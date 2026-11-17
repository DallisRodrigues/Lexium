import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { q } from '../lib/api.js';
import SEO from '../components/SEO.jsx';
import Hero from '../components/Hero.jsx';
import Section from '../components/Section.jsx';
import ChipList from '../components/ChipList.jsx';
import CapabilityTabs from '../components/CapabilityTabs.jsx';
import ProcessSteps from '../components/ProcessSteps.jsx';
import CTABand from '../components/CTABand.jsx';
import CustomSection from '../components/CustomSection.jsx';
import { StatementBlock } from '../components/Cards.jsx';
import RelatedInsights from './RelatedInsights.jsx';
import PageState from './PageState.jsx';

export default function IndustryPage() {
  const { slug } = useParams();
  const query = useQuery(q.industry(slug));
  return <PageState query={query}>{(d) => <Industry d={d} />}</PageState>;
}

function Industry({ d }) {
  let n = 1;
  const next = () => String(++n).padStart(2, '0');
  const custom = (slot) => (d.customSections || []).filter((c) => c.after === slot).map((c) => <CustomSection key={c.key} s={c} num={next()} page={d.slug} />);
  const crumbs = [{ label: 'Home', to: '/' }, { label: 'Industries', to: '/industries/' }, { label: d.title, to: `/industries/${d.slug}/` }];
  const svcBySlug = Object.fromEntries((d.services || []).map((s) => [s.slug, s]));

  return (
    <>
      <SEO title={d.seo?.title} description={d.seo?.metaDescription} image={d.hero?.image?.src} breadcrumbs={crumbs} noindex={d.seo?.noindex} />
      <Hero
        variant="split"
        breadcrumbs={crumbs}
        eyebrow={d.title}
        num={d.number}
        headline={d.hero?.headline}
        intro={d.hero?.intro || d.positioning}
        introMobile={d.hero?.introMobile}
        image={d.hero?.image}
        primary={{ label: 'Speak with an advisor', to: `/contact/?industry=${d.slug}` }}
        analytics={{ industry: d.slug }}
      />
      {custom('hero')}

      {d.tensionStatement && (
        <Section id="market-tension" num={next()} label="Market tension" surface="navy">
          <StatementBlock text={d.tensionStatement} dark />
        </Section>
      )}
      {d.tensions?.length > 0 && (
        <Section id="market-tensions" num={next()} label="Market tensions" heading={d.tensionsHeading || 'The forces shaping growth'} tight>
          <ChipList items={d.tensions.map((t) => t.title)} label="Market tensions" />
        </Section>
      )}
      {custom('tension')}

      {d.subsectors?.length > 0 && (
        <Section id="subsectors" num={next()} label="Subsectors" heading="Where we work in this sector" tight>
          <ChipList items={d.subsectors} label="Subsectors" />
        </Section>
      )}
      {custom('subsectors')}

      {d.clientQuestions?.length > 0 && (
        <Section id="client-questions" num={next()} label="Client questions" surface="pale">
          <ul className="list-none p-0 m-0 grid gap-x-10 md:grid-cols-2 lg:grid-cols-3">
            {d.clientQuestions.map((cq) => (
              <li key={cq} className="border-t border-lx-graphite/20 py-5 font-display text-[1.375rem] md:text-[1.625rem] leading-snug font-medium text-lx-navy">{cq}</li>
            ))}
          </ul>
        </Section>
      )}

      {d.capabilityModules?.length > 0 && (
        <Section id="capabilities" num={next()} label={d.capabilitiesLabel || 'Connected capabilities'} heading={`How Lexium supports ${d.title.toLowerCase()} businesses`}>
          <CapabilityTabs
            label={`${d.title} capabilities`}
            tabs={d.capabilityModules.map((m) => {
              const svc = svcBySlug[m.service];
              return {
                value: m.title,
                label: m.title,
                heading: m.title,
                body: m.body,
                links: svc ? [{ to: `/services/${svc.slug}/`, label: `Explore ${svc.title}` }] : [],
              };
            })}
          />
        </Section>
      )}
      {custom('capabilities')}

      {d.challenges?.length > 0 && (
        <Section id="challenges" num={next()} label={d.challengesLabel || 'Four challenges'} heading="What growth demands" surface="pale">
          <ul className="grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4 list-none p-0 m-0">
            {d.challenges.map((c, i) => (
              <li key={c.title} className="border-t-2 border-lx-orange pt-6">
                <p className="t-num text-sm font-semibold text-lx-midgrey">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-3 text-[1.375rem] leading-snug">{c.title}</h3>
                {c.body && <p className="mt-3 text-lx-graphite">{c.body}</p>}
              </li>
            ))}
          </ul>
        </Section>
      )}
      {custom('challenges')}

      {d.approach?.length > 0 && (
        <Section id="approach" num={next()} label="Approach" heading="How we work with you">
          <ProcessSteps steps={d.approach} label="Approach" />
        </Section>
      )}
      {custom('approach')}

      {d.services?.length > 0 && (
        <Section id="related-services" num={next()} label="Related services" heading="Services most often combined in this sector" tight>
          <ul className="list-none p-0 m-0 grid md:grid-cols-2 gap-x-10 border-b border-lx-graphite/15">
            {d.services.map((s) => (
              <li key={s.slug} className="border-t border-lx-graphite/15">
                <Link to={`/services/${s.slug}/`} className="group flex items-center justify-between gap-4 py-5 min-h-[44px] no-underline">
                  <span><span className="t-num text-sm num-accent mr-3">{s.number}</span><span className="font-display text-xl font-semibold text-lx-navy group-hover:underline decoration-lx-orange decoration-2 underline-offset-4">{s.title}</span></span>
                  <ArrowRight aria-hidden="true" className="h-5 w-5 text-lx-orange flex-none" />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <RelatedInsights num={next()} industry={d.slug} />
      <CTABand heading={d.cta} to={`/contact/?industry=${d.slug}`} variant="navy" industry={d.slug} />
    </>
  );
}
