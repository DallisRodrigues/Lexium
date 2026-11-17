import { ArrowUpRight, ArrowRight } from 'lucide-react';
import Logo from '../components/Logo.jsx';
import Hero from '../components/Hero.jsx';
import CapabilityTabs from '../components/CapabilityTabs.jsx';
import Accordion from '../components/Accordion.jsx';
import ProcessSteps from '../components/ProcessSteps.jsx';
import RegionSelector from '../components/RegionSelector.jsx';
import Diagnostic from '../components/Diagnostic.jsx';
import CTABand from '../components/CTABand.jsx';
import EnquiryForm from '../components/EnquiryForm.jsx';
import Matrix from '../components/Matrix.jsx';
import DocumentStack from '../components/DocumentStack.jsx';
import ChipList from '../components/ChipList.jsx';
import Journey from '../components/Journey.jsx';
import Disclaimer from '../components/Disclaimer.jsx';
import ReviewedDate from '../components/ReviewedDate.jsx';
import Portrait from '../components/Portrait.jsx';
import { ServiceCard, IndustryCard, InsightCard, EngagementCard, StatementBlock, TensionList } from '../components/Cards.jsx';

/** Hidden component library (/admin/styleguide) — every state from §6. Sample text is illustrative only. */
const SWATCHES = [
  ['--lx-orange', '#F36F21', 'CTAs, active states, short emphasis and fine rules'],
  ['--lx-navy', '#092744', 'Hero fields, footer and high-contrast sections'],
  ['--lx-graphite', '#243746', 'Body text and interface labels'],
  ['--lx-midgrey', '#66717C', 'Secondary copy and metadata'],
  ['--lx-palegrey', '#F3F5F6', 'Section backgrounds and quiet cards'],
  ['--lx-white', '#FFFFFF', 'Primary canvas and negative space'],
];
const svc = { number: '01', title: 'Strategy Consulting', slug: 'strategy-consulting', outcomeLine: 'choose where to play and how to win', threeCapabilities: ['Growth strategy', 'Portfolio strategy', 'Market and competitor intelligence'] };
const ind = { number: '01', isAnchor: true, title: 'Medical Devices and Diagnostics', slug: 'medical-devices-diagnostics', proposition: 'Move medical technology from approval to adoption.', hero: { image: { src: '/images/medical-device-diagnostic-manufacturing', alt: 'Sample' } } };
const ins = { title: 'Sample insight title for layout review', slug: 'sample', category: 'Markets', date: '2026-11-03', readingTime: 6, standfirst: 'Sample standfirst used only in the styleguide.', author: { name: 'Author name' }, image: { src: '/images/insight-india-market-platform', alt: 'Sample' } };

function Block({ title, children, note }) {
  return (
    <section className="bg-white border border-lx-graphite/15 mb-8">
      <header className="px-6 py-4 border-b border-lx-graphite/15 flex justify-between gap-4"><h2 className="text-[1.25rem]">{title}</h2>{note && <p className="t-meta">{note}</p>}</header>
      <div className="p-6">{children}</div>
    </section>
  );
}

export default function Styleguide() {
  return (
    <div>
      <h1 className="text-[2rem] mb-2">Styleguide</h1>
      <p className="t-meta mb-8">Hidden page (noindex). Every component and state from the component library. Sample text is illustrative.</p>

      <Block title="Colour tokens">
        <ul className="grid gap-4 sm:grid-cols-3 list-none p-0 m-0">
          {SWATCHES.map(([v, hex, use]) => (
            <li key={v}><div className="h-20 border border-lx-graphite/15" style={{ background: `var(${v})` }} /><p className="font-semibold mt-2">{v} <span className="t-num">{hex}</span></p><p className="t-meta">{use}</p></li>
          ))}
        </ul>
      </Block>

      <Block title="Typography">
        <p className="t-display">Display 96</p>
        <h2 className="mt-4">Heading 2 — Manrope</h2>
        <h3 className="mt-3">Heading 3 — Manrope</h3>
        <p className="t-lead mt-3">Lead copy — Inter 18–20px.</p>
        <p className="mt-2">Body copy — Inter 16–18px.</p>
        <p className="t-meta mt-2">Label / metadata — 14px.</p>
        <p className="mt-3 text-2xl">Editorial accent: <span className="t-serif">one phrase only per page</span></p>
        <p className="mt-2 t-num">Tabular figures: 1,234.50 · 10 / 10</p>
        <p className="eyebrow mt-4"><span className="num">01</span>Section label</p>
      </Block>

      <Block title="Buttons, links, rules, focus" note="Tab through to see focus rings">
        <div className="flex flex-wrap gap-4 items-center">
          <button className="btn btn-orange">Primary orange <ArrowUpRight aria-hidden="true" /></button>
          <button className="btn btn-navy">Primary navy <ArrowUpRight aria-hidden="true" /></button>
          <button className="btn btn-outline">Outline</button>
          <button className="btn btn-navy" disabled>Disabled</button>
          <a href="#x" className="link-arrow">Text link with arrow <ArrowRight aria-hidden="true" /></a>
        </div>
        <div className="mt-6 grid gap-4"><hr className="rule" /><hr className="rule-orange" /></div>
        <div className="mt-6 surface-navy on-dark p-6 flex gap-4"><button className="btn btn-orange">On navy</button><button className="btn btn-outline">Outline on navy</button></div>
      </Block>

      <Block title="Logo slot"><div className="flex gap-6 items-center"><Logo /><div className="surface-navy p-4"><Logo variant="white" /></div><Logo compact /></div></Block>

      <Block title="Editorial hero — light, dark, split">
        <div className="grid gap-6">
          <div className="border border-lx-graphite/15"><Hero variant="light" eyebrow="Light" headline="Light hero headline" intro="Introduction copy." primary={{ label: 'Primary', to: '#' }} secondary={{ label: 'Secondary', to: '#' }} /></div>
          <div className="border border-lx-graphite/15"><Hero variant="dark" eyebrow="Dark field" headline="Dark hero headline" intro="Introduction copy." primary={{ label: 'Primary', to: '#' }} /></div>
          <div className="border border-lx-graphite/15"><Hero variant="split" eyebrow="Split" headline="Split hero headline" intro="Introduction copy." image={{ src: '/images/cleanroom-manufacturing', alt: 'Sample' }} primary={{ label: 'Primary', to: '#' }} /></div>
        </div>
      </Block>

      <Block title="Capability tabs" note="Default · active · hover · keyboard focus (arrow keys)">
        <CapabilityTabs eventName="styleguide" tabs={['One', 'Two', 'Three'].map((t) => ({ value: t, label: `Capability ${t}`, heading: `Outcome ${t}`, body: 'Summary copy.', deliverables: ['Deliverable A', 'Deliverable B', 'Deliverable C'], links: [{ to: '#', label: 'Explore service' }] }))} />
      </Block>

      <Block title="Accordion" note="Collapsed · expanded · deep-linked (#sg-acc-2)">
        <Accordion defaultOpen={['sg-acc-1']} items={[1, 2, 3].map((i) => ({ id: `sg-acc-${i}`, title: `Accordion item ${i}`, content: <p>Expanded content {i}.</p> }))} />
      </Block>

      <Block title="Cards">
        <div className="grid gap-8 md:grid-cols-3">
          <ServiceCard service={svc} />
          <IndustryCard industry={ind} />
          <EngagementCard e={{ title: 'Engagement title', situation: 'Situation.', role: 'Lexium role.', resultType: 'Result type' }} index={0} />
        </div>
        <div className="mt-10"><InsightCard insight={ins} variant="featured" /></div>
        <div className="mt-10 grid gap-8 md:grid-cols-3"><InsightCard insight={ins} /><InsightCard insight={ins} variant="compact" /><Portrait /></div>
      </Block>

      <Block title="Statement and tensions"><StatementBlock text="A large editorial statement with one accent phrase." accent="accent phrase" /><div className="mt-8"><TensionList items={[{ title: 'Tension one', body: 'Body.' }, { title: 'Tension two', body: 'Body.' }]} /></div></Block>
      <Block title="Process steps" note="Horizontal ≥1200px, vertical below"><ProcessSteps steps={['Frame the ambition', 'Find the advantage', 'Design the pathway', 'Mobilise execution']} /></Block>
      <Block title="Journey, chips"><Journey steps={['Decide', 'Enter', 'Comply', 'Build']} /><ChipList className="mt-6" items={['Chip one', 'Chip two', 'Chip three']} /></Block>
      <Block title="Region selector" note="Selected region · keyboard focus (arrow keys)">
        <RegionSelector regions={[{ slug: 'a', name: 'Region A', overview: 'Overview A.', contactRoute: '/services/global-market-entry/', mapCodes: ['356'] }, { slug: 'b', name: 'Region B', overview: 'Overview B.', mapCodes: ['076'] }]} />
      </Block>
      <Block title="Diagnostic" note="Question · progress · result · lead capture"><Diagnostic /></Block>
      <Block title="Matrix"><Matrix criteria={['Demand', 'Regulation', 'Competition']} /></Block>
      <Block title="Document stack"><DocumentStack items={['URS', 'Layouts', 'Specifications']} /></Block>
      <Block title="Disclaimer and reviewed date"><Disclaimer>Website content is general information and not a regulatory determination.</Disclaimer><ReviewedDate className="mt-3" date="2026-11-17" /></Block>
      <Block title="Form" note="Submit empty to see validation + error summary"><EnquiryForm /></Block>
      <div className="mb-8 grid gap-1"><CTABand heading="Orange CTA band" variant="orange" id="sg1" /><CTABand heading="Navy CTA band" variant="navy" id="sg2" /><CTABand heading="Minimal white CTA band" variant="white" id="sg3" /></div>
    </div>
  );
}
