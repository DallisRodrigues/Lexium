import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { getConsent, setConsent } from '../lib/consent.js';

/** Consent banner for non-essential analytics — Accept / Reject / Manage with equal prominence. */
export default function ConsentBanner() {
  const [show, setShow] = useState(false);
  const [manage, setManage] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    if (!getConsent()) setShow(true);
    const open = () => { setAnalytics(getConsent()?.analytics || false); setManage(true); };
    addEventListener('lx:manage-consent', open);
    return () => removeEventListener('lx:manage-consent', open);
  }, []);

  const decide = (v) => { setConsent(v); setShow(false); setManage(false); };
  const btn = 'btn btn-outline flex-1 sm:flex-none min-w-[120px]';

  return (
    <>
      {show && !manage && (
        <section aria-label="Cookie consent" className="fixed bottom-0 inset-x-0 z-[45] bg-white border-t-2 border-lx-navy shadow-[0_-12px_32px_-16px_rgba(9,39,68,0.3)]">
          <div className="container-lx py-5 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
            <p className="text-[0.9375rem] flex-1">
              We use essential cookies to run this site. With your permission we also measure anonymous usage to improve it — no analytics run until you choose. <Link to="/privacy/" className="text-link">Privacy notice</Link>
            </p>
            <div className="flex flex-wrap gap-3">
              <button type="button" className={btn} onClick={() => decide(true)}>Accept</button>
              <button type="button" className={btn} onClick={() => decide(false)}>Reject</button>
              <button type="button" className={btn} onClick={() => { setAnalytics(false); setManage(true); }}>Manage</button>
            </div>
          </div>
        </section>
      )}
      <Dialog.Root open={manage} onOpenChange={setManage}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-lx-navy/50" />
          <Dialog.Content className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(560px,calc(100vw-32px))] max-h-[90vh] overflow-y-auto bg-white p-6 md:p-8 border-t-2 border-lx-orange">
            <Dialog.Title className="font-display text-2xl font-semibold text-lx-navy">Cookie settings</Dialog.Title>
            <Dialog.Description className="mt-3 text-[0.9375rem]">Choose which cookies we may use. You can change this at any time from the footer.</Dialog.Description>
            <div className="mt-6 border-y border-lx-graphite/15 divide-y divide-lx-graphite/15">
              <div className="py-4 flex items-start justify-between gap-6">
                <div><p className="font-semibold text-lx-navy">Essential</p><p className="t-meta mt-1">Required for security, forms and remembering this choice.</p></div>
                <span className="t-meta font-semibold whitespace-nowrap">Always on</span>
              </div>
              <label className="py-4 flex items-start justify-between gap-6 cursor-pointer">
                <span><span className="block font-semibold text-lx-navy">Analytics</span><span className="block t-meta mt-1">Anonymous, first-party measurement of page interactions. Never includes message text or diagnostic answers.</span></span>
                <input type="checkbox" role="switch" aria-checked={analytics} checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="mt-1 h-6 w-6 flex-none accent-lx-navy" />
              </label>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" className={btn} onClick={() => decide(analytics)}>Save choices</button>
              <button type="button" className={btn} onClick={() => decide(true)}>Accept all</button>
              <button type="button" className={btn} onClick={() => decide(false)}>Reject all</button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
