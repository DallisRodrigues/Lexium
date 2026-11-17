#!/usr/bin/env node
// Deploy helper: seeds the database only when it has no content yet (first deploy on a fresh
// cluster). Never wipes an existing database. Run with MONGODB_URI in the environment.
import { mongoose } from '../server/src/deps.js';
import { Page } from '../server/src/models/index.js';

if (!process.env.MONGODB_URI) { console.log('[seed-if-empty] MONGODB_URI not set — skipping'); process.exit(0); }
await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
const pages = await Page.countDocuments();
await mongoose.disconnect();
if (pages > 0) { console.log(`[seed-if-empty] database already has ${pages} pages — skipping`); process.exit(0); }
console.log('[seed-if-empty] empty database — seeding content');
await import('./seed.mjs');
