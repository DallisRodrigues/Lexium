import { Router } from 'express';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Service, Industry, Insight } from '../models/index.js';
import { visibleFilter } from '../models/shared.js';

const r = Router();
export const STATIC_ROUTES = ['/', '/services/', '/industries/', '/insights/', '/about/', '/contact/', '/privacy/', '/terms/'];

export async function publicRoutes() {
  const P = { ...visibleFilter(), 'seo.noindex': { $ne: true } };
  const [s, i, n] = await Promise.all([
    Service.find(P).select('slug updatedAt').lean(),
    Industry.find(P).select('slug updatedAt').lean(),
    Insight.find(P).select('slug updatedAt').lean(),
  ]);
  return [
    ...STATIC_ROUTES.map((url) => ({ url })),
    ...s.map((d) => ({ url: `/services/${d.slug}/`, lastmod: d.updatedAt })),
    ...i.map((d) => ({ url: `/industries/${d.slug}/`, lastmod: d.updatedAt })),
    ...n.map((d) => ({ url: `/insights/${d.slug}/`, lastmod: d.updatedAt })),
  ];
}

r.get('/sitemap.xml', async (_req, res) => {
  const stream = new SitemapStream({ hostname: process.env.SITE_URL || 'https://lexium.local:8443' });
  (await publicRoutes()).forEach((u) => stream.write(u));
  stream.end();
  res.type('application/xml').send(await streamToPromise(stream));
});

r.get('/robots.txt', (_req, res) => {
  res.type('text/plain').send(`User-agent: *\nDisallow: /admin\nDisallow: /api/admin\n\nSitemap: ${process.env.SITE_URL || 'https://lexium.local:8443'}/sitemap.xml\n`);
});

r.get('/api/routes', async (_req, res) => res.json((await publicRoutes()).map((u) => u.url)));

export default r;
