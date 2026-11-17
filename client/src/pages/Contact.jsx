import { useQuery } from '@tanstack/react-query';
import { q } from '../lib/api.js';
import { track } from '../lib/analytics.js';
import SEO from '../components/SEO.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import EnquiryForm from '../components/EnquiryForm.jsx';
import PageState from '../templates/PageState.jsx';

export default function Contact() {
  const page = useQuery(q.page('contact'));
  return <PageState query={page}>{(p) => <ContactContent p={p} />}</PageState>;
}

function ContactContent({ p }) {
  const { data: s } = useQuery(q.settings());
  const email = s?.email || 'info@lexiumconsulting.com';
  const crumbs = [{ label: 'Home', to: '/' }, { label: 'Contact', to: '/contact/' }];
  const dt = 'text-xs font-semibold tracking-[0.12em] uppercase text-lx-midgrey';
  return (
    <>
      <SEO title={p.seo?.title} description={p.seo?.metaDescription} breadcrumbs={crumbs} />
      <section className="container-lx pt-10 md:pt-16 pb-20 md:pb-28">
        <Breadcrumbs items={crumbs} />
        <div className="mt-10 md:mt-14 grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">Contact</p>
            <h1 id="page-title" className="t-page mt-6 text-balance">{p.hero?.headline}</h1>
            {p.hero?.intro && <p className="t-lead mt-6">{p.hero.intro}</p>}
            <dl className="mt-12 grid gap-6 border-t border-lx-graphite/15 pt-8">
              <div>
                <dt className={dt}>Email</dt>
                <dd className="m-0 mt-1"><a href={`mailto:${email}`} onClick={() => track('email_click', { placement: 'contact-details' })} className="text-link text-lg font-semibold inline-flex min-h-[44px] items-center">{email}</a></dd>
              </div>
              {s?.website && <div><dt className={dt}>Website</dt><dd className="m-0 mt-1">{s.website}</dd></div>}
              <div><dt className={dt}>Office</dt><dd className="m-0 mt-1"><address className="not-italic">{s?.officeAddress || 'Approved office address — to be confirmed'}</address></dd></div>
              {s?.phone && <div><dt className={dt}>Telephone</dt><dd className="m-0 mt-1"><a href={`tel:${s.phone.replace(/\s/g, '')}`} className="text-link">{s.phone}</a></dd></div>}
              <div><dt className={dt}>LinkedIn</dt><dd className="m-0 mt-1">{s?.linkedin ? <a href={s.linkedin} rel="noopener" target="_blank" className="text-link">Lexium Consulting on LinkedIn<span className="sr-only"> (opens in a new tab)</span></a> : 'LinkedIn page — to be confirmed'}</dd></div>
            </dl>
          </div>
          <div className="lg:col-span-7 lg:pl-8">
            <EnquiryForm responseWindow={s?.responseWindow} />
          </div>
        </div>
      </section>
    </>
  );
}
