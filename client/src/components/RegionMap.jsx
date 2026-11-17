import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import topo from 'world-atlas/countries-110m.json';

/** Map enhancement only (decorative to assistive tech). Regions are selected via the button list. */
export default function RegionMap({ regions = [], selected, onSelect }) {
  const lookup = new Map();
  regions.forEach((r) => (r.mapCodes || []).forEach((c) => lookup.set(String(Number(c)), r)));
  return (
    <div aria-hidden="true" className="w-full">
      <ComposableMap projection="geoEqualEarth" projectionConfig={{ scale: 165 }} width={800} height={420} style={{ width: '100%', height: 'auto' }}>
        <Geographies geography={topo}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const r = lookup.get(String(Number(geo.id)));
              const isSel = r && r.slug === selected;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  tabIndex={-1}
                  onClick={() => r && onSelect(r.slug)}
                  fill={isSel ? '#F36F21' : r ? '#092744' : '#E3E7EA'}
                  fillOpacity={r && !isSel ? 0.55 : 1}
                  stroke="#fff"
                  strokeWidth={0.4}
                  className={r ? 'cursor-pointer outline-none hover:[fill-opacity:1]' : 'outline-none'}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
