import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as Accordion from '@radix-ui/react-accordion';
import { Plus, Minus } from 'lucide-react';
import Logo from './Logo.jsx';
import { q } from '../lib/api.js';
import { track } from '../lib/analytics.js';

const COMPANY = [
  ['About', '/about/'],
  ['Leadership', '/about/#leadership'],
  ['Insights', '/insights/'],
  ['Contact', '/contact/'],
];

function LinkCol({ title, links }) {
  return (
    <>
      <h2 className="hidden md:block text-sm font-body font-semibold tracking-[0.14em] uppercase text-white mb-5">{title}</h2>
      <ul className="list-none p-0 m-0">
        {links.map(([label, to]) => (
          <li key={to}>
            <Link to={to} className="inline-flex items-center min-h-[44px] md:min-h-[36px] text-white/80 no-underline hover:text-white hover:underline decoration-lx-orange underline-offset-4">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function Footer() {
  const { data: nav } = useQuery(q.nav());
  const { data: s } = useQuery(q.settings());
  const email = s?.email || 'info@lexiumconsulting.com';
  const cols = [
    ['Services', (nav?.services || []).map((x) => [x.title, `/services/${x.slug}/`])],
    ['Industries', (nav?.industries || []).map((x) => [x.title, `/industries/${x.slug}/`])],
    ['Company', COMPANY],
  ];
  const year = new Date().getFullYear();

  return (
    <footer className="surface-navy on-dark border-t-2 border-lx-orange">
      <div className="container-lx pt-16 md:pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* 1. LEXIUM */}
          <div className="lg:col-span-4">
            <h2 className="sr-only">Lexium Consulting</h2>
            <Logo variant="white" />
            <p className="mt-6 text-white/80 max-w-[38ch]">{s?.footerPositioningLine}</p>
            <a
              href={`mailto:${email}`}
              onClick={() => track('email_click', { placement: 'footer' })}
              className="mt-6 inline-flex items-center min-h-[44px] text-white font-semibold underline decoration-lx-orange decoration-2 underline-offset-4"
            >
              {email}
            </a>
          </div>

          {/* 2. SERVICES | INDUSTRIES | COMPANY — desktop columns */}
          <nav aria-label="Footer" className="hidden md:grid lg:col-span-8 grid-cols-3 gap-8">
            {cols.map(([title, links]) => (
              <div key={title}><LinkCol title={title} links={links} /></div>
            ))}
          </nav>
          {/* mobile accordions */}
          <nav aria-label="Footer" className="md:hidden">
            <Accordion.Root type="multiple" className="border-y border-white/15">
              {cols.map(([title, links]) => (
                <Accordion.Item key={title} value={title} className="border-t border-white/15 first:border-t-0">
                  <Accordion.Header className="m-0">
                    <Accordion.Trigger className="group flex w-full items-center justify-between min-h-[56px] bg-transparent border-0 text-left text-sm font-semibold tracking-[0.14em] uppercase text-white">
                      {title}
                      <Plus aria-hidden="true" className="h-5 w-5 text-lx-orange group-data-[state=open]:hidden" />
                      <Minus aria-hidden="true" className="h-5 w-5 text-lx-orange hidden group-data-[state=open]:block" />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="pb-4"><LinkCol title={title} links={links} /></Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </nav>
        </div>

        {/* 3. INDIA | GLOBAL MARKETS */}
        <div className="mt-14 pt-10 border-t border-white/15 grid gap-8 md:grid-cols-3">
          <div>
            <h2 className="text-sm font-body font-semibold tracking-[0.14em] uppercase text-white mb-3">India</h2>
            <address className="not-italic text-white/80">{s?.officeAddress || 'Approved office address — to be confirmed'}</address>
          </div>
          <div>
            <h2 className="text-sm font-body font-semibold tracking-[0.14em] uppercase text-white mb-3">Global markets</h2>
            <p className="text-white/80">{(s?.operatingRegions || []).join(' · ')}</p>
          </div>
          <div>
            <h2 className="text-sm font-body font-semibold tracking-[0.14em] uppercase text-white mb-3">Contact</h2>
            <p className="text-white/80">
              <a href={`mailto:${email}`} onClick={() => track('email_click', { placement: 'footer-contact' })} className="text-white/90 underline decoration-white/30 underline-offset-4 hover:decoration-lx-orange">{email}</a>
              {s?.phone && (<><br /><a href={`tel:${s.phone.replace(/\s/g, '')}`} className="text-white/90 no-underline">{s.phone}</a></>)}
              {s?.website && (<><br />{s.website}</>)}
            </p>
          </div>
        </div>

        {/* 4. LinkedIn | Privacy | Terms | Copyright */}
        <div className="mt-12 pt-6 border-t border-white/15 flex flex-col md:flex-row md:items-center gap-2 md:gap-8 text-sm text-white/70">
          {s?.linkedin ? (
            <a href={s.linkedin} rel="noopener" target="_blank" className="inline-flex items-center min-h-[44px] text-white/80 no-underline hover:text-white">LinkedIn<span className="sr-only"> (opens in a new tab)</span></a>
          ) : (
            <span className="inline-flex items-center min-h-[44px]">LinkedIn</span>
          )}
          <Link to="/privacy/" className="inline-flex items-center min-h-[44px] text-white/80 no-underline hover:text-white">Privacy</Link>
          <Link to="/terms/" className="inline-flex items-center min-h-[44px] text-white/80 no-underline hover:text-white">Terms</Link>
          <button type="button" onClick={() => window.dispatchEvent(new Event('lx:manage-consent'))} className="inline-flex items-center min-h-[44px] bg-transparent border-0 p-0 text-white/80 hover:text-white text-sm">Cookie settings</button>
          <span className="md:ml-auto inline-flex items-center min-h-[44px]">© {year} Lexium Consulting</span>
        </div>
      </div>
    </footer>
  );
}
