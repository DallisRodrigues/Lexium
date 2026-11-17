/** Market selection matrix — six criteria scored across illustrative markets (rating dots + text, never colour alone). */
export default function Matrix({ criteria = [], markets = ['Market A', 'Market B', 'Market C'], caption }) {
  // Illustrative pattern only — not data. Labelled as such.
  const pattern = [[3, 2, 1], [2, 3, 2], [1, 2, 3], [3, 1, 2], [2, 2, 3], [1, 3, 2]];
  const word = ['', 'Lower', 'Moderate', 'Higher'];
  return (
    <figure className="m-0 overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <caption className="text-left t-meta pb-4">{caption || 'Illustrative six-criteria market selection matrix — each priority market is scored on the same criteria.'}</caption>
        <thead>
          <tr>
            <th scope="col" className="py-3 pr-4 text-xs font-semibold tracking-[0.12em] uppercase text-lx-midgrey border-b-2 border-lx-navy">Criterion</th>
            {markets.map((m) => (
              <th key={m} scope="col" className="py-3 px-4 text-xs font-semibold tracking-[0.12em] uppercase text-lx-midgrey border-b-2 border-lx-navy">{m}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {criteria.map((c, r) => (
            <tr key={c} className="border-b border-lx-graphite/15">
              <th scope="row" className="py-4 pr-4 font-display text-lg font-semibold text-lx-navy">{c}</th>
              {markets.map((m, k) => {
                const v = pattern[r % pattern.length][k % 3];
                return (
                  <td key={m} className="py-4 px-4">
                    <span className="inline-flex items-center gap-3">
                      <span aria-hidden="true" className="inline-flex gap-1">
                        {[1, 2, 3].map((d) => (
                          <span key={d} className={`h-2.5 w-6 ${d <= v ? 'bg-lx-navy' : 'bg-lx-graphite/15'}`} />
                        ))}
                      </span>
                      <span className="t-meta">{word[v]}</span>
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
