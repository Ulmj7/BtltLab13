import { z } from 'zod';
import * as defaultRepository from '../repositories/link-repository.js';
import { generateCode as defaultGenerateCode } from '../utils/code-generator.js';
import { AppError } from '../utils/app-error.js';

const MAX_URL_LENGTH = 2048;
const MAX_COLLISION_RETRIES = 5;

const urlSchema = z
  .string({ required_error: 'url шаардлагатай' })
  .min(1, 'url хоосон байж болохгүй')
  .max(MAX_URL_LENGTH, `url нь ${MAX_URL_LENGTH} тэмдэгтээс хэтрэхгүй байх ёстой`)
  .url('зөв URL бичнэ үү')
  .regex(/^https?:\/\//i, 'http эсвэл https scheme шаардлагатай');

/**
 * Link service factory — repository болон код үүсгэгчийг параметрээр авч,
 * тест бичихэд mock орлуулах боломжтой.
 *
 * @param {object} [deps]
 * @param {typeof defaultRepository} [deps.repository]
 * @param {typeof defaultGenerateCode} [deps.codeGenerator]
 */
export function createLinkService({
  repository = defaultRepository,
  codeGenerator = defaultGenerateCode,
} = {}) {
  /**
   * Шинэ богино холбоос үүсгэнэ. Унаган collision гарвал шинэ код үүсгэж дахин оролдоно.
   * @param {{ url: string }} input
   * @returns {Promise<{ id: string, code: string, url: string, createdAt: Date }>}
   */
  async function createShortLink(input) {
    const parsed = urlSchema.safeParse(input?.url);
    if (!parsed.success) {
      const message = parsed.error.errors[0]?.message ?? 'Буруу URL';
      throw new AppError(message, 422, 'URL_INVALID');
    }

    const url = parsed.data;
    for (let attempt = 0; attempt < MAX_COLLISION_RETRIES; attempt += 1) {
      const code = codeGenerator();
      const inserted = await repository.insertLink({ code, url });
      if (inserted !== null) return inserted;
    }

    throw new AppError(
      'Богино код үүсгэх боломжгүй боллоо, дахин оролдоно уу',
      500,
      'CODE_COLLISION_EXHAUSTED',
    );
  }

  /**
   * Богино кодоор урт URL-ийг олж, click тоологчийг нэмнэ.
   * @param {string} code
   * @returns {Promise<{ url: string, clickCount: number }>}
   */
  async function resolveAndTrackClick(code) {
    if (typeof code !== 'string' || code.length === 0) {
      throw new AppError('Богино код шаардлагатай', 400, 'CODE_REQUIRED');
    }

    const link = await repository.findByCode(code);
    if (!link) {
      throw new AppError('Холбоос олдсонгүй', 404, 'LINK_NOT_FOUND');
    }

    const clickCount = await repository.incrementClicks(code);
    return { url: link.url, clickCount };
  }

  return { createShortLink, resolveAndTrackClick };
}

export const linkService = createLinkService();
