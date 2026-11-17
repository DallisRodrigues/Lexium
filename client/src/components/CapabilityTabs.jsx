import * as Tabs from '@radix-ui/react-tabs';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { useState } from 'react';
import { track } from '../lib/analytics.js';

/**
 * WAI-ARIA tabs (arrow keys via Radix). Desktop: vertical tab list + adjacent panel.
 * Mobile: accessible horizontally scrollable tab list with edge fade + scroll hint.
 * tabs: [{ value, label, heading, body, deliverables[], links: [{to,label}] }]
 */
export default function CapabilityTabs({ tabs = [], label = 'Capabilities', eventName = 'service_tab_select', dark = false }) {
  const [value, setValue] = useState(tabs[0]?.value);
  if (!tabs.length) return null;
  const change = (v) => {
    setValue(v);
    track(eventName, { capability: tabs.find((t) => t.value === v)?.label });
  };
  return (
    <Tabs.Root value={value} onValueChange={change} orientation="horizontal" className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-12 lg:gap-12" activationMode="automatic">
      <div className="lg:col-span-4 relative min-w-0">
        <Tabs.List
          aria-label={label}
          className="flex lg:flex-col overflow-x-auto no-scrollbar -mx-[var(--gutter)] px-[var(--gutter)] lg:mx-0 lg:px-0 border-b lg:border-b-0 lg:border-l border-lx-graphite/15 snap-x"
        >
          {tabs.map((t, i) => (
            <Tabs.Trigger
              key={t.value}
              value={t.value}
              className={`group snap-start flex-none flex items-center gap-3 text-left min-h-[52px] px-4 lg:px-6 py-3 bg-transparent border-0 -mb-px lg:mb-0 lg:-ml-px border-b-2 lg:border-b-0 lg:border-l-2 border-transparent
                data-[state=active]:border-lx-orange data-[state=active]:font-semibold
                ${dark ? 'text-white/75 hover:text-white data-[state=active]:text-white' : 'text-lx-graphite hover:text-lx-navy hover:bg-lx-palegrey data-[state=active]:text-lx-navy'}
                transition-colors duration-200 whitespace-nowrap lg:whitespace-normal`}
            >
              <span className={`t-num text-sm ${dark ? 'text-white/60' : 'text-lx-midgrey'} group-data-[state=active]:text-lx-navy group-data-[state=active]:font-semibold`}>{String(i + 1).padStart(2, '0')}</span>
              <span className="text-[1.0625rem]">{t.label}</span>
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <div aria-hidden="true" className={`lg:hidden pointer-events-none absolute right-[calc(-1*var(--gutter))] top-0 bottom-0 w-12 bg-gradient-to-l ${dark ? 'from-lx-navy' : 'from-white'} to-transparent`} />
        <p className="lg:hidden t-meta mt-3" aria-hidden="true">Swipe or use arrow keys to see all {tabs.length}</p>
      </div>
      {tabs.map((t) => (
        <Tabs.Content key={t.value} value={t.value} className="lg:col-span-8 lg:pl-4 focus-visible:outline-offset-8 data-[state=active]:animate-[lxfade_300ms_ease]">
          {t.heading && <h3 className="text-balance">{t.heading}</h3>}
          {t.body && <p className="t-lead mt-5 measure">{t.body}</p>}
          {t.deliverables?.length > 0 && (
            <ul className="mt-8 grid gap-x-8 sm:grid-cols-2 list-none p-0 m-0">
              {t.deliverables.map((d) => (
                <li key={d} className={`flex gap-3 py-3 border-t ${dark ? 'border-white/15' : 'border-lx-graphite/15'}`}>
                  <Check aria-hidden="true" strokeWidth={1.75} className="mt-1 h-4 w-4 flex-none text-lx-orange" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          )}
          {t.links?.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
              {t.links.map((l) => (
                <Link key={l.to} to={l.to} className="link-arrow">{l.label} <ArrowRight aria-hidden="true" /></Link>
              ))}
            </div>
          )}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
