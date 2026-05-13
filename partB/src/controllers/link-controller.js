import { linkService } from '../services/link-service.js';
import { env } from '../config/env.js';

/**
 * POST /api/links — шинэ богино холбоос үүсгэнэ.
 */
export async function createLink(req, res, next) {
  try {
    const link = await linkService.createShortLink({ url: req.body?.url });
    res.status(201).json({
      code: link.code,
      url: link.url,
      shortUrl: `${env.baseUrl}/${link.code}`,
      createdAt: link.createdAt,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /:code — богино кодыг урт URL руу redirect.
 */
export async function redirectByCode(req, res, next) {
  try {
    const { url } = await linkService.resolveAndTrackClick(req.params.code);
    // 302 Found: browser нь redirect-ийг cache хийхгүй — click тоологч ажиллана.
    res.redirect(302, url);
  } catch (err) {
    next(err);
  }
}
