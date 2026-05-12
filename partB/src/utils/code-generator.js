import { randomBytes } from 'node:crypto';

// URL-safe base62 alphabet (alphanumeric, no look-alikes removed for simplicity).
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const DEFAULT_LENGTH = 7;

/**
 * Криптографын хувьд аюулгүй богино код үүсгэнэ.
 * `crypto.randomBytes`-ыг ашиглана — `Math.random` биш (CLAUDE.md §11).
 *
 * @param {number} [length=7] — Кодын урт (тэмдэгтийн тоо).
 * @returns {string} Үсэг тоонуудаас бүрдсэн санамсаргүй код.
 */
export function generateCode(length = DEFAULT_LENGTH) {
  if (!Number.isInteger(length) || length < 4 || length > 32) {
    throw new RangeError('code length must be an integer between 4 and 32');
  }

  // Modulo bias багасгахын тулд хэрэгцээт байтын 2 дахин их санамсаргүй байт авна.
  const bytes = randomBytes(length * 2);
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}
