import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { api } from '../lib/api.js';
import { useAdmin, Panel, useFlash } from './AdminApp.jsx';

export function Redirects() {
  const qc = useQueryClient();
  const { data = [] } = useAdmin('/redirects');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [code, setCode] = useState(301);
  const [flash, setFlash] = useFlash();
  const add = async (e) => {
    e.preventDefault();
    try { await api('/admin/redirects', { method: 'POST', body: { from, to, code: Number(code) } }); setFrom(''); setTo(''); setFlash({ text: 'Redirect saved.' }); qc.invalidateQueries({ queryKey: ['admin', '/redirects'] }); }
    catch (x) { setFlash({ text: x.message, error: true }); }
  };
  const del = async (id) => { await api(`/admin/redirects/${id}`, { method: 'DELETE' }); qc.invalidateQueries({ queryKey: ['admin', '/redirects'] }); };
  return (
    <div className="grid gap-6">
      <h1 className="text-[2rem]">Redirects</h1>
      {flash}
      <Panel title="Add redirect">
        <form onSubmit={add} className="grid gap-4 md:grid-cols-[1fr_1fr_120px_auto] items-end">
          <div><label className="label-lx" htmlFor="rf">From</label><input id="rf" className="input-lx" placeholder="/old-path/" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
          <div><label className="label-lx" htmlFor="rt">To</label><input id="rt" className="input-lx" placeholder="/new-path/" value={to} onChange={(e) => setTo(e.target.value)} /></div>
          <div><label className="label-lx" htmlFor="rc">Code</label><select id="rc" className="input-lx" value={code} onChange={(e) => setCode(e.target.value)}><option>301</option><option>302</option></select></div>
          <button className="btn btn-navy">Add</button>
        </form>
      </Panel>
      <Panel title={`Active redirects (${data.length})`}>
        <table className="w-full text-[0.9375rem]"><thead><tr className="text-left t-meta"><th className="py-2">From</th><th>To</th><th>Code</th><th>Source</th><th /></tr></thead>
          <tbody>{data.map((r) => (
            <tr key={r._id} className="border-t border-lx-graphite/10"><td className="py-2 font-mono text-sm">{r.from}</td><td className="font-mono text-sm">{r.to}</td><td>{r.code}</td><td className="t-meta">{r.auto ? 'slug change' : 'manual'}</td><td className="text-right"><button className="text-link bg-transparent border-0" onClick={() => del(r._id)}>Delete</button></td></tr>
          ))}</tbody></table>
      </Panel>
    </div>
  );
}

export function Settings({ me }) {
  const { data, refetch } = useAdmin('/settings');
  const [s, setS] = useState(null);
  const [flash, setFlash] = useFlash();
  useEffect(() => { if (data) setS(data); }, [data]);
  if (!s) return <p>Loading…</p>;
  const f = (k, label, hint) => (
    <div><label className="label-lx" htmlFor={k}>{label}</label><input id={k} className="input-lx" value={s[k] || ''} onChange={(e) => setS({ ...s, [k]: e.target.value })} />{hint && <p className="t-meta mt-1">{hint}</p>}</div>
  );
  const save = async () => {
    try { await api('/admin/settings', { method: 'PUT', body: s }); setFlash({ text: 'Settings saved.' }); refetch(); }
    catch (x) { setFlash({ text: x.message, error: true }); }
  };
  const canEdit = ['admin', 'approver'].includes(me.role);
  return (
    <div className="grid gap-6 max-w-[960px]">
      <h1 className="text-[2rem]">Settings</h1>
      {flash}
      <Panel title="Home hero variant">
        <fieldset className="grid gap-3 border-0 p-0">
          <legend className="sr-only">Active home hero headline</legend>
          {(s.heroVariants || []).map((v, i) => (
            <label key={i} className="flex gap-3 items-start border border-lx-graphite/15 p-3 cursor-pointer">
              <input type="radio" name="hv" checked={s.activeHeroVariant === i} onChange={() => setS({ ...s, activeHeroVariant: i })} className="mt-1" />
              <span><span className="font-semibold text-lx-navy">{v.headline}</span><span className="block t-meta">{v.label} — {v.note}</span></span>
            </label>
          ))}
        </fieldset>
      </Panel>
      <Panel title="Contact details (footer and Contact page only)">
        <div className="grid gap-4 md:grid-cols-2">
          {f('email', 'Primary enquiry email')}{f('website', 'Website')}
          {f('officeAddress', 'Approved office address', 'Leave blank to show “Approved office address — to be confirmed”.')}
          {f('phone', 'Telephone', 'Never shown in primary navigation.')}{f('linkedin', 'LinkedIn URL')}
          {f('responseWindow', 'Enquiry response window')}
        </div>
        <div className="mt-4">{f('footerPositioningLine', 'Footer positioning line')}</div>
        <div className="mt-4">{f('leadershipLine', 'Home leadership proof line')}</div>
        <div className="mt-4"><label className="label-lx" htmlFor="or">Operating regions (comma-separated)</label><input id="or" className="input-lx" value={(s.operatingRegions || []).join(', ')} onChange={(e) => setS({ ...s, operatingRegions: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) })} /></div>
        <label className="flex items-center gap-2 mt-4"><input type="checkbox" checked={!!s.newsletterEnabled} onChange={(e) => setS({ ...s, newsletterEnabled: e.target.checked })} /> Enable newsletter sign-up (only when a genuine email cadence and consent process are ready)</label>
      </Panel>
      <Panel title="Lead routing">
        <p className="t-meta mb-3">Owner email addresses are configured in .env (LEAD_*). Map each contact-form service interest to a routing selection.</p>
        <table className="w-full text-[0.9375rem] mb-6"><thead><tr className="text-left t-meta"><th className="py-2">Selection</th><th>Internal owner</th><th>CRM tag</th><th>.env key</th></tr></thead>
          <tbody>{(s.routing || []).map((r) => <tr key={r.selection} className="border-t border-lx-graphite/10"><td className="py-2">{r.selection}</td><td>{r.owner}</td><td className="font-semibold">{r.crmTag}</td><td className="font-mono text-sm">{r.envKey}</td></tr>)}</tbody></table>
        <div className="grid gap-3 md:grid-cols-2">
          {Object.entries(s.serviceRouting || {}).map(([k, v]) => (
            <div key={k}><label className="label-lx" htmlFor={`sr-${k}`}>{k}</label>
              <select id={`sr-${k}`} className="input-lx" value={v} onChange={(e) => setS({ ...s, serviceRouting: { ...s.serviceRouting, [k]: e.target.value } })}>
                {(s.routing || []).map((r) => <option key={r.selection}>{r.selection}</option>)}
              </select></div>
          ))}
        </div>
      </Panel>
      <button className="btn btn-navy justify-self-start" onClick={save} disabled={!canEdit}>Save settings</button>
    </div>
  );
}

export function Enquiries() {
  const [params, setParams] = useSearchParams();
  const tag = params.get('tag') || '';
  const { data = [] } = useAdmin(`/enquiries${tag ? `?tag=${encodeURIComponent(tag)}` : ''}`, ['enq', tag]);
  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <h1 className="text-[2rem]">Enquiries</h1>
        <div><label className="sr-only" htmlFor="tg">Filter by CRM tag</label>
          <select id="tg" className="input-lx !w-auto" value={tag} onChange={(e) => setParams(e.target.value ? { tag: e.target.value } : {})}>
            <option value="">All CRM tags</option>{['REGULATORY', 'MANUFACTURING', 'MARKET ENTRY', 'M&A', 'CAPITAL', 'GENERAL'].map((t) => <option key={t}>{t}</option>)}
          </select></div>
      </div>
      <div className="grid gap-4">
        {data.map((e) => (
          <Panel key={e._id} title={`${e.name} — ${e.company}`} actions={<span className="font-semibold text-sm">{e.crmTag}</span>}>
            <p className="t-meta">{format(new Date(e.createdAt), 'd MMM yyyy HH:mm')} · routed to {e.routedOwner} ({e.routedTo}) · mail {e.mailStatus}</p>
            <p className="mt-2 text-sm">{e.workEmail}{e.phone ? ` · ${e.phone}` : ''} · {e.country} · {e.industry} · {e.serviceInterest}</p>
            <p className="mt-3 whitespace-pre-wrap">{e.message}</p>
            <p className="t-meta mt-2">Source: {e.sourcePage}</p>
          </Panel>
        ))}
        {!data.length && <p className="t-meta">No enquiries.</p>}
      </div>
    </div>
  );
}

export function ImageCredits() {
  const { data = [] } = useAdmin('/image-credits');
  return (
    <div className="grid gap-6">
      <h1 className="text-[2rem]">Image credits</h1>
      <Panel>
        {data.length ? (
          <table className="w-full text-[0.9375rem]"><thead><tr className="text-left t-meta"><th className="py-2">File</th><th>Source</th><th>Photographer</th><th>Licence</th><th>Downloaded</th></tr></thead>
            <tbody>{data.map((c) => <tr key={c.file} className="border-t border-lx-graphite/10"><td className="py-2 font-mono text-sm">{c.file}</td><td>{c.source}</td><td><a className="text-link" href={c.pageUrl} target="_blank" rel="noopener">{c.photographer}</a></td><td>{c.license}</td><td className="t-num">{c.downloadedAt}</td></tr>)}</tbody></table>
        ) : <p className="t-meta">No stock images downloaded yet. Add an Unsplash or Pexels key to .env and run <code>npm run images</code>.</p>}
      </Panel>
    </div>
  );
}
