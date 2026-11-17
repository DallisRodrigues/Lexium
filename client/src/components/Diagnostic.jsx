import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ArrowUpRight, Check, Minus, X } from 'lucide-react';
import { api } from '../lib/api.js';
import { track, sessionId } from '../lib/analytics.js';

export const QUESTIONS = [
  { area: 'Growth', question: 'Is the three-year growth thesis supported by market evidence?' },
  { area: 'Economics', question: 'Does the financial model reconcile revenue drivers, cash and funding need?' },
  { area: 'Governance', question: 'Are statutory, board and management controls documented?' },
  { area: 'Narrative', question: 'Can management explain the use of funds and value creation clearly?' },
  { area: 'Diligence', question: 'Is a structured data room substantially ready?' },
];
const OPTIONS = ['Yes', 'Partly', 'No'];
const BAND_COPY = {
  Foundation: 'The core building blocks are still forming. Focus on evidence, economics and governance before engaging investors.',
  'Investor-readying': 'Important elements are in place. Closing the remaining gaps will strengthen your position before a raise.',
  'Market-ready': 'Your business shows strong readiness signals. The next step is positioning and a structured investor process.',
};
const ICON = { Strength: Check, 'Partly in place': Minus, 'Gap to address': X };

/** Investor readiness diagnostic — question, progress, result, lead capture. */
export default function Diagnostic() {
  const { pathname } = useLocation();
  const [step, setStep] = useState(-1); // -1 intro, 0..4 questions, 5 result
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [emailState, setEmailState] = useState('idle');
  const [emailErr, setEmailErr] = useState('');
  const headingRef = useRef(null);

  useEffect(() => { if (step >= 0) headingRef.current?.focus(); }, [step]);

  const start = () => { setStep(0); track('diagnostic_start', { source_page: pathname }); };

  const choose = async (area, value) => {
    const next = { ...answers, [area]: value };
    setAnswers(next);
    if (step < QUESTIONS.length - 1) return setStep(step + 1);
    setBusy(true); setError('');
    try {
      const r = await api('/diagnostic', { method: 'POST', body: { answers: next, sourcePage: pathname, sessionId: sessionId() } });
      setResult(r);
      setStep(QUESTIONS.length);
      track('diagnostic_complete', { band: r.band });
    } catch (e) {
      setError(e.message || 'We could not calculate your result. Please try again.');
    } finally { setBusy(false); }
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    setEmailErr('');
    if (!/^\S+@\S+\.\S+$/.test(email)) return setEmailErr('Enter a valid email address');
    if (!consent) return setEmailErr('Please confirm consent');
    setEmailState('loading');
    try {
      await api(`/diagnostic/${result.id}/email`, { method: 'POST', body: { email, consent } });
      setEmailState('success');
    } catch (err) { setEmailState('error'); setEmailErr(err.message); }
  };

  const restart = () => { setAnswers({}); setResult(null); setStep(0); };
  const pct = Math.round((Math.min(step, QUESTIONS.length) / QUESTIONS.length) * 100);

  return (
    <div className="bg-white border border-lx-graphite/15">
      {step >= 0 && step < QUESTIONS.length && (
        <div className="px-6 md:px-10 pt-6">
          <div className="flex items-center justify-between t-meta t-num">
            <span aria-live="polite">Question {step + 1} of {QUESTIONS.length}</span>
            <span>{QUESTIONS[step].area}</span>
          </div>
          <div className="mt-3 h-1 bg-lx-palegrey" role="progressbar" aria-label="Diagnostic progress" aria-valuemin={0} aria-valuemax={QUESTIONS.length} aria-valuenow={step} aria-valuetext={`${step + 1} of ${QUESTIONS.length}`}>
            <div className="h-full bg-lx-orange transition-[width] duration-300" style={{ width: `${Math.max(pct, 4)}%` }} />
          </div>
        </div>
      )}

      <div className="p-6 md:p-10 min-h-[340px]">
        {step === -1 && (
          <div>
            <p className="eyebrow"><span className="num t-num">5</span>Questions · about two minutes</p>
            <h3 className="mt-5 text-balance">Investor readiness diagnostic</h3>
            <p className="t-lead mt-4 measure">Answer five questions — Yes, Partly or No — to see where your business stands across growth, economics, governance, narrative and diligence. You see your full result before we ask for anything.</p>
            <button type="button" onClick={start} className="btn btn-navy mt-8">Start the diagnostic <ArrowRight aria-hidden="true" /></button>
          </div>
        )}

        {step >= 0 && step < QUESTIONS.length && (
          <fieldset className="border-0 p-0 m-0" disabled={busy}>
            <legend className="sr-only">{QUESTIONS[step].area}</legend>
            <h3 ref={headingRef} tabIndex={-1} className="text-balance text-[1.625rem] md:text-[2rem] outline-none">{QUESTIONS[step].question}</h3>
            <div className="mt-8 grid gap-3 sm:grid-cols-3" role="group" aria-label="Your answer">
              {OPTIONS.map((o) => {
                const on = answers[QUESTIONS[step].area] === o;
                return (
                  <button
                    key={o}
                    type="button"
                    aria-pressed={on}
                    onClick={() => choose(QUESTIONS[step].area, o)}
                    className={`flex items-center justify-between min-h-[56px] px-5 border-2 text-left font-semibold ${on ? 'border-lx-navy bg-lx-navy text-white' : 'border-lx-graphite/25 bg-white text-lx-navy hover:border-lx-navy'}`}
                  >
                    {o} {on && <Check aria-hidden="true" className="h-5 w-5" />}
                  </button>
                );
              })}
            </div>
            {error && <p role="alert" className="mt-4 field-error">{error}</p>}
            {busy && <p className="mt-4 t-meta" aria-live="polite">Calculating your result…</p>}
            {step > 0 && (
              <button type="button" onClick={() => setStep(step - 1)} className="mt-8 inline-flex items-center gap-2 min-h-[44px] bg-transparent border-0 p-0 text-lx-navy font-semibold">
                <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Previous question
              </button>
            )}
          </fieldset>
        )}

        {step === QUESTIONS.length && result && (
          <div>
            <p className="eyebrow">Your result</p>
            <div className="mt-5 flex flex-wrap items-end gap-x-8 gap-y-3">
              <h3 ref={headingRef} tabIndex={-1} className="text-[2.25rem] md:text-[3rem] outline-none">{result.band}</h3>
              <p className="t-num font-display text-2xl font-semibold text-lx-navy pb-1">
                {result.score}<span className="text-lx-midgrey"> / 10</span>
              </p>
            </div>
            <p className="t-lead mt-4 measure">{BAND_COPY[result.band]}</p>
            <ul className="mt-8 grid gap-0 sm:grid-cols-5 list-none p-0 m-0 border-y border-lx-graphite/15 sm:divide-x sm:divide-lx-graphite/15">
              {result.summary.map((s) => {
                const Icon = ICON[s.label];
                return (
                  <li key={s.area} className="py-4 sm:px-4 first:sm:pl-0 flex sm:block items-center justify-between gap-4 border-t first:border-t-0 sm:border-t-0 border-lx-graphite/15">
                    <p className="font-semibold text-lx-navy">{s.area}</p>
                    <p className="t-meta mt-1 inline-flex items-center gap-1.5">
                      <Icon aria-hidden="true" className={`h-4 w-4 ${s.points === 2 ? 'text-lx-navy' : 'text-lx-orange'}`} strokeWidth={2} />
                      {s.label} <span className="t-num">({s.points}/2)</span>
                    </p>
                  </li>
                );
              })}
            </ul>
            <p className="t-meta mt-3">Bands: Foundation (0–4) · Investor-readying (5–7) · Market-ready (8–10). This indicative self-assessment is not investment advice.</p>

            <div className="mt-10 grid gap-10 lg:grid-cols-2">
              <form onSubmit={sendEmail} noValidate className="border-t-2 border-lx-orange pt-6">
                <h4>Email me this summary <span className="t-meta font-normal">(optional)</span></h4>
                {emailState === 'success' ? (
                  <p role="status" className="mt-4">Thank you — your summary is on its way.</p>
                ) : (
                  <>
                    <label htmlFor="diag-email" className="block mt-4 font-semibold text-[0.9375rem]">Email</label>
                    <input id="diag-email" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={Boolean(emailErr) || undefined} aria-describedby={emailErr ? 'diag-email-err' : undefined} className="mt-2 w-full min-h-[48px] border border-lx-graphite/40 px-4 bg-white" />
                    <label className="mt-4 flex gap-3 items-start text-[0.9375rem] cursor-pointer">
                      <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-5 w-5 accent-lx-navy flex-none" />
                      <span>I agree that Lexium may email me this summary and store my email address in line with the <Link to="/privacy/" className="text-link">privacy notice</Link>.</span>
                    </label>
                    {emailErr && <p id="diag-email-err" role="alert" className="mt-3 field-error">{emailErr}</p>}
                    <button type="submit" className="btn btn-outline mt-5" disabled={emailState === 'loading'}>{emailState === 'loading' ? 'Sending…' : 'Send summary'}</button>
                  </>
                )}
              </form>
              <div className="border-t-2 border-lx-navy pt-6">
                <h4>Discuss your result</h4>
                <p className="mt-3 text-lx-graphite">Talk through your gaps and next steps with a Lexium advisor.</p>
                <Link to="/contact/?service=fundraising-ipo-advisory" onClick={() => track('cta_click', { label: 'Assess your capital readiness', placement: 'diagnostic-result', service: 'fundraising-ipo-advisory' })} className="btn btn-orange mt-5">
                  Assess your capital readiness <ArrowUpRight aria-hidden="true" />
                </Link>
                <button type="button" onClick={restart} className="block mt-4 min-h-[44px] bg-transparent border-0 p-0 text-lx-navy font-semibold underline underline-offset-4">Retake the diagnostic</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
