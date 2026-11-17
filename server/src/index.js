import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';
import { createApp } from './app.js';
import { startScheduler } from './jobs/scheduler.js';

const ROOT = path.resolve(import.meta.dirname, '../..');
const prod = process.env.NODE_ENV === 'production';
const port = Number(prod ? process.env.HTTPS_PORT || 8443 : process.env.API_PORT || 4000);
const tls = {
  key: fs.readFileSync(path.resolve(ROOT, process.env.TLS_KEY || 'certs/localhost-key.pem')),
  cert: fs.readFileSync(path.resolve(ROOT, process.env.TLS_CERT || 'certs/localhost.pem')),
};

mongoose.set('strictQuery', true);
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lexium', { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log(`[db] connected to ${mongoose.connection.name}`))
  .catch((e) => console.error('[db] connection failed:', e.message));

startScheduler();
const server = https.createServer(tls, createApp({ serveClient: prod }));
// Avoid keep-alive socket reuse races with browsers issuing many parallel asset requests.
server.keepAliveTimeout = 65_000;
server.headersTimeout = 66_000;
server.listen(port, '0.0.0.0', () => console.log(`[server] ${prod ? 'production' : 'api'} listening on https://lexium.local:${port}`));
