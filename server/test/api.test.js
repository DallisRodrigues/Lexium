import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import argon2 from 'argon2';
import { createApp } from '../src/app.js';
import { Service, Insight, Enquiry, Event, User, Redirect, RegulatoryItem, SiteSettings } from '../src/models/index.js';
import { bandFor, scoreDiagnostic } from '../src/lib-diagnostic.js';
import { resolveRoute, DEFAULT_ROUTING, DEFAULT_SERVICE_ROUTING } from '../src/mail/routing.js';
import { publishDue } from '../src/jobs/scheduler.js';

process.env.FORM_RATE_LIMIT = '1000';
process.env.COOKIE_INSECURE_FOR_TESTS = 'true';
process.env.CONTENT_PREVIEW = 'false';
Object.assign(process.env, { LEAD_REGULATORY: 'reg@t', LEAD_MANUFACTURING: 'mfg@t', LEAD_MARKET_ENTRY: 'mkt@t', LEAD_MA: 'ma@t', LEAD_CAPITAL: 'cap@t', LEAD_GENERAL: 'gen@t', SMTP_PORT: '1' });

const app = createApp({ serveClient: false });
const agent = () => request.agent(app).trustLocalhost?.() ?? request.agent(app);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://127.0.0.1:27017/lexium_test');
  await mongoose.connection.db.dropDatabase();
  await SiteSettings.create({ key: 'site', routing: DEFAULT_ROUTING, serviceRouting: DEFAULT_SERVICE_ROUTING });
  for (const [email, role] of [['editor@t.local', 'editor'], ['approver@t.local', 'approver']])
    await User.create({ name: role, email, role, passwordHash: await argon2.hash('correct-horse-battery') });
});
afterAll(async () => { await mongoose.connection.db.dropDatabase(); await mongoose.disconnect(); });

describe('Investor readiness diagnostic', () => {
  it.each([[0, 'Foundation'], [4, 'Foundation'], [5, 'Investor-readying'], [7, 'Investor-readying'], [8, 'Market-ready'], [10, 'Market-ready']])('score %i → %s', (s, band) => {
    expect(bandFor(s)).toBe(band);
  });
  it('scores Yes=2, Partly=1, No=0 and returns a per-area summary', () => {
    const r = scoreDiagnostic({ Growth: 'Yes', Economics: 'Partly', Governance: 'No', Narrative: 'Yes', Diligence: 'Partly' });
    expect(r.score).toBe(6);
    expect(r.band).toBe('Investor-readying');
    expect(r.summary.map((s) => s.label)).toEqual(['Strength', 'Partly in place', 'Gap to address', 'Strength', 'Partly in place']);
  });
  it('API returns score + band + summary and never echoes answers', async () => {
    const res = await request(app).post('/api/diagnostic').send({ answers: { Growth: 'Yes', Economics: 'Yes', Governance: 'Yes', Narrative: 'Yes', Diligence: 'Yes' } });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ score: 10, band: 'Market-ready' });
    expect(res.body.answers).toBeUndefined();
  });
});

describe('Lead routing (§8.4)', () => {
  const settings = { routing: DEFAULT_ROUTING, serviceRouting: DEFAULT_SERVICE_ROUTING };
  it.each([
    ['Regulatory and Licences', 'Regulatory lead', 'REGULATORY'],
    ['Manufacturing Advisory', 'Plant setup lead', 'MANUFACTURING'],
    ['Market Entry (India)', 'Strategy and markets lead', 'MARKET ENTRY'],
    ['Market Entry (Global)', 'Strategy and markets lead', 'MARKET ENTRY'],
    ['Strategy Consulting', 'Strategy and markets lead', 'MARKET ENTRY'],
    ['Mergers and Acquisitions', 'Transaction lead', 'M&A'],
    ['Fundraising and IPO Advisory', 'Capital advisory lead', 'CAPITAL'],
    ['General', 'Central business development', 'GENERAL'],
  ])('%s → %s / %s', (sel, owner, tag) => {
    expect(resolveRoute(sel, settings)).toMatchObject({ owner, crmTag: tag });
  });
});

const enquiry = (o = {}) => ({ name: 'Test Person', company: 'Test Co', workEmail: 'test@example.com', country: 'India', industry: 'Medical Devices and Diagnostics', serviceInterest: 'Regulatory and Licences', message: 'Hello', consent: true, startedAt: Date.now() - 5000, website_url: '', ...o });

describe('Enquiry form', () => {
  beforeEach(() => Enquiry.deleteMany({}));
  it('stores the enquiry with CRM tag and owner', async () => {
    const res = await request(app).post('/api/enquiries').send(enquiry({ serviceInterest: 'Mergers and Acquisitions' }));
    expect(res.status).toBe(201);
    const e = await Enquiry.findOne().lean();
    expect(e).toMatchObject({ crmTag: 'M&A', routedOwner: 'Transaction lead', routedTo: 'ma@t' });
  });
  it('rejects a filled honeypot', async () => {
    expect((await request(app).post('/api/enquiries').send(enquiry({ website_url: 'http://spam' }))).status).toBe(400);
  });
  it('rejects submissions faster than 3 seconds', async () => {
    expect((await request(app).post('/api/enquiries').send(enquiry({ startedAt: Date.now() - 500 }))).status).toBe(400);
  });
  it('requires consent and validates fields server-side', async () => {
    const res = await request(app).post('/api/enquiries').send(enquiry({ consent: false, workEmail: 'nope' }));
    expect(res.status).toBe(422);
    expect(Object.keys(res.body.fields)).toEqual(expect.arrayContaining(['workEmail', 'consent']));
  });
  it('strips HTML from inputs', async () => {
    await request(app).post('/api/enquiries').send(enquiry({ message: '<script>x</script>Hi <b>there</b>' }));
    expect((await Enquiry.findOne().lean()).message).toBe('Hi there');
  });
});

describe('Analytics events', () => {
  beforeEach(() => Event.deleteMany({}));
  it('stores nothing without consent', async () => {
    await request(app).post('/api/events').set('Content-Type', 'text/plain').send(JSON.stringify({ consent: false, events: [{ name: 'cta_click', params: {} }] }));
    expect(await Event.countDocuments()).toBe(0);
  });
  it('stores consented events and scrubs message/answer/email params', async () => {
    await request(app).post('/api/events').set('Content-Type', 'text/plain').send(JSON.stringify({ consent: true, events: [{ name: 'form_submit', params: { service: 'X', message: 'secret', answers: 'a', email: 'e' } }, { name: 'not_allowed' }] }));
    const ev = await Event.find().lean();
    expect(ev).toHaveLength(1);
    expect(ev[0].params).toEqual({ service: 'X' });
  });
});

async function login(email) {
  const a = request.agent(app);
  const r = await a.post('/api/admin/login').send({ email, password: 'correct-horse-battery' });
  return { a, csrf: r.body.csrf };
}

describe('CMS workflow', () => {
  let svc;
  beforeEach(async () => {
    await Service.deleteMany({}); await Redirect.deleteMany({});
    svc = await Service.create({ number: '01', title: 'Strategy Consulting', slug: 'strategy-consulting', status: 'review', hero: { headline: 'Short headline' } });
  });
  it('rejects state changes without the CSRF token', async () => {
    const { a } = await login('approver@t.local');
    expect((await a.post(`/api/admin/content/services/${svc._id}/workflow`).send({ action: 'publish' })).status).toBe(403);
  });
  it('editors cannot publish; approvers can and are recorded', async () => {
    const ed = await login('editor@t.local');
    expect((await ed.a.post(`/api/admin/content/services/${svc._id}/workflow`).set('X-CSRF-Token', ed.csrf).send({ action: 'publish' })).status).toBe(403);
    const ap = await login('approver@t.local');
    const r = await ap.a.post(`/api/admin/content/services/${svc._id}/workflow`).set('X-CSRF-Token', ap.csrf).send({ action: 'publish' });
    expect(r.status).toBe(200);
    expect(r.body).toMatchObject({ status: 'published', approverName: 'approver' });
  });
  it('blocks publishing when content limits are exceeded', async () => {
    await Service.updateOne({ _id: svc._id }, { 'hero.headline': 'one two three four five six seven eight nine ten eleven twelve thirteen' });
    const ap = await login('approver@t.local');
    const r = await ap.a.post(`/api/admin/content/services/${svc._id}/workflow`).set('X-CSRF-Token', ap.csrf).send({ action: 'publish' });
    expect(r.status).toBe(422);
  });
  it('creates a 301 when a slug changes', async () => {
    const ed = await login('editor@t.local');
    await ed.a.put(`/api/admin/content/services/${svc._id}`).set('X-CSRF-Token', ed.csrf).send({ slug: 'strategy' });
    expect(await Redirect.findOne({ from: '/services/strategy-consulting/' }).lean()).toMatchObject({ to: '/services/strategy/', code: 301 });
  });
  it('public API only serves published content', async () => {
    expect((await request(app).get('/api/services/strategy-consulting')).status).toBe(404);
  });
});

describe('Regulatory governance', () => {
  it('requires a reviewed date', async () => {
    await expect(RegulatoryItem.create({ jurisdiction: 'India', topic: 'X' })).rejects.toThrow(/reviewed date/);
  });
});

describe('Scheduled publishing', () => {
  it('publishes scheduled insights when publishAt <= now', async () => {
    await Insight.create({ title: 'A', slug: 'a', category: 'Strategy', status: 'scheduled', publishAt: new Date(Date.now() - 1000) });
    await Insight.create({ title: 'B', slug: 'b', category: 'Strategy', status: 'scheduled', publishAt: new Date(Date.now() + 3600e3) });
    expect(await publishDue()).toBe(1);
    expect((await Insight.findOne({ slug: 'a' })).status).toBe('published');
    expect((await Insight.findOne({ slug: 'b' })).status).toBe('scheduled');
  });
});

describe('Redirects and SEO', () => {
  it('301s non-slash URLs to slash versions', async () => {
    const r = await request(app).get('/about');
    expect(r.status).toBe(301);
    expect(r.headers.location).toBe('/about/');
  });
  it('robots.txt disallows /admin', async () => {
    expect((await request(app).get('/robots.txt')).text).toMatch(/Disallow: \/admin/);
  });
  it('health endpoint reports Mongo', async () => {
    expect((await request(app).get('/api/health')).body).toMatchObject({ ok: true, mongo: 'connected' });
  });
});
