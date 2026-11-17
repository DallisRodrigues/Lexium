// Build-time check for the approved logo files (rebuild after dropping them in public/brand/).
const AVAILABLE = Object.keys(import.meta.glob('../../public/brand/lexium-logo*.{svg,png,webp}', { query: '?url', import: 'default' })).map((k) => k.split('/').pop());

/**
 * Approved Lexium wordmark slot. NEVER recreate, redraw or substitute the logo.
 * Loads /brand/lexium-logo.svg (or -white for dark backgrounds). Until the real files are supplied,
 * a neutral grey dashed placeholder is shown so the gap is obvious.
 */
export default function Logo({ variant = 'default', compact = false, className = '' }) {
  // Prefer SVG, then PNG/WebP. The white variant falls back to the standard file if no white version exists.
  const pick = (base) => ['svg', 'png', 'webp'].map((e) => `${base}.${e}`).find((f) => AVAILABLE.includes(f));
  const file = (variant === 'white' && pick('lexium-logo-white')) || pick('lexium-logo');
  const src = file ? `/brand/${file}` : '';
  const missing = !file;
  const h = compact ? 28 : 34;

  if (missing)
    return (
      <span
        className={`tr-height inline-flex items-center justify-center border border-dashed px-2 text-[10px] sm:text-[11px] leading-tight text-center font-semibold tracking-[0.06em] uppercase ${variant === 'white' ? 'border-white/50 text-white/80' : 'border-lx-midgrey text-lx-midgrey'} ${className}`}
        style={{ height: h + 6, width: compact ? 150 : 172, maxWidth: '48vw' }}
        role="img"
        aria-label="Lexium Consulting"
      >
        LOGO — supply approved SVG
      </span>
    );

  // Natural aspect of the supplied logo (PNG export from logo.cdr is 256×83).
  const ratio = file.endsWith('.png') ? 256 / 83 : 4;
  const img = (
    <img
      src={src}
      alt="Lexium Consulting"
      height={h}
      width={Math.round(h * ratio)}
      style={{ height: h, width: 'auto' }}
      className={`tr-height ${className}`}
    />
  );
  // No white version supplied: show the original logo on a white plate on dark backgrounds (never recoloured).
  if (variant === 'white' && !file.startsWith('lexium-logo-white'))
    return <span className="inline-flex bg-white px-3 py-2">{img}</span>;
  return img;
}
