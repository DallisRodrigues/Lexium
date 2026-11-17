import { Router } from 'express';
import express from 'express';
import { Event } from '../models/index.js';
import { eventLimiter } from '../middleware/bot.js';

const r = Router();
export const ALLOWED_EVENTS = ['cta_click', 'service_tab_select', 'region_select', 'form_start', 'form_submit', 'diagnostic_start', 'diagnostic_complete', 'insight_read', 'email_click'];
const BLOCKED_KEYS = /message|answer|email|phone|name|company/i;

const scrub = (params = {}) =>
  Object.fromEntries(
    Object.entries(params)
      .filter(([k, v]) => !BLOCKED_KEYS.test(k) && ['string', 'number', 'boolean'].includes(typeof v))
      .map(([k, v]) => [k.slice(0, 40), typeof v === 'string' ? v.slice(0, 160) : v]),
  );

// sendBeacon posts text/plain; accept both.
r.post('/events', eventLimiter, express.text({ type: '*/*', limit: '32kb' }), async (req, res) => {
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).end(); }
  }
  if (!body?.consent) return res.status(204).end(); // never store without consent
  const events = (Array.isArray(body.events) ? body.events : []).slice(0, 50).filter((e) => ALLOWED_EVENTS.includes(e?.name));
  if (events.length)
    await Event.insertMany(
      events.map((e) => ({ name: e.name, params: scrub(e.params), page: String(e.page || '').slice(0, 300), sessionId: String(body.sessionId || '').slice(0, 64), ts: e.ts ? new Date(e.ts) : new Date() })),
    );
  res.status(204).end();
});

export default r;
