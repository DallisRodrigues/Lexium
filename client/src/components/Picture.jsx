import manifest from '../content/image-manifest.json';

const DEFAULT_WIDTHS = [480, 768, 1200, 1600, 2400];

/**
 * Responsive <picture>: AVIF + WebP srcset, explicit dimensions, focal point → object-position.
 * `image.src` is an extensionless base, e.g. "/images/medical-device-cleanroom-manufacturing".
 */
export default function Picture({ image, sizes = '100vw', priority = false, className = '', imgClassName = '', aspect, fill = false }) {
  if (!image?.src) return null;
  const meta = manifest[image.src] || {};
  const known = image.widths?.length || meta.widths?.length;
  if (!known) {
    // Image not yet supplied/optimised: neutral placeholder (never a broken image)
    const box = fill ? { position: 'absolute', inset: 0 } : { aspectRatio: aspect || '3 / 2' };
    return (
      <div
        className={`bg-lx-palegrey ${className}`}
        style={{ ...box, backgroundImage: 'linear-gradient(135deg, transparent 49.6%, rgba(36,55,70,.08) 50%, transparent 50.4%)' }}
        {...(image.decorative || !image.alt ? { 'aria-hidden': true } : { role: 'img', 'aria-label': image.alt })}
      />
    );
  }
  const widths = image.widths?.length ? image.widths : meta.widths || DEFAULT_WIDTHS;
  const width = image.width || meta.width || 1600;
  const height = image.height || meta.height || 1067;
  const placeholder = image.placeholder || meta.placeholder;
  const set = (ext, base = image.src) => widths.map((w) => `${base}-${w}.${ext} ${w}w`).join(', ');
  const fx = image.focalPoint?.x ?? 50;
  const fy = image.focalPoint?.y ?? 50;
  const mobile = image.mobileSrc || meta.mobileSrc;
  const largest = widths.filter((w) => w <= 1600).pop() || widths[0];

  return (
    <picture className={className} style={fill ? { display: 'block', position: 'absolute', inset: 0 } : aspect ? { display: 'block', aspectRatio: aspect } : undefined}>
      {mobile && <source media="(max-width: 767px)" type="image/avif" srcSet={`${mobile}.avif`} />}
      {mobile && <source media="(max-width: 767px)" type="image/webp" srcSet={`${mobile}.webp`} />}
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img
        src={`${image.src}-${largest}.webp`}
        alt={image.decorative ? '' : image.alt || ''}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding={priority ? 'sync' : 'async'}
        className={imgClassName}
        style={{
          objectFit: 'cover',
          objectPosition: `${fx}% ${fy}%`,
          width: '100%',
          height: fill || aspect ? '100%' : 'auto',
          backgroundImage: placeholder ? `url(${placeholder})` : undefined,
          backgroundSize: 'cover',
          backgroundColor: 'var(--lx-palegrey)',
        }}
      />
    </picture>
  );
}
