import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { q } from '../lib/api.js';
import SEO from '../components/SEO.jsx';
import Hero from '../components/Hero.jsx';
import Section from '../components/Section.jsx';
import Accordion from '../components/Accordion.jsx';
import ProcessSteps from '../components/ProcessSteps.jsx';
import CTABand from '../components/CTABand.jsx';
import Disclaimer from '../components/Disclaimer.jsx';
import CustomSection from '../components/CustomSection.jsx';
import GeometricVisual from '../components/GeometricVisual.jsx';
import { StatementBlock, TensionList, EngagementCard } from '../components/Cards.jsx';
import RelatedInsights from './RelatedInsights.jsx';
import PageState from './PageState.jsx';

/**
 * Reusable service page template (§9.3):
 * 01 Hero → 02 Client question → 03 Why it matters → 04 Capabilities → 05 Typical engagements →
 * 06 How we work → 07 Related industries → 08 Related insights → 09 CTA.
 * Page-specific customSections are inserted after the slot named in `after`.
 */
export default function ServicePage() {
  const { slug } = useParams();
  const query = useQuery(q.service(slug));
  return <PageState query={query}>{(s) => <Service s={s} />}</PageState>;
}

function Service({ s }) {
  let n = 1;
  const next = () => String(++n).padStart(2, '0');
  const custom = (slot) => (s.customSections || []).filter((c) => c.after === slot).map((c) => <CustomSection key={c.key} s={c} num={next()} page={s.slug} />);
  const crumbs = [{ label: 'Home', to: '/' }, { label: 'What We Do', to: '/services/' }, { label: s.title, to: `/services/${s.slug}/` }];
  const analytics = { service: s.slug };

  return (
    <>
      <SEO title={s.seo?.title} description={s.seo?.metaDescription} image={s.hero?.image?.src} breadcrumbs={crumbs} noindex={s.seo?.noindex} />
      <Hero
        variant={s.hero?.variant || 'split'}
        breadcrumbs={crumbs}
        eyebrow={s.eyebrow}
        num={s.number}
        headline={s.hero?.headline}
        intro={s.hero?.intro}
        introMobile={s.hero?.introMobile}
        audience={s.hero?.audience}
        image={s.hero?.image}
        visual={s.slug === 'strategy-consulting' ? <GeometricVisual /> : undefined}
        primary={{ label: 'Speak with an advisor', to: `/contact/?service=${s.slug}` }}
        analytics={analytics}
      />
      {custom('hero')}

      {(s.clientQuestionStatement || s.clientQuestions?.length > 0) && (
        <Section id="client-question" num={next()} label="The client question" surface="pale">
          {s.clientQuestionStatement && <StatementBlock text={s.clientQuestionStatement} accent={s.clientQuestionAccent} />}
          {s.clientQuestions?.length > 0 && (
            <ul className="list-none p-0 m-0 grid gap-x-10 md:grid-cols-2 lg:grid-cols-3 mt-2">
              {s.clientQuestions.map((cq) => (
                <li key={cq} className="border-t border-lx-graphite/20 py-5 font-display text-[1.375rem] md:text-[1.625rem] leading-snug font-medium text-lx-navy">{cq}</li>
              ))}
            </ul>
          )}
        </Section>
      )}
      {custom('question')}

      {s.tensions?.length > 0 && (
        <Section id="why-it-matters" num={next()} label="Why it matters" heading={s.tensionsHeading}>
          <TensionList items={s.tensions} />
        </Section>
      )}
      {custom('tensions')}

      {s.capabilities?.length > 0 && (
        <Section id="capabilities" num={next()} label="Capabilities" heading={s.capabilitiesHeading || `What ${s.title} covers`}>
          <Accordion
            defaultOpen={[`cap-${1}`]}
            items={s.capabilities.map((c, i) => ({
              id: `cap-${i + 1}`,
              title: c.title,
              content: (
                <div>
                  {c.outcome && <p className="font-display text-xl font-semibold text-lx-navy">{c.outcome}</p>}
                  <p className={`mt-3 text-lx-graphite ${c.summaryMobile ? 'hidden md:block' : ''}`}>{c.summary}</p>
                  {c.summaryMobile && <p className="mt-3 text-lx-graphite md:hidden">{c.summaryMobile}</p>}
                  {c.deliverables?.length > 0 && (
                    <>
                      <p className="mt-6 text-xs font-semibold tracking-[0.12em] uppercase text-lx-midgrey">Deliverables</p>
                      <ul className="mt-2 list-none p-0 m-0 grid sm:grid-cols-2 gap-x-8">
                        {c.deliverables.map((d) => <li key={d} className="py-2 border-t border-lx-graphite/10 text-[0.9875rem]">{d}</li>)}
                      </ul>
                    </>
                  )}
                </div>
              ),
            }))}
          />
        </Section>
      )}
      {custom('capabilities')}

      {s.engagements?.length > 0 && (
        <Section id="engagements" num={next()} label="Typical engagements" heading="Where we are typically asked to help" surface="pale">
          <ul className="grid gap-6 md:grid-cols-3 list-none p-0 m-0">
            {s.engagements.map((e, i) => <li key={e.title}><EngagementCard e={e} index={i} /></li>)}
          </ul>
        </Section>
      )}
      {custom('engagements')}

      {s.methodology?.length > 0 && (
        <Section id="how-we-work" num={next()} label="How we work" heading={s.methodologyHeading || 'A four-stage approach'}>
          <ProcessSteps steps={s.methodology} label={s.methodologyHeading || 'How we work'} />
        </Section>
      )}
      {custom('methodology')}

      {s.industries?.length > 0 && (
        <Section id="related-industries" num={next()} label="Related industries" heading="Sectors where this matters most" tight>
          <ul className="list-none p-0 m-0 border-b border-lx-graphite/15">
            {s.industries.slice(0, 5).map((ind) => (
              <li key={ind.slug} className="border-t border-lx-graphite/15">
                <Link to={`/industries/${ind.slug}/`} className="group flex flex-col md:flex-row md:items-center justify-between gap-2 py-5 no-underline">
                  <span className="font-display text-[1.5rem] font-semibold text-lx-navy group-hover:underline decoration-lx-orange decoration-2 underline-offset-[6px]">{ind.title}</span>
                  <span className="flex items-center gap-3 text-lx-graphite">{ind.proposition || ind.hero?.headline} <ArrowRight aria-hidden="true" className="h-5 w-5 text-lx-orange flex-none" /></span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <RelatedInsights num={next()} service={s.slug} />

      {s.disclaimers?.length > 0 && (
        <div className="container-lx pb-12 grid gap-4">{s.disclaimers.map((d) => <Disclaimer key={d}>{d}</Disclaimer>)}</div>
      )}
      <CTABand heading={s.ctaQuestion} label="Discuss your ambition" to={`/contact/?service=${s.slug}`} variant="navy" service={s.slug} />
    </>
  );
}
