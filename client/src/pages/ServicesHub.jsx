import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { q } from '../lib/api.js';
import SEO from '../components/SEO.jsx';
import Hero from '../components/Hero.jsx';
import Section from '../components/Section.jsx';
import Journey from '../components/Journey.jsx';
import CTABand from '../components/CTABand.jsx';
import GeometricVisual from '../components/GeometricVisual.jsx';
import { ServiceCard } from '../components/Cards.jsx';
import PageState from '../templates/PageState.jsx';

export default function ServicesHub() {
  const page = useQuery(q.page('services'));
  return <PageState query={page}>{(p) => <Hub p={p} />}</PageState>;
}

function Hub({ p }) {
  const { data: services = [] } = useQuery(q.services());
  const { data: journeys = [] } = useQuery(q.journeys());
  const sec = Object.fromEntries((p.sections || []).map((s) => [s.key, s]));
  const titleBySlug = Object.fromEntries(services.map((s) => [s.slug, s.title]));
  const crumbs = [{ label: 'Home', to: '/' }, { label: 'What We Do', to: '/services/' }];
  return (
    <>
      <SEO title={p.seo?.title} description={p.seo?.metaDescription} breadcrumbs={crumbs} />
      <Hero variant="split" breadcrumbs={crumbs} eyebrow="What We Do" headline={p.hero?.headline} intro={p.hero?.intro} image={p.hero?.image} visual={p.hero?.image?.src ? undefined : <GeometricVisual variant="services" />} primary={{ label: 'Speak with an advisor', to: '/contact/' }} />

      <Section id="connected-model" num="01" label="Connected advisory model" heading={sec.model?.heading} intro={sec.model?.intro} surface="pale">
        <Journey steps={sec.model?.items || []} label="Connected advisory model" />
      </Section>

      <Section id="services" num="02" label="Seven services" heading={sec.services?.heading}>
        <ul className="grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0">
          {services.map((s) => <li key={s.slug}><ServiceCard service={s} /></li>)}
        </ul>
      </Section>

      <Section id="case-journeys" num="03" label="Cross-service case journeys" heading={sec.journeys?.heading} intro={sec.journeys?.intro} surface="navy">
        <ul className="grid gap-10 lg:grid-cols-3 list-none p-0 m-0">
          {journeys.map((j) => (
            <li key={j.title} className="border-t-2 border-lx-orange pt-6">
              <h3 className="text-[1.5rem]">{j.title}</h3>
              {j.situation && <p className="mt-3 text-white/80">{j.situation}</p>}
              <ol className="mt-6 list-none p-0 m-0 grid gap-0" aria-label={`Services involved: ${j.title}`}>
                {(j.sequence || []).map((slug, i) => (
                  <li key={slug} className="flex items-center gap-3 border-t border-white/15 first:border-t-0">
                    <span className="t-num text-sm text-lx-orange w-6">{String(i + 1).padStart(2, '0')}</span>
                    <Link to={`/services/${slug}/`} className="flex-1 flex items-center justify-between min-h-[48px] text-white no-underline hover:underline decoration-lx-orange underline-offset-4">
                      {titleBySlug[slug] || slug}
                      {i < j.sequence.length - 1 && <ArrowRight aria-hidden="true" className="h-4 w-4 text-white/50 rotate-90" />}
                    </Link>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ul>
      </Section>

      <CTABand heading={p.cta} variant="white" />
    </>
  );
}
