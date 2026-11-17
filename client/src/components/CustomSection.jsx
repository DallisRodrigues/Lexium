import { useQuery } from '@tanstack/react-query';
import * as Tabs from '@radix-ui/react-tabs';
import { q } from '../lib/api.js';
import Section from './Section.jsx';
import ChipList from './ChipList.jsx';
import Journey from './Journey.jsx';
import ProcessSteps from './ProcessSteps.jsx';
import Matrix from './Matrix.jsx';
import DocumentStack from './DocumentStack.jsx';
import RegionSelector from './RegionSelector.jsx';
import Accordion from './Accordion.jsx';
import Diagnostic from './Diagnostic.jsx';
import Disclaimer from './Disclaimer.jsx';
import ReviewedDate from './ReviewedDate.jsx';
import CapabilityTabs from './CapabilityTabs.jsx';
import { StatementBlock } from './Cards.jsx';

const DISCLAIMER = 'Website content is general information and not a regulatory determination.';

function Paras({ text }) {
  if (!text) return null;
  return String(text).split(/\n{2,}/).map((p, i) => <p key={i} className={i ? 'mt-4' : ''}>{p}</p>);
}

function RegulatoryAccordion({ group, page, idPrefix }) {
  const { data = [] } = useQuery(q.regulatory(page));
  const items = data.filter((d) => d.group === group);
  if (!items.length) return null;
  return (
    <Accordion
      items={items.map((r) => ({
        id: r.anchor || `${idPrefix}-${r._id}`,
        title: r.topic,
        content: (
          <div className="text-lx-graphite">
            <p className="t-lead">{r.summary}</p>
            {r.detail && <div className="mt-4"><Paras text={r.detail} /></div>}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <ReviewedDate date={r.reviewedDate} />
            </div>
            <Disclaimer className="mt-4">{r.disclaimer || DISCLAIMER}</Disclaimer>
          </div>
        ),
      }))}
    />
  );
}

function PathwaySelector({ page }) {
  const { data = [] } = useQuery(q.regulatory(page));
  const items = data.filter((d) => d.group === 'pathway');
  if (!items.length) return null;
  return (
    <Tabs.Root defaultValue={items[0].jurisdiction} className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-12">
      <Tabs.List aria-label="Regulatory pathway by jurisdiction" className="lg:col-span-4 flex lg:flex-col overflow-x-auto no-scrollbar border-b lg:border-b-0 lg:border-l border-lx-graphite/15 -mx-[var(--gutter)] px-[var(--gutter)] lg:mx-0 lg:px-0">
        {items.map((r) => (
          <Tabs.Trigger key={r.jurisdiction} value={r.jurisdiction} className="flex-none text-left min-h-[52px] px-4 lg:px-6 bg-transparent border-0 -mb-px lg:mb-0 lg:-ml-px border-b-2 lg:border-b-0 lg:border-l-2 border-transparent text-lx-graphite hover:text-lx-navy data-[state=active]:border-lx-orange data-[state=active]:text-lx-navy data-[state=active]:font-semibold whitespace-nowrap">
            {r.jurisdiction}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {items.map((r) => (
        <Tabs.Content key={r.jurisdiction} value={r.jurisdiction} className="lg:col-span-8">
          <h3>{r.topic}</h3>
          <p className="t-lead mt-4 measure">{r.summary}</p>
          {r.detail && <div className="mt-4 measure text-lx-graphite"><Paras text={r.detail} /></div>}
          <ReviewedDate date={r.reviewedDate} className="mt-6" />
          <Disclaimer className="mt-4">{r.disclaimer || DISCLAIMER}</Disclaimer>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}

function RegionBlock() {
  const { data = [] } = useQuery(q.regions('global'));
  return <RegionSelector regions={data} label="Global regions" />;
}

/** Renders a typed customSection (page-specific module) within the shared templates. */
export default function CustomSection({ s, num, page }) {
  const wrap = (children, opts = {}) => (
    <Section id={s.key} num={num} label={s.eyebrow} heading={s.heading} intro={s.intro} surface={opts.surface} tight={opts.tight}>
      {children}
    </Section>
  );
  switch (s.type) {
    case 'statement':
      return wrap(<StatementBlock text={s.data?.text} accent={s.data?.accent} />);
    case 'chips':
      return wrap(<ChipList items={s.items} label={s.heading || s.eyebrow} />, { tight: true });
    case 'journey':
    case 'decisionModel':
      return wrap(<Journey steps={s.items} label={s.heading || s.eyebrow} />, { surface: s.data?.surface });
    case 'process':
      return wrap(<ProcessSteps steps={s.items} label={s.heading || s.eyebrow} />);
    case 'matrix':
      return wrap(<Matrix criteria={s.items} caption={s.data?.caption} />);
    case 'documentStack':
      return wrap(<DocumentStack items={s.items} />, { surface: 'pale' });
    case 'regionSelector':
      return wrap(<RegionBlock />);
    case 'pathwaySelector':
      return wrap(<PathwaySelector page={page} />, { surface: 'pale' });
    case 'accordion':
      if (s.data?.source) return wrap(<RegulatoryAccordion group={s.data.source} page={page} idPrefix={s.key} />);
      return wrap(<Accordion items={(s.items || []).map((i, k) => ({ id: i.id || `${s.key}-${k + 1}`, title: i.title, content: <Paras text={i.body} /> }))} />);
    case 'faq':
      return wrap(
        <>
          <RegulatoryAccordion group="faq" page={page} idPrefix="faq" />
          {s.data?.note && <Disclaimer className="mt-8">{s.data.note}</Disclaimer>}
        </>,
      );
    case 'regulatoryContext':
      return wrap(<RegulatoryAccordion group="context" page={page} idPrefix="context" />, { surface: 'pale' });
    case 'diagnostic':
      return wrap(<div className="max-w-[960px]"><Diagnostic /></div>, { surface: 'pale' });
    case 'tabs':
      return wrap(<CapabilityTabs tabs={(s.items || []).map((i) => ({ value: i.title, label: i.title, heading: i.title, body: i.body, deliverables: i.deliverables }))} />);
    case 'cards':
    case 'blocks':
      return wrap(
        <ul className={`grid gap-x-10 gap-y-10 list-none p-0 m-0 ${s.items?.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'}`}>
          {(s.items || []).map((i, k) => (
            <li key={i.title} className="border-t-2 border-lx-graphite/15 pt-6">
              <p className="t-num text-sm num-accent">{String(k + 1).padStart(2, '0')}</p>
              <h3 className="mt-3 text-[1.375rem] leading-snug">{i.title}</h3>
              {i.body && <p className="mt-3 text-lx-graphite">{i.body}</p>}
            </li>
          ))}
        </ul>,
        { surface: s.data?.surface },
      );
    case 'disclaimer':
      return (
        <div className="container-lx pb-12"><Disclaimer>{s.data?.text}</Disclaimer></div>
      );
    default:
      return null;
  }
}
