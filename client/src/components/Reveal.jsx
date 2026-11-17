import { useEffect, useRef } from 'react';

/** Soft reveal on first scroll. Disabled by prefers-reduced-motion (CSS). */
export default function Reveal({ as: Tag = 'div', className = '', children, delay = 0, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) return el.classList.add('is-in');
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add('is-in');
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return (
    <Tag ref={ref} className={`reveal ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
