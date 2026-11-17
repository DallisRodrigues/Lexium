export const MAILPIT = process.env.MAILPIT_API || 'http://127.0.0.1:8025';
export const consent = (ctx, analytics = false) => ctx.addInitScript((a) => localStorage.setItem('lx-consent-v1', JSON.stringify({ essential: true, analytics: a })), analytics);
export const TEMPLATES = ['/', '/services/', '/services/regulatory-licences/', '/services/fundraising-ipo-advisory/', '/industries/', '/industries/medical-devices-diagnostics/', '/insights/', '/insights/capital-readiness-founder-led-businesses/', '/about/', '/contact/', '/privacy/'];

/** Navigate and wait until the client has taken over the prerendered markup. */
export async function go(page, url) {
  await page.goto(url);
  await page.waitForSelector('html[data-lx-ready="1"]');
}
