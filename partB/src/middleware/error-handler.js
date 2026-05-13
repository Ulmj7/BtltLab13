import { AppError } from '../utils/app-error.js';
import { env } from '../config/env.js';

/**
 * Express error middleware — AppError-ийг machine-readable JSON болгоно,
 * үлдсэн алдааг 500 болгож хувиргана. Production-д stack trace буцаахгүй.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: { code: err.code, message: err.message },
    });
  }

  console.error('[error-handler] unhandled', err);
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Серверийн дотоод алдаа',
      ...(env.isProduction ? {} : { detail: err?.message }),
    },
  });
}

/**
 * 404 fallback — ямар ч route таарахгүй үед.
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    error: { code: 'ROUTE_NOT_FOUND', message: `${req.method} ${req.path} олдсонгүй` },
  });
}
