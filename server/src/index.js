import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';
import { createApp } from './app.js';
import { startScheduler } from './jobs/scheduler.js';

const ROOT = path.resolve(import.meta.dirname, '../..');
const prod = process.env.NODE_ENV === 'production';
// Hosted platforms (Render etc.) terminate TLS at their proxy and hand us $PORT: serve plain HTTP there.
const hosted = Boolean(process.env.PORT);
const port = Number(process.env.PORT || (prod ? process.env.HTTPS_PORT || 8443 : process.env.API_PORT || 4000));
const keyPath = path.resolve(ROOT, process.env.TLS_KEY || 'certs/localhost-key.pem');
const certPath = path.resolve(ROOT, process.env.TLS_CERT || 'certs/localhost.pem');
const useTls = !hosted && fs.existsSync(keyPath) && fs.existsSync(certPath);

mongoose.set('strictQuery', true);
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lexium', { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log(`[db] connected to ${mongoose.connection.name}`))
  .catch((e) => console.error('[db] connection failed:', e.message));

startScheduler();
const app = createApp({ serveClient: prod });
const server = useTls
  ? https.createServer({ key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) }, app)
  : http.createServer(app);
// Avoid keep-alive socket reuse races with browsers issuing many parallel asset requests.
server.keepAliveTimeout = 65_000;
server.headersTimeout = 66_000;
server.listen(port, '0.0.0.0', () => console.log(`[server] ${prod ? 'production' : 'api'} listening on ${useTls ? 'https' : 'http'}://${hosted ? '0.0.0.0' : 'lexium.local'}:${port}`));
