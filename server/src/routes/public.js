import { Router } from 'express';
import { visibleFilter, isPreview } from '../models/shared.js';
import { Service, Industry, Insight, Region, RegulatoryItem, SiteSettings, Person, CaseJourney, Page } from '../models/index.js';

const r = Router();
const pub = () => visibleFilter(); // evaluated per request
const LINK = 'title slug number shortLabel outcomeLine proposition hero.headline';
const INSIGHT_CARD = 'title slug category type standfirst date readingTime image featured author';
const strip = '-history -createdBy -updatedBy -approver -claimOwner -claimSource -nexiomReferralApproved';

const notFound = (res) => res.status(404).json({ error: 'Not found' });

r.get('/services', async (_req, res) => {
  res.json(await Service.find(pub()).select('number title slug shortLabel eyebrow outcomeLine threeCapabilities capabilities hero seo').sort('number').lean());
});

r.get('/services/:slug', async (req, res) => {
  const doc = await Service.findOne({ ...pub(), slug: req.params.slug })
    .select(strip)
    .populate({ path: 'industries', match: pub(), select: LINK })
    .populate({ path: 'people', match: pub(), select: 'name role image linkedin' })
    .lean();
  doc ? res.json(doc) : notFound(res);
});

r.get('/industries', async (_req, res) => {
  res.json(
    await Industry.find(pub())
      .select('number title slug order isAnchor hero proposition positioning subsectors clientTypes decisions services seo')
      .populate({ path: 'services', match: pub(), select: LINK })
      .sort('order')
      .lean(),
  );
});

r.get('/industries/:slug', async (req, res) => {
  const doc = await Industry.findOne({ ...pub(), slug: req.params.slug })
    .select(strip)
    .populate({ path: 'services', match: pub(), select: LINK })
    .lean();
  doc ? res.json(doc) : notFound(res);
});

const withAuthor = (q) => q.populate({ path: 'author', select: 'name role image linkedin' });

r.get('/insights', async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 9, 24);
  const page = Math.max(Number(req.query.page) || 1, 1);
  const filter = { ...pub() };
  if (req.query.category && req.query.category !== 'All') filter.category = req.query.category;
  if (req.query.featured === 'true') filter.featured = true;
  if (req.query.type) filter.type = req.query.type;
  const [items, total] = await Promise.all([
    withAuthor(Insight.find(filter).select(INSIGHT_CARD).sort({ date: -1 }).skip((page - 1) * limit).limit(limit)).lean(),
    Insight.countDocuments(filter),
  ]);
  res.json({ items, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
});

/** Three dynamically selected articles: shared relationships first, then recency. */
r.get('/insights/related', async (req, res) => {
  const { service, industry, exclude } = req.query;
  const [svc, ind, ex] = await Promise.all([
    service ? Service.findOne({ slug: service }).select('_id').lean() : null,
    industry ? Industry.findOne({ slug: industry }).select('_id').lean() : null,
    exclude ? Insight.findOne({ slug: exclude }).select('_id services industries category').lean() : null,
  ]);
  const svcIds = [svc?._id, ...(ex?.services || [])].filter(Boolean).map(String);
  const indIds = [ind?._id, ...(ex?.industries || [])].filter(Boolean).map(String);
  const pool = await withAuthor(Insight.find({ ...pub(), ...(ex ? { _id: { $ne: ex._id } } : {}) }).select(INSIGHT_CARD + ' services industries')).lean();
  const score = (i) =>
    (i.services || []).filter((s) => svcIds.includes(String(s))).length * 2 +
    (i.industries || []).filter((s) => indIds.includes(String(s))).length * 2 +
    (ex && i.category === ex.category ? 1 : 0);
  pool.sort((a, b) => score(b) - score(a) || new Date(b.date) - new Date(a.date));
  res.json(pool.slice(0, 3).map(({ services, industries, ...rest }) => rest));
});

r.get('/insights/:slug', async (req, res) => {
  const doc = await withAuthor(
    Insight.findOne({ ...pub(), slug: req.params.slug })
      .select(strip + ' -body')
      .populate({ path: 'services', match: pub(), select: LINK })
      .populate({ path: 'industries', match: pub(), select: LINK }),
  ).lean();
  doc ? res.json(doc) : notFound(res);
});

r.get('/regions', async (req, res) => {
  const f = { ...pub(), regionStatus: 'active' };
  if (req.query.context) f.contexts = req.query.context;
  res.json(await Region.find(f).select('name slug contexts order overview capabilities contactRoute mapCodes verificationRequired').sort('order').lean());
});

r.get('/regulatory', async (req, res) => {
  const f = { ...pub() };
  if (req.query.page) f.pages = req.query.page;
  if (req.query.group) f.group = req.query.group;
  res.json(await RegulatoryItem.find(f).select('jurisdiction topic group anchor order summary detail reviewedDate disclaimer pages').sort('order').lean());
});

r.get('/journeys', async (_req, res) => {
  res.json(await CaseJourney.find(pub()).select('title situation lexiumRole resultType sequence').lean());
});

r.get('/people', async (_req, res) => {
  res.json(await Person.find(pub()).select('name role biography image linkedin expertise experienceClaims isFounder verificationRequired').lean());
});

r.get('/pages/:key', async (req, res) => {
  const doc = await Page.findOne({ ...pub(), key: req.params.key }).select(strip).lean();
  doc ? res.json(doc) : notFound(res);
});

r.get('/settings', async (_req, res) => {
  const s = await SiteSettings.findOne({ key: 'site' }).select('-routing -serviceRouting -updatedBy').lean();
  res.json({ ...(s || {}), contentPreview: isPreview() });
});

/** Navigation payload for header mega menu + footer, in one request. */
r.get('/nav', async (_req, res) => {
  const [services, industries, featured] = await Promise.all([
    Service.find(pub()).select('number title slug').sort('number').lean(),
    Industry.find(pub()).select('number title slug').sort('order').lean(),
    withAuthor(Insight.findOne({ ...pub(), featured: true }).select(INSIGHT_CARD).sort({ date: -1 })).lean(),
  ]);
  const latest = featured || (await Insight.findOne(pub()).select(INSIGHT_CARD).sort({ date: -1 }).lean());
  res.json({ services, industries, featuredInsight: latest });
});

export default r;
