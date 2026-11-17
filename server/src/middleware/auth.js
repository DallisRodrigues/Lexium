import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { User } from '../models/index.js';

const COOKIE = 'lx_session';
const CSRF_COOKIE = 'lx_csrf';
const secret = () => process.env.JWT_SECRET || 'dev-only-secret';

export function issueSession(res, user) {
  const token = jwt.sign({ sub: String(user._id), role: user.role, name: user.name }, secret(), { expiresIn: '8h' });
  const csrf = crypto.randomBytes(24).toString('hex');
  const base = { secure: process.env.COOKIE_INSECURE_FOR_TESTS !== 'true', sameSite: 'strict', path: '/', maxAge: 8 * 3600 * 1000 };
  res.cookie(COOKIE, token, { ...base, httpOnly: true });
  res.cookie(CSRF_COOKIE, csrf, { ...base, httpOnly: false });
  return csrf;
}

export function clearSession(res) {
  res.clearCookie(COOKIE, { path: '/' });
  res.clearCookie(CSRF_COOKIE, { path: '/' });
}

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[COOKIE];
    if (!token) return res.status(401).json({ error: 'Not signed in' });
    const payload = jwt.verify(token, secret());
    const user = await User.findById(payload.sub).lean();
    if (!user) return res.status(401).json({ error: 'Not signed in' });
    req.user = user;
    // Double-submit CSRF check on state-changing requests
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      const header = req.get('x-csrf-token');
      if (!header || header !== req.cookies?.[CSRF_COOKIE]) return res.status(403).json({ error: 'CSRF token missing or invalid' });
    }
    next();
  } catch {
    res.status(401).json({ error: 'Session expired' });
  }
}

export const requireRole = (...roles) => (req, res, next) =>
  roles.includes(req.user?.role) ? next() : res.status(403).json({ error: `Requires role: ${roles.join(' or ')}` });
