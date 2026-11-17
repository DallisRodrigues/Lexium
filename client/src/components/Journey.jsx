import { ArrowRight } from 'lucide-react';

/** Horizontal "A → B → C" journey. Wraps on small screens; arrows are decorative. */
export default function Journey({ steps = [], label, dark, numbered = true, className = '' }) {
  return (
    <ol aria-label={label} className={`flex flex-col md:flex-row md:flex-wrap md:items-stretch gap-0 list-none p-0 m-0 ${className}`}>
      {steps.map((s, i) => (
        <li key={s} className="flex md:flex-1 md:min-w-[140px] items-stretch">
          <div className={`flex-1 py-4 md:py-5 md:pr-4 border-t-2 ${i === 0 ? 'border-lx-orange' : dark ? 'border-white/25' : 'border-lx-graphite/20'}`}>
            {numbered && <span className={`block t-num text-sm font-semibold mb-1 ${dark ? 'text-lx-orange' : 'text-lx-midgrey'}`}>{String(i + 1).padStart(2, '0')}</span>}
            <span className={`font-display text-lg md:text-xl font-semibold leading-tight ${dark ? 'text-white' : 'text-lx-navy'}`}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <ArrowRight aria-hidden="true" strokeWidth={1.5} className="hidden md:block self-center mx-1 h-5 w-5 flex-none text-lx-orange" />
          )}
        </li>
      ))}
    </ol>
  );
}
