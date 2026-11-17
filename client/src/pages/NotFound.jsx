import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SEO from '../components/SEO.jsx';

export default function NotFound() {
  return (
    <>
      <SEO title="Page not found | Lexium Consulting" noindex />
      <section className="container-lx section">
        <p className="eyebrow"><span className="num">404</span>Page not found</p>
        <h1 id="page-title" className="t-page mt-6 max-w-[16ch]">This page has moved or no longer exists.</h1>
        <p className="t-lead mt-6 measure">Try one of these instead:</p>
        <ul className="mt-6 list-none p-0 m-0 grid gap-1">
          {[['What We Do', '/services/'], ['Industries', '/industries/'], ['Insights', '/insights/'], ['Contact', '/contact/']].map(([l, to]) => (
            <li key={to}><Link to={to} className="link-arrow">{l} <ArrowRight aria-hidden="true" /></Link></li>
          ))}
        </ul>
      </section>
    </>
  );
}
