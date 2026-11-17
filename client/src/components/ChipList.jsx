/** Subsectors, audiences, mandate types — fine-ruled list, square corners. */
export default function ChipList({ items = [], label, className = '', dark }) {
  return (
    <ul aria-label={label} className={`flex flex-wrap gap-2 list-none p-0 m-0 ${className}`}>
      {items.map((t) => (
        <li key={t} className={`border px-4 py-2 text-[0.9375rem] font-medium ${dark ? 'border-white/25 text-white' : 'border-lx-graphite/20 text-lx-navy bg-white'}`}>
          {t}
        </li>
      ))}
    </ul>
  );
}
