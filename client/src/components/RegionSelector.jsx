import { lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { track } from '../lib/analytics.js';

const RegionMap = lazy(() => import('./RegionMap.jsx'));

/**
 * Region selector: every region is a focusable button in a list (map is enhancement only).
 * Selected state uses weight + underline + check icon, not colour alone.
 */
export default function RegionSelector({ regions = [], label = 'Select a region', showMap = true, extraItems = [] }) {
  const all = [...regions, ...extraItems];
  const [sel, setSel] = useState(all[0]?.slug);
  useEffect(() => { if (!sel && all[0]) setSel(all[0].slug); }, [all, sel]);
  const current = all.find((r) => r.slug === sel);
  const select = (slug) => {
    setSel(slug);
    track('region_select', { region: all.find((r) => r.slug === slug)?.name });
  };
  const onKey = (e, i) => {
    const k = e.key;
    if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(k)) return;
    e.preventDefault();
    const n = all.length;
    const j = k === 'Home' ? 0 : k === 'End' ? n - 1 : (i + (k === 'ArrowDown' || k === 'ArrowRight' ? 1 : -1) + n) % n;
    document.getElementById(`region-btn-${all[j].slug}`)?.focus();
  };

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <ul aria-label={label} className="list-none p-0 m-0 border-b border-lx-graphite/15">
          {all.map((r, i) => {
            const on = r.slug === sel;
            return (
              <li key={r.slug} className="border-t border-lx-graphite/15">
                <button
                  id={`region-btn-${r.slug}`}
                  type="button"
                  aria-pressed={on}
                  aria-controls="region-panel"
                  onClick={() => select(r.slug)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={`flex w-full items-center justify-between gap-4 min-h-[56px] bg-transparent border-0 text-left font-display text-xl ${on ? 'font-semibold text-lx-navy' : 'font-medium text-lx-graphite hover:text-lx-navy'}`}
                >
                  <span className={`border-b-2 ${on ? 'border-lx-orange' : 'border-transparent'}`}>{r.name}</span>
                  {on && <Check aria-hidden="true" className="h-5 w-5 text-lx-orange" strokeWidth={2} />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="lg:col-span-8">
        {showMap && (
          <div className="hidden md:block">
            <Suspense fallback={<div className="aspect-[800/420] bg-lx-palegrey" />}>
              <RegionMap regions={all} selected={sel} onSelect={select} />
            </Suspense>
          </div>
        )}
        <div id="region-panel" aria-live="polite" className="mt-6 border-t-2 border-lx-orange pt-6">
          {current && (
            <>
              <h3 className="text-[1.75rem]">{current.name}</h3>
              <p className="mt-3 t-lead measure">{current.overview}</p>
              {current.capabilities?.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2 list-none p-0 m-0">
                  {current.capabilities.map((c) => <li key={c} className="border border-lx-graphite/20 px-3 py-1.5 text-[0.9375rem] text-lx-navy">{c}</li>)}
                </ul>
              )}
              {current.contactRoute && (
                <Link to={current.contactRoute} className="link-arrow mt-6">
                  {current.contactRoute.includes('india') ? 'Explore India Market Entry' : 'Explore Global Market Entry'} <ArrowRight aria-hidden="true" />
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
