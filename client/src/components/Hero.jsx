import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import Picture from './Picture.jsx';
import Breadcrumbs from './Breadcrumbs.jsx';
import { Eyebrow } from './Section.jsx';
import { track } from '../lib/analytics.js';

/**
 * Editorial hero — variants: 'light' (white field, image below/right), 'dark' (navy field), 'split' (copy | image).
 * Copy always precedes imagery in the DOM so it appears first on mobile.
 */
export default function Hero({
  variant = 'split', eyebrow, num, headline, intro, introMobile, audience, primary, secondary,
  image, visual, breadcrumbs, display = false, children, analytics = {},
}) {
  const dark = variant === 'dark';
  const H = display ? 't-display' : 't-page';
  const hasMedia = Boolean(image?.src || visual);
  const cta = (c, kind) =>
    c && (
      <Link
        to={c.to}
        className={kind === 'primary' ? `btn ${dark ? 'btn-orange' : 'btn-navy'}` : 'link-arrow'}
        onClick={() => track('cta_click', { label: c.label, placement: `hero-${kind}`, ...analytics })}
      >
        {c.label} {kind === 'primary' ? <ArrowUpRight aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
      </Link>
    );

  return (
    <section className={`${dark ? 'surface-navy on-dark' : 'bg-white'} relative overflow-hidden`} aria-labelledby="page-title">
      <div className={`container-lx ${variant === 'split' && hasMedia ? 'grid lg:grid-cols-12 lg:gap-12 items-stretch' : ''}`}>
        <div className={`pt-10 md:pt-16 pb-12 md:pb-20 ${variant === 'split' && hasMedia ? 'lg:col-span-6 lg:pt-24 lg:pb-28 flex flex-col' : 'lg:pt-24'}`}>
          {breadcrumbs && <div className="mb-8 md:mb-12"><Breadcrumbs items={breadcrumbs} dark={dark} /></div>}
          {eyebrow && <Eyebrow num={num} className="mb-6">{eyebrow}</Eyebrow>}
          <h1 id="page-title" className={`${H} text-balance ${variant !== 'split' ? 'max-w-[18ch]' : ''}`}>{headline}</h1>
          {intro && (
            <>
              <p className={`t-lead mt-6 md:mt-8 measure ${introMobile ? 'hidden md:block' : ''}`}>{intro}</p>
              {introMobile && <p className="t-lead mt-6 md:hidden">{introMobile}</p>}
            </>
          )}
          {audience && <p className="t-meta mt-4 measure">{audience}</p>}
          {(primary || secondary) && (
            <div className="mt-8 md:mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              {cta(primary, 'primary')}
              {cta(secondary, 'secondary')}
            </div>
          )}
          {children}
        </div>
        {hasMedia && variant === 'split' && (
          <div className="relative lg:col-span-6 -mx-[var(--gutter)] lg:mx-0 lg:-mr-[var(--gutter)] min-h-[280px] md:min-h-[420px]">
            {visual || <Picture image={image} priority fill sizes="(min-width: 1200px) 50vw, 100vw" />}
          </div>
        )}
      </div>
      {hasMedia && variant !== 'split' && (
        <div className="container-lx pb-12 md:pb-20">
          {visual || <Picture image={image} priority aspect="21 / 9" sizes="(min-width: 1440px) 1360px, 100vw" />}
        </div>
      )}
    </section>
  );
}
