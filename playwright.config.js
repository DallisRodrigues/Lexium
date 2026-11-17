import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  timeout: 60_000,
  workers: 2,
  reporter: [['list']],
  use: { baseURL: 'https://127.0.0.1:8444', ignoreHTTPSErrors: true, viewport: { width: 1440, height: 900 } },
  webServer: {
    command: 'node --env-file=.env server/src/index.js',
    url: 'https://127.0.0.1:8444/api/health',
    ignoreHTTPSErrors: true,
    reuseExistingServer: false,
    timeout: 30_000,
    env: { NODE_ENV: 'production', HTTPS_PORT: '8444', FORM_RATE_LIMIT: '200' },
  },
});
