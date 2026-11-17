import { hasAnalyticsConsent, onConsentChange } from './consent.js';

/**
 * Consent-gated analytics (§13). Nothing is queued or sent before consent.
 * Events are batched and sent with navigator.sendBeacon to /api/events.
 */
const BLOCKED = /message|answer|email|phone|name|company/i;
let queue = [];
let timer;

export function sessionId() {
  if (!hasAnalyticsConsent()) return undefined;
  let id = sessionStorage.getItem('lx-sid');
  if (!id) {
    id = crypto.getRandomValues(new Uint32Array(4)).reduce((s, n) => s + n.toString(36), '');
    sessionStorage.setItem('lx-sid', id);
  }
  return id;
}

export function track(name, params = {}) {
  if (typeof window === 'undefined' || !hasAnalyticsConsent()) return false;
  const safe = Object.fromEntries(Object.entries(params).filter(([k, v]) => !BLOCKED.test(k) && v !== undefined && v !== ''));
  queue.push({ name, params: safe, page: location.pathname, ts: Date.now() });
  if (window.__lxEvents) window.__lxEvents.push({ name, params: safe }); // test hook
  clearTimeout(timer);
  timer = setTimeout(flush, 2000);
  return true;
}

export function flush() {
  if (!queue.length || !hasAnalyticsConsent()) return;
  const payload = JSON.stringify({ consent: true, sessionId: sessionId(), events: queue });
  queue = [];
  const ok = navigator.sendBeacon?.('/api/events', new Blob([payload], { type: 'text/plain' }));
  if (!ok) fetch('/api/events', { method: 'POST', body: payload, keepalive: true, headers: { 'Content-Type': 'text/plain' } }).catch(() => {});
}

if (typeof window !== 'undefined') {
  addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => document.visibilityState === 'hidden' && flush());
  onConsentChange((c) => { if (!c.analytics) queue = []; });
}
