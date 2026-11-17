import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowUpRight, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api } from '../lib/api.js';
import { track, sessionId } from '../lib/analytics.js';

export const INDUSTRY_OPTIONS = [
  'Medical Devices and Diagnostics',
  'Healthcare and Digital Health',
  'Cosmetics and Personal Care',
  'Food, Nutrition and Beverages',
  'Consumer Health and Wellness',
  'Other',
];
export const SERVICE_OPTIONS = [
  'Strategy Consulting',
  'Market Entry (India)',
  'Market Entry (Global)',
  'Regulatory and Licences',
  'Manufacturing Advisory',
  'Mergers and Acquisitions',
  'Fundraising and IPO Advisory',
  'General',
];
export const SLUG_TO_SERVICE = {
  'strategy-consulting': 'Strategy Consulting',
  'india-market-entry': 'Market Entry (India)',
  'global-market-entry': 'Market Entry (Global)',
  'regulatory-licences': 'Regulatory and Licences',
  'manufacturing-advisory': 'Manufacturing Advisory',
  'mergers-acquisitions': 'Mergers and Acquisitions',
  'fundraising-ipo-advisory': 'Fundraising and IPO Advisory',
};
const SLUG_TO_INDUSTRY = {
  'medical-devices-diagnostics': INDUSTRY_OPTIONS[0],
  'healthcare-digital-health': INDUSTRY_OPTIONS[1],
  'cosmetics-personal-care': INDUSTRY_OPTIONS[2],
  'food-nutrition-beverages': INDUSTRY_OPTIONS[3],
  'consumer-health-wellness': INDUSTRY_OPTIONS[4],
};

const schema = z.object({
  name: z.string().trim().min(1, 'Enter your name'),
  company: z.string().trim().min(1, 'Enter your company'),
  workEmail: z.string().trim().email('Enter a valid work email address'),
  phone: z.string().trim().regex(/^[+()\d\s.-]*$/, 'Enter a valid phone number, using digits only').optional().or(z.literal('')),
  country: z.string().trim().min(1, 'Enter your country'),
  industry: z.enum(INDUSTRY_OPTIONS, { error: 'Select an industry' }),
  serviceInterest: z.enum(SERVICE_OPTIONS, { error: 'Select a service interest' }),
  message: z.string().trim().min(1, 'Tell us briefly what you are working through').max(3000, 'Keep your message under 3,000 characters'),
  consent: z.literal(true, { error: 'Please confirm consent so we can respond' }),
});

const FIELDS = [
  ['name', 'Name', { type: 'text', autoComplete: 'name' }],
  ['company', 'Company', { type: 'text', autoComplete: 'organization' }],
  ['workEmail', 'Work email', { type: 'email', inputMode: 'email', autoComplete: 'email' }],
  ['phone', 'Phone (optional)', { type: 'tel', inputMode: 'tel', autoComplete: 'tel' }],
  ['country', 'Country', { type: 'text', autoComplete: 'country-name' }],
];

/** Qualified enquiry form — default, validation, loading, success and error states. */
export default function EnquiryForm({ responseWindow }) {
  const [params] = useSearchParams();
  const { pathname } = useLocation();
  const [state, setState] = useState('default');
  const [serverError, setServerError] = useState('');
  const startedAt = useRef(Date.now());
  const startedTracked = useRef(false);
  const summaryRef = useRef(null);
  const successRef = useRef(null);

  const { register, handleSubmit, setValue, setError, formState: { errors, submitCount } } = useForm({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: { name: '', company: '', workEmail: '', phone: '', country: '', industry: '', serviceInterest: '', message: '', consent: false },
  });

  useEffect(() => {
    const s = SLUG_TO_SERVICE[params.get('service')];
    if (s) setValue('serviceInterest', s);
    const i = SLUG_TO_INDUSTRY[params.get('industry')];
    if (i) setValue('industry', i);
  }, [params, setValue]);

  useEffect(() => { if (submitCount && Object.keys(errors).length) summaryRef.current?.focus(); }, [submitCount, errors]);
  useEffect(() => { if (state === 'success') successRef.current?.focus(); }, [state]);

  const onFirst = () => {
    if (startedTracked.current) return;
    startedTracked.current = true;
    track('form_start', { form_type: 'enquiry', source_page: document.referrer ? new URL(document.referrer).pathname : pathname });
  };

  const onSubmit = async (data) => {
    setState('loading');
    setServerError('');
    const utm = Object.fromEntries([...params].filter(([k]) => k.startsWith('utm_')));
    try {
      await api('/enquiries', {
        method: 'POST',
        body: { ...data, sourcePage: params.get('from') || pathname, utm, sessionId: sessionId(), startedAt: startedAt.current, website_url: document.getElementById('website_url')?.value || '' },
      });
      setState('success');
      track('form_submit', { service: data.serviceInterest, industry: data.industry, country: data.country });
    } catch (e) {
      if (e.status === 422 && e.body?.fields) Object.entries(e.body.fields).forEach(([k, m]) => setError(k, { message: m }));
      setServerError(e.status === 429 ? 'Too many submissions from this connection. Please try again later or email us directly.' : e.message || 'Something went wrong. Please try again or email us directly.');
      setState('error');
    }
  };

  if (state === 'success')
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="border-t-2 border-lx-orange pt-8 outline-none">
        <CheckCircle2 aria-hidden="true" className="h-8 w-8 text-lx-orange" strokeWidth={1.5} />
        <h2 className="mt-4 text-[2rem]">Thank you — your enquiry has been received.</h2>
        <p className="t-lead mt-4 measure">{responseWindow || 'We aim to respond within two business days.'}</p>
        <Link to="/insights/" className="link-arrow mt-6">Read our latest insights <ArrowRight aria-hidden="true" /></Link>
      </div>
    );

  const errList = Object.entries(errors);
  const fieldProps = (name) => ({
    id: `f-${name}`,
    'aria-invalid': errors[name] ? 'true' : undefined,
    'aria-describedby': errors[name] ? `f-${name}-err` : undefined,
    onFocus: onFirst,
  });
  const err = (name) => errors[name] && <p id={`f-${name}-err`} className="field-error mt-2">Error: {errors[name].message}</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate aria-busy={state === 'loading'} className="grid gap-6" aria-label="Enquiry form">
      {errList.length > 0 && submitCount > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="border-2 border-lx-orange p-5 outline-none">
          <p className="font-semibold text-lx-navy">There {errList.length === 1 ? 'is 1 problem' : `are ${errList.length} problems`} with your enquiry</p>
          <ul className="mt-3 list-disc pl-5">
            {errList.map(([k, v]) => <li key={k}><a href={`#f-${k}`} className="text-link">{v.message}</a></li>)}
          </ul>
        </div>
      )}
      {state === 'error' && serverError && (
        <div role="alert" className="border-2 border-lx-orange p-5"><p className="field-error">{serverError}</p></div>
      )}

      {/* Honeypot — hidden from people and assistive tech */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
        <label htmlFor="website_url">Website</label>
        <input id="website_url" name="website_url" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {FIELDS.map(([name, label, attrs]) => (
          <div key={name} className={name === 'country' ? 'md:col-span-2' : ''}>
            <label htmlFor={`f-${name}`} className="label-lx">{label}</label>
            <input {...attrs} {...fieldProps(name)} {...register(name)} className="input-lx" />
            {err(name)}
          </div>
        ))}
        <div>
          <label htmlFor="f-industry" className="label-lx">Industry</label>
          <select {...fieldProps('industry')} {...register('industry')} className="input-lx">
            <option value="">Select an industry</option>
            {INDUSTRY_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
          {err('industry')}
        </div>
        <div>
          <label htmlFor="f-serviceInterest" className="label-lx">Service interest</label>
          <select {...fieldProps('serviceInterest')} {...register('serviceInterest')} className="input-lx">
            <option value="">Select a service</option>
            {SERVICE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
          {err('serviceInterest')}
        </div>
      </div>
      <div>
        <label htmlFor="f-message" className="label-lx">Brief message</label>
        <textarea {...fieldProps('message')} {...register('message')} rows={6} className="input-lx" />
        {err('message')}
      </div>
      <div>
        <label className="flex gap-3 items-start cursor-pointer">
          <input type="checkbox" {...fieldProps('consent')} {...register('consent')} className="mt-1 h-5 w-5 flex-none accent-lx-navy" />
          <span className="text-[0.9375rem]">
            I consent to Lexium Consulting storing and using the information I have provided to respond to my enquiry, as described in the <Link to="/privacy/" className="text-link">privacy notice</Link>.
          </span>
        </label>
        {err('consent')}
      </div>
      <div>
        <button type="submit" className="btn btn-navy" disabled={state === 'loading'}>
          {state === 'loading' ? 'Sending…' : <>Send enquiry <ArrowUpRight aria-hidden="true" /></>}
        </button>
        <p className="sr-only" aria-live="polite">{state === 'loading' ? 'Sending your enquiry' : ''}</p>
      </div>
    </form>
  );
}
