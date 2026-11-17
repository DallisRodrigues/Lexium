const KEY = 'lx-consent-v1';
const listeners = new Set();

export function getConsent() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null;
  } catch {
    return null;
  }
}

export function setConsent(analytics) {
  const value = { essential: true, analytics: Boolean(analytics), ts: new Date().toISOString() };
  localStorage.setItem(KEY, JSON.stringify(value));
  if (!analytics) sessionStorage.removeItem('lx-sid');
  listeners.forEach((fn) => fn(value));
  return value;
}

export const hasAnalyticsConsent = () => getConsent()?.analytics === true;

export function onConsentChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
