import { useEffect, useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { api, q } from '../lib/api.js';
import SEO from '../components/SEO.jsx';
import Hero from '../components/Hero.jsx';
import { InsightCard } from '../components/Cards.jsx';
import PageState from '../templates/PageState.jsx';

const FILTERS = ['All', 'Strategy', 'Markets', 'Regulation', 'Manufacturing', 'M&A', 'Capital', 'Industry'];
const PER = 6;

export default function Insights() {
  const page = useQuery(q.page('insights'));
  return <PageState query={page}>{(p) => <List p={p} />}</PageState>;
}

function List({ p }) {
  const [params, setParams] = useSearchParams();
  const category = FILTERS.includes(params.get('category')) ? params.get('category') : 'All';
  const type = params.get('type') || '';
  const pageNum = Math.max(1, Number(params.get('page')) || 1);
  const { data: settings } = useQuery(q.settings());
  const { data: featuredRes } = useQuery({ queryKey: ['insights-featured'], queryFn: () => api('/insights?featured=true&limit=1') });
  const featured = featuredRes?.items?.[0];
  const [extra, setExtra] = useState([]);
  const [loadedTo, setLoadedTo] = useState(pageNum);

  const listQ = useQuery({
    queryKey: ['insights-list', category, type, pageNum],
    queryFn: () => api(`/insights?category=${encodeURIComponent(category)}&page=${pageNum}&limit=${PER}${type ? `&type=${encodeURIComponent(type)}` : ''}`),
    placeholderData: keepPreviousData,
  });
  useEffect(() => { setExtra([]); setLoadedTo(pageNum); }, [category, type, pageNum]);

  const items = [...(listQ.data?.items || []), ...extra].filter((i) => category !== 'All' || type || pageNum > 1 || i.slug !== featured?.slug);
  const pages = listQ.data?.pages || 1;

  const loadMore = async () => {
    const nextPage = loadedTo + 1;
    const r = await api(`/insights?category=${encodeURIComponent(category)}&page=${nextPage}&limit=${PER}${type ? `&type=${encodeURIComponent(type)}` : ''}`);
    setExtra((e) => [...e, ...r.items]);
    setLoadedTo(nextPage);
  };
  const setFilter = (c) => {
    const next = new URLSearchParams();
    if (c !== 'All') next.set('category', c);
    setParams(next, { preventScrollReset: true });
  };
  const crumbs = [{ label: 'Home', to: '/' }, { label: 'Insights', to: '/insights/' }];
  const href = (n) => `/insights/?${new URLSearchParams({ ...(category !== 'All' ? { category } : {}), ...(type ? { type } : {}), page: n })}`;

  return (
    <>
      <SEO title={p.seo?.title} description={p.seo?.metaDescription} breadcrumbs={crumbs} />
      <Hero variant="light" breadcrumbs={crumbs} eyebrow="Insights" headline={p.hero?.headline} intro={p.hero?.intro} />

      {featured && category === 'All' && !type && pageNum === 1 && (
        <section aria-label="Featured insight" className="pb-16 md:pb-24"><div className="container-lx"><InsightCard insight={featured} variant="featured" headingLevel={2} /></div></section>
      )}

      <section aria-labelledby="all-insights-h" className="section-tight border-t border-lx-graphite/15">
        <div className="container-lx">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <h2 id="all-insights-h" className="text-[2rem]">{type ? `${type}s` : 'All perspectives'}</h2>
            <div role="group" aria-label="Filter insights by category" className="flex gap-2 overflow-x-auto no-scrollbar -mx-[var(--gutter)] px-[var(--gutter)] lg:mx-0 lg:px-0 lg:flex-wrap">
              {FILTERS.map((c) => {
                const on = c === category;
                return (
                  <button key={c} type="button" aria-pressed={on} onClick={() => setFilter(c)}
                    className={`flex-none min-h-[44px] px-4 border text-[0.9375rem] ${on ? 'bg-lx-navy border-lx-navy text-white font-semibold underline decoration-lx-orange decoration-2 underline-offset-4' : 'bg-white border-lx-graphite/25 text-lx-navy hover:border-lx-navy'}`}>
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
          {type && <p className="t-meta mt-4">Showing: {type}s · <Link to="/insights/" className="text-link">Clear</Link></p>}

          <div aria-live="polite" aria-busy={listQ.isFetching}>
            {items.length ? (
              <ul className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0">
                {items.map((i) => <li key={i.slug}><InsightCard insight={i} /></li>)}
              </ul>
            ) : (
              !listQ.isPending && <p className="mt-12 t-lead">No insights in this category yet.</p>
            )}
          </div>

          {loadedTo < pages && (
            <div className="mt-14 flex flex-col items-start gap-4">
              <button type="button" onClick={loadMore} className="btn btn-outline">Load more</button>
              <nav aria-label="Insights pages" className="t-meta">
                <ul className="flex gap-2 list-none p-0 m-0">
                  {Array.from({ length: pages }, (_, k) => k + 1).map((n) => (
                    <li key={n}><Link to={href(n)} aria-current={n === pageNum ? 'page' : undefined} className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] border border-lx-graphite/20 no-underline aria-[current=page]:bg-lx-navy aria-[current=page]:text-white">{n}</Link></li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </div>
      </section>

      {settings?.newsletterEnabled && <Newsletter />}
    </>
  );
}

/** Newsletter — disabled by default (newsletterEnabled:false) until a genuine cadence and consent process exist. */
function Newsletter() {
  return (
    <section aria-labelledby="newsletter-h" className="section-tight surface-pale">
      <div className="container-lx max-w-[720px]">
        <h2 id="newsletter-h" className="text-[1.75rem]">Receive new perspectives</h2>
        <p className="mt-3">Occasional insights on growth in regulated markets. Unsubscribe at any time.</p>
        <form className="mt-6 flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="nl-email" className="sr-only">Email</label>
          <input id="nl-email" type="email" inputMode="email" autoComplete="email" className="input-lx flex-1" />
          <button className="btn btn-navy" type="submit">Subscribe</button>
        </form>
      </div>
    </section>
  );
}
