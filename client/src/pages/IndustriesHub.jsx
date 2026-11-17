import { useQuery } from '@tanstack/react-query';
import { q } from '../lib/api.js';
import SEO from '../components/SEO.jsx';
import Hero from '../components/Hero.jsx';
import Section from '../components/Section.jsx';
import ChipList from '../components/ChipList.jsx';
import CTABand from '../components/CTABand.jsx';
import { IndustryCard } from '../components/Cards.jsx';
import PageState from '../templates/PageState.jsx';

export default function IndustriesHub() {
  const page = useQuery(q.page('industries'));
  return <PageState query={page}>{(p) => <Hub p={p} />}</PageState>;
}

function Hub({ p }) {
  const { data: industries = [] } = useQuery(q.industries());
  const sec = Object.fromEntries((p.sections || []).map((s) => [s.key, s]));
  const anchor = industries.find((i) => i.isAnchor);
  const others = industries.filter((i) => !i.isAnchor);
  const crumbs = [{ label: 'Home', to: '/' }, { label: 'Industries', to: '/industries/' }];
  return (
    <>
      <SEO title={p.seo?.title} description={p.seo?.metaDescription} breadcrumbs={crumbs} />
      <Hero variant="light" breadcrumbs={crumbs} eyebrow="Industries" headline={p.hero?.headline} intro={p.hero?.intro} />

      <section className="pb-16 md:pb-24" aria-label="Industries">
        <div className="container-lx">
          {anchor && <IndustryCard industry={anchor} large showServices headingLevel={2} />}
          <ul className="mt-16 grid gap-x-10 gap-y-16 md:grid-cols-2 list-none p-0 m-0">
            {others.map((ind) => <li key={ind.slug}><IndustryCard industry={ind} showServices headingLevel={2} /></li>)}
          </ul>
        </div>
      </section>

      <Section id="themes" num="06" label="Cross-sector themes" heading={sec.themes?.heading} intro={sec.themes?.intro} surface="pale" tight>
        <ChipList items={sec.themes?.items || []} label="Cross-sector themes" />
      </Section>

      <CTABand heading={p.cta} variant="navy" />
    </>
  );
}
