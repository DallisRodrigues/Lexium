import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider, hydrate, dehydrate } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import '@fontsource-variable/manrope';
import '@fontsource-variable/inter';
import '@fontsource-variable/source-serif-4/wght-italic.css';
import './styles/index.css';
import { createRouter, preloadRoute } from './App.jsx';

document.documentElement.classList.add('lx-js');

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: (n, e) => e?.status !== 404 && n < 2, refetchOnWindowFocus: false } },
});

// Dehydrated query cache embedded by the prerenderer (data block — not executed, CSP-safe)
const stateEl = document.getElementById('__LX_STATE__');
if (stateEl) {
  try { hydrate(queryClient, JSON.parse(stateEl.textContent)); } catch { /* ignore */ }
}

const router = createRouter();
const app = (
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>
);

// Prerendered pages: load the route's code first, then render the complete page in one commit over the
// prerendered markup (identical output, so there is no flash or layout shift).
const root = document.getElementById('root');
preloadRoute(location.pathname)
  .catch(() => {})
  .then(() => createRoot(root).render(app));

// Used by scripts/prerender.mjs to embed the loaded data in each prerendered page
window.__LX_DEHYDRATE__ = () => dehydrate(queryClient, { shouldDehydrateQuery: (q) => q.state.status === 'success' && q.queryKey[0] !== 'me' });
