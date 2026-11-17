/** Section with document-style eyebrow: orange number + uppercase label, fine rule on top. */
export function Eyebrow({ num, children, className = '' }) {
  return (
    <p className={`eyebrow ${className}`}>
      {num && <span className="num" aria-hidden="true">{num}</span>}
      <span>{children}</span>
    </p>
  );
}

export default function Section({ id, num, label, heading, intro, surface, tight, rule = true, className = '', headingLevel = 2, children, aside }) {
  const H = `h${headingLevel}`;
  const surfaceCls = surface === 'pale' ? 'surface-pale' : surface === 'navy' ? 'surface-navy on-dark' : '';
  return (
    <section id={id} className={`${tight ? 'section-tight' : 'section'} ${surfaceCls} ${className}`} aria-labelledby={heading && id ? `${id}-h` : undefined}>
      <div className="container-lx">
        {(label || heading) && (
          <div className={`${rule && !surface ? 'rule-top pt-8' : ''} mb-10 md:mb-14 grid gap-6 lg:grid-cols-12`}>
            <div className="lg:col-span-4">{label && <Eyebrow num={num}>{label}</Eyebrow>}</div>
            {(heading || intro) && (
              <div className="lg:col-span-8">
                {heading && <H id={id ? `${id}-h` : undefined} className="text-balance">{heading}</H>}
                {intro && <p className="t-lead mt-5 measure">{intro}</p>}
                {aside}
              </div>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
