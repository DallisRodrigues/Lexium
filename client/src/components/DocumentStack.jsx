import { useEffect, useRef, useState } from 'react';

/** Layered stacked-file visual: offset sheets with fine rules, orange tab on active sheet, reveal on scroll. */
export default function DocumentStack({ items = [] }) {
  const [active, setActive] = useState(items.length - 1);
  const [shown, setShown] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setShown(true), io.disconnect()), { threshold: 0.3 });
    ref.current && io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const n = items.length;
  return (
    <div ref={ref} className="grid gap-10 lg:grid-cols-12 items-center">
      <div className="lg:col-span-7 relative h-[360px] md:h-[440px]" aria-hidden="true">
        {items.map((label, i) => {
          const depth = n - 1 - i;
          const isActive = i === active;
          return (
            <div
              key={label}
              className="tr-sheet absolute bg-white border border-lx-graphite/20 shadow-[0_12px_32px_-20px_rgba(9,39,68,0.35)]"
              style={{
                left: `${depth * 4 + 4}%`,
                top: `${depth * 9}%`,
                width: '62%',
                height: '58%',
                zIndex: i + (isActive ? 20 : 0),
                transform: shown ? 'none' : `translateY(${24 + depth * 8}px)`,
                opacity: shown ? 1 : 0,
                transitionDelay: `${depth * 70}ms`,
              }}
            >
              <span className={`absolute -top-[22px] left-6 h-[22px] px-3 text-[11px] font-semibold tracking-[0.12em] uppercase flex items-center ${isActive ? 'bg-lx-orange text-lx-navy' : 'bg-lx-palegrey text-lx-midgrey border border-b-0 border-lx-graphite/20'}`}>{label}</span>
              <div className="p-6 grid gap-3">
                <span className="block h-2 w-1/2 bg-lx-navy/80" />
                {[90, 75, 82, 60, 70].map((w, k) => <span key={k} className="block h-px bg-lx-graphite/20" style={{ width: `${w}%` }} />)}
              </div>
            </div>
          );
        })}
      </div>
      <ol className="lg:col-span-5 list-none p-0 m-0 border-b border-lx-graphite/15">
        {items.map((label, i) => (
          <li key={label} className="border-t border-lx-graphite/15">
            <button
              type="button"
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="flex w-full items-center gap-4 min-h-[52px] bg-transparent border-0 text-left text-lx-navy aria-pressed:font-semibold"
            >
              <span className={`t-num text-sm w-6 ${i === active ? 'num-accent' : 'text-lx-midgrey'}`}>{String(i + 1).padStart(2, '0')}</span>
              <span className={`border-b-2 ${i === active ? 'border-lx-orange' : 'border-transparent'}`}>{label}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
