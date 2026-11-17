import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items, dark }) {
  return (
    <nav aria-label="Breadcrumb" className={`t-meta ${dark ? 'text-white/75' : ''}`}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 list-none p-0 m-0">
        {items.map((b, i) => {
          const last = i === items.length - 1;
          return (
            <li key={b.to} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className={dark ? 'text-white' : 'text-lx-graphite'}>{b.label}</span>
              ) : (
                <>
                  <Link to={b.to} className="inline-flex items-center min-h-[44px] underline-offset-4 hover:underline">{b.label}</Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
