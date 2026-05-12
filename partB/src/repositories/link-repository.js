import { pool } from '../db/pool.js';

// Postgres-ын unique violation код (`23505`) — `code` UNIQUE constraint conflict.
const PG_UNIQUE_VIOLATION = '23505';

/**
 * Шинэ link мөр оруулна. Хэрэв `code` давхардвал `null` буцаана,
 * service давхаргад дахин үүсгэхээр шийднэ.
 *
 * @param {{ code: string, url: string }} params
 * @returns {Promise<{ id: string, code: string, url: string, createdAt: Date } | null>}
 */
export async function insertLink({ code, url }) {
  try {
    const { rows } = await pool.query(
      `INSERT INTO links (code, url)
       VALUES ($1, $2)
       RETURNING id, code, url, created_at`,
      [code, url],
    );
    return mapRow(rows[0]);
  } catch (err) {
    if (err.code === PG_UNIQUE_VIOLATION) return null;
    throw err;
  }
}

/**
 * Богино кодоор мөр хайна.
 *
 * @param {string} code
 * @returns {Promise<{ id: string, code: string, url: string, createdAt: Date, clickCount: number } | null>}
 */
export async function findByCode(code) {
  const { rows } = await pool.query(
    `SELECT id, code, url, click_count, created_at
       FROM links
      WHERE code = $1`,
    [code],
  );
  return rows[0] ? mapRow(rows[0]) : null;
}

/**
 * Click тоологчийг 1-ээр нэмнэ. Атомик — race condition-аас хамгаалагдсан.
 *
 * @param {string} code
 * @returns {Promise<number>} Шинэ click тоолуур.
 */
export async function incrementClicks(code) {
  const { rows } = await pool.query(
    `UPDATE links
        SET click_count = click_count + 1
      WHERE code = $1
      RETURNING click_count`,
    [code],
  );
  return rows[0] ? Number(rows[0].click_count) : 0;
}

function mapRow(row) {
  return {
    id: String(row.id),
    code: row.code,
    url: row.url,
    clickCount: row.click_count !== undefined ? Number(row.click_count) : undefined,
    createdAt: row.created_at,
  };
}
