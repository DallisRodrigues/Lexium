import { Link } from 'react-router-dom';
import NotFound from '../pages/NotFound.jsx';

/** Loading / error / not-found wrapper used by data-driven pages. */
export default function PageState({ query, children }) {
  if (query.isPending) return <div className="container-lx section" aria-busy="true"><p className="t-meta">Loading…</p></div>;
  if (query.error?.status === 404) return <NotFound />;
  if (query.error)
    return (
      <div className="container-lx section">
        <h1 className="t-page">This page could not be loaded</h1>
        <p className="t-lead mt-6">Please refresh, or <Link to="/" className="text-link">return to the home page</Link>.</p>
      </div>
    );
  return children(query.data);
}
