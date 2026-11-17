// Lighthouse CI against the production build (npm run build && npm start).
// CHROME_PATH defaults to Playwright's Chromium.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const pw = path.join(os.homedir(), '.cache/ms-playwright');
const chrome = process.env.CHROME_PATH || (fs.existsSync(pw) && fs.readdirSync(pw).filter((d) => /^chromium-\d+$/.test(d)).sort().map((d) => path.join(pw, d, 'chrome-linux64/chrome')).filter(fs.existsSync).pop());
const BASE = process.env.LHCI_BASE || 'https://127.0.0.1:8443';

module.exports = {
  ci: {
    collect: {
      url: ['/', '/services/regulatory-licences/', '/industries/medical-devices-diagnostics/', '/insights/capital-readiness-founder-led-businesses/'].map((u) => BASE + u),
      numberOfRuns: 1,
      chromePath: chrome,
      settings: { chromeFlags: '--headless=new --ignore-certificate-errors --no-sandbox', preset: 'desktop', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] },
    },
    assert: {
      assertions: {
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 200 }],
        'total-byte-weight': ['error', { maxNumericValue: 1_500_000 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci' },
  },
};
