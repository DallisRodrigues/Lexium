import { useQuery } from '@tanstack/react-query';
import { q } from '../lib/api.js';
import SEO from '../components/SEO.jsx';
import Hero from '../components/Hero.jsx';
import Section from '../components/Section.jsx';
import CTABand from '../components/CTABand.jsx';
import Portrait from '../components/Portrait.jsx';
import RegionSelector from '../components/RegionSelector.jsx';
import ChipList from '../components/ChipList.jsx';
import { StatementBlock } from '../components/Cards.jsx';
import PageState from '../templates/PageState.jsx';

export default function About() {
  const page = useQuery(q.page('about'));
  return <PageState query={page}>{(p) => <AboutContent p={p} />}</PageState>;
}

function AboutContent({ p }) {
  const { data: people = [] } = useQuery(q.people());
  const { data: regions = [] } = useQuery(q.regions('home'));
  const sec = Object.fromEntries((p.sections || []).map((s) => [s.key, s]));
  const crumbs = [{ label: 'Home', to: '/' }, { label: 'About Lexium', to: '/about/' }];
  const grid = (items) => (
    <ul className={`grid gap-x-8 gap-y-10 md:grid-cols-2 ${items.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} list-none p-0 m-0`}>
      {items.map((i, k) => (
        <li key={i.title} className="border-t-2 border-lx-graphite/15 pt-6">
          <p className="t-num text-sm num-accent">{String(k + 1).padStart(2, '0')}</p>
          <h3 className="mt-3 text-[1.375rem]">{i.title}</h3>
          {i.body && <p className="mt-3 text-lx-graphite">{i.body}</p>}
        </li>
      ))}
    </ul>
  );
  return (
    <>
      <SEO title={p.seo?.title} description={p.seo?.metaDescription} breadcrumbs={crumbs}
        jsonLd={people.filter((x) => x.name && !x.verificationRequired).map((x) => ({ '@context': 'https://schema.org', '@type': 'Person', name: x.name, jobTitle: x.role, worksFor: { '@type': 'Organization', name: 'Lexium Consulting' } }))} />
      <Hero variant="split" breadcrumbs={crumbs} eyebrow="About Lexium" headline={p.hero?.headline} intro={p.hero?.intro} image={p.hero?.image} primary={{ label: 'Work with Lexium', to: '/contact/' }} />

      <Section id="firm" num="01" label="Firm" heading={sec.firm?.heading}>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-start-5 lg:col-span-8 t-lead measure grid gap-5">
            {(sec.firm?.intro || '').split(/\n{2,}/).map((t) => <p key={t}>{t}</p>)}
          </div>
        </div>
      </Section>

      <Section id="why-lexium" num="02" label="Why Lexium" heading={sec.why?.heading} surface="pale">
        {grid(sec.why?.items || [])}
      </Section>

      <Section id="leadership" num="03" label="Leadership" heading={sec.leadership?.heading}>
        {people.map((x) => (
          <article key={x._id} className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4 max-w-[380px]"><Portrait person={x} /></div>
            <div className="lg:col-span-8">
              <h3 className="text-[2rem]">{x.name}</h3>
              <p className="t-meta mt-2">{x.role}</p>
              <p className="t-lead mt-6 measure">{x.biography}</p>
              {x.experienceClaims?.length > 0 && (
                <ul className="mt-8 list-none p-0 m-0 border-b border-lx-graphite/15 measure">
                  {x.experienceClaims.map((c) => <li key={c.text} className="border-t border-lx-graphite/15 py-4 font-semibold text-lx-navy t-num">{c.text}</li>)}
                </ul>
              )}
              {x.expertise?.length > 0 && (<><p className="mt-8 text-xs font-semibold tracking-[0.12em] uppercase text-lx-midgrey">Selected areas of expertise</p><ChipList className="mt-3" items={x.expertise} label="Selected areas of expertise" /></>)}
              {x.linkedin && <a href={x.linkedin} rel="noopener" target="_blank" className="text-link inline-flex min-h-[44px] items-center mt-6">LinkedIn profile<span className="sr-only"> (opens in a new tab)</span></a>}
            </div>
          </article>
        ))}
      </Section>

      <Section id="global-reach" num="04" label="Global experience" heading={sec.global?.heading} intro={sec.global?.intro} surface="pale">
        <RegionSelector regions={regions} label="Regions of experience" />
      </Section>

      <Section id="values" num="05" label="Values" heading={sec.values?.heading}>
        {grid(sec.values?.items || [])}
      </Section>

      <CTABand heading={sec.cta?.heading || p.cta} label="Work with Lexium" variant="navy" />
    </>
  );
}
