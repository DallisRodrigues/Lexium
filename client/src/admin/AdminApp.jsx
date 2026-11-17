import { useEffect, useState, lazy, Suspense } from 'react';
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api.js';
import Login from './Login.jsx';
import Dashboard from './Dashboard.jsx';
import ContentList from './ContentList.jsx';
import { Redirects, Settings, Enquiries, ImageCredits } from './Screens.jsx';

const ContentEditor = lazy(() => import('./ContentEditor.jsx'));
const Styleguide = lazy(() => import('./Styleguide.jsx'));

export const KINDS = [
  ['services', 'Services'], ['industries', 'Industries'], ['insights', 'Insights'], ['regulatory', 'Regulatory'],
  ['regions', 'Regions'], ['people', 'People'], ['journeys', 'Case journeys'], ['pages', 'Pages'],
];

const navCls = ({ isActive }) => `block px-3 py-2 min-h-[40px] no-underline text-[0.9375rem] ${isActive ? 'bg-white/10 text-white font-semibold border-l-2 border-lx-orange' : 'text-white/75 hover:text-white border-l-2 border-transparent'}`;

export default function AdminApp() {
  const qc = useQueryClient();
  const nav = useNavigate();
  const me = useQuery({ queryKey: ['me'], queryFn: () => api('/admin/me'), retry: false });
  useEffect(() => { document.title = 'Lexium CMS'; }, []);
  if (me.isPending) return <p className="p-8">Loading…</p>;
  if (me.isError) return <Login onDone={() => qc.invalidateQueries({ queryKey: ['me'] })} />;
  const logout = async () => { await api('/admin/logout', { method: 'POST' }); qc.removeQueries({ queryKey: ['me'] }); nav('/admin/'); location.reload(); };

  return (
    <div className="min-h-screen grid lg:grid-cols-[240px_1fr] bg-lx-palegrey">
      <aside className="surface-navy on-dark lg:min-h-screen">
        <div className="p-5 border-b border-white/15">
          <p className="font-display text-lg font-semibold text-white">Lexium CMS</p>
          <p className="text-xs text-white/70 mt-1">{me.data.name} · {me.data.role}</p>
        </div>
        <nav aria-label="Admin" className="p-3 grid gap-0.5">
          <NavLink to="/admin/" end className={navCls}>Dashboard</NavLink>
          <p className="px-3 pt-4 pb-1 text-[11px] uppercase tracking-[0.14em] text-white/60">Content</p>
          {KINDS.map(([k, l]) => <NavLink key={k} to={`/admin/content/${k}`} className={navCls}>{l}</NavLink>)}
          <p className="px-3 pt-4 pb-1 text-[11px] uppercase tracking-[0.14em] text-white/60">Site</p>
          <NavLink to="/admin/enquiries" className={navCls}>Enquiries</NavLink>
          <NavLink to="/admin/redirects" className={navCls}>Redirects</NavLink>
          <NavLink to="/admin/settings" className={navCls}>Settings</NavLink>
          <NavLink to="/admin/image-credits" className={navCls}>Image credits</NavLink>
          <NavLink to="/admin/styleguide" className={navCls}>Styleguide</NavLink>
          <a href="/" className="block px-3 py-2 text-white/75 no-underline hover:text-white mt-4">View site ↗</a>
          <button onClick={logout} className="text-left px-3 py-2 bg-transparent border-0 text-white/75 hover:text-white">Sign out</button>
        </nav>
      </aside>
      <main id="main" className="p-5 md:p-8 min-w-0">
        <Suspense fallback={<p>Loading…</p>}>
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="content/:kind" element={<ContentList me={me.data} />} />
            <Route path="content/:kind/:id" element={<ContentEditor me={me.data} />} />
            <Route path="enquiries" element={<Enquiries />} />
            <Route path="redirects" element={<Redirects />} />
            <Route path="settings" element={<Settings me={me.data} />} />
            <Route path="image-credits" element={<ImageCredits />} />
            <Route path="styleguide" element={<Styleguide />} />
            <Route path="*" element={<Navigate to="/admin/" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export function useAdmin(path, key) {
  return useQuery({ queryKey: ['admin', ...(key || [path])], queryFn: () => api(`/admin${path}`) });
}

export function StatusBadge({ status }) {
  const style = { published: 'bg-lx-navy text-white', review: 'bg-lx-orange text-lx-navy', scheduled: 'border border-lx-navy text-lx-navy', draft: 'border border-lx-graphite/40 text-lx-graphite', archived: 'bg-lx-graphite/15 text-lx-graphite' }[status];
  return <span className={`inline-block px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.08em] ${style}`}>{status}</span>;
}

export function Panel({ title, children, actions }) {
  return (
    <section className="bg-white border border-lx-graphite/15 p-5 md:p-6">
      {(title || actions) && <div className="flex items-center justify-between gap-4 mb-4">{title && <h2 className="text-[1.25rem]">{title}</h2>}{actions}</div>}
      {children}
    </section>
  );
}

export function useFlash() {
  const [msg, setMsg] = useState(null);
  useEffect(() => { if (msg) { const t = setTimeout(() => setMsg(null), 5000); return () => clearTimeout(t); } }, [msg]);
  return [msg && <p role="status" className={`p-3 mb-4 border-l-4 ${msg.error ? 'border-lx-orange bg-white field-error' : 'border-lx-navy bg-white'}`}>{msg.text}</p>, setMsg];
}
