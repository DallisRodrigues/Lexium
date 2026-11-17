import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';
import Picture from './Picture.jsx';

/** ServiceCard: number 01–07, title, outcome line, three capabilities, "Explore service →". */
export function ServiceCard({ service, headingLevel = 3 }) {
  const H = `h${headingLevel}`;
  return (
    <article className="group relative flex flex-col h-full border-t-2 border-lx-graphite/15 hover:border-lx-orange focus-within:border-lx-orange transition-colors duration-300 pt-6">
      <p><span className="num-accent font-display text-[2rem] leading-none">{service.number}</span></p>
      <H className="mt-5 text-[1.5rem] md:text-[1.625rem] leading-tight">
        <Link to={`/services/${service.slug}/`} className="no-underline after:absolute after:inset-0">{service.title}</Link>
      </H>
      <p className="mt-3 text-lx-graphite">{service.outcomeLine}</p>
      <ul className="mt-5 list-none p-0 m-0 text-[0.9375rem] text-lx-midgrey">
        {(service.threeCapabilities || []).map((c) => (
          <li key={c} className="py-2 border-t border-lx-graphite/10">{c}</li>
        ))}
      </ul>
      <span className="link-arrow mt-auto pt-6" aria-hidden="true">Explore service <ArrowRight /></span>
    </article>
  );
}

/** IndustryCard: desaturated image, colour/zoom reveal on hover and focus. */
export function IndustryCard({ industry, large = false, headingLevel = 3, showServices = false }) {
  const H = `h${headingLevel}`;
  return (
    <article className={`reveal-parent group relative flex flex-col h-full bg-white ${large ? 'lg:flex-row' : ''}`}>
      <div className={`relative overflow-hidden ${large ? 'lg:w-3/5 aspect-[4/3] lg:aspect-auto lg:min-h-[480px]' : 'aspect-[4/3]'}`}>
        <Picture image={industry.hero?.image} fill imgClassName="img-desat" sizes={large ? '(min-width:1200px) 60vw, 100vw' : '(min-width:1200px) 33vw, (min-width:768px) 50vw, 100vw'} />
      </div>
      <div className={`flex flex-col flex-1 pt-6 ${large ? 'lg:p-12 lg:pt-12 lg:surface-pale' : ''}`}>
        {industry.number && <p className="eyebrow"><span className="num">{industry.number}</span>{industry.isAnchor ? 'Anchor industry' : 'Industry'}</p>}
        <H className={`mt-4 ${large ? 'text-[2rem] md:text-[2.5rem]' : 'text-[1.5rem]'} leading-tight`}>
          <Link to={`/industries/${industry.slug}/`} className="no-underline after:absolute after:inset-0">{industry.title}</Link>
        </H>
        <p className="mt-3 text-lx-graphite">{industry.proposition || industry.hero?.headline}</p>
        {showServices && industry.clientTypes?.length > 0 && (
          <p className="t-meta mt-4"><span className="font-semibold text-lx-graphite">Clients: </span>{industry.clientTypes.join(', ')}</p>
        )}
        {showServices && industry.decisions?.length > 0 && (
          <p className="t-meta mt-2"><span className="font-semibold text-lx-graphite">Decisions we support: </span>{industry.decisions.join(', ')}</p>
        )}
        {showServices && industry.services?.length > 0 && (
          <ul className="relative z-10 mt-5 flex flex-wrap gap-x-5 gap-y-1 list-none p-0 m-0" aria-label={`Related services for ${industry.title}`}>
            {industry.services.slice(0, large ? 6 : 3).map((s) => (
              <li key={s.slug}><Link to={`/services/${s.slug}/`} className="text-link text-[0.9375rem] inline-flex min-h-[44px] items-center">{s.title}</Link></li>
            ))}
          </ul>
        )}
        <span className="link-arrow mt-auto pt-5" aria-hidden="true">Explore industry <ArrowRight /></span>
      </div>
    </article>
  );
}

/** InsightCard — 'featured', 'standard', 'compact' (related). */
export function InsightCard({ insight, variant = 'standard', headingLevel = 3 }) {
  const H = `h${headingLevel}`;
  const date = insight.date ? new Date(insight.date) : null;
  const meta = (
    <p className="t-meta t-num">
      {date && <time dateTime={date.toISOString().slice(0, 10)}>{format(date, 'd MMM yyyy')}</time>}
      {insight.readingTime ? <> · {insight.readingTime} min read</> : null}
    </p>
  );
  if (variant === 'featured')
    return (
      <article className="reveal-parent group relative grid gap-8 lg:grid-cols-12 lg:gap-12 items-center">
        <div className="lg:col-span-7 relative overflow-hidden aspect-[16/10]">
          <Picture image={insight.image} fill sizes="(min-width:1200px) 58vw, 100vw" priority />
        </div>
        <div className="lg:col-span-5">
          <p className="eyebrow"><span className="num">{insight.category}</span>Featured</p>
          <H className="mt-5 text-[2rem] md:text-[2.5rem] leading-tight text-balance">
            <Link to={`/insights/${insight.slug}/`} className="no-underline after:absolute after:inset-0 group-hover:underline decoration-lx-orange decoration-2 underline-offset-[6px]">{insight.title}</Link>
          </H>
          {insight.standfirst && <p className="t-lead mt-5">{insight.standfirst}</p>}
          <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1 items-center">
            {insight.author?.name && <p className="t-meta font-semibold text-lx-graphite">{insight.author.name}</p>}
            {meta}
          </div>
        </div>
      </article>
    );
  if (variant === 'compact')
    return (
      <article className="group relative border-t border-lx-graphite/15 pt-5 h-full flex flex-col">
        <p className="t-meta font-semibold text-lx-graphite">{insight.category}</p>
        <H className="mt-3 text-[1.25rem] leading-snug">
          <Link to={`/insights/${insight.slug}/`} className="no-underline after:absolute after:inset-0 group-hover:underline decoration-lx-orange decoration-2 underline-offset-4">{insight.title}</Link>
        </H>
        <div className="mt-auto pt-4">{meta}</div>
      </article>
    );
  return (
    <article className="reveal-parent group relative flex flex-col h-full">
      <div className="relative overflow-hidden aspect-[3/2]">
        <Picture image={insight.image} fill imgClassName="img-desat" sizes="(min-width:1200px) 33vw, (min-width:768px) 50vw, 100vw" />
      </div>
      <p className="t-meta font-semibold text-lx-graphite mt-5">{insight.category}</p>
      <H className="mt-2 text-[1.375rem] leading-snug">
        <Link to={`/insights/${insight.slug}/`} className="no-underline after:absolute after:inset-0 group-hover:underline decoration-lx-orange decoration-2 underline-offset-4">{insight.title}</Link>
      </H>
      <div className="mt-auto pt-4">{meta}</div>
    </article>
  );
}

/** EngagementCard: situation, Lexium role, result type. No client names or quantified results. */
export function EngagementCard({ e, index, headingLevel = 3 }) {
  const H = `h${headingLevel}`;
  return (
    <article className="flex flex-col h-full bg-white p-6 md:p-8 border-t-2 border-lx-orange">
      <p className="t-num text-sm text-lx-midgrey">{String(index + 1).padStart(2, '0')}</p>
      <H className="mt-3 text-[1.375rem] leading-snug">{e.title}</H>
      <dl className="mt-6 grid gap-4 text-[0.9375rem]">
        {[['Situation', e.situation], ['Lexium role', e.role], ['Result type', e.resultType]].map(([k, v]) => v && (
          <div key={k}>
            <dt className="text-xs font-semibold tracking-[0.12em] uppercase text-lx-midgrey">{k}</dt>
            <dd className="m-0 mt-1 text-lx-graphite">{v}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

/** Large editorial statement / client question. `accent` = one phrase in serif italic. */
export function StatementBlock({ text, accent, cite, as: Tag = 'p', dark, className = '' }) {
  let content = text;
  if (accent && text?.includes(accent)) {
    const [a, b] = text.split(accent);
    content = (<>{a}<span className="t-serif">{accent}</span>{b}</>);
  }
  return (
    <figure className={`m-0 ${className}`}>
      <Tag className={`font-display font-medium text-balance leading-[1.12] tracking-[-0.02em] text-[clamp(1.75rem,1.2rem+2.2vw,3.25rem)] ${dark ? 'text-white' : 'text-lx-navy'}`}>{content}</Tag>
      {cite && <figcaption className="t-meta mt-6">{cite}</figcaption>}
    </figure>
  );
}

/** 3–4 market tensions. A figure only renders when a source and date are present. */
export function TensionList({ items = [], headingLevel = 3 }) {
  const H = `h${headingLevel}`;
  return (
    <ol className="grid gap-x-10 gap-y-10 md:grid-cols-2 list-none p-0 m-0">
      {items.map((t, i) => (
        <li key={t.title} className="border-t border-lx-graphite/15 pt-6">
          <p className="t-num text-sm num-accent">{String(i + 1).padStart(2, '0')}</p>
          {t.figure && t.source && t.sourceDate && (
            <p className="mt-3 t-num font-display text-5xl font-semibold text-lx-navy">{t.figure}</p>
          )}
          <H className="mt-3 text-[1.375rem] leading-snug">{t.title}</H>
          {t.body && <p className="mt-3 text-lx-graphite">{t.body}</p>}
          {t.figure && t.source && t.sourceDate && <p className="t-meta mt-3">Source: {t.source}, {t.sourceDate}</p>}
        </li>
      ))}
    </ol>
  );
}

export function CTAInline({ to, label }) {
  return <Link to={to} className="btn btn-navy">{label} <ArrowUpRight aria-hidden="true" /></Link>;
}
