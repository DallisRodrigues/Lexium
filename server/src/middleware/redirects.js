import { Redirect } from '../models/index.js';

let cache = { at: 0, map: new Map() };
export const invalidateRedirects = () => (cache.at = 0);

async function load() {
  if (Date.now() - cache.at < 30_000) return cache.map;
  const rows = await Redirect.find().lean();
  cache = { at: Date.now(), map: new Map(rows.map((r) => [r.from, r])) };
  return cache.map;
}

const norm = (p) => (p.endsWith('/') ? p : p + '/');

/** CMS redirects, then trailing-slash normalisation (301). Runs before the SPA fallback. */
export async function redirects(req, res, next) {
  if (!['GET', 'HEAD'].includes(req.method)) return next();
  const p = req.path;
  if (p.startsWith('/api') || p.startsWith('/assets') || p.startsWith('/uploads') || /\.[a-z0-9]{2,5}$/i.test(p)) return next();
  try {
    const map = await load();
    const hit = map.get(p) || map.get(norm(p));
    if (hit) return res.redirect(hit.code || 301, hit.to);
  } catch { /* db unavailable: skip */ }
  if (!p.endsWith('/')) {
    const qs = req.originalUrl.slice(req.path.length);
    return res.redirect(301, p + '/' + qs);
  }
  next();
}
