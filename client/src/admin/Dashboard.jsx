import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useAdmin, Panel } from './AdminApp.jsx';

const label = (d) => d.title || d.name || d.key || [d.jurisdiction, d.topic].filter(Boolean).join(' — ');

export default function Dashboard() {
  const { data, isPending } = useAdmin('/dashboard');
  if (isPending) return <p>Loading…</p>;
  const list = (rows) => (
    <ul className="list-none p-0 m-0 divide-y divide-lx-graphite/10 max-h-[360px] overflow-auto">
      {rows.map((r) => (
        <li key={r.kind + r._id} className="py-2 flex justify-between gap-4">
          <Link to={`/admin/content/${r.kind}/${r._id}`} className="text-link">{label(r)}</Link>
          <span className="t-meta">{r.kind}</span>
        </li>
      ))}
      {!rows.length && <li className="py-2 t-meta">Nothing here.</li>}
    </ul>
  );
  return (
    <div className="grid gap-6">
      <h1 className="text-[2rem]">Dashboard</h1>
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title={`Content needing review (${data.review.length})`}>{list(data.review)}</Panel>
        <Panel title={`Verification required (${data.verification.length})`}>{list(data.verification)}</Panel>
        <Panel title="Regulatory items reviewed over 6 months ago">
          {data.staleRegulatory.length ? (
            <ul className="list-none p-0 m-0">{data.staleRegulatory.map((r) => <li key={r._id}><Link className="text-link" to={`/admin/content/regulatory/${r._id}`}>{r.jurisdiction} — {r.topic}</Link> <span className="t-meta">({format(new Date(r.reviewedDate), 'd MMM yyyy')})</span></li>)}</ul>
          ) : <p className="t-meta">All regulatory content reviewed within six months.</p>}
        </Panel>
        <Panel title="Conversions">
          <table className="w-full text-[0.9375rem]"><tbody>
            {Object.entries(data.conversions).map(([k, v]) => <tr key={k} className="border-t border-lx-graphite/10"><td className="py-2 pr-4">{k}</td><td className="py-2 t-num font-semibold text-right">{v}</td></tr>)}
          </tbody></table>
        </Panel>
        <Panel title="Enquiries by CRM tag">
          <table className="w-full text-[0.9375rem]"><tbody>
            {data.enquiriesByTag.map((e) => <tr key={e._id} className="border-t border-lx-graphite/10"><td className="py-2"><Link className="text-link" to={`/admin/enquiries?tag=${encodeURIComponent(e._id)}`}>{e._id}</Link></td><td className="t-num text-right font-semibold">{e.count}</td></tr>)}
            {!data.enquiriesByTag.length && <tr><td className="t-meta py-2">No enquiries yet.</td></tr>}
          </tbody></table>
        </Panel>
        <Panel title="Analytics events (consented)">
          <table className="w-full text-[0.9375rem]"><tbody>
            {data.eventsByName.map((e) => <tr key={e._id} className="border-t border-lx-graphite/10"><td className="py-2">{e._id}</td><td className="t-num text-right font-semibold">{e.count}</td></tr>)}
            {!data.eventsByName.length && <tr><td className="t-meta py-2">No events yet.</td></tr>}
          </tbody></table>
          {data.diagnosticBands.length > 0 && <p className="t-meta mt-3">Diagnostic results: {data.diagnosticBands.map((b) => `${b._id} ${b.count}`).join(' · ')}</p>}
        </Panel>
      </div>
    </div>
  );
}
