import { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { q } from '../lib/api.js';
import { track } from '../lib/analytics.js';
import { ORIGIN } from '../components/SEO.jsx';
import SEO from '../components/SEO.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import Picture from '../components/Picture.jsx';
import Portrait from '../components/Portrait.jsx';
import CTABand from '../components/CTABand.jsx';
import RelatedInsights from './RelatedInsights.jsx';
import PageState from './PageState.jsx';

export default function ArticlePage() {
  const { slug } = useParams();
  const query = useQuery(q.insight(slug));
  return <PageState query={query}>{(a) => <Article a={a} />}</PageState>;
}

/** Fire insight_read at 50% and 90% scroll depth through the article body. */
function useReadDepth(ref, a) {
  useEffect(() => {
    const fired = new Set();
    const on = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const pct = Math.min(1, Math.max(0, (innerHeight - r.top) / r.height));
      for (const t of [50, 90]) if (pct * 100 >= t && !fired.has(t)) { fired.add(t); track('insight_read', { article: a.slug, category: a.category, threshold: t }); }
    };
    addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, [ref, a.slug, a.category]);
}

function Article({ a }) {
  const body = useRef(null);
  useReadDepth(body, a);
  const date = new Date(a.date);
  const crumbs = [{ label: 'Home', to: '/' }, { label: 'Insights', to: '/insights/' }, { label: a.title, to: `/insights/${a.slug}/` }];
  // Key takeaways sit within the body, after the opening section.
  const html = a.bodyHtml || '';
  const split = html.indexOf('<h2', 20);
  const [first, rest] = split > 0 ? [html.slice(0, split), html.slice(split)] : [html, ''];
  const jsonLd = [{
    '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.standfirst,
    datePublished: date.toISOString(), dateModified: new Date(a.updatedAt || a.date).toISOString(),
    author: a.author?.name ? { '@type': 'Person', name: a.author.name, jobTitle: a.author.role } : { '@type': 'Organization', name: 'Lexium Consulting' },
    publisher: { '@type': 'Organization', name: 'Lexium Consulting' },
    mainEntityOfPage: `${ORIGIN}/insights/${a.slug}/`,
    ...(a.image?.src ? { image: `${ORIGIN}${a.image.src}-1200.webp` } : {}),
  }];
  if (a.author?.name) jsonLd.push({ '@context': 'https://schema.org', '@type': 'Person', name: a.author.name, jobTitle: a.author.role, ...(a.author.linkedin ? { sameAs: [a.author.linkedin] } : {}) });

  return (
    <>
      <SEO title={a.seo?.title} description={a.seo?.metaDescription || a.standfirst} image={a.image?.src} type="article" breadcrumbs={crumbs} jsonLd={jsonLd} noindex={a.seo?.noindex} />
      <article>
        <header className="container-lx pt-10 md:pt-16">
          <Breadcrumbs items={crumbs} />
          <div className="max-w-[920px] mt-10 md:mt-14">
            <p className="eyebrow"><span className="num">{a.category}</span>{a.type}</p>
            <h1 id="page-title" className="t-page mt-6 text-balance">{a.title}</h1>
            {a.standfirst && <p className="t-lead mt-6 measure">{a.standfirst}</p>}
            <p className="t-meta t-num mt-8 flex flex-wrap gap-x-3">
              {a.author?.name && <span className="font-semibold text-lx-graphite">{a.author.name}</span>}
              <span aria-hidden="true">·</span>
              <time dateTime={date.toISOString().slice(0, 10)}>{format(date, 'd MMMM yyyy')}</time>
              <span aria-hidden="true">·</span>
              <span>{a.readingTime} min read</span>
            </p>
          </div>
        </header>
        {a.image?.src && (
          <div className="container-lx mt-10 md:mt-14">
            <Picture image={a.image} priority aspect="21 / 9" sizes="(min-width:1440px) 1360px, 100vw" />
          </div>
        )}
        <div className="container-lx section-tight">
          <div ref={body} className="mx-auto max-w-[720px]">
            <div className="prose-lx" dangerouslySetInnerHTML={{ __html: first }} />
            {a.keyTakeaways?.length > 0 && (
              <aside aria-labelledby="takeaways-h" className="my-12 border-y-2 border-lx-navy py-8">
                <h2 id="takeaways-h" className="text-[1.5rem]">Key takeaways</h2>
                <ol className="mt-5 list-none p-0 m-0 grid gap-4">
                  {a.keyTakeaways.map((t, i) => (
                    <li key={t} className="flex gap-4"><span className="t-num num-accent self-start">{String(i + 1).padStart(2, '0')}</span><span>{t}</span></li>
                  ))}
                </ol>
              </aside>
            )}
            <div className="prose-lx" dangerouslySetInnerHTML={{ __html: rest }} />
            {a.sources?.length > 0 && (
              <section aria-labelledby="sources-h" className="mt-12 border-t border-lx-graphite/15 pt-6">
                <h2 id="sources-h" className="text-[1.125rem] font-body font-semibold tracking-[0.1em] uppercase text-lx-graphite">Sources</h2>
                <ol className="mt-4 grid gap-2 t-meta pl-5">
                  {a.sources.map((s) => <li key={s.url || s.label}>{s.url ? <a href={s.url} rel="noopener" className="text-link">{s.label}</a> : s.label}{s.date ? `, ${s.date}` : ''}</li>)}
                </ol>
              </section>
            )}
            {(a.services?.length > 0 || a.industries?.length > 0) && (
              <nav aria-label="Related services and industries" className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
                {[...(a.services || []).map((s) => [s.title, `/services/${s.slug}/`]), ...(a.industries || []).map((s) => [s.title, `/industries/${s.slug}/`])].map(([t, to]) => (
                  <Link key={to} to={to} className="text-link inline-flex min-h-[44px] items-center">{t}</Link>
                ))}
              </nav>
            )}
            {a.author?.name && (
              <section aria-labelledby="author-h" className="mt-12 grid grid-cols-[96px_1fr] md:grid-cols-[120px_1fr] gap-6 items-start border-t-2 border-lx-orange pt-8">
                <Portrait person={a.author} />
                <div>
                  <h2 id="author-h" className="text-[1.375rem]">{a.author.name}</h2>
                  <p className="t-meta mt-1">{a.author.role}</p>
                  <div className="mt-3 flex gap-6">
                    <Link to="/about/#leadership" className="text-link inline-flex min-h-[44px] items-center">Leadership profile</Link>
                    {a.author.linkedin && <a href={a.author.linkedin} rel="noopener" target="_blank" className="text-link inline-flex min-h-[44px] items-center">LinkedIn<span className="sr-only"> (opens in a new tab)</span></a>}
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </article>
      <RelatedInsights num="" exclude={a.slug} label="Related insights" heading="Continue reading" />
      <CTABand heading="Discuss what this means for your business" variant="navy" />
    </>
  );
}
