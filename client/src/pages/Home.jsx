import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { q } from '../lib/api.js';
import SEO from '../components/SEO.jsx';
import Hero from '../components/Hero.jsx';
import Section from '../components/Section.jsx';
import CapabilityTabs from '../components/CapabilityTabs.jsx';
import RegionSelector from '../components/RegionSelector.jsx';
import ProcessSteps from '../components/ProcessSteps.jsx';
import CTABand from '../components/CTABand.jsx';
import Portrait from '../components/Portrait.jsx';
import Reveal from '../components/Reveal.jsx';
import { IndustryCard, InsightCard, StatementBlock } from '../components/Cards.jsx';
import PageState from '../templates/PageState.jsx';

/** Home — content order is fixed by the document (§9.1). */
export default function Home() {
  const page = useQuery(q.page('home'));
  return <PageState query={page}>{(p) => <HomeContent p={p} />}</PageState>;
}

function HomeContent({ p }) {
  const { data: settings } = useQuery(q.settings());
  const { data: services = [] } = useQuery(q.services());
  const { data: industries = [] } = useQuery(q.industries());
  const { data: regions = [] } = useQuery(q.regions('home'));
  const { data: insights } = useQuery(q.insights('All', 1, 3));
  const { data: people = [] } = useQuery(q.people());
  const sec = Object.fromEntries((p.sections || []).map((s) => [s.key, s]));
  const variant = settings?.heroVariants?.[settings?.activeHeroVariant ?? 0];
  const headline = variant?.headline || p.hero?.headline;
  const founder = people.find((x) => x.isFounder) || people[0];
  const bySlug = Object.fromEntries(services.map((s) => [s.slug, s]));

  const tabs = (sec.capabilities?.items || []).map((t) => {
    const svcs = (t.services || []).map((s) => bySlug[s]).filter(Boolean);
    const main = svcs[0];
    const deliverables = (main?.capabilities || []).slice(0, t.count || 4).map((c) => c.title);
    return {
      value: t.label,
      label: t.label,
      heading: main?.outcomeLine && main.outcomeLine.charAt(0).toUpperCase() + main.outcomeLine.slice(1) + '.',
      body: t.body,
      deliverables,
      links: svcs.map((s) => ({ to: `/services/${s.slug}/`, label: svcs.length > 1 ? `Explore ${s.title}` : 'Explore service' })),
    };
  });

  return (
    <>
      <SEO title={p.seo?.title} description={p.seo?.metaDescription} image={p.hero?.image?.src} />

      {/* 2. Hero */}
      <Hero
        variant="split"
        display
        headline={headline}
        intro={p.hero?.intro}
        image={p.hero?.image}
        primary={{ label: 'Explore our capabilities', to: '/services/' }}
        secondary={{ label: 'Speak with an advisor', to: '/contact/' }}
      />

      {/* 3. Credential strip */}
      <section aria-label="Credentials" className="border-y border-lx-graphite/15 bg-white">
        <ul className="container-lx list-none m-0 py-5 md:py-6 grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-nowrap gap-x-6 gap-y-3 lg:gap-0">
          {(sec.credentials?.items || []).map((c, i) => (
            <li key={c} className={`lg:flex-1 text-[0.9375rem] md:text-base font-semibold text-lx-navy lg:px-4 lg:first:pl-0 ${i ? 'lg:border-l border-lx-graphite/20' : ''}`}>{c}</li>
          ))}
        </ul>
      </section>

      {/* 4. Market tension */}
      {sec.tension && (
        <section className="section" aria-label="Market tension">
          <div className="container-lx grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3"><p className="eyebrow"><span className="num">01</span>{sec.tension.eyebrow}</p></div>
            <Reveal className="lg:col-span-9"><StatementBlock text={sec.tension.data?.text} accent={sec.tension.data?.accent} /></Reveal>
          </div>
        </section>
      )}

      {/* 5. Six capability tabs */}
      <Section id="capabilities" num="02" label={sec.capabilities?.eyebrow || 'Capabilities'} heading={sec.capabilities?.heading} surface="pale">
        <CapabilityTabs tabs={tabs} label="Lexium capabilities" />
      </Section>

      {/* 6. Industries */}
      <Section id="industries" num="03" label="Industries" heading={sec.industries?.heading}>
        <ul className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-6 list-none p-0 m-0">
          {industries.map((ind, i) => (
            <li key={ind.slug} className={i < 2 ? 'lg:col-span-3' : 'lg:col-span-2'}>
              <IndustryCard industry={ind} />
            </li>
          ))}
        </ul>
        <Link to="/industries/" className="link-arrow mt-10">All industries <ArrowRight aria-hidden="true" /></Link>
      </Section>

      {/* 7. India and Global */}
      <Section id="india-and-global" num="04" label="India and Global" heading={sec.regions?.heading} intro={sec.regions?.intro}>
        <RegionSelector regions={regions} label="Regions" />
      </Section>

      {/* 8. How we work */}
      <Section id="how-we-work" num="05" label="How we work" heading={sec['how-we-work']?.heading} surface="pale">
        <ProcessSteps steps={sec['how-we-work']?.items || []} label="How we work" />
      </Section>

      {/* 9. Insights */}
      <Section id="insights" num="06" label="Insights" heading={sec.insights?.heading}>
        <ul className="grid gap-x-8 gap-y-12 md:grid-cols-3 list-none p-0 m-0">
          {(insights?.items || []).map((i) => <li key={i.slug}><InsightCard insight={i} /></li>)}
        </ul>
        <Link to="/insights/" className="link-arrow mt-10">All insights <ArrowRight aria-hidden="true" /></Link>
      </Section>

      {/* 10. Leadership proof */}
      <Section id="leadership" num="07" label="Leadership" surface="navy">
        <div className="grid gap-10 lg:grid-cols-12 items-center">
          <div className="lg:col-span-4 max-w-[360px]"><Portrait person={founder} /></div>
          <div className="lg:col-span-8">
            <p className="font-display text-[clamp(1.75rem,1.2rem+2vw,3rem)] leading-[1.15] font-medium text-white text-balance">{settings?.leadershipLine}</p>
            {founder && (
              <p className="mt-8 text-white/85">
                <span className="font-semibold text-white">{founder.name}</span>
                {founder.role ? <> — {founder.role}</> : null}
              </p>
            )}
            <Link to="/about/#leadership" className="link-arrow mt-6">Meet the leadership <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </Section>

      {/* 11. CTA band */}
      <CTABand heading={p.cta || 'What could your next growth chapter look like?'} label="Discuss your ambition" variant="orange" />
    </>
  );
}
