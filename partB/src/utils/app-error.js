/**
 * Бизнес логикийн алдаануудад зориулсан custom Error class.
 * HTTP statusCode-ыг alongside дамжуулж error middleware-д response үүсгэхэд хэрэглэнэ.
 */
export class AppError extends Error {
  /**
   * @param {string} message — Хэрэглэгчид буцаах тайлбар.
   * @param {number} statusCode — HTTP status code (4xx эсвэл 5xx).
   * @param {string} [code] — Машинд унших алдааны код (e.g. 'URL_INVALID').
   */
  constructor(message, statusCode, code) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code ?? 'APP_ERROR';
    this.isOperational = true;
    Error.captureStackTrace?.(this, this.constructor);
  }
}
