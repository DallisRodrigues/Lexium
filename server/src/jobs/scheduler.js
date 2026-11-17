import cron from 'node-cron';
import { Insight } from '../models/index.js';

/** Flip scheduled insights to published when publishAt <= now. Exported for tests. */
export async function publishDue(now = new Date()) {
  const due = await Insight.find({ status: 'scheduled', publishAt: { $lte: now } });
  for (const d of due) {
    d.status = 'published';
    d.date = d.publishAt;
    d.history.push({ action: 'published (scheduled)', by: 'scheduler' });
    await d.save();
  }
  return due.length;
}

export function startScheduler() {
  return cron.schedule('* * * * *', () => publishDue().then((n) => n && console.log(`[scheduler] published ${n} insight(s)`)).catch((e) => console.error('[scheduler]', e.message)));
}
