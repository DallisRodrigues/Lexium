import { lazy, Suspense, useEffect, useRef } from 'react';
import { createBrowserRouter, Outlet, useLocation, ScrollRestoration, matchRoutes } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import SkipLink from './components/SkipLink.jsx';
import ConsentBanner from './components/ConsentBanner.jsx';
import { useQuery } from '@tanstack/react-query';
import { q } from './lib/api.js';

function PreviewRibbon() {
  const { data } = useQuery(q.settings());
  if (!data?.contentPreview) return null;
  return (
    <div className="bg-lx-palegrey border-b border-lx-graphite/15 text-[0.8125rem] text-lx-graphite no-print">
      <p className="container-lx py-1.5"><strong className="text-lx-navy">Preview build</strong> — drafted content shown here is awaiting Lexium approval.</p>
    </div>
  );
}

/**
 * Route-level code splitting with preload: once a page module has loaded, the component renders
 * synchronously (no Suspense fallback), so the first client render over prerendered HTML is complete.
 */
function lazyPage(factory) {
  let Mod;
  const Lazy = lazy(() => factory().then((m) => ((Mod = m), m)));
  const Page = (props) => (Mod ? <Mod.default {...props} /> : <Lazy {...props} />);
  Page.preload = () => (Mod ? Promise.resolve() : factory().then((m) => { Mod = m; }));
  return Page;
}

const Home = lazyPage(() => import('./pages/Home.jsx'));
const ServicesHub = lazyPage(() => import('./pages/ServicesHub.jsx'));
const ServicePage = lazyPage(() => import('./templates/ServicePage.jsx'));
const IndustriesHub = lazyPage(() => import('./pages/IndustriesHub.jsx'));
const IndustryPage = lazyPage(() => import('./templates/IndustryPage.jsx'));
const Insights = lazyPage(() => import('./pages/Insights.jsx'));
const ArticlePage = lazyPage(() => import('./templates/ArticlePage.jsx'));
const About = lazyPage(() => import('./pages/About.jsx'));
const Contact = lazyPage(() => import('./pages/Contact.jsx'));
const Legal = lazyPage(() => import('./pages/Legal.jsx'));
const NotFound = lazyPage(() => import('./pages/NotFound.jsx'));
const Admin = lazy(() => import('./admin/AdminApp.jsx'));

const Fallback = () => <div className="min-h-[60vh]" aria-busy="true" />;

function Layout() {
  const { pathname, hash } = useLocation();
  const main = useRef(null);
  const first = useRef(true);
  useEffect(() => { document.documentElement.dataset.lxReady = '1'; }, []); // client has taken over the prerendered page
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (!hash) main.current?.focus({ preventScroll: true }); // announce new page to screen readers
  }, [pathname, hash]);
  return (
    <>
      <SkipLink />
      <PreviewRibbon />
      <Header />
      <main id="main" ref={main} tabIndex={-1} className="outline-none">
        <Suspense fallback={<Fallback />}><Outlet /></Suspense>
      </main>
      <Footer />
      <ConsentBanner />
      <ScrollRestoration getKey={(l) => l.pathname} />
    </>
  );
}

function AdminShell() {
  useEffect(() => {
    const m = document.createElement('meta');
    m.name = 'robots';
    m.content = 'noindex, nofollow';
    document.head.appendChild(m);
    return () => m.remove();
  }, []);
  return <Suspense fallback={<Fallback />}><Admin /></Suspense>;
}

export const routes = [
  { path: '/admin/*', element: <AdminShell /> },
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/services/', element: <ServicesHub /> },
      { path: '/services/:slug/', element: <ServicePage /> },
      { path: '/industries/', element: <IndustriesHub /> },
      { path: '/industries/:slug/', element: <IndustryPage /> },
      { path: '/insights/', element: <Insights /> },
      { path: '/insights/:slug/', element: <ArticlePage /> },
      { path: '/about/', element: <About /> },
      { path: '/contact/', element: <Contact /> },
      { path: '/privacy/', element: <Legal pageKey="privacy" /> },
      { path: '/terms/', element: <Legal pageKey="terms" /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];

export const createRouter = () => createBrowserRouter(routes);

/** Load the page module(s) for a URL before the first render. */
export function preloadRoute(pathname) {
  const matches = matchRoutes(routes, pathname) || [];
  return Promise.all(matches.map((m) => m.route.element?.type?.preload?.()).filter(Boolean));
}
