import { useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as Dialog from '@radix-ui/react-dialog';
import * as Accordion from '@radix-ui/react-accordion';
import { ArrowUpRight, ArrowRight, ChevronDown, Menu, X, Plus, Minus } from 'lucide-react';
import { format } from 'date-fns';
import Logo from './Logo.jsx';
import { q } from '../lib/api.js';
import { track } from '../lib/analytics.js';

const INSIGHT_TYPES = [
  ['Articles', 'Article'],
  ['Market perspectives', 'Market perspective'],
  ['Regulatory updates', 'Regulatory update'],
  ['Founder viewpoints', 'Founder viewpoint'],
];
const ABOUT_ANCHORS = [
  ['Firm', '/about/#firm'],
  ['Leadership', '/about/#leadership'],
  ['Global reach', '/about/#global-reach'],
  ['Why Lexium', '/about/#why-lexium'],
];

const NAV = [
  { key: 'services', label: 'What We Do', to: '/services/' },
  { key: 'industries', label: 'Industries', to: '/industries/' },
  { key: 'insights', label: 'Insights', to: '/insights/' },
  { key: 'about', label: 'About', to: '/about/' },
];

function useScrolled(threshold = 80) {
  const [state, setState] = useState({ scrolled: false, compact: false });
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setState({ scrolled: scrollY > 4, compact: scrollY > threshold }));
    };
    on();
    addEventListener('scroll', on, { passive: true });
    return () => { removeEventListener('scroll', on); cancelAnimationFrame(raf); };
  }, [threshold]);
  return state;
}

const sectionOf = (path) => NAV.find((n) => path.startsWith(n.to))?.key;

function FeaturedInsight({ insight, onNavigate }) {
  if (!insight) return null;
  return (
    <div className="border-l border-lx-graphite/15 pl-8">
      <p className="eyebrow mb-4">Featured insight</p>
      <Link to={`/insights/${insight.slug}/`} onClick={onNavigate} className="group block no-underline">
        <p className="t-meta mb-2">{insight.category}</p>
        <p className="font-display text-xl font-semibold leading-snug text-lx-navy group-hover:underline decoration-lx-orange decoration-2 underline-offset-4">{insight.title}</p>
        {insight.date && (
          <p className="t-meta mt-3 t-num">
            <time dateTime={insight.date}>{format(new Date(insight.date), 'd MMM yyyy')}</time>
            {insight.readingTime ? ` · ${insight.readingTime} min read` : ''}
          </p>
        )}
      </Link>
    </div>
  );
}

function MenuLink({ to, children, onNavigate, num }) {
  const { pathname } = useLocation();
  const current = pathname === to;
  return (
    <Link
      to={to}
      onClick={onNavigate}
      aria-current={current ? 'page' : undefined}
      className={`group flex items-baseline gap-3 py-2.5 min-h-[44px] no-underline text-[1rem] ${current ? 'text-lx-navy font-semibold' : 'text-lx-graphite hover:text-lx-navy'}`}
    >
      {num && <span className="t-num text-sm text-lx-midgrey w-6">{num}</span>}
      <span className={`border-b-2 ${current ? 'border-lx-orange' : 'border-transparent group-hover:border-lx-orange/60'}`}>{children}</span>
    </Link>
  );
}

function MegaPanel({ which, nav, close, id, labelledBy }) {
  const services = nav?.services || [];
  const industries = nav?.industries || [];
  const viewAll = (to, label) => (
    <Link to={to} onClick={close} className="link-arrow mt-4">
      {label} <ArrowRight aria-hidden="true" />
    </Link>
  );
  return (
    <div id={id} role="region" aria-labelledby={labelledBy} className="absolute left-0 right-0 top-full bg-white border-t border-lx-graphite/10 shadow-[0_24px_48px_-24px_rgba(9,39,68,0.25)]">
      <div className="container-lx py-10">
        {(which === 'services' || which === 'industries') && (
          <div className="grid grid-cols-12 gap-8">
            <div className={which === 'services' ? 'col-span-6' : 'col-span-4'}>
              <p className="eyebrow mb-4"><span className="num">01</span>What We Do</p>
              <ul className={`list-none p-0 m-0 grid ${which === 'services' ? 'grid-cols-2' : 'grid-cols-1'} gap-x-8`}>
                {services.map((s) => (
                  <li key={s.slug}><MenuLink to={`/services/${s.slug}/`} onNavigate={close} num={s.number}>{s.title}</MenuLink></li>
                ))}
              </ul>
              {viewAll('/services/', 'View all services')}
            </div>
            <div className={which === 'services' ? 'col-span-3' : 'col-span-5'}>
              <p className="eyebrow mb-4"><span className="num">02</span>Industries</p>
              <ul className="list-none p-0 m-0">
                {industries.map((s) => (
                  <li key={s.slug}><MenuLink to={`/industries/${s.slug}/`} onNavigate={close}>{s.title}</MenuLink></li>
                ))}
              </ul>
              {viewAll('/industries/', 'View all industries')}
            </div>
            <div className="col-span-3"><FeaturedInsight insight={nav?.featuredInsight} onNavigate={close} /></div>
          </div>
        )}
        {which === 'insights' && (
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-5">
              <p className="eyebrow mb-4">Insights</p>
              <ul className="list-none p-0 m-0">
                {INSIGHT_TYPES.map(([label, type]) => (
                  <li key={type}><MenuLink to={`/insights/?type=${encodeURIComponent(type)}`} onNavigate={close}>{label}</MenuLink></li>
                ))}
              </ul>
              {viewAll('/insights/', 'View all insights')}
            </div>
            <div className="col-span-4 col-start-9"><FeaturedInsight insight={nav?.featuredInsight} onNavigate={close} /></div>
          </div>
        )}
        {which === 'about' && (
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-5">
              <p className="eyebrow mb-4">About Lexium</p>
              <ul className="list-none p-0 m-0">
                {ABOUT_ANCHORS.map(([label, to]) => (
                  <li key={to}><MenuLink to={to} onNavigate={close}>{label}</MenuLink></li>
                ))}
                <li><MenuLink to="/contact/" onNavigate={close}>Contact</MenuLink></li>
              </ul>
              {viewAll('/about/', 'View all about Lexium')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DesktopNav({ nav }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(null);
  const triggers = useRef({});
  const wrap = useRef(null);
  const uid = useId();
  const current = sectionOf(pathname);

  useEffect(() => setOpen(null), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        triggers.current[open]?.focus();
        setOpen(null);
      }
    };
    const onDown = (e) => { if (!wrap.current?.contains(e.target)) setOpen(null); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown); };
  }, [open]);

  // Close when focus leaves the nav + panel entirely
  const onBlur = (e) => { if (!wrap.current?.contains(e.relatedTarget)) setOpen(null); };

  return (
    <nav aria-label="Primary" ref={wrap} onBlur={onBlur} className="hidden lg:block static">
      <ul className="flex items-center gap-1 list-none m-0 p-0">
        {NAV.map((n) => {
          const isOpen = open === n.key;
          const isCurrent = current === n.key;
          return (
            <li key={n.key}>
              <button
                ref={(el) => (triggers.current[n.key] = el)}
                type="button"
                id={`${uid}-${n.key}-t`}
                aria-expanded={isOpen}
                aria-controls={`${uid}-${n.key}-p`}
                aria-current={isCurrent ? 'page' : undefined}
                onClick={() => setOpen(isOpen ? null : n.key)}
                onKeyDown={(e) => { if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(n.key); requestAnimationFrame(() => document.querySelector(`#${CSS.escape(`${uid}-${n.key}-p`)} a`)?.focus()); } }}
                className={`relative flex items-center gap-1.5 h-11 px-4 bg-transparent border-0 text-[0.9875rem] font-medium ${isCurrent || isOpen ? 'text-lx-navy' : 'text-lx-graphite hover:text-lx-navy'}`}
              >
                {n.label}
                <ChevronDown aria-hidden="true" strokeWidth={1.75} className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                <span aria-hidden="true" className={`absolute left-4 right-4 -bottom-0.5 h-[2px] ${isCurrent ? 'bg-lx-orange' : isOpen ? 'bg-lx-graphite/30' : 'bg-transparent'}`} />
              </button>
              {isOpen && <MegaPanel which={n.key} nav={nav} close={() => setOpen(null)} id={`${uid}-${n.key}-p`} labelledBy={`${uid}-${n.key}-t`} />}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function MobileDrawer({ nav }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  const close = () => setOpen(false);
  const groups = [
    { key: 'services', label: 'What We Do', items: (nav?.services || []).map((s) => ({ to: `/services/${s.slug}/`, label: s.title })), all: '/services/' },
    { key: 'industries', label: 'Industries', items: (nav?.industries || []).map((s) => ({ to: `/industries/${s.slug}/`, label: s.title })), all: '/industries/' },
  ];
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="lg:hidden inline-flex items-center gap-2 h-11 px-3 -mr-3 bg-transparent border-0 font-semibold text-lx-navy">
        Menu <Menu aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-lx-navy/40" />
        <Dialog.Content className="fixed inset-0 z-50 flex flex-col bg-white overflow-y-auto" aria-describedby={undefined}>
          <div className="container-lx flex items-center justify-between h-[68px] border-b border-lx-graphite/10 flex-none">
            <Link to="/" onClick={close}><Logo compact /></Link>
            <Dialog.Title className="sr-only">Site menu</Dialog.Title>
            <Dialog.Close className="inline-flex items-center gap-2 h-11 px-3 -mr-3 bg-transparent border-0 font-semibold text-lx-navy">
              Close <X aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
            </Dialog.Close>
          </div>
          <nav aria-label="Mobile" className="container-lx flex-1 py-4">
            <Accordion.Root type="multiple" className="border-b border-lx-graphite/10">
              {groups.map((g) => (
                <Accordion.Item key={g.key} value={g.key} className="border-t border-lx-graphite/10 first:border-t-0">
                  <Accordion.Header className="m-0">
                    <Accordion.Trigger className="group flex w-full items-center justify-between min-h-[56px] bg-transparent border-0 text-left font-display text-xl font-semibold text-lx-navy">
                      {g.label}
                      <Plus aria-hidden="true" className="h-5 w-5 text-lx-orange group-data-[state=open]:hidden" />
                      <Minus aria-hidden="true" className="h-5 w-5 text-lx-orange hidden group-data-[state=open]:block" />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="pb-4">
                    <ul className="list-none p-0 m-0">
                      {g.items.map((i) => (
                        <li key={i.to}>
                          <Link to={i.to} onClick={close} aria-current={pathname === i.to ? 'page' : undefined} className="flex items-center min-h-[44px] no-underline text-lx-graphite aria-[current=page]:font-semibold aria-[current=page]:text-lx-navy">
                            {i.label}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link to={g.all} onClick={close} className="link-arrow">View all <ArrowRight aria-hidden="true" /></Link>
                      </li>
                    </ul>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
              {[['Insights', '/insights/'], ['About', '/about/'], ['Contact', '/contact/']].map(([label, to]) => (
                <div key={to} className="border-t border-lx-graphite/10">
                  <NavLink to={to} onClick={close} end className="flex items-center min-h-[56px] no-underline font-display text-xl font-semibold text-lx-navy aria-[current=page]:underline decoration-lx-orange decoration-2 underline-offset-8">
                    {label}
                  </NavLink>
                </div>
              ))}
            </Accordion.Root>
          </nav>
          <div className="container-lx py-6 border-t border-lx-graphite/10 flex-none sticky bottom-0 bg-white">
            <Link to="/contact/" onClick={() => { track('cta_click', { label: 'Discuss your ambition', placement: 'mobile-drawer' }); close(); }} className="btn btn-orange w-full">
              Discuss your ambition <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default function Header() {
  const { scrolled, compact } = useScrolled(80);
  const { data: nav } = useQuery(q.nav());
  return (
    <header
      data-compact={compact || undefined}
      className={`sticky top-0 z-40 bg-white transition-[box-shadow,border-color] duration-300 border-b ${scrolled ? 'border-lx-graphite/15 shadow-[0_1px_0_rgba(36,55,70,0.04)]' : 'border-lx-graphite/10'}`}
    >
      <div
        className="tr-height container-lx flex items-center justify-between gap-6"
        style={{ height: compact ? 'var(--header-h-compact)' : 'var(--header-h)' }}
      >
        <Link to="/" className="flex-none inline-flex items-center min-h-[44px]">
          <Logo compact={compact} />
        </Link>
        <DesktopNav nav={nav} />
        <div className="flex items-center gap-4">
          <Link
            to="/contact/"
            onClick={() => track('cta_click', { label: 'Discuss your ambition', placement: 'header' })}
            className={`btn btn-navy hidden lg:inline-flex ${compact ? 'min-h-[44px] py-2' : ''}`}
          >
            Discuss your ambition <ArrowUpRight aria-hidden="true" />
          </Link>
          <MobileDrawer nav={nav} />
        </div>
      </div>
    </header>
  );
}
