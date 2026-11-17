import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useState } from 'react';
import { api } from '../lib/api.js';
import { useAdmin, StatusBadge, KINDS } from './AdminApp.jsx';

const label = (d) => d.title || d.name || d.key || [d.jurisdiction, d.topic].filter(Boolean).join(' — ');

export default function ContentList() {
  const { kind } = useParams();
  const nav = useNavigate();
  const [status, setStatus] = useState('');
  const { data = [], isPending } = useAdmin(`/content/${kind}${status ? `?status=${status}` : ''}`, ['list', kind, status]);
  const title = KINDS.find(([k]) => k === kind)?.[1] || kind;
  const create = async () => {
    const base = { insights: { title: 'Untitled insight', slug: `untitled-${Date.now()}`, category: 'Strategy' }, services: { title: 'Untitled service', slug: `untitled-${Date.now()}`, number: '08' }, industries: { title: 'Untitled industry', slug: `untitled-${Date.now()}` }, regulatory: { jurisdiction: 'India', topic: 'New item', reviewedDate: new Date().toISOString() }, regions: { name: 'New region' }, people: { name: 'New person' }, journeys: { title: 'New journey' }, pages: { key: `page-${Date.now()}`, title: 'New page' } }[kind];
    const doc = await api(`/admin/content/${kind}`, { method: 'POST', body: base });
    nav(`/admin/content/${kind}/${doc._id}`);
  };
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[2rem]">{title}</h1>
        <div className="flex gap-3">
          <label className="sr-only" htmlFor="st">Filter by status</label>
          <select id="st" className="input-lx !w-auto" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>{['draft', 'review', 'scheduled', 'published', 'archived'].map((s) => <option key={s}>{s}</option>)}
          </select>
          <button className="btn btn-navy" onClick={create}>New</button>
        </div>
      </div>
      <div className="bg-white border border-lx-graphite/15 overflow-x-auto">
        <table className="w-full text-[0.9375rem] min-w-[640px]">
          <thead><tr className="text-left text-xs uppercase tracking-[0.1em] text-lx-midgrey"><th className="p-3">Title</th><th className="p-3">Status</th><th className="p-3">Origin</th><th className="p-3">Verify</th><th className="p-3">Updated</th></tr></thead>
          <tbody>
            {isPending && <tr><td className="p-3">Loading…</td></tr>}
            {data.map((d) => (
              <tr key={d._id} className="border-t border-lx-graphite/10">
                <td className="p-3"><Link to={`/admin/content/${kind}/${d._id}`} className="text-link">{d.number ? `${d.number} ` : ''}{label(d)}</Link></td>
                <td className="p-3"><StatusBadge status={d.status} />{d.publishAt && d.status === 'scheduled' && <span className="t-meta ml-2">{format(new Date(d.publishAt), 'd MMM HH:mm')}</span>}</td>
                <td className="p-3 t-meta">{d.copyOrigin}</td>
                <td className="p-3 t-meta">{d.verificationRequired ? 'Required' : '—'}</td>
                <td className="p-3 t-meta t-num">{format(new Date(d.updatedAt), 'd MMM yyyy')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
