import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import Cropper from 'react-easy-crop';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExt from '@tiptap/extension-link';
import ImageExt from '@tiptap/extension-image';
import { api } from '../lib/api.js';
import { useAdmin, StatusBadge, Panel, useFlash } from './AdminApp.jsx';

const words = (s = '') => (String(s).trim().match(/\S+/g) || []).length;
const get = (o, p) => p.split('.').reduce((a, k) => a?.[k], o);
const set = (o, p, v) => {
  const keys = p.split('.');
  const copy = structuredClone(o);
  let cur = copy;
  keys.slice(0, -1).forEach((k) => (cur = cur[k] ??= {}));
  cur[keys.at(-1)] = v;
  return copy;
};

/** Fields edited by dedicated controls; everything else is edited in the Advanced JSON panel. */
const BASIC = ['_id', '__v', 'createdAt', 'updatedAt', 'history', 'status', 'approver', 'approverName', 'approvedAt', 'publishAt', '_limits', 'createdBy', 'updatedBy',
  'title', 'name', 'key', 'slug', 'number', 'eyebrow', 'hero', 'seo', 'verificationRequired', 'claimOwner', 'claimSource', 'copyOrigin',
  'category', 'type', 'standfirst', 'featured', 'bodyHtml', 'body', 'keyTakeaways', 'image', 'readingTime',
  'jurisdiction', 'topic', 'summary', 'detail', 'reviewedDate', 'disclaimer', 'role', 'biography', 'linkedin'];

function Counter({ n, max, min, unit = 'words' }) {
  const bad = (max && n > max) || (min && n < min);
  return <span className={`t-meta t-num ml-2 ${bad ? 'font-semibold text-lx-navy' : ''}`}>{bad ? '⚠ ' : ''}{n}{min ? `/${min}–${max}` : max ? `/${max}` : ''} {unit}</span>;
}

function Field({ label, value, onChange, max, min, chars, textarea, type = 'text', hint, id }) {
  const fid = id || label.replace(/\W+/g, '-').toLowerCase();
  const n = chars ? String(value || '').length : words(value);
  const Tag = textarea ? 'textarea' : 'input';
  return (
    <div>
      <label htmlFor={fid} className="label-lx">{label}{(max || min) && <Counter n={n} max={max} min={min} unit={chars ? 'chars' : 'words'} />}</label>
      <Tag id={fid} type={type} className="input-lx" value={value ?? ''} onChange={(e) => onChange(e.target.value)} rows={textarea ? 4 : undefined} style={textarea ? { minHeight: 110 } : undefined} />
      {hint && <p className="t-meta mt-1">{hint}</p>}
    </div>
  );
}

function ImageField({ label = 'Image', value = {}, onChange }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [busy, setBusy] = useState(false);
  const previewSrc = value.src ? (value.widths?.length || value.src.startsWith('/uploads') ? `${value.src}-${(value.widths || [768])[Math.min(1, (value.widths || [768]).length - 1)]}.webp` : `${value.src}-768.webp`) : null;
  const onComplete = useCallback((area) => {
    const fx = Math.round(area.x + area.width / 2);
    const fy = Math.round(area.y + area.height / 2);
    if (fx !== value.focalPoint?.x || fy !== value.focalPoint?.y) onChange({ ...value, focalPoint: { x: fx, y: fy } });
  }, [value, onChange]);
  const upload = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    const fd = new FormData();
    fd.append('file', f);
    fd.append('name', f.name.replace(/\.\w+$/, ''));
    try {
      const r = await api('/admin/uploads', { method: 'POST', body: fd });
      onChange({ ...value, src: r.src, widths: r.widths, width: r.width, height: r.height, placeholder: r.placeholder, focalPoint: { x: 50, y: 50 } });
    } finally { setBusy(false); }
  };
  const altMissing = value.src && !value.decorative && !value.alt;
  return (
    <fieldset className="border border-lx-graphite/15 p-4 grid gap-3">
      <legend className="px-1 font-semibold text-lx-navy">{label}</legend>
      <Field label="Image path (extensionless)" value={value.src} onChange={(src) => onChange({ ...value, src })} id={`${label}-src`} hint="e.g. /images/cleanroom-manufacturing — or upload below (AVIF/WebP generated automatically)." />
      <div><label className="label-lx" htmlFor={`${label}-up`}>Upload</label><input id={`${label}-up`} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={upload} disabled={busy} />{busy && <span className="t-meta ml-2">Processing…</span>}</div>
      <Field label="Alternative text" value={value.alt} onChange={(alt) => onChange({ ...value, alt })} id={`${label}-alt`} />
      {altMissing && <p className="field-error">Alt text is required unless the image is decorative.</p>}
      <label className="flex items-center gap-2"><input type="checkbox" checked={!!value.decorative} onChange={(e) => onChange({ ...value, decorative: e.target.checked })} /> Decorative (alt="")</label>
      <Field label="Credit" value={value.credit} onChange={(credit) => onChange({ ...value, credit })} id={`${label}-credit`} />
      {previewSrc && (
        <div>
          <p className="label-lx">Focal point <span className="t-meta">({value.focalPoint?.x ?? 50}%, {value.focalPoint?.y ?? 50}%) — drag the image to centre the subject</span></p>
          <div className="relative h-[240px] bg-lx-palegrey">
            <Cropper image={previewSrc} crop={crop} zoom={1.6} aspect={16 / 9} onCropChange={setCrop} onCropComplete={onComplete} showGrid={false} />
          </div>
        </div>
      )}
    </fieldset>
  );
}

function SeoPreview({ seo = {}, path }) {
  const title = seo.title || 'Page title | Lexium';
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="border border-lx-graphite/15 p-4 bg-white" aria-label="Search result preview">
        <p className="t-meta">Search preview</p>
        <p className="text-sm text-lx-midgrey mt-2 truncate">lexiumconsulting.com{path}</p>
        <p className="text-lx-navy underline text-lg leading-snug truncate">{title}</p>
        <p className="text-sm text-lx-graphite line-clamp-2">{seo.metaDescription || 'Meta description…'}</p>
      </div>
      <div className="border border-lx-graphite/15 bg-white" aria-label="Social card preview">
        <div className="aspect-[1.91/1] bg-lx-palegrey grid place-items-center t-meta">{seo.ogImage ? <img src={`${seo.ogImage}-768.webp`} alt="" className="w-full h-full object-cover" /> : 'Social image'}</div>
        <div className="p-3"><p className="text-xs uppercase text-lx-midgrey">lexiumconsulting.com</p><p className="font-semibold truncate">{title}</p><p className="text-sm line-clamp-1">{seo.metaDescription}</p></div>
      </div>
    </div>
  );
}

function RichText({ html, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] } }), LinkExt.configure({ openOnClick: false }), ImageExt],
    content: html || '',
    onUpdate: ({ editor: e }) => onChange({ html: e.getHTML(), json: e.getJSON() }),
  });
  if (!editor) return null;
  const B = ({ on, run, children, label }) => (
    <button type="button" aria-label={label} aria-pressed={on} onClick={run} className={`min-h-[36px] px-3 border text-sm ${on ? 'bg-lx-navy text-white border-lx-navy' : 'bg-white border-lx-graphite/25'}`}>{children}</button>
  );
  return (
    <div className="border border-lx-graphite/30">
      <div className="flex flex-wrap gap-1 p-2 border-b border-lx-graphite/15 bg-lx-palegrey" role="toolbar" aria-label="Formatting">
        <B label="Heading 2" on={editor.isActive('heading', { level: 2 })} run={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</B>
        <B label="Heading 3" on={editor.isActive('heading', { level: 3 })} run={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</B>
        <B label="Bold" on={editor.isActive('bold')} run={() => editor.chain().focus().toggleBold().run()}>B</B>
        <B label="Italic" on={editor.isActive('italic')} run={() => editor.chain().focus().toggleItalic().run()}><em>I</em></B>
        <B label="Bulleted list" on={editor.isActive('bulletList')} run={() => editor.chain().focus().toggleBulletList().run()}>• List</B>
        <B label="Numbered list" on={editor.isActive('orderedList')} run={() => editor.chain().focus().toggleOrderedList().run()}>1. List</B>
        <B label="Quote" on={editor.isActive('blockquote')} run={() => editor.chain().focus().toggleBlockquote().run()}>“ ”</B>
        <B label="Link" on={editor.isActive('link')} run={() => { const url = prompt('Link URL (https://…)'); if (url === null) return; url ? editor.chain().focus().setLink({ href: url }).run() : editor.chain().focus().unsetLink().run(); }}>Link</B>
      </div>
      <EditorContent editor={editor} className="prose-lx p-4 min-h-[320px] max-w-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[300px]" />
    </div>
  );
}

const pathFor = (kind, d) => ({ services: `/services/${d.slug}/`, industries: `/industries/${d.slug}/`, insights: `/insights/${d.slug}/`, pages: d.path })[kind] || '/';

export default function ContentEditor({ me }) {
  const { kind, id } = useParams();
  const qc = useQueryClient();
  const { data, refetch } = useAdmin(`/content/${kind}/${id}`, ['doc', kind, id]);
  const [doc, setDoc] = useState(null);
  const [json, setJson] = useState('');
  const [jsonErr, setJsonErr] = useState('');
  const [dirty, setDirty] = useState(false);
  const [when, setWhen] = useState('');
  const [limits, setLimits] = useState([]);
  const [flash, setFlash] = useFlash();
  const canApprove = ['approver', 'admin'].includes(me.role);

  const advancedOf = (d) => JSON.stringify(Object.fromEntries(Object.entries(d).filter(([k]) => !BASIC.includes(k))), null, 2);
  useEffect(() => {
    if (!data) return;
    setDoc(data); setJson(advancedOf(data)); setLimits(data._limits || []); setDirty(false);
  }, [data]);
  const up = (p) => (v) => { setDoc((d) => set(d, p, v)); setDirty(true); };
  const has = (k) => doc && (k in doc || ['hero', 'seo'].includes(k));

  const save = async () => {
    let adv = {};
    try { adv = JSON.parse(json || '{}'); setJsonErr(''); } catch (e) { setJsonErr(`Advanced JSON is invalid: ${e.message}`); return false; }
    const { _id, __v, createdAt, updatedAt, history, status, _limits, approver, approverName, approvedAt, ...rest } = doc;
    try {
      const r = await api(`/admin/content/${kind}/${id}`, { method: 'PUT', body: { ...rest, ...adv } });
      setLimits(r._limits || []); setDirty(false);
      setFlash({ text: 'Saved.' });
      qc.invalidateQueries({ queryKey: ['admin'] });
      await refetch();
      return true;
    } catch (e) { setFlash({ text: e.message, error: true }); return false; }
  };
  const act = async (action) => {
    if (dirty && !(await save())) return;
    try {
      await api(`/admin/content/${kind}/${id}/workflow`, { method: 'POST', body: { action, publishAt: when ? new Date(when).toISOString() : undefined } });
      setFlash({ text: `Done: ${action}.` });
      qc.invalidateQueries({ queryKey: ['admin'] });
      refetch();
    } catch (e) { setFlash({ text: e.body?.limits ? `${e.message} ${e.body.limits.join('; ')}` : e.message, error: true }); }
  };

  const blocking = useMemo(() => limits.filter((l) => !/^SEO title|^Meta description/.test(l)), [limits]);
  if (!doc) return <p>Loading…</p>;
  const isInsight = kind === 'insights';
  const isReg = kind === 'regulatory';

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_340px] items-start">
      <div className="grid gap-6 min-w-0">
        <div>
          <Link to={`/admin/content/${kind}`} className="text-link t-meta">← Back to {kind}</Link>
          <h1 className="text-[1.75rem] mt-2">{doc.title || doc.name || doc.key || doc.topic}</h1>
        </div>
        {flash}
        <Panel title="Basics">
          <div className="grid gap-4 md:grid-cols-2">
            {has('title') && <Field label="Title" value={doc.title} onChange={up('title')} max={kind === 'insights' ? undefined : 6} />}
            {has('name') && <Field label="Name" value={doc.name} onChange={up('name')} />}
            {has('slug') && <Field label="Slug" value={doc.slug} onChange={up('slug')} hint="Changing a slug automatically creates a 301 redirect." />}
            {has('key') && <Field label="Key" value={doc.key} onChange={up('key')} />}
            {has('number') && <Field label="Number" value={doc.number} onChange={up('number')} />}
            {has('eyebrow') && <Field label="Eyebrow" value={doc.eyebrow} onChange={up('eyebrow')} />}
            {has('role') && <Field label="Role" value={doc.role} onChange={up('role')} />}
            {has('linkedin') && <Field label="LinkedIn URL" value={doc.linkedin} onChange={up('linkedin')} />}
            {isInsight && (
              <>
                <div><label className="label-lx" htmlFor="cat">Category</label><select id="cat" className="input-lx" value={doc.category} onChange={(e) => up('category')(e.target.value)}>{['Strategy', 'Markets', 'Regulation', 'Manufacturing', 'M&A', 'Capital', 'Industry'].map((c) => <option key={c}>{c}</option>)}</select></div>
                <div><label className="label-lx" htmlFor="typ">Type</label><select id="typ" className="input-lx" value={doc.type} onChange={(e) => up('type')(e.target.value)}>{['Article', 'Market perspective', 'Regulatory update', 'Founder viewpoint'].map((c) => <option key={c}>{c}</option>)}</select></div>
                <label className="flex items-center gap-2"><input type="checkbox" checked={!!doc.featured} onChange={(e) => up('featured')(e.target.checked)} /> Featured insight</label>
              </>
            )}
            {isReg && (
              <>
                <Field label="Jurisdiction" value={doc.jurisdiction} onChange={up('jurisdiction')} />
                <Field label="Topic" value={doc.topic} onChange={up('topic')} />
                <Field label="Reviewed date (required)" type="date" value={doc.reviewedDate ? String(doc.reviewedDate).slice(0, 10) : ''} onChange={up('reviewedDate')} />
              </>
            )}
          </div>
          {has('standfirst') && <div className="mt-4"><Field label="Standfirst" textarea value={doc.standfirst} onChange={up('standfirst')} /></div>}
          {has('biography') && <div className="mt-4"><Field label="Biography" textarea value={doc.biography} onChange={up('biography')} /></div>}
          {isReg && (
            <div className="grid gap-4 mt-4">
              <Field label="Summary (first view)" textarea value={doc.summary} onChange={up('summary')} />
              <Field label="Detail (expandable — form numbers belong here only)" textarea value={doc.detail} onChange={up('detail')} />
              <Field label="Disclaimer" value={doc.disclaimer} onChange={up('disclaimer')} />
            </div>
          )}
        </Panel>

        {['services', 'industries', 'pages'].includes(kind) && (
          <Panel title="Hero">
            <div className="grid gap-4">
              <Field label="Headline" value={doc.hero?.headline} onChange={up('hero.headline')} max={12} />
              <Field label="Introduction" textarea value={doc.hero?.intro} onChange={up('hero.intro')} max={70} />
              <Field label="Introduction (mobile, optional)" textarea value={doc.hero?.introMobile} onChange={up('hero.introMobile')} max={55} />
              <ImageField label="Hero image" value={doc.hero?.image || {}} onChange={up('hero.image')} />
            </div>
          </Panel>
        )}

        {isInsight && (
          <>
            <Panel title="Hero image"><ImageField label="Article image" value={doc.image || {}} onChange={up('image')} /></Panel>
            <Panel title={`Body${doc.readingTime ? ` · ${doc.readingTime} min read` : ''}`}>
              <RichText html={doc.bodyHtml} onChange={({ html, json: j }) => { setDoc((d) => ({ ...d, bodyHtml: html, body: j })); setDirty(true); }} />
            </Panel>
            <Panel title="Key takeaways (three)">
              {[0, 1, 2].map((i) => <div key={i} className="mb-3"><Field label={`Takeaway ${i + 1}`} value={doc.keyTakeaways?.[i]} onChange={(v) => { const k = [...(doc.keyTakeaways || ['', '', ''])]; k[i] = v; up('keyTakeaways')(k); }} /></div>)}
            </Panel>
          </>
        )}
        {kind === 'people' && <Panel title="Portrait"><ImageField label="Portrait" value={doc.image || {}} onChange={up('image')} /></Panel>}

        <Panel title="SEO and social">
          <div className="grid gap-4">
            <Field label="SEO title" chars min={50} max={60} value={doc.seo?.title} onChange={up('seo.title')} hint="Service or industry first, Lexium second." />
            <Field label="Meta description" chars textarea min={140} max={160} value={doc.seo?.metaDescription} onChange={up('seo.metaDescription')} />
            <Field label="Social image path" value={doc.seo?.ogImage} onChange={up('seo.ogImage')} />
            <label className="flex items-center gap-2"><input type="checkbox" checked={!!doc.seo?.noindex} onChange={(e) => up('seo.noindex')(e.target.checked)} /> Exclude from search engines (noindex)</label>
            <SeoPreview seo={doc.seo} path={pathFor(kind, doc)} />
          </div>
        </Panel>

        <Panel title="Claims and verification">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex items-center gap-2 md:col-span-2"><input type="checkbox" checked={!!doc.verificationRequired} onChange={(e) => up('verificationRequired')(e.target.checked)} /> Verification required before publishing claims</label>
            <Field label="Claim owner" value={doc.claimOwner} onChange={up('claimOwner')} />
            <Field label="Claim source" value={doc.claimSource} onChange={up('claimSource')} />
            <div><label className="label-lx" htmlFor="co">Copy origin</label><select id="co" className="input-lx" value={doc.copyOrigin} onChange={(e) => up('copyOrigin')(e.target.value)}><option value="document">document</option><option value="drafted">drafted</option></select></div>
          </div>
        </Panel>

        <Panel title="Advanced fields (JSON)">
          <p className="t-meta mb-2">Capabilities, tensions, engagements, methodology, custom sections and relationships. Word limits are checked on save.</p>
          <label htmlFor="adv" className="sr-only">Advanced JSON</label>
          <textarea id="adv" className="input-lx font-mono text-[13px]" style={{ minHeight: 420 }} value={json} onChange={(e) => { setJson(e.target.value); setDirty(true); }} spellCheck={false} />
          {jsonErr && <p className="field-error mt-2">{jsonErr}</p>}
        </Panel>
      </div>

      <aside className="grid gap-6 xl:sticky xl:top-6">
        <Panel title="Workflow">
          <p className="flex items-center gap-2"><StatusBadge status={doc.status} /> <span className="t-meta">{doc.copyOrigin}</span></p>
          {doc.approverName && <p className="t-meta mt-2">Approved by {doc.approverName}{doc.approvedAt ? ` on ${format(new Date(doc.approvedAt), 'd MMM yyyy')}` : ''}</p>}
          {doc.status === 'scheduled' && doc.publishAt && <p className="t-meta mt-1">Scheduled for {format(new Date(doc.publishAt), 'd MMM yyyy HH:mm')}</p>}
          <div className="grid gap-2 mt-4">
            <button className="btn btn-outline" onClick={save} disabled={!dirty}>{dirty ? 'Save changes' : 'Saved'}</button>
            {doc.status === 'draft' && <button className="btn btn-outline" onClick={() => act('submit')}>Submit for review</button>}
            {canApprove && <button className="btn btn-navy" onClick={() => act('publish')} disabled={blocking.length > 0}>Approve and publish</button>}
            {canApprove && isInsight && (
              <div className="grid gap-2 border-t border-lx-graphite/15 pt-3">
                <label htmlFor="when" className="label-lx !mb-0">Schedule publication</label>
                <input id="when" type="datetime-local" className="input-lx" value={when} onChange={(e) => setWhen(e.target.value)} />
                <button className="btn btn-outline" onClick={() => act('schedule')} disabled={!when || blocking.length > 0}>Schedule</button>
              </div>
            )}
            {canApprove && doc.status === 'review' && <button className="btn btn-outline" onClick={() => act('reject')}>Return to draft</button>}
            {canApprove && ['published', 'scheduled'].includes(doc.status) && <button className="btn btn-outline" onClick={() => act('unpublish')}>Unpublish</button>}
            {canApprove && doc.status !== 'archived' && <button className="btn btn-outline" onClick={() => act('archive')}>Archive</button>}
            {!canApprove && <p className="t-meta">Only an approver or admin can publish.</p>}
          </div>
          {limits.length > 0 && (
            <div className="mt-4 border-t border-lx-graphite/15 pt-3">
              <p className="font-semibold text-lx-navy">Content limits</p>
              <ul className="mt-2 grid gap-1 text-sm">{limits.map((l) => <li key={l} className={/^SEO|^Meta/.test(l) ? 't-meta' : 'field-error'}>{l}</li>)}</ul>
              {blocking.length > 0 && <p className="t-meta mt-2">Publishing is blocked until limits are met.</p>}
            </div>
          )}
          {['services', 'industries', 'insights', 'pages'].includes(kind) && <a href={pathFor(kind, doc)} target="_blank" rel="noopener" className="text-link block mt-4">Preview page ↗</a>}
        </Panel>
        <Panel title="History">
          <ol className="list-none p-0 m-0 grid gap-2 text-sm max-h-[320px] overflow-auto">
            {[...(doc.history || [])].reverse().map((h, i) => (
              <li key={i}><span className="font-semibold">{h.action}</span> · {h.by} <span className="t-meta">{h.at ? format(new Date(h.at), 'd MMM yyyy HH:mm') : ''}</span>{h.note && <span className="block t-meta">{h.note}</span>}</li>
            ))}
          </ol>
        </Panel>
      </aside>
    </div>
  );
}
