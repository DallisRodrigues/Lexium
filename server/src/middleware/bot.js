import rateLimit from 'express-rate-limit';

/** Per-IP limit for public form endpoints. */
export const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: Number(process.env.FORM_RATE_LIMIT || 10),
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many submissions. Please try again later.' },
});

export const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-7', legacyHeaders: false });
export const eventLimiter = rateLimit({ windowMs: 60 * 1000, limit: 120, standardHeaders: 'draft-7', legacyHeaders: false });

/**
 * Non-intrusive bot control: hidden honeypot field `website_url` must be empty, and the
 * form must have been on screen for at least 3 seconds (`startedAt` epoch ms from the client).
 */
export function botControl(req, res, next) {
  const { website_url: honeypot, startedAt } = req.body || {};
  const minMs = Number(process.env.FORM_MIN_MS ?? 3000);
  if (honeypot) return res.status(400).json({ error: 'Submission rejected.' });
  const started = Number(startedAt);
  if (!started || Date.now() - started < minMs) return res.status(400).json({ error: 'Submission rejected. Please take a moment and try again.' });
  next();
}
