import { Router } from 'express';
import argon2 from 'argon2';
import multer from 'multer';
import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs/promises';
import slugify from 'slugify';
import sanitizeHtml from 'sanitize-html';
import readingTime from 'reading-time';
import { z } from 'zod';
import {
  CONTENT_MODELS, User, Redirect, SiteSettings, Enquiry, Event, DiagnosticResult, RegulatoryItem,
} from '../models/index.js';
import { requireAuth, requireRole, issueSession, clearSession } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/bot.js';
import { ARTICLE_HTML } from '../middleware/validate.js';
import { invalidateRedirects } from '../middleware/redirects.js';
import { wordCount, LIMITS } from '../models/shared.js';
import { tiptapToHtml } from '../lib-tiptap.js';

const r = Router();
const ROOT = path.resolve(import.meta.dirname, '../../..');
export const UPLOAD_DIR = path.join(ROOT, 'server', 'uploads');
const WIDTHS = [480, 768, 1200, 1600, 2400];

// ---------- Auth ----------
r.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body || {};
  const user = await User.findOne({ email: String(email || '').toLowerCase() }).select('+passwordHash');
  if (!user || !(await argon2.verify(user.passwordHash, String(password || '')).catch(() => false)))
    return res.status(401).json({ error: 'Incorrect email or password' });
  const csrf = issueSession(res, user);
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, csrf });
});
r.post('/logout', (_req, res) => { clearSession(res); res.json({ ok: true }); });

r.use(requireAuth);
r.get('/me', (req, res) => res.json({ id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role }));

// ---------- Content limits (§5.6) ----------
export function checkLimits(kind, d) {
  const v = [];
  const over = (label, text, max) => { const n = wordCount(text); if (text && n > max) v.push(`${label}: ${n} words (max ${max})`); };
  const range = (label, text, [min, max]) => { const n = wordCount(text); if (text && (n < min || n > max)) v.push(`${label}: ${n} words (${min}–${max})`); };
  if (d.hero) {
    over('Hero headline', d.hero.headline, LIMITS.heroHeadline);
    over('Hero introduction', d.hero.intro, LIMITS.heroIntro);
    over('Hero introduction (mobile)', d.hero.introMobile, LIMITS.heroIntroMobile);
  }
  if (kind === 'services') {
    (d.capabilities || []).forEach((c, i) => {
      over(`Capability ${i + 1} title`, c.title, LIMITS.cardTitle);
      range(`Capability ${i + 1} summary`, c.summary, LIMITS.capabilitySummary);
      if (c.summaryMobile) range(`Capability ${i + 1} summary (mobile)`, c.summaryMobile, LIMITS.capabilitySummaryMobile);
    });
    (d.engagements || []).forEach((e, i) => {
      over(`Engagement ${i + 1} title`, e.title, LIMITS.cardTitle);
      ['situation', 'role', 'resultType'].forEach((k) => over(`Engagement ${i + 1} ${k}`, e[k], LIMITS.cardBody));
    });
  }
  if (kind === 'industries') (d.challenges || []).forEach((c, i) => over(`Challenge ${i + 1} body`, c.body, LIMITS.cardBody));
  if (d.seo?.title && (d.seo.title.length < 50 || d.seo.title.length > 60)) v.push(`SEO title: ${d.seo.title.length} characters (aim 50–60)`);
  if (d.seo?.metaDescription && (d.seo.metaDescription.length < 140 || d.seo.metaDescription.length > 160))
    v.push(`Meta description: ${d.seo.metaDescription.length} characters (aim 140–160)`);
  return v;
}

const isBlocking = (msg) => !msg.startsWith('SEO title') && !msg.startsWith('Meta description'); // SEO lengths warn only

function prepare(kind, body) {
  if (body.slug) body.slug = slugify(body.slug, { lower: true, strict: true });
  if (kind === 'insights' && body.body) {
    body.bodyHtml = sanitizeHtml(tiptapToHtml(body.body), ARTICLE_HTML);
    body.readingTime = Math.max(1, Math.round(readingTime(sanitizeHtml(body.bodyHtml, { allowedTags: [] })).minutes));
  } else if (kind === 'insights' && body.bodyHtml) {
    body.bodyHtml = sanitizeHtml(body.bodyHtml, ARTICLE_HTML);
    body.readingTime = Math.max(1, Math.round(readingTime(sanitizeHtml(body.bodyHtml, { allowedTags: [] })).minutes));
  }
  delete body.history; delete body.approver; delete body.approverName; delete body.approvedAt;
  return body;
}

const urlFor = (kind, slug) => ({ services: `/services/${slug}/`, industries: `/industries/${slug}/`, insights: `/insights/${slug}/` })[kind];

// ---------- Generic CRUD ----------
r.get('/content/:kind', async (req, res) => {
  const M = CONTENT_MODELS[req.params.kind];
  if (!M) return res.status(404).json({ error: 'Unknown content type' });
  const f = req.query.status ? { status: req.query.status } : {};
  res.json(await M.find(f).select('title name slug key number jurisdiction topic status copyOrigin verificationRequired updatedAt publishAt approverName reviewedDate category').sort({ updatedAt: -1 }).lean());
});

r.get('/content/:kind/:id', async (req, res) => {
  const M = CONTENT_MODELS[req.params.kind];
  const doc = await M?.findById(req.params.id).select(req.params.kind === 'services' ? '+nexiomReferralApproved' : '').lean();
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json({ ...doc, _limits: checkLimits(req.params.kind, doc) });
});

r.post('/content/:kind', async (req, res) => {
  const M = CONTENT_MODELS[req.params.kind];
  if (!M) return res.status(404).json({ error: 'Unknown content type' });
  const body = prepare(req.params.kind, { ...req.body, status: 'draft' });
  try {
    const doc = await M.create({ ...body, createdBy: req.user.name, history: [{ action: 'created', by: req.user.name }] });
    res.status(201).json(doc);
  } catch (e) { res.status(422).json({ error: e.message }); }
});

r.put('/content/:kind/:id', async (req, res) => {
  const kind = req.params.kind;
  const M = CONTENT_MODELS[kind];
  const doc = await M?.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });
  const body = prepare(kind, { ...req.body });
  delete body.status; // status only changes via workflow actions
  const oldSlug = doc.slug;
  doc.set(body);
  doc.updatedBy = req.user.name;
  doc.history.push({ action: 'edited', by: req.user.name });
  try {
    await doc.save();
  } catch (e) { return res.status(422).json({ error: e.message }); }
  // Auto 301 when a slug changes
  if (oldSlug && doc.slug && oldSlug !== doc.slug && urlFor(kind, oldSlug)) {
    await Redirect.findOneAndUpdate({ from: urlFor(kind, oldSlug) }, { to: urlFor(kind, doc.slug), code: 301, auto: true }, { upsert: true });
    await Redirect.updateMany({ to: urlFor(kind, oldSlug) }, { to: urlFor(kind, doc.slug) });
    invalidateRedirects();
  }
  res.json({ ...doc.toObject(), _limits: checkLimits(kind, doc.toObject()) });
});

r.delete('/content/:kind/:id', requireRole('admin'), async (req, res) => {
  await CONTENT_MODELS[req.params.kind]?.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// ---------- Workflow ----------
const WorkflowInput = z.object({
  action: z.enum(['submit', 'publish', 'schedule', 'unpublish', 'archive', 'reject']),
  publishAt: z.string().optional(),
  note: z.string().max(500).optional(),
});

r.post('/content/:kind/:id/workflow', async (req, res) => {
  const parsed = WorkflowInput.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ error: 'Invalid workflow action' });
  const { action, publishAt, note } = parsed.data;
  const kind = req.params.kind;
  const doc = await CONTENT_MODELS[kind]?.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });
  const canApprove = ['approver', 'admin'].includes(req.user.role);

  if (['publish', 'schedule', 'unpublish', 'archive', 'reject'].includes(action) && !canApprove)
    return res.status(403).json({ error: 'Only an approver or admin can perform this action.' });

  if (['publish', 'schedule'].includes(action)) {
    const blocking = checkLimits(kind, doc.toObject()).filter(isBlocking);
    if (blocking.length) return res.status(422).json({ error: 'Content limits exceeded — fix before publishing.', limits: blocking });
    if (kind === 'regulatory' && !doc.reviewedDate) return res.status(422).json({ error: 'A reviewed date is required.' });
  }
  if (action === 'schedule' && kind !== 'insights') return res.status(422).json({ error: 'Scheduling is available for insights.' });

  switch (action) {
    case 'submit': doc.status = 'review'; break;
    case 'reject': doc.status = 'draft'; break;
    case 'publish':
      doc.status = 'published';
      Object.assign(doc, { approver: req.user._id, approverName: req.user.name, approvedAt: new Date() });
      break;
    case 'schedule': {
      const when = new Date(publishAt);
      if (isNaN(when)) return res.status(422).json({ error: 'Choose a valid publish date and time.' });
      Object.assign(doc, { status: 'scheduled', publishAt: when, approver: req.user._id, approverName: req.user.name, approvedAt: new Date() });
      break;
    }
    case 'unpublish': doc.status = 'draft'; break;
    case 'archive': doc.status = 'archived'; break;
  }
  doc.history.push({ action, by: req.user.name, note: note || (action === 'schedule' ? `for ${doc.publishAt.toISOString()}` : undefined) });
  await doc.save();
  res.json(doc);
});

// ---------- Uploads (sharp → AVIF + WebP at responsive widths) ----------
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, f, cb) => cb(null, /^image\/(jpeg|png|webp|avif)$/.test(f.mimetype)),
});

r.post('/uploads', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(422).json({ error: 'Upload a JPEG, PNG, WebP or AVIF image.' });
  const base = slugify(req.body.name || path.parse(req.file.originalname).name, { lower: true, strict: true }) || 'image';
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const meta = await sharp(req.file.buffer).metadata();
  const widths = WIDTHS.filter((w) => w <= (meta.width || 2400));
  if (!widths.length) widths.push(meta.width);
  for (const w of widths) {
    const img = sharp(req.file.buffer).rotate().resize({ width: w, withoutEnlargement: true });
    await img.clone().avif({ quality: 55 }).toFile(path.join(UPLOAD_DIR, `${base}-${w}.avif`));
    await img.clone().webp({ quality: 72 }).toFile(path.join(UPLOAD_DIR, `${base}-${w}.webp`));
  }
  const lqip = await sharp(req.file.buffer).resize(20).webp({ quality: 40 }).toBuffer();
  res.status(201).json({
    src: `/uploads/${base}`, widths, width: meta.width, height: meta.height,
    placeholder: `data:image/webp;base64,${lqip.toString('base64')}`,
  });
});

// ---------- Redirects ----------
r.get('/redirects', async (_req, res) => res.json(await Redirect.find().sort({ updatedAt: -1 }).lean()));
r.post('/redirects', async (req, res) => {
  const { from, to, code = 301 } = req.body || {};
  if (!from?.startsWith('/') || !to) return res.status(422).json({ error: 'From must start with / and To is required.' });
  const doc = await Redirect.findOneAndUpdate({ from }, { to, code }, { upsert: true, new: true });
  invalidateRedirects();
  res.status(201).json(doc);
});
r.delete('/redirects/:id', async (req, res) => { await Redirect.findByIdAndDelete(req.params.id); invalidateRedirects(); res.json({ ok: true }); });

// ---------- Settings ----------
r.get('/settings', async (_req, res) => res.json(await SiteSettings.findOne({ key: 'site' }).lean()));
r.put('/settings', requireRole('admin', 'approver'), async (req, res) => {
  const { _id, key, ...rest } = req.body || {};
  res.json(await SiteSettings.findOneAndUpdate({ key: 'site' }, { ...rest, updatedBy: req.user.name }, { new: true, upsert: true }));
});

// ---------- Users (admin) ----------
r.get('/users', requireRole('admin'), async (_req, res) => res.json(await User.find().lean()));
r.post('/users', requireRole('admin'), async (req, res) => {
  const { name, email, password, role } = req.body || {};
  if (!email || !password || password.length < 12) return res.status(422).json({ error: 'Email and a password of at least 12 characters are required.' });
  const u = await User.create({ name, email, role, passwordHash: await argon2.hash(password) });
  res.status(201).json({ id: u._id, name, email: u.email, role: u.role });
});

// ---------- Enquiries ----------
r.get('/enquiries', async (req, res) => {
  const f = req.query.tag ? { crmTag: req.query.tag } : {};
  res.json(await Enquiry.find(f).sort({ createdAt: -1 }).limit(200).lean());
});

// ---------- Dashboard ----------
r.get('/dashboard', async (_req, res) => {
  const sixMonthsAgo = new Date(Date.now() - 182 * 864e5);
  const kinds = Object.entries(CONTENT_MODELS);
  const review = [], verification = [];
  for (const [kind, M] of kinds) {
    (await M.find({ status: 'review' }).select('title name key jurisdiction topic slug').lean()).forEach((d) => review.push({ kind, ...d }));
    (await M.find({ verificationRequired: true }).select('title name key jurisdiction topic slug claimOwner claimSource status').lean()).forEach((d) => verification.push({ kind, ...d }));
  }
  const [staleRegulatory, enquiriesByTag, eventsByName, diagnosticBands, totalEnquiries] = await Promise.all([
    RegulatoryItem.find({ reviewedDate: { $lt: sixMonthsAgo } }).select('jurisdiction topic reviewedDate').lean(),
    Enquiry.aggregate([{ $group: { _id: '$crmTag', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    Event.aggregate([{ $group: { _id: '$name', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    DiagnosticResult.aggregate([{ $group: { _id: '$band', count: { $sum: 1 } } }]),
    Enquiry.countDocuments(),
  ]);
  // Diagnostic completion followed by an enquiry (joined by session)
  const diagSessions = await DiagnosticResult.distinct('sessionId', { sessionId: { $nin: [null, ''] } });
  const diagThenEnquiry = diagSessions.length ? await Enquiry.countDocuments({ sessionId: { $in: diagSessions } }) : 0;
  const tag = (t) => enquiriesByTag.find((e) => e._id === t)?.count || 0;
  res.json({
    review, verification, staleRegulatory, enquiriesByTag, eventsByName, diagnosticBands,
    conversions: {
      'Qualified consultation enquiry': totalEnquiries,
      'Regulatory or market-entry enquiry routed to the correct team': tag('REGULATORY') + tag('MARKET ENTRY'),
      'Manufacturing opportunity discussion': tag('MANUFACTURING'),
      'Confidential M&A or fundraising conversation': tag('M&A') + tag('CAPITAL'),
      'Investor-readiness diagnostic completion followed by an enquiry': diagThenEnquiry,
    },
  });
});

// ---------- Image credits ----------
r.get('/image-credits', async (_req, res) => {
  try {
    res.json(JSON.parse(await fs.readFile(path.join(ROOT, 'client/src/content/image-credits.json'), 'utf8')));
  } catch { res.json([]); }
});

export default r;
