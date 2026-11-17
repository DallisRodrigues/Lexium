// Six substantive articles, one per content pillar. Drafted (status 'review'), no invented statistics.
const img = (src, alt, focalPoint = { x: 50, y: 50 }) => ({ src, alt, decorative: false, focalPoint });
const p = (...xs) => xs.map((x) => `<p>${x}</p>`).join('');
const h2 = (x) => `<h2>${x}</h2>`;
const ul = (...xs) => `<ul>${xs.map((x) => `<li>${x}</li>`).join('')}</ul>`;

export const insights = [
  {
    title: 'India as a market and a manufacturing platform',
    slug: 'india-market-and-manufacturing-platform',
    seoTitle: 'India as a Market and Manufacturing Platform | Lexium',
    category: 'Markets',
    type: 'Market perspective',
    featured: true,
    date: new Date('2026-11-03'),
    standfirst: 'For healthcare and regulated consumer businesses, India is increasingly two opportunities at once: a large, diverse market to sell into, and a base from which to build products for other markets.',
    image: img('/images/insight-india-market-platform', 'City skyline in India at dawn'),
    services: ['india-market-entry', 'manufacturing-advisory', 'strategy-consulting'],
    industries: ['medical-devices-diagnostics', 'consumer-health-wellness'],
    keyTakeaways: [
      'Treat India as a set of distinct segments and regions, not a single market, and choose where to start deliberately.',
      'Regulatory planning belongs inside the commercial plan, because licensing shapes launch timing and partner choice.',
      'Local manufacturing is a strategic option to assess early, even if the first step is import and distribution.',
    ],
    bodyHtml:
      p(
        'Many international companies still approach India with a single question: should we sell there? That question remains important, but it is no longer sufficient. For businesses in medical technology, healthcare and regulated consumer categories, India is increasingly a place to build as well as to sell — a source of engineering talent, supplier networks and manufacturing capability that can serve other markets.',
        'Seeing India as both a market and a platform changes the decisions leadership teams need to make, and the order in which they make them.',
      ) +
      h2('A market of many markets') +
      p(
        'India rewards companies that resist treating it as one homogeneous opportunity. Demand, purchasing power, healthcare infrastructure and distribution vary widely between metropolitan centres, smaller cities and rural areas. Institutional buyers behave differently from retail consumers, and private healthcare providers differ from public procurement.',
        'The practical implication is that market entry starts with segmentation. Which customer groups have a clear need for your product today? Which regions have the channels and infrastructure to reach them? Where are competitors already strong, and where is there room for a differentiated offer? Answering these questions with sourced, dated evidence — rather than headline estimates of market size — produces an entry plan that can be executed and measured.',
      ) +
      h2('Regulation as part of the commercial plan') +
      p(
        'In regulated categories, the route to market is shaped as much by approvals as by customers. Medical devices, diagnostics, cosmetics and nutrition products each follow their own regulatory framework in India, with requirements for classification, licensing, labelling and, in some cases, a local authorised agent.',
        'These requirements are not simply administrative steps to be completed after the commercial decision has been made. They influence which products can launch first, how long it will take, which partner structure is workable and what the early economics look like. Companies that bring regulatory planning into the commercial plan from the start avoid the common trap of signing a distributor before understanding who will hold the licence, or of committing to a launch date that depends on an approval timeline outside their control.',
      ) +
      h2('Choosing the right entry route') +
      p('There is no single correct way to enter India. The most common routes each have different implications for control, investment and speed:') +
      ul(
        '<strong>Export and distribution</strong> offers a lower-commitment start, but places a great deal of reliance on the chosen partner.',
        '<strong>A subsidiary</strong> gives greater control over brand, pricing and regulatory responsibility, at higher fixed cost.',
        '<strong>A joint venture or acquisition</strong> can accelerate access to customers and capability, but requires careful diligence and integration.',
        '<strong>Local manufacturing</strong> can improve cost and access, and may align with public procurement preferences, but is a long-term commitment.',
      ) +
      p('Many successful entrants move through more than one of these routes over time. The important thing is to choose the first step with the later steps in mind.') +
      h2('From market to platform') +
      p(
        'The second opportunity — India as a manufacturing and engineering base — is easy to overlook when the immediate focus is sales. Yet the decision to localise is often best assessed early. Local production can strengthen competitiveness in the domestic market and, for some products, create a base for exports to other price-sensitive markets.',
        'A localisation assessment considers demand, product mix, technology, cost, regulatory implications for a new facility, and the availability of suitable partners. It does not need to lead to an immediate investment. Its value lies in making sure that early commercial decisions — partner agreements, licence structures, product choices — do not close off a manufacturing option that could later prove valuable.',
      ) +
      h2('What this means for leadership teams') +
      p(
        'Leadership teams considering India benefit from asking a connected set of questions rather than tackling them one at a time. Where should we start, and with which customers? What regulatory route applies, and how does it affect timing? Which partner structure gives us the control we need? Should we plan for local manufacturing, and if so, when?',
        'Answering these questions together produces a plan that is realistic about complexity and clear about sequence. It also makes the business more credible with partners, regulators and, where relevant, investors — all of whom look for evidence that the entrant understands the market it is entering.',
      ),
  },
  {
    title: 'Healthcare access and local manufacturing across the Global South',
    slug: 'global-south-healthcare-access-local-manufacturing',
    category: 'Manufacturing',
    type: 'Article',
    date: new Date('2026-10-20'),
    standfirst: 'Governments and healthcare systems across Africa, South Asia and other regions are looking for more resilient access to medical technology. Local and regional manufacturing is part of the answer — but only when it is built on sound economics.',
    image: img('/images/insight-global-south-manufacturing', 'Quality control inspection on a clean production line'),
    services: ['manufacturing-advisory', 'global-market-entry', 'mergers-acquisitions'],
    industries: ['medical-devices-diagnostics', 'healthcare-digital-health'],
    keyTakeaways: [
      'Local manufacturing succeeds when it is anchored in real, accessible demand rather than policy ambition alone.',
      'Regulatory capability, quality systems and skills need to be planned alongside the facility itself.',
      'Partnerships — for technology, distribution and capital — often determine whether a regional platform is viable.',
    ],
    bodyHtml:
      p(
        'Recent disruptions to global supply chains highlighted how dependent many healthcare systems are on a small number of manufacturing locations. For countries across the Global South, the question of how to secure reliable access to essential medical technology has moved up the policy agenda. Local and regional manufacturing is frequently proposed as a solution.',
        'For manufacturers, investors and governments, the opportunity is real. So are the risks. Facilities that are built without a clear view of demand, regulatory pathway and operating economics can struggle to reach sustainable volumes.',
      ) +
      h2('Start with demand that can be reached') +
      p(
        'The first question for any manufacturing investment is not what can be made, but what can be sold — at what price, through which channels and to whom. In many markets, demand for medical technology is significant but fragmented across public procurement, private providers and different levels of care.',
        'A credible feasibility study maps this demand carefully. It distinguishes between need and purchasing power, between national and regional markets, and between products where local production offers a genuine advantage and those where scale economics favour established global producers. It also considers how procurement policies, including any preferences for local products, are applied in practice.',
      ) +
      h2('Regional platforms, not just national plants') +
      p(
        'For many products, a single national market is too small to support efficient production. Regional platforms — facilities designed to serve several neighbouring markets — can improve utilisation and economics. They also introduce complexity: each export market has its own regulatory requirements, distribution structures and commercial dynamics.',
        'Planning for a regional platform therefore means planning for market access as well as production. Which markets will the facility serve first? What approvals will each require? Which distributors or partners will carry the products? Answering these questions early shapes the product mix, capacity and quality system of the facility itself.',
      ) +
      h2('Regulation and quality from day one') +
      p(
        'A manufacturing facility for medical devices or diagnostics is only as valuable as its ability to obtain and maintain the necessary licences and certifications. Quality management systems, documentation, validation and staff capability all need to be designed into the project, not added at the end.',
        'Where national regulatory systems are still developing, manufacturers may also need to align with international standards and reference approvals to support exports. This affects facility design, equipment choice and the documentation that must be prepared during setup.',
      ) +
      h2('The role of partnerships') +
      p('Few local manufacturing projects succeed in isolation. Common partnership models include:') +
      ul(
        '<strong>Technology transfer or licensing</strong> from established manufacturers, providing proven designs and processes.',
        '<strong>Distribution partnerships</strong> that give the facility reliable access to customers in several markets.',
        '<strong>Investment partnerships</strong> that bring patient capital and governance discipline.',
        '<strong>Joint ventures</strong> that combine local market knowledge with international capability.',
      ) +
      p('Each model carries different implications for control, economics and risk. Careful partner screening and diligence are as important as the facility design itself.') +
      h2('A practical sequence') +
      p(
        'Projects that succeed tend to follow a disciplined sequence: confirm the demand and the markets to be served; select products and technology; develop a business plan and financing structure; design the facility and quality system around the products; select equipment and technology partners; and plan qualification and commercial readiness.',
        'This sequence is not bureaucratic. It ensures that each major commitment — capital, partners, facility design — is made with the information needed to make it well. For governments, investors and manufacturers alike, that discipline is what turns the ambition of local manufacturing into lasting improvements in healthcare access.',
      ),
  },
  {
    title: 'Medical-device localisation and regulatory strategy',
    slug: 'medical-device-localisation-regulatory-strategy',
    category: 'Regulation',
    type: 'Regulatory update',
    date: new Date('2026-10-06'),
    standfirst: 'When device companies decide to manufacture locally, the regulatory strategy changes as much as the supply chain. Planning the two together avoids delays and protects market access.',
    image: img('/images/insight-device-localisation-regulatory', 'Regulatory documentation reviewed beside a medical device component'),
    services: ['regulatory-licences', 'manufacturing-advisory', 'india-market-entry'],
    industries: ['medical-devices-diagnostics'],
    keyTakeaways: [
      'Moving from import to local manufacture usually means new licences, a new quality system scope and new responsibilities.',
      'Continuity of supply during transition depends on planning import and manufacturing licences in parallel.',
      'Design transfer, supplier qualification and validation evidence are regulatory as well as operational workstreams.',
    ],
    bodyHtml:
      p(
        'Device companies often begin in a new market by importing finished products through a local partner or authorised agent. As volumes grow, local assembly or manufacturing becomes attractive — for cost, responsiveness, procurement access or strategic presence. The operational case for localisation is usually well understood. The regulatory implications are sometimes underestimated.',
        'In India and in most other jurisdictions, manufacturing a device locally is regulated differently from importing it. Treating localisation as a regulatory project from the outset helps avoid gaps in market access and costly rework.',
      ) +
      h2('What changes when you localise') +
      p('Localisation typically changes several things at once:') +
      ul(
        '<strong>The licence type.</strong> A product previously covered by an import licence will generally need a manufacturing licence for the local site.',
        '<strong>The legal manufacturer and responsibilities.</strong> Depending on the model, responsibilities may shift between the original manufacturer, the local entity and any contract manufacturer.',
        '<strong>The quality system scope.</strong> The local site needs a quality management system appropriate to its activities, and may be audited.',
        '<strong>Technical documentation.</strong> Design transfer, process validation and supplier qualification create new evidence that the authority will expect.',
      ) +
      p('Each of these has implications for timing, cost and the agreements between the parties involved.') +
      h2('Planning for continuity') +
      p(
        'A frequent risk in localisation is a gap in supply. If the import licence is relinquished before the manufacturing licence is granted, or if the local product is considered a new product requiring separate approval, customers may face interruption.',
        'A sound regulatory strategy plans import and manufacturing licences in parallel, with clear milestones for when each product will transition. Timelines depend on authority review, product complexity and document readiness, so the plan should identify the steps within the company’s control — documentation, testing, quality system implementation — and build contingency around the steps that are not.',
      ) +
      h2('Design transfer and validation as regulatory evidence') +
      p(
        'When a product is transferred from one manufacturing site to another, the receiving site must show that it can produce the device to the same specification and quality. This involves design transfer documentation, process validation, equipment qualification and supplier qualification.',
        'These activities are often managed by engineering and operations teams. They also produce the evidence the regulator will review. Involving regulatory specialists early ensures that the evidence is generated in a form that supports the licence application, rather than needing to be reconstructed later.',
      ) +
      h2('Choosing the localisation model') +
      p(
        'Localisation can take several forms: final assembly of imported components, full manufacturing at a company-owned site, contract manufacturing with a local partner, or technology transfer to a licensee. Each model allocates regulatory responsibility differently and requires different agreements.',
        'Commercially, the right model depends on volumes, capital availability, control requirements and the capabilities of potential partners. Regulatory considerations should be part of that comparison, because some models can be implemented more quickly or with less new evidence than others.',
      ) +
      h2('A connected approach') +
      p(
        'The most effective localisation programmes treat regulatory strategy, manufacturing planning and commercial planning as one workstream. A single plan connects the business case, the facility or partner selection, the quality system, the licence applications and the commercial transition.',
        'This approach reduces surprises, protects continuity for customers and gives leadership a clear view of when the benefits of localisation will be realised. As with all regulatory matters, the specific route depends on the product, its classification and the jurisdiction, and should be confirmed with current regulations.',
      ),
  },
  {
    title: 'Scaling regulated consumer brands across markets',
    slug: 'scaling-regulated-consumer-brands-across-markets',
    seoTitle: 'Scaling Regulated Consumer Brands Across Markets | Lexium',
    category: 'Industry',
    type: 'Article',
    date: new Date('2026-09-22'),
    standfirst: 'Cosmetics, nutrition and wellness brands can grow quickly at home and then stall abroad. The brands that scale internationally plan for regulatory difference, local relevance and operations from the start.',
    image: img('/images/insight-regulated-consumer-brands', 'Unbranded wellness and personal care products arranged on a neutral surface'),
    services: ['global-market-entry', 'regulatory-licences', 'strategy-consulting'],
    industries: ['cosmetics-personal-care', 'food-nutrition-beverages', 'consumer-health-wellness'],
    keyTakeaways: [
      'Formulations, claims and labels that work in one market may not be permitted in another; plan for difference.',
      'Market prioritisation should weigh regulatory effort alongside demand and channel access.',
      'Operations and partners must scale with the brand, without diluting quality or trust.',
    ],
    bodyHtml:
      p(
        'Consumer brands in cosmetics, personal care, nutrition and wellness occupy an interesting position. They are consumer businesses, driven by brand, channel and product experience. They are also regulated businesses, subject to rules on ingredients, claims, labelling and, in some categories, registration before sale.',
        'At home, brands learn to navigate these rules, often informally. When they expand internationally, they encounter a different set of rules in each market. Brands that plan for this difference grow faster and with fewer setbacks than those that discover it market by market.',
      ) +
      h2('The same product is not always the same product') +
      p(
        'A formulation that is compliant in one market may contain an ingredient that is restricted elsewhere. A claim that is accepted in one jurisdiction may need different evidence or wording in another. Labelling requirements — languages, mandatory statements, format — vary widely.',
        'For nutrition and wellness products, the regulatory category itself can differ: the same product might be treated as a food, a supplement or a product with stricter requirements depending on the market and the claims made. These differences affect not only compliance, but also positioning, pricing and channel choice.',
      ) +
      h2('Prioritising markets with regulation in view') +
      p(
        'International expansion often begins opportunistically, with a distributor enquiry or a trade fair contact. A more deliberate approach evaluates candidate markets against consistent criteria: consumer demand, regulatory effort, competition, channel access, pricing and investment requirement.',
        'Including regulatory effort in this assessment can change the order of markets significantly. A market with moderate demand but a straightforward regulatory route may be a better first step than a larger market requiring reformulation or extended registration. Getting the sequence right builds momentum and learning that can be applied to later markets.',
      ) +
      h2('Local relevance without losing the brand') +
      p(
        'Consumers in different markets have different needs, preferences and climates. Brands that succeed internationally adapt thoughtfully — selecting which products to lead with, how to position them and which channels to use — while keeping the core brand promise consistent.',
        'This is as much a strategic question as a marketing one. Adapting too little can limit relevance; adapting too much can fragment the portfolio and increase regulatory and operational complexity. A clear view of what is fixed and what can flex helps teams make these trade-offs quickly.',
      ) +
      h2('Operations and partners that scale') +
      p('Growth places new demands on manufacturing, sourcing and distribution. Common questions include:') +
      ul(
        'Can current contract manufacturers support new formulations, volumes and documentation requirements?',
        'Are ingredient suppliers able to provide the evidence required in new markets?',
        'Do distributors have the regulatory competence to support registration and post-market obligations?',
        'At what point does local or regional manufacturing make sense?',
      ) +
      p('Answering these questions early protects quality and trust, which are central to the value of a consumer health or beauty brand.') +
      h2('Building investability alongside growth') +
      p(
        'International expansion often requires capital. Investors evaluating regulated consumer brands look for evidence of repeatable growth, sound unit economics, regulatory confidence and governance. Brands that build these foundations as they expand — clear market selection logic, compliant products, reliable partners and transparent reporting — are better positioned when they come to raise.',
        'Scaling a regulated consumer brand across markets is a connected challenge. Strategy, regulation, operations and capital each influence the others. Treating them together is what allows a promising product to become a durable international brand.',
      ),
  },
  {
    title: 'Capital readiness for founder-led businesses',
    slug: 'capital-readiness-founder-led-businesses',
    category: 'Capital',
    type: 'Founder viewpoint',
    date: new Date('2026-09-08'),
    standfirst: 'Founder-led businesses often approach fundraising as a pitch. Investors approach it as an assessment. Closing that gap starts well before the first investor meeting.',
    image: img('/images/insight-capital-readiness', 'Financial model and business plan documents on a clean desk'),
    services: ['fundraising-ipo-advisory', 'strategy-consulting'],
    industries: ['medical-devices-diagnostics', 'healthcare-digital-health', 'consumer-health-wellness'],
    keyTakeaways: [
      'Capital is an outcome of business readiness, so preparation should focus on the business, not only the deck.',
      'A credible growth thesis and a reconciled financial model are the foundation of the equity story.',
      'Governance and a structured data room shorten diligence and build investor confidence.',
    ],
    bodyHtml:
      p(
        'Founders build businesses through conviction, speed and close personal involvement. Those qualities are often exactly what investors want to see. Yet when founder-led businesses come to raise capital, they can find that the process rewards something different: evidence, structure and the ability to answer detailed questions consistently.',
        'Capital readiness is the work of closing that gap. It is less about producing a persuasive presentation and more about making the business itself easier to understand, assess and believe in.',
      ) +
      h2('Five areas investors examine') +
      p('While every investor has its own approach, most assess five broad areas:') +
      ul(
        '<strong>Growth.</strong> Is the growth thesis supported by market evidence, or by assumption?',
        '<strong>Economics.</strong> Does the financial model reconcile revenue drivers, margins, cash and the funding need?',
        '<strong>Governance.</strong> Are statutory, board and management controls in place and documented?',
        '<strong>Narrative.</strong> Can management clearly explain the use of funds and how value will be created?',
        '<strong>Diligence.</strong> Is information organised so that investors can verify what they are told?',
      ) +
      p('Weakness in any one of these areas can slow a process or change its terms. Strength across all five creates momentum.') +
      h2('The growth thesis comes first') +
      p(
        'The most persuasive equity stories are built on a clear growth thesis: where the business will grow, why it will win, and what the new capital will unlock. This thesis should be grounded in market evidence that an investor can test — customer demand, competitive position, regulatory pathway and channel access.',
        'For businesses in regulated sectors, the thesis also needs to show an understanding of approval timelines, compliance obligations and the investment they require. Investors will look closely at whether the plan is realistic about these factors.',
      ) +
      h2('A model that holds together') +
      p(
        'A financial model is often the first place where an investor tests a founder’s claims. A model that is driver-based, transparent and consistent with the business plan builds confidence. One that is difficult to follow, or that does not reconcile revenue with cash and funding need, raises questions about the whole business.',
        'Building a robust model is also valuable for management. It clarifies which assumptions matter most, how sensitive the plan is to changes, and how much capital is genuinely required.',
      ) +
      h2('Governance is not a formality') +
      p(
        'Founder-led businesses sometimes treat governance as something to address after a raise. Investors usually see it differently. Board composition, statutory compliance, financial controls and reporting are assessed early and can become conditions of investment.',
        'Strengthening governance before a process begins demonstrates maturity and reduces the risk of issues emerging late in diligence. For businesses considering a public listing in the longer term, including on SME platforms, governance and reporting standards become even more important.',
      ) +
      h2('Preparing for diligence') +
      p(
        'A structured data room — organised, complete and indexed — signals that a business is ready to be examined. Preparing one in advance also helps management identify gaps and inconsistencies before investors do. Alongside the data room, a prepared set of answers to likely questions helps the leadership team respond consistently.',
        'Readiness is rarely achieved in a few weeks. For many founder-led businesses, the most valuable preparation starts six to twelve months before a planned raise. That time allows the business to strengthen its evidence, model, governance and materials so that, when the process begins, the conversation is about opportunity rather than gaps. Where formal intermediaries are required, they should be engaged in line with applicable regulations.',
      ),
  },
  {
    title: 'M&A and partnership opportunities in healthcare and consumer sectors',
    slug: 'ma-partnership-opportunities-healthcare-consumer',
    seoTitle: 'M&A and Partnerships in Healthcare and Consumer | Lexium',
    category: 'M&A',
    type: 'Article',
    date: new Date('2026-08-25'),
    standfirst: 'Acquisitions, joint ventures and strategic partnerships are reshaping healthcare and regulated consumer markets. The transactions that create value start from strategy and look closely at regulatory assets.',
    image: img('/images/insight-ma-partnerships', 'Glass building facade reflecting a clear sky'),
    services: ['mergers-acquisitions', 'strategy-consulting', 'fundraising-ipo-advisory'],
    industries: ['medical-devices-diagnostics', 'healthcare-digital-health', 'cosmetics-personal-care', 'consumer-health-wellness'],
    keyTakeaways: [
      'Begin with strategic intent and clear criteria, so that deal activity supports the wider growth plan.',
      'In regulated sectors, licences, approvals and quality systems are core assets that require specialist diligence.',
      'Partnerships and joint ventures can deliver access and capability with less capital, but need careful structuring.',
    ],
    bodyHtml:
      p(
        'In healthcare and regulated consumer sectors, inorganic growth has become a central part of strategy for many businesses. Companies acquire to enter new categories or markets, to gain technology or manufacturing capability, or to build scale. Others form joint ventures and strategic partnerships to share risk and combine strengths.',
        'These transactions can create significant value. They can also destroy it, particularly when the strategic rationale is unclear or when regulatory assets are not properly understood.',
      ) +
      h2('Start with strategic intent') +
      p(
        'The strongest transactions begin with a clear answer to a simple question: what must this deal achieve for our strategy? Whether the objective is market access, a new capability, a product portfolio or manufacturing capacity, defining it precisely makes it possible to set criteria, screen opportunities and judge value.',
        'Without that clarity, businesses risk pursuing opportunities because they are available rather than because they are right. A disciplined approach to inorganic growth considers acquisitions alongside organic options and partnerships, and chooses the route that best fits the objective, risk appetite and resources.',
      ) +
      h2('Regulatory assets are core assets') +
      p(
        'In regulated sectors, much of a target’s value may sit in its licences, product approvals, registrations and quality systems. These assets determine what the business can sell, where, and under what conditions. They can also carry hidden risk: approvals that are close to renewal, quality issues that may attract regulatory attention, or registrations that cannot be easily transferred to a new owner.',
        'Specialist market and regulatory diligence examines these assets and links findings to commercial impact. It asks whether approvals are current and transferable, whether the quality system would withstand inspection, and what changes in regulation could affect the business. These findings inform valuation, transaction structure and protections in the transaction documents.',
      ) +
      h2('The role of partnerships and joint ventures') +
      p('Not every strategic objective requires an acquisition. Partnerships and joint ventures can provide:') +
      ul(
        'Access to a new market through a partner with established customers and regulatory capability.',
        'Technology or product rights through licensing or technology transfer.',
        'Manufacturing capacity through contract or shared facilities.',
        'Shared investment in a new platform, reducing the capital required from each party.',
      ) +
      p('These structures can be faster and less capital-intensive than acquisitions, but they depend heavily on alignment between partners, clear governance and well-defined exit arrangements.') +
      h2('Integration decides the outcome') +
      p(
        'The value of an acquisition is realised after completion. Integration planning should begin during diligence, covering operations, people, customers and — in regulated sectors — the transfer or continuation of licences and approvals. Customers, regulators and employees all need continuity.',
        'A clear plan for the first months after completion, with defined priorities and owners, protects the business while the expected synergies are pursued. Tracking value creation against the original deal rationale keeps attention on the outcomes that justified the transaction.',
      ) +
      h2('Confidentiality and discipline') +
      p(
        'Transactions require confidentiality. Discussions with potential targets, partners and investors should be managed carefully, with information shared in a controlled way. A well-run process — clear timelines, coordinated advisers and organised information — helps maintain momentum and protects all parties.',
        'For healthcare and regulated consumer businesses, M&A and partnerships will remain important routes to growth. The businesses that use them well are those that start from strategy, look closely at regulatory assets and plan for integration from the beginning.',
      ),
  },
];
