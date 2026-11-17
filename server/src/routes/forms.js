import { Router } from 'express';
import { z } from 'zod';
import { Enquiry, DiagnosticResult, SiteSettings } from '../models/index.js';
import { formLimiter, botControl } from '../middleware/bot.js';
import { validate, clean } from '../middleware/validate.js';
import { resolveRoute, SERVICE_INTEREST_OPTIONS } from '../mail/routing.js';
import { sendLeadEmails, sendDiagnosticSummary } from '../mail/index.js';
import { scoreDiagnostic, DIAGNOSTIC_QUESTIONS } from '../lib-diagnostic.js';

const r = Router();

export const INDUSTRY_OPTIONS = [
  'Medical Devices and Diagnostics',
  'Healthcare and Digital Health',
  'Cosmetics and Personal Care',
  'Food, Nutrition and Beverages',
  'Consumer Health and Wellness',
  'Other',
];

const txt = (max, msg) => z.string({ error: msg }).transform(clean).pipe(z.string().min(1, msg).max(max));

const EnquiryInput = z.object({
  name: txt(120, 'Enter your name'),
  company: txt(160, 'Enter your company'),
  workEmail: z.string().trim().toLowerCase().email('Enter a valid work email address').max(200),
  phone: z.string().trim().max(40).regex(/^[+()\d\s.-]*$/, 'Enter a valid phone number').optional().or(z.literal('')),
  country: txt(80, 'Enter your country'),
  industry: z.enum(INDUSTRY_OPTIONS, { error: 'Select an industry' }),
  serviceInterest: z.enum(SERVICE_INTEREST_OPTIONS, { error: 'Select a service interest' }),
  message: txt(3000, 'Tell us briefly what you are working through'),
  consent: z.literal(true, { error: 'Please confirm consent so we can respond' }),
  sourcePage: z.string().max(300).optional(),
  utm: z.record(z.string(), z.string().max(200)).optional(),
  sessionId: z.string().max(64).optional(),
  website_url: z.string().optional(),
  startedAt: z.union([z.number(), z.string()]).optional(),
});

r.post('/enquiries', formLimiter, botControl, validate(EnquiryInput), async (req, res) => {
  const { website_url, startedAt, ...data } = req.valid;
  const settings = await SiteSettings.findOne({ key: 'site' }).lean();
  const route = resolveRoute(data.serviceInterest, settings);
  const enquiry = await Enquiry.create({ ...data, routedTo: route.email, routedOwner: route.owner, crmTag: route.crmTag });
  try {
    await sendLeadEmails(enquiry, route, settings);
    enquiry.mailStatus = 'sent';
  } catch (e) {
    enquiry.mailStatus = 'failed: ' + e.message;
    console.error('[mail] lead email failed', e.message);
  }
  await enquiry.save();
  res.status(201).json({ ok: true, id: enquiry._id, responseWindow: settings?.responseWindow });
});

r.get('/diagnostic/questions', (_req, res) => res.json(DIAGNOSTIC_QUESTIONS));

const Answer = z.enum(['Yes', 'Partly', 'No']);
const DiagnosticInput = z.object({
  answers: z.object(Object.fromEntries(DIAGNOSTIC_QUESTIONS.map((q) => [q.area, Answer]))),
  sourcePage: z.string().max(300).optional(),
  sessionId: z.string().max(64).optional(),
});

r.post('/diagnostic', formLimiter, validate(DiagnosticInput), async (req, res) => {
  const { answers, sourcePage, sessionId } = req.valid;
  const result = scoreDiagnostic(answers);
  const doc = await DiagnosticResult.create({ answers, score: result.score, band: result.band, sourcePage, sessionId });
  res.status(201).json({ id: doc._id, ...result });
});

const EmailInput = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  consent: z.literal(true, { error: 'Please confirm consent' }),
});

r.post('/diagnostic/:id/email', formLimiter, validate(EmailInput), async (req, res) => {
  const doc = await DiagnosticResult.findById(req.params.id).select('+answers');
  if (!doc) return res.status(404).json({ error: 'Result not found' });
  doc.email = req.valid.email;
  doc.emailConsent = true;
  await doc.save();
  const { summary } = scoreDiagnostic(doc.answers);
  try {
    await sendDiagnosticSummary(doc.email, doc, summary);
  } catch (e) {
    console.error('[mail] diagnostic email failed', e.message);
  }
  res.json({ ok: true });
});

export default r;
