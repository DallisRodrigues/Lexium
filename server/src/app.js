import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import path from 'node:path';
import fs from 'node:fs';
import publicRoutes from './routes/public.js';
import formRoutes from './routes/forms.js';
import eventRoutes from './routes/events.js';
import adminRoutes, { UPLOAD_DIR } from './routes/admin.js';
import seoRoutes, { publicRoutes as listPublicRoutes } from './seo/index.js';
import { redirects } from './middleware/redirects.js';

const DIST = path.resolve(import.meta.dirname, '../../client/dist');

export function createApp({ serveClient = process.env.NODE_ENV === 'production' } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 'loopback');

  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: false,
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"], // inline style attributes used by motion/object-position
          imgSrc: ["'self'", 'data:', 'blob:'],
          fontSrc: ["'self'"],
          connectSrc: ["'self'"],
          frameAncestors: ["'none'"],
          formAction: ["'self'"],
          baseUri: ["'self'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      strictTransportSecurity: { maxAge: 31536000, includeSubDomains: true },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      crossOriginEmbedderPolicy: false,
    }),
  );
  app.use((_req, res, next) => {
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
    next();
  });
  app.use(compression());
  app.use(cors({ origin: [/^https:\/\/(localhost|127\.0\.0\.1|lexium\.local)(:\d+)?$/], credentials: true }));
  app.use(cookieParser());

  app.get('/api/health', async (_req, res) => {
    const state = mongoose.connection.readyState;
    let ping = false;
    try { ping = state === 1 && (await mongoose.connection.db.admin().ping()).ok === 1; } catch {}
    res.status(ping ? 200 : 503).json({ ok: ping, mongo: ping ? 'connected' : 'unavailable', db: mongoose.connection.name, uptime: Math.round(process.uptime()) });
  });

  app.use('/api', eventRoutes); // text body parser for sendBeacon (before json)
  app.use(express.json({ limit: '2mb' }));
  app.use('/api', publicRoutes);
  app.use('/api', formRoutes);
  app.use('/api/admin', adminRoutes);
  app.use(seoRoutes);
  app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '30d', immutable: true }));
  app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

  app.use(redirects);

  if (serveClient && fs.existsSync(DIST)) {
    app.use('/assets', express.static(path.join(DIST, 'assets'), { maxAge: '1y', immutable: true }));
    app.use(express.static(DIST, { index: 'index.html', maxAge: '5m', redirect: false }));
    let known = { at: 0, set: new Set() };
    app.get('/{*splat}', async (req, res) => {
      if (Date.now() - known.at > 60_000) {
        const urls = await listPublicRoutes().catch(() => []);
        known = { at: Date.now(), set: new Set([...urls.map((u) => u.url), '/']) };
      }
      const isAdmin = req.path.startsWith('/admin');
      if (isAdmin) res.setHeader('X-Robots-Tag', 'noindex, nofollow');
      const status = isAdmin || known.set.has(req.path) ? 200 : 404;
      // _shell.html = un-prerendered SPA shell (admin, dynamic routes); _404.html = prerendered 404
      const shell = fs.existsSync(path.join(DIST, '_shell.html')) ? '_shell.html' : 'index.html';
      const file = status === 404 && fs.existsSync(path.join(DIST, '_404.html')) ? '_404.html' : shell;
      res.status(status).sendFile(path.join(DIST, file));
    });
  }

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message });
  });
  return app;
}
