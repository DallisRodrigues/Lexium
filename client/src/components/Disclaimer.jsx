import { Info } from 'lucide-react';

export default function Disclaimer({ children, className = '' }) {
  return (
    <aside className={`flex gap-3 border-l-2 border-lx-orange pl-4 py-1 t-meta text-lx-graphite ${className}`} role="note">
      <Info aria-hidden="true" className="mt-[3px] h-4 w-4 flex-none text-lx-midgrey" strokeWidth={1.5} />
      <p>{children}</p>
    </aside>
  );
}
