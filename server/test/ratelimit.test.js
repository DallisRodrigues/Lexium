import { describe, it, expect } from 'vitest';
import request from 'supertest';

process.env.FORM_RATE_LIMIT = '3';
const { createApp } = await import('../src/app.js');

describe('Rate limiting', () => {
  it('returns 429 after the per-IP form limit is exceeded', async () => {
    const app = createApp({ serveClient: false });
    const codes = [];
    for (let i = 0; i < 5; i++) codes.push((await request(app).post('/api/enquiries').send({ website_url: 'bot' })).status);
    expect(codes.slice(0, 3).every((c) => c !== 429)).toBe(true);
    expect(codes.slice(3)).toEqual([429, 429]);
  });
});
