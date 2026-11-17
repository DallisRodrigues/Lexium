import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { track } from '../lib/analytics.js';

/**
 * Conversion band — three variants: 'orange' (use sparingly), 'navy', 'white' (minimal).
 * Orange variant uses navy text (contrast ≈ 5:1).
 */
export default function CTABand({ heading, label = 'Discuss your ambition', to = '/contact/', variant = 'navy', service, industry, id = 'cta' }) {
  const styles = {
    orange: 'bg-lx-orange text-lx-navy',
    navy: 'surface-navy on-dark',
    white: 'bg-white border-t border-lx-graphite/15',
  }[variant];
  const btn = variant === 'orange' ? 'btn-navy' : variant === 'navy' ? 'btn-orange' : 'btn-navy';
  return (
    <section id={id} className={`${styles} section-tight`} aria-labelledby={`${id}-h`}>
      <div className="container-lx grid gap-8 lg:grid-cols-12 lg:items-end">
        <h2 id={`${id}-h`} className={`lg:col-span-8 text-balance ${variant === 'orange' ? '!text-lx-navy' : ''}`}>{heading}</h2>
        <div className="lg:col-span-4 lg:justify-self-end">
          <Link
            to={to}
            className={`btn ${btn}`}
            onClick={() => track('cta_click', { label, placement: 'cta-band', service, industry })}
          >
            {label} <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
