/** Process steps — horizontal on desktop, vertical on mobile. steps: [{title, body}] or strings. */
export default function ProcessSteps({ steps = [], label, dark, headingLevel = 3 }) {
  const H = `h${headingLevel}`;
  const n = steps.length;
  return (
    <ol aria-label={label} className={`relative list-none p-0 m-0 grid gap-0 ${n === 4 ? 'lg:grid-cols-4' : n === 6 ? 'lg:grid-cols-6' : n === 7 ? 'lg:grid-cols-7' : 'lg:grid-cols-5'}`}>
      {steps.map((s, i) => {
        const step = typeof s === 'string' ? { title: s } : s;
        return (
          <li key={step.title} className="relative pl-10 lg:pl-0 lg:pr-8 pb-10 lg:pb-0">
            {/* connector: vertical on mobile, horizontal on desktop */}
            <span aria-hidden="true" className={`absolute left-[7px] top-4 bottom-0 w-px lg:hidden ${i === n - 1 ? 'hidden' : ''} ${dark ? 'bg-white/20' : 'bg-lx-graphite/20'}`} />
            <span aria-hidden="true" className={`hidden lg:block absolute left-4 right-0 top-[7px] h-px ${i === n - 1 ? 'lg:hidden' : ''} ${dark ? 'bg-white/20' : 'bg-lx-graphite/20'}`} />
            <span aria-hidden="true" className={`absolute left-0 top-0 lg:relative lg:block h-4 w-4 border-2 border-lx-orange ${i === 0 ? 'bg-lx-orange' : dark ? 'bg-lx-navy' : 'bg-white'}`} />
            <p className={`t-num text-sm font-semibold lg:mt-6 ${dark ? 'text-white/70' : 'text-lx-midgrey'}`}>Stage {String(i + 1).padStart(2, '0')}</p>
            <H className="mt-2 text-[1.375rem] leading-snug">{step.title}</H>
            {step.body && <p className={`mt-3 text-[0.9875rem] ${dark ? 'text-white/80' : 'text-lx-graphite'}`}>{step.body}</p>}
          </li>
        );
      })}
    </ol>
  );
}
