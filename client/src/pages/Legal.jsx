import { useQuery } from '@tanstack/react-query';
import { q } from '../lib/api.js';
import SEO from '../components/SEO.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import Disclaimer from '../components/Disclaimer.jsx';
import PageState from '../templates/PageState.jsx';

export default function Legal({ pageKey }) {
  const page = useQuery(q.page(pageKey));
  return (
    <PageState query={page}>
      {(p) => {
        const crumbs = [{ label: 'Home', to: '/' }, { label: p.title, to: p.path }];
        return (
          <>
            <SEO title={p.seo?.title} description={p.seo?.metaDescription} breadcrumbs={crumbs} />
            <article className="container-lx pt-10 md:pt-16 pb-24">
              <Breadcrumbs items={crumbs} />
              <h1 id="page-title" className="t-page mt-10">{p.hero?.headline}</h1>
              {p.legalPlaceholder && <Disclaimer className="mt-8 max-w-[720px]">Placeholder — awaiting legal review. This page will be replaced with text approved by Lexium's legal advisers.</Disclaimer>}
              <div className="prose-lx mt-10">
                {(p.sections || []).map((s) => (
                  <section key={s.key} aria-labelledby={`${s.key}-h`}>
                    <h2 id={`${s.key}-h`}>{s.heading}</h2>
                    {String(s.intro || '').split(/\n{2,}/).map((t) => <p key={t}>{t}</p>)}
                  </section>
                ))}
              </div>
            </article>
          </>
        );
      }}
    </PageState>
  );
}
