#!/usr/bin/env node
// Writes REVIEW_ITEMS.md: every drafted / review / verificationRequired item awaiting Lexium approval.
import fs from 'node:fs/promises';
import { mongoose } from '../server/src/deps.js';
import { CONTENT_MODELS } from '../server/src/models/index.js';

await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lexium');
const label = (d) => d.title || d.name || d.key || [d.jurisdiction, d.topic].filter(Boolean).join(' — ');
let out = `# Items awaiting Lexium approval\n\nGenerated ${new Date().toISOString().slice(0, 10)} by \`npm run review-report\`. Approve in the CMS (/admin/) — only approver/admin roles can publish.\n`;
for (const [kind, M] of Object.entries(CONTENT_MODELS)) {
  const docs = await M.find({ $or: [{ copyOrigin: 'drafted' }, { status: { $ne: 'published' } }, { verificationRequired: true }] }).lean();
  if (!docs.length) continue;
  out += `\n## ${kind} (${docs.length})\n\n| Item | Status | Copy | Verification | Claim source |\n|---|---|---|---|---|\n`;
  for (const d of docs) out += `| ${label(d)} | ${d.status} | ${d.copyOrigin} | ${d.verificationRequired ? '**Required**' : '—'} | ${d.claimSource || '—'} |\n`;
}
out += `\n## Placeholders to replace\n\n- Logo files (client/public/brand/) — dashed placeholder until supplied\n- Founder name, biography and portrait (people) — "Founder — name to be confirmed"\n- Office address, telephone and LinkedIn URL (Settings) — blank shows "to be confirmed"\n- Privacy and Terms — placeholder text awaiting legal review\n- Stock images — neutral placeholders until \`npm run images\` is run with an API key\n`;
await fs.writeFile('REVIEW_ITEMS.md', out);
console.log('Wrote REVIEW_ITEMS.md');
await mongoose.disconnect();
