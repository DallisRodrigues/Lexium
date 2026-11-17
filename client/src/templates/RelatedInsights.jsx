import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { q } from '../lib/api.js';
import Section from '../components/Section.jsx';
import { InsightCard } from '../components/Cards.jsx';

export default function RelatedInsights({ num, service, industry, exclude, label = 'Related insights', heading = 'Perspectives connected to this decision' }) {
  const { data = [] } = useQuery(q.related({ service, industry, exclude }));
  if (!data.length) return null;
  return (
    <Section id="related-insights" num={num} label={label} heading={heading}>
      <ul className="grid gap-x-8 gap-y-10 md:grid-cols-3 list-none p-0 m-0">
        {data.map((i) => <li key={i.slug}><InsightCard insight={i} variant="compact" /></li>)}
      </ul>
      <Link to="/insights/" className="link-arrow mt-8">All insights <ArrowRight aria-hidden="true" /></Link>
    </Section>
  );
}
