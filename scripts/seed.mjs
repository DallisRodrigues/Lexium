#!/usr/bin/env node
/**
 * Seeds ALL content from the Lexium information architecture (§9).
 *   npm run seed            → wipe content collections and reseed (enquiries/events are kept)
 *   npm run seed -- --all   → also wipe enquiries, events, diagnostic results and redirects
 * Document wording is stored with copyOrigin 'document'. Any record containing drafted copy is
 * stored with copyOrigin 'drafted' and status 'review' so Lexium can approve it.
 */
import { mongoose, argon2, sanitizeHtml, readingTime } from '../server/src/deps.js';
import {
  Service, Industry, Insight, Person, Region, RegulatoryItem, CaseJourney, SiteSettings, User, Page,
  Enquiry, Event, DiagnosticResult, Redirect,
} from '../server/src/models/index.js';
import { checkLimits } from '../server/src/routes/admin.js';
import { DEFAULT_ROUTING, DEFAULT_SERVICE_ROUTING } from '../server/src/mail/routing.js';
import { services } from './seed/services.mjs';
import { industries } from './seed/industries.mjs';
import { insights } from './seed/insights.mjs';
import { settings, pages, regions, regulatoryItems, journeys, people } from './seed/site.mjs';

const ALL = process.argv.includes('--all');
const SEEDER = 'seed script';
const FULLY_DOCUMENT_PAGES = new Set([]); // every page includes at least some drafted copy
const hist = (note) => [{ action: 'seeded', by: SEEDER, note }];
const drafted = (extra = {}) => ({ status: 'review', copyOrigin: 'drafted', history: hist('Drafted copy awaiting Lexium approval'), createdBy: SEEDER, ...extra });

await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lexium');
console.log(`Seeding ${mongoose.connection.name}…`);

const wipe = [Service, Industry, Insight, Person, Region, RegulatoryItem, CaseJourney, SiteSettings, Page];
if (ALL) wipe.push(Enquiry, Event, DiagnosticResult, Redirect);
await Promise.all(wipe.map((M) => M.deleteMany({})));

// ── Admin user (credentials printed once) ──
const email = (process.env.ADMIN_EMAIL || 'admin@lexium.local').toLowerCase();
let printedPassword = null;
if (!(await User.findOne({ email }))) {
  await User.create({ name: process.env.ADMIN_NAME || 'Lexium Admin', email, role: 'admin', passwordHash: await argon2.hash(process.env.ADMIN_PASSWORD) });
  printedPassword = process.env.ADMIN_PASSWORD;
}

// ── Settings ──
await SiteSettings.create({ ...settings, routing: DEFAULT_ROUTING, serviceRouting: DEFAULT_SERVICE_ROUTING, updatedBy: SEEDER });

// ── People ──
const [founder] = await Person.insertMany(people.map((p) => ({ ...p, ...drafted({ verificationRequired: true }) })));

// ── Services & industries (two passes to link both ways) ──
const svcDocs = await Service.insertMany(services.map(({ industries: _i, ...s }) => ({ ...s, people: [founder._id], ...drafted() })));
const svcId = Object.fromEntries(svcDocs.map((d) => [d.slug, d._id]));
const indDocs = await Industry.insertMany(industries.map(({ services: s = [], ...i }) => ({ ...i, services: s.map((x) => svcId[x]), ...drafted() })));
const indId = Object.fromEntries(indDocs.map((d) => [d.slug, d._id]));
for (const s of services) await Service.updateOne({ slug: s.slug }, { industries: (s.industries || []).map((x) => indId[x]) });

// ── Insights ──
const insightDocs = await Insight.insertMany(
  insights.map((a) => {
    const bodyHtml = sanitizeHtml(a.bodyHtml, { allowedTags: sanitizeHtml.defaults.allowedTags, allowedAttributes: {} });
    return {
      ...a,
      bodyHtml,
      readingTime: Math.max(1, Math.round(readingTime(sanitizeHtml(bodyHtml, { allowedTags: [] })).minutes)),
      author: founder._id,
      services: a.services.map((x) => svcId[x]),
      industries: a.industries.map((x) => indId[x]),
      seo: { title: a.seoTitle || `${a.title.length > 44 ? a.title.slice(0, a.title.lastIndexOf(' ', 44)) : a.title} | Lexium`, metaDescription: a.standfirst.length > 160 ? a.standfirst.slice(0, a.standfirst.lastIndexOf(' ', 156)) + '…' : a.standfirst },
      ...drafted(),
    };
  }),
);
for (const a of insightDocs) {
  await Service.updateMany({ _id: { $in: a.services } }, { $addToSet: { insights: a._id } });
  await Industry.updateMany({ _id: { $in: a.industries } }, { $addToSet: { insights: a._id } });
}

// ── Regions, regulatory items, journeys, pages ──
await Region.insertMany(regions.map((r) => ({ ...r, regionStatus: 'active', ...drafted({ verificationRequired: true, claimSource: 'Regions listed in the information architecture; delivery capability to be confirmed by Lexium' }) })));
await RegulatoryItem.insertMany(regulatoryItems.map((r) => ({ ...r, ...drafted({ verificationRequired: true, claimSource: r.claimSource }) })));
await CaseJourney.insertMany(journeys.map((j) => ({ ...j, services: j.sequence.map((x) => svcId[x]), approvalStatus: 'pending', ...drafted() })));
await Page.insertMany(pages.map((p) => ({ ...p, ...(FULLY_DOCUMENT_PAGES.has(p.key) ? { status: 'published', copyOrigin: 'document' } : drafted()) })));

// ── Content limit report (§5.6) ──
let issues = 0;
for (const [kind, M] of [['services', Service], ['industries', Industry], ['pages', Page], ['insights', Insight]]) {
  for (const d of await M.find().lean()) {
    const v = checkLimits(kind, d);
    if (v.length) { issues += v.length; console.log(`  ⚠ ${kind}/${d.slug || d.key}: ${v.join('; ')}`); }
  }
}

const counts = Object.fromEntries(await Promise.all([Service, Industry, Insight, Person, Region, RegulatoryItem, CaseJourney, Page].map(async (M) => [M.modelName, await M.countDocuments()])));
console.log('Seeded:', counts);
console.log(issues ? `Content limit warnings: ${issues}` : 'All content within §5.6 limits.');
if (printedPassword) console.log(`\nAdmin user created — shown once:\n  email:    ${email}\n  password: ${printedPassword}\n  Sign in at https://lexium.local:5173/admin/\n`);
await mongoose.disconnect();
