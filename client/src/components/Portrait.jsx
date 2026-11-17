import Picture from './Picture.jsx';

/** Leadership portrait — no stock. Neutral silhouette placeholder until the current executive portrait is supplied. */
export default function Portrait({ person, className = '' }) {
  if (person?.image?.src) return <Picture image={person.image} aspect="4 / 5" className={className} sizes="(min-width:1200px) 30vw, 100vw" />;
  return (
    <div className={`relative aspect-[4/5] bg-lx-palegrey border border-dashed border-lx-midgrey/60 flex flex-col items-center justify-end overflow-hidden ${className}`} role="img" aria-label="Current executive portrait — to be supplied">
      <svg viewBox="0 0 200 220" aria-hidden="true" className="w-3/5 text-lx-graphite/15" fill="currentColor">
        <circle cx="100" cy="78" r="44" />
        <path d="M20 220c0-52 36-86 80-86s80 34 80 86z" />
      </svg>
      <span className="absolute top-4 left-4 right-4 text-center text-xs font-semibold tracking-[0.08em] uppercase text-lx-midgrey">Current executive portrait — to be supplied</span>
    </div>
  );
}
