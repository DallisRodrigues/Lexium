import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

export const ORIGIN = import.meta.env.VITE_SITE_URL || 'https://lexium.local:8443';

const ORG = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Lexium Consulting',
  url: ORIGIN + '/',
  email: 'info@lexiumconsulting.com',
  foundingDate: '2018',
  description:
    'Lexium helps ambitious healthcare and regulated consumer businesses move from opportunity to execution—through strategy, market entry, regulation, manufacturing, mergers and acquisitions, and capital advisory.',
};

export default function SEO({ title, description, image, noindex, breadcrumbs, jsonLd = [], type = 'website' }) {
  const { pathname } = useLocation();
  const canonical = ORIGIN + pathname;
  const fullTitle = title || 'Lexium Consulting';
  const ogImage = image ? (image.startsWith('http') ? image : `${ORIGIN}${image}-1200.webp`) : undefined;
  const graphs = [ORG, ...jsonLd];
  if (breadcrumbs?.length)
    graphs.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.label, item: ORIGIN + b.to })),
    });
  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:site_name" content="Lexium Consulting" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonical} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta name="twitter:card" content={ogImage ? 'summary_large_image' : 'summary'} />
      {graphs.map((g, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(g)}</script>
      ))}
    </Helmet>
  );
}
