import * as RA from '@radix-ui/react-accordion';
import { Plus, Minus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Accessible accordion — collapsed, expanded and deep-linked: a URL #hash matching an item id opens it.
 * items: [{ id, title, eyebrow?, content (node) }]
 */
export default function Accordion({ items = [], type = 'multiple', defaultOpen = [], headingLevel = 3, dark = false, className = '' }) {
  const { hash } = useLocation();
  const [open, setOpen] = useState(defaultOpen);
  const H = `h${headingLevel}`;

  useEffect(() => {
    const id = decodeURIComponent(hash.replace('#', ''));
    if (id && items.some((i) => i.id === id)) {
      setOpen((o) => (type === 'single' ? id : Array.from(new Set([...(Array.isArray(o) ? o : []), id]))));
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }));
    }
  }, [hash, items, type]);

  const value = type === 'single' ? (Array.isArray(open) ? open[0] : open) : open;
  return (
    <RA.Root type={type} value={value} onValueChange={setOpen} collapsible={type === 'single' ? true : undefined} className={`border-b ${dark ? 'border-white/15' : 'border-lx-graphite/15'} ${className}`}>
      {items.map((it, idx) => (
        <RA.Item key={it.id} value={it.id} id={it.id} className={`border-t ${dark ? 'border-white/15' : 'border-lx-graphite/15'}`}>
          <RA.Header asChild>
            <H className="m-0 text-[length:inherit] font-[inherit]">
              <RA.Trigger className={`group flex w-full items-start gap-4 py-5 md:py-6 min-h-[56px] bg-transparent border-0 text-left ${dark ? 'text-white' : 'text-lx-navy'}`}>
                {it.eyebrow !== false && (
                  <span className={`t-num pt-1 text-sm w-8 flex-none ${dark ? 'text-white/60' : 'text-lx-midgrey'} group-data-[state=open]:text-lx-navy group-data-[state=open]:font-semibold`}>
                    {it.eyebrow || String(idx + 1).padStart(2, '0')}
                  </span>
                )}
                <span className="flex-1 font-display text-xl md:text-2xl font-semibold leading-snug tracking-[-0.01em]">{it.title}</span>
                <Plus aria-hidden="true" strokeWidth={1.5} className="mt-1 h-6 w-6 flex-none text-lx-orange group-data-[state=open]:hidden" />
                <Minus aria-hidden="true" strokeWidth={1.5} className="mt-1 h-6 w-6 flex-none text-lx-orange hidden group-data-[state=open]:block" />
              </RA.Trigger>
            </H>
          </RA.Header>
          <RA.Content className="overflow-hidden data-[state=open]:animate-[lxdown_280ms_ease] data-[state=closed]:animate-[lxup_200ms_ease]">
            <div className="pb-8 md:pl-12 max-w-[820px]">{it.content}</div>
          </RA.Content>
        </RA.Item>
      ))}
    </RA.Root>
  );
}
