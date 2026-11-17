// Seven services (§9.2–9.10). Strings marked D() are drafted copy (copyOrigin 'drafted', status 'review').
// Everything else is document wording, reproduced exactly.

const img = (src, alt, focalPoint = { x: 50, y: 50 }) => ({ src, alt, decorative: false, focalPoint });

/** Shared four-stage method (document wording), adapted per service via the body copy. */
const method = (bodies) =>
  ['Frame the ambition', 'Find the advantage', 'Design the pathway', 'Mobilise execution'].map((title, i) => ({ title, body: bodies[i] }));

export const services = [
  // ───────────────────────── 01 Strategy Consulting ─────────────────────────
  {
    number: '01',
    title: 'Strategy Consulting',
    slug: 'strategy-consulting',
    shortLabel: 'Strategy',
    eyebrow: 'Strategy Consulting',
    outcomeLine: 'choose where to play and how to win',
    hero: {
      headline: 'Make the choices that create durable growth.',
      intro:
        'Lexium helps leadership teams translate market ambition into a focused portfolio, operating agenda and executable plan. We work alongside promoters, CEOs and boards to test where value will come from, what it will take to capture it, and which decisions need to be made first.',
      introMobile: 'Lexium helps leadership teams translate market ambition into a focused portfolio, operating agenda and executable plan.',
      variant: 'split',
      image: img('/images/strategy-team-workshop', 'Executive looking out over a city from a high-rise office window', { x: 60, y: 50 }),
    },
    clientQuestions: ['Where should we play?', 'How will we win?', 'What must change to deliver the ambition?'],
    tensionsHeading: 'Growth choices are getting harder to make — and more expensive to get wrong.',
    tensions: [
      { title: 'Markets are fragmenting', body: 'Regulated categories are splitting into narrower segments, each with its own channels, evidence needs and economics.' },
      { title: 'Capital is more selective', body: 'Investors and boards now expect a clear thesis, credible numbers and a visible path to execution before they commit.' },
      { title: 'Regulation shapes strategy', body: 'Approval routes, claims rules and local requirements increasingly decide which opportunities are realistic and when.' },
      { title: 'Execution capacity is finite', body: 'Leadership teams cannot pursue every opportunity at once; sequencing and focus determine what gets delivered.' },
    ],
    capabilities: [
      {
        title: 'Growth strategy',
        outcome: 'A clear, prioritised route to the next stage of growth.',
        summary:
          'We assess markets, segments and adjacencies against your capabilities and ambition, then define where to compete and how to win. The result is a short list of growth moves with clear logic, sequencing and resource needs, so leadership can commit with confidence and communicate the plan internally.',
        deliverables: ['Growth thesis and ambition statement', 'Prioritised opportunity map', 'Where-to-play and how-to-win choices', 'Sequenced growth roadmap'],
      },
      {
        title: 'Portfolio strategy',
        outcome: 'A portfolio built around where value will come from.',
        summary:
          'We review products, categories and markets to show which deserve investment, which need repositioning and which no longer fit. Portfolio choices are linked to regulatory effort, manufacturing implications and margin, giving leadership a practical basis for allocating capital and management attention across the business.',
        deliverables: ['Portfolio performance and fit review', 'Invest, reposition or exit recommendations', 'Category and market prioritisation', 'Resource allocation view'],
      },
      {
        title: 'Market and competitor intelligence',
        outcome: 'Decisions grounded in evidence, not assumption.',
        summary:
          'We build a structured picture of market size drivers, customer needs, channel dynamics and competitor positions for the categories that matter to you. Findings are sourced and dated, and framed around the specific decisions in front of the leadership team rather than delivered as a general market report.',
        deliverables: ['Market model and demand drivers', 'Competitor profiles and positioning map', 'Customer and channel insight', 'Decision-focused summary for leadership'],
      },
      {
        title: 'Business plan',
        outcome: 'A plan that connects ambition to numbers.',
        summary:
          'We translate strategic choices into a business plan with clear assumptions, milestones and funding needs. Financial modelling supports the strategic decision rather than replacing it, and the plan is structured so it can be used for board approval, lender discussions or an investor process later.',
        deliverables: ['Business plan narrative', 'Assumption book and driver-based model', 'Milestone and funding plan', 'Board-ready summary'],
      },
      {
        title: 'Operating model',
        outcome: 'An organisation designed to deliver the strategy.',
        summary:
          'We define how the business needs to be organised to execute its strategy, including structure, decision rights, partner roles and key processes. Recommendations reflect regulatory obligations and market realities, so the operating model works in practice across the countries and categories where you compete.',
        deliverables: ['Current-state operating model diagnostic', 'Target operating model design', 'Roles, decision rights and governance', 'Transition priorities'],
      },
      {
        title: 'Transformation roadmap',
        outcome: 'A practical sequence for change.',
        summary:
          'We turn the strategy into a phased programme with clear initiatives, owners, dependencies and measures of progress. The roadmap balances quick, visible wins with longer structural change, and gives leadership a simple way to track delivery and adjust course as conditions and priorities evolve.',
        deliverables: ['Initiative portfolio and business cases', 'Phased roadmap with dependencies', 'Programme governance and cadence', 'Progress measures'],
      },
    ],
    customSections: [
      {
        type: 'decisionModel',
        key: 'decision-model',
        after: 'capabilities',
        eyebrow: 'Decision model',
        heading: 'Every recommendation is tested against four questions.',
        items: ['Opportunity', 'Advantage', 'Economics', 'Execution'],
        data: { surface: 'pale' },
        copyOrigin: 'document',
      },
    ],
    engagements: [
      { title: 'Five-year growth strategy', situation: 'A founder-led business has outgrown its original plan and needs a clear direction for the next five years.', role: 'Lexium frames the ambition, tests options and builds the prioritised strategy with leadership.', resultType: 'Board-approved growth strategy and roadmap' },
      { title: 'New-category assessment', situation: 'A company is considering entry into an adjacent regulated category and needs an objective view.', role: 'Lexium assesses market attractiveness, regulatory effort, capability fit and economics.', resultType: 'Go or no-go recommendation with entry options' },
      { title: 'Business model redesign', situation: 'Margins and growth are under pressure as channels, customers and regulation change.', role: 'Lexium diagnoses the model, designs alternatives and plans the transition.', resultType: 'Redesigned business model and transition plan' },
    ],
    methodologyHeading: 'How a strategy engagement runs',
    methodology: method([
      'Agree the ambition, the decisions to be made and the evidence needed.',
      'Identify where the business can build a defensible advantage.',
      'Shape the choices into a sequenced, funded plan.',
      'Set up governance and owners so the plan is delivered.',
    ]),
    ctaQuestion: 'Clarify your next strategic move',
    industries: ['medical-devices-diagnostics', 'healthcare-digital-health', 'cosmetics-personal-care', 'food-nutrition-beverages', 'consumer-health-wellness'],
    disclaimers: ['Lexium provides strategic advisory services. Financial modelling supports strategic decisions; Lexium does not provide audit or accounting services.'],
    seo: { title: 'Strategy Consulting for Regulated Markets | Lexium', metaDescription: 'Strategy consulting for healthcare and regulated consumer businesses: growth and portfolio strategy, business plans, operating models and transformation.' },
  },

  // ───────────────────────── 02 India Market Entry ─────────────────────────
  {
    number: '02',
    title: 'India Market Entry',
    slug: 'india-market-entry',
    shortLabel: 'Market Entry',
    eyebrow: 'India Market Entry',
    outcomeLine: 'convert India opportunity into revenue',
    hero: {
      headline: 'Enter India with clarity and control.',
      intro:
        'For international manufacturers, brands and investors, India offers scale and momentum — and real complexity. Lexium connects market assessment, regulatory pathway, partner selection and launch planning, so you choose the right entry route, build the right relationships and reach revenue with fewer surprises.',
      audience: 'For international manufacturers, brands and investors.',
      image: img('/images/india-business-district-daylight', 'Business district skyline in India in daylight', { x: 50, y: 40 }),
      variant: 'split',
    },
    clientQuestionStatement: 'Which entry route will get us to sustainable revenue in India — and what must be in place before launch?',
    tensionsHeading: 'The India opportunity',
    tensions: [
      { title: 'Market attractiveness', body: 'Demand is broad but uneven. Success depends on choosing the right segments, cities and customer groups, rather than treating India as a single market.' },
      { title: 'Category dynamics', body: 'Pricing, channel structure and local competition differ sharply by category, shaping which entry model and positioning will work.' },
      { title: 'The regulatory-commercial interface', body: 'Licences, authorised agents and labelling requirements affect launch timing and cost, so regulatory planning must sit inside the commercial plan.' },
    ],
    capabilities: [
      {
        title: 'Market assessment',
        outcome: 'An evidence-based view of where and how to compete.',
        summary:
          'We assess demand, segments, pricing, channels and competition for your specific categories in India, using sourced and dated evidence. The assessment identifies the most attractive entry points and the realistic size of the near-term opportunity, giving leadership a sound basis for the entry decision.',
        deliverables: ['Category and segment assessment', 'Competitor and pricing landscape', 'Channel and customer map', 'Opportunity prioritisation'],
      },
      {
        title: 'Entry strategy',
        outcome: 'The right route, sequence and investment level.',
        summary:
          'We compare entry routes — from export and distribution to subsidiary, joint venture, acquisition or local manufacturing — against your objectives, risk appetite and timeline. The recommended strategy sets out the sequence of moves, investment required and the decisions needed at each stage.',
        deliverables: ['Entry route options appraisal', 'Recommended entry model', 'Investment and resourcing view', 'Phased entry plan'],
      },
      {
        title: 'India authorised agent',
        outcome: 'A compliant local presence for regulatory responsibilities.',
        summary:
          'Where Indian regulation requires a local authorised agent, we help you understand the role, its obligations and the options for fulfilling it. We support selection and set-up so responsibilities are clear, documented and aligned with your commercial partners and distribution arrangements.',
        deliverables: ['Authorised agent requirements briefing', 'Options and selection support', 'Roles and responsibilities matrix', 'Set-up checklist'],
      },
      {
        title: 'Regulatory pathway',
        outcome: 'A licensing plan aligned with launch timing.',
        summary:
          'We map the applicable licences, registrations and evidence requirements for your products, and build them into the commercial timeline. Timelines depend on authority review, product complexity and document readiness, so the plan highlights dependencies and the actions that keep approval on track.',
        deliverables: ['Product classification and licence map', 'Documentation and evidence gap review', 'Regulatory timeline within the launch plan', 'Dossier coordination'],
      },
      {
        title: 'Distributor or partner search',
        outcome: 'Partners chosen for capability and fit.',
        summary:
          'We define the partner profile you need, identify and screen candidates, and support structured discussions. Assessment covers reach, capability, compliance and commercial alignment, so you can shortlist and negotiate with partners who can genuinely build your business in the target segments.',
        deliverables: ['Partner profile and criteria', 'Longlist and screening', 'Partner due diligence summary', 'Negotiation support'],
      },
      {
        title: 'Pricing and launch',
        outcome: 'A launch plan that protects price and position.',
        summary:
          'We develop pricing, positioning and a go-to-market plan suited to Indian channels and customers. The launch plan coordinates regulatory readiness, partner activation, marketing and supply, with clear milestones so the first months in market build momentum rather than resolve avoidable issues.',
        deliverables: ['Pricing and positioning strategy', 'Go-to-market plan', 'Launch readiness checklist', 'First-year milestones'],
      },
      {
        title: 'Local manufacturing assessment',
        outcome: 'A clear view on whether and when to localise.',
        summary:
          'We assess whether local manufacturing, assembly or contract manufacturing would strengthen your position in India. The assessment considers demand, cost, incentives where relevant, regulatory implications and partner options, and links to our manufacturing advisory if you decide to proceed with a facility.',
        deliverables: ['Localisation options appraisal', 'Cost and economics comparison', 'Partner and location shortlist', 'Recommendation and next steps'],
      },
    ],
    customSections: [
      {
        type: 'chips',
        key: 'entry-routes',
        after: 'capabilities',
        eyebrow: 'Entry routes',
        heading: 'Six ways to enter — chosen against your objectives, risk and timeline.',
        items: ['Export', 'Distributor', 'Subsidiary', 'Joint venture', 'Acquisition', 'Local manufacturing'],
        copyOrigin: 'document',
      },
    ],
    engagements: [
      { title: 'Entry route selection', situation: 'An international device manufacturer is weighing distribution against a local subsidiary.', role: 'Lexium compares routes, models the economics and recommends a phased approach.', resultType: 'Entry strategy and phased plan' },
      { title: 'Partner search and launch', situation: 'A brand has regulatory approval in progress and needs the right distribution partner.', role: 'Lexium profiles, screens and supports negotiation with shortlisted partners.', resultType: 'Partner shortlist and launch plan' },
      { title: 'Localisation decision', situation: 'A growing importer is considering local assembly to improve cost and access.', role: 'Lexium assesses options, economics and regulatory implications.', resultType: 'Localisation recommendation' },
    ],
    methodologyHeading: '90 to 180 day roadmap',
    methodology: [
      { title: 'Diagnose', body: 'Assess the opportunity, regulatory position and readiness of your products.' },
      { title: 'Select route', body: 'Choose the entry model and sequence that fits your objectives.' },
      { title: 'Build partner pipeline', body: 'Identify, screen and engage the partners you need.' },
      { title: 'Prepare launch', body: 'Align approvals, partners, pricing and supply for market entry.' },
    ],
    ctaQuestion: 'Build your India entry plan',
    industries: ['medical-devices-diagnostics', 'healthcare-digital-health', 'cosmetics-personal-care', 'food-nutrition-beverages', 'consumer-health-wellness'],
    seo: { title: 'India Market Entry Advisory for Manufacturers | Lexium', metaDescription: 'Enter India with clarity: market assessment, entry strategy, authorised agent, regulatory pathway, distributor search and launch planning from Lexium.' },
  },

  // ───────────────────────── 03 Global Market Entry ─────────────────────────
  {
    number: '03',
    title: 'Global Market Entry',
    slug: 'global-market-entry',
    shortLabel: 'Market Entry',
    eyebrow: 'Global Market Entry',
    outcomeLine: 'build compliant, partner-led expansion',
    hero: {
      headline: 'Expand globally with a market-by-market advantage.',
      intro:
        'For Indian and regional businesses pursuing exports or overseas establishment, growth depends on choosing the right markets and entering them well. Lexium prioritises markets, maps regulatory routes and finds credible partners, so each new country builds on the last rather than stretching the business.',
      audience: 'For Indian and regional businesses pursuing exports or overseas establishment.',
      image: img('/images/container-port-aerial', 'Aerial view of a container port', { x: 50, y: 50 }),
      variant: 'split',
    },
    clientQuestionStatement: 'Which markets should we enter next, in what order, and with which partners?',
    tensionsHeading: 'International growth rewards focus.',
    tensions: [
      { title: 'Too many options', body: 'Without a clear method, businesses spread effort across markets and progress slowly in all of them.' },
      { title: 'Regulation varies widely', body: 'Each market has its own approval route, evidence needs and local obligations that shape timing and cost.' },
      { title: 'Partners decide outcomes', body: 'In most markets, the quality of the distributor or partner determines commercial success more than the product alone.' },
    ],
    capabilities: [
      {
        title: 'Market prioritisation',
        outcome: 'A ranked list of markets worth entering.',
        summary:
          'We evaluate candidate markets against demand, regulation, competition, channel access, pricing and investment requirement, using one consistent framework. The output is a ranked shortlist and a recommended sequence, so effort and capital go first to the markets with the best balance of opportunity and feasibility.',
        deliverables: ['Market screening framework', 'Scored market shortlist', 'Recommended market sequence', 'Leadership summary'],
      },
      {
        title: 'Country screening',
        outcome: 'Deeper insight into each priority market.',
        summary:
          'For each shortlisted country we examine customers, channels, competitors, pricing and practical barriers to entry. The screening highlights what must be true for success and where the main risks lie, so the business can plan entry with realistic expectations and the right level of local support.',
        deliverables: ['Country profiles', 'Channel and competitor review', 'Risk and barrier assessment', 'Entry considerations'],
      },
      {
        title: 'Regulatory route',
        outcome: 'A clear approval path for each market.',
        summary:
          'We identify the approval, registration and labelling requirements for your products in each priority market, and the evidence you will need. We set out realistic dependencies — timelines depend on authority review, product complexity and document readiness — and coordinate with in-country specialists where required.',
        deliverables: ['Regulatory route map by market', 'Evidence and documentation needs', 'Dependency-based timeline', 'In-country specialist coordination'],
      },
      {
        title: 'Distributor search',
        outcome: 'Credible partners in each target market.',
        summary:
          'We define the distributor profile for each market, identify and screen candidates, and support initial discussions. Screening considers coverage, capability, regulatory competence and commercial alignment, helping you build a partner network that can represent your products well and grow with you over time.',
        deliverables: ['Distributor profile', 'Candidate identification and screening', 'Introductions and discussion support', 'Shortlist recommendation'],
      },
      {
        title: 'Partner due diligence',
        outcome: 'Confidence in who you are partnering with.',
        summary:
          'Before you commit, we review shortlisted partners for commercial track record, capability, compliance and reputation. Findings are presented clearly with any concerns and mitigations, so agreements can be structured with appropriate protections and performance expectations from the start of the relationship.',
        deliverables: ['Partner background review', 'Capability and compliance check', 'Findings and risk summary', 'Agreement considerations'],
      },
      {
        title: 'Commercial launch',
        outcome: 'A coordinated entry into each market.',
        summary:
          'We support the launch plan for each market, aligning approvals, partner activation, pricing, marketing materials and supply. Clear milestones and responsibilities help the business and its partners move together, and early performance measures show quickly whether the launch is on track or needs adjustment.',
        deliverables: ['Market launch plan', 'Partner activation plan', 'Pricing and materials alignment', 'Early performance measures'],
      },
      {
        title: 'Localisation',
        outcome: 'Products and operations adapted for each market.',
        summary:
          'We help you decide what to adapt for each market — from labelling and packaging to service model, pricing and, where it makes sense, local assembly or manufacturing. Localisation choices are weighed against cost and complexity so the business stays efficient as it expands into new countries.',
        deliverables: ['Localisation requirements review', 'Adaptation options and costs', 'Local operations considerations', 'Recommendation'],
      },
    ],
    customSections: [
      {
        type: 'regionSelector',
        key: 'regions',
        after: 'tensions',
        eyebrow: 'Regions',
        heading: 'Explore the regions where we support expansion.',
        copyOrigin: 'document',
      },
      {
        type: 'matrix',
        key: 'market-selection-matrix',
        after: 'capabilities',
        eyebrow: 'Market selection matrix',
        heading: 'Six criteria, applied consistently to every candidate market.',
        items: ['Demand', 'Regulation', 'Competition', 'Channel access', 'Pricing', 'Investment requirement'],
        copyOrigin: 'document',
      },
    ],
    engagements: [
      { title: 'Export market prioritisation', situation: 'An Indian manufacturer receives enquiries from many countries and lacks a clear focus.', role: 'Lexium screens markets and recommends a sequenced priority list.', resultType: 'Prioritised market plan' },
      { title: 'Regional distributor network', situation: 'A company needs reliable distribution across several countries in one region.', role: 'Lexium profiles, screens and introduces distributors in priority markets.', resultType: 'Distributor shortlist and launch plan' },
      { title: 'Overseas establishment', situation: 'A growing business is considering its first overseas entity.', role: 'Lexium assesses options, regulatory obligations and partner needs.', resultType: 'Establishment recommendation and plan' },
    ],
    methodologyHeading: 'How a global entry engagement runs',
    methodology: method([
      'Agree growth objectives, constraints and the markets under consideration.',
      'Screen markets and identify where your products can win.',
      'Map regulatory routes, partners and the entry sequence.',
      'Activate partners and launch, market by market.',
    ]),
    ctaQuestion: 'Identify your next priority market',
    industries: ['medical-devices-diagnostics', 'cosmetics-personal-care', 'food-nutrition-beverages', 'consumer-health-wellness'],
    seo: { title: 'Global Market Entry and Export Strategy Advisory | Lexium', metaDescription: 'Global market entry for Indian and regional businesses: market prioritisation, country screening, regulatory routes, distributor search and launch.' },
  },

  // ───────────────────────── 04 Regulatory and Licences ─────────────────────────
  {
    number: '04',
    title: 'Regulatory and Licences',
    slug: 'regulatory-licences',
    shortLabel: 'Regulatory',
    eyebrow: 'Regulatory and Licences',
    outcomeLine: 'navigate approval with commercial context',
    hero: {
      headline: 'Build regulatory confidence into every growth decision.',
      intro:
        'Approval strategy shapes launch timing, investment and market access. Lexium connects classification, evidence, dossiers and authority engagement with your commercial plan, so regulatory work supports growth decisions rather than delaying them — across India and the international markets where you want to compete.',
      image: img('/images/clean-laboratory-documents-inspection', 'Quality documentation reviewed on a clean laboratory bench', { x: 50, y: 50 }),
      variant: 'split',
    },
    clientQuestionStatement: 'Which approval route protects our launch plan — and what will it take to get there?',
    tensionsHeading: 'Regulation is a commercial decision.',
    tensions: [
      { title: 'Timing drives value', body: 'The approval route chosen affects when revenue starts, how much evidence is needed and what it costs to get there.' },
      { title: 'Requirements keep evolving', body: 'Frameworks for devices, cosmetics, nutrition and digital health continue to change across markets.' },
      { title: 'Evidence takes planning', body: 'Testing, clinical data and quality systems take time to build and are hard to accelerate late in the process.' },
    ],
    capabilities: [
      {
        title: 'Classification',
        outcome: 'The right category and route from the start.',
        summary:
          'We determine how your products are likely to be classified in each target market and which approval routes apply. Early, well-reasoned classification avoids rework, informs the evidence plan and gives leadership a realistic basis for launch timing, budget and the sequencing of markets.',
        deliverables: ['Product classification rationale', 'Applicable route by market', 'Evidence implications', 'Regulatory strategy summary'],
      },
      {
        title: 'Gap assessment',
        outcome: 'A clear view of what is missing.',
        summary:
          'We review your existing documentation, testing, quality system and labelling against the requirements of each target route. The assessment highlights gaps, their impact on timing and the actions needed to close them, so effort is focused where it matters most for approval.',
        deliverables: ['Requirements checklist', 'Gap analysis report', 'Prioritised action plan', 'Timeline implications'],
      },
      {
        title: 'Dossier',
        outcome: 'A complete, well-structured submission.',
        summary:
          'We plan, compile and review technical and regulatory dossiers in the format each authority expects. Our coordination covers internal teams, testing laboratories and partners, keeping content consistent and complete so the submission is ready for review with fewer avoidable queries.',
        deliverables: ['Dossier plan and structure', 'Document compilation and review', 'Consistency and completeness check', 'Submission support'],
      },
      {
        title: 'Query response',
        outcome: 'Clear, timely answers to authority questions.',
        summary:
          'When authorities raise questions, we help you understand what is being asked, prepare clear responses and identify any additional evidence required. A structured approach to queries keeps the review moving and reduces the risk of repeated rounds of questions during the process.',
        deliverables: ['Query analysis', 'Response drafting and review', 'Additional evidence planning', 'Response tracking'],
      },
      {
        title: 'Audit readiness',
        outcome: 'Facilities and systems ready for inspection.',
        summary:
          'We prepare your teams, documentation and facilities for regulatory and certification audits. Mock audits, document reviews and corrective action planning help identify issues before inspectors do, building confidence across quality, manufacturing and leadership teams well ahead of the audit itself.',
        deliverables: ['Audit readiness review', 'Mock audit', 'Corrective action plan', 'Team preparation'],
      },
      {
        title: 'Post-approval changes',
        outcome: 'Approvals that stay current as the business evolves.',
        summary:
          'Products, suppliers, sites and labels change after approval. We help you assess which changes require notification or new approval, plan the regulatory work and keep licences current, so commercial changes can proceed smoothly without putting existing market access or customer supply at risk.',
        deliverables: ['Change impact assessment', 'Notification or variation plan', 'Licence maintenance calendar', 'Submission support'],
      },
    ],
    customSections: [
      {
        type: 'pathwaySelector',
        key: 'pathway-selector',
        after: 'question',
        eyebrow: 'Pathway selector',
        heading: 'Choose a jurisdiction to see the regulatory pathway at a glance.',
        items: ['India', 'European Union', 'United States', 'United Kingdom', 'Brazil', 'Australia', 'Canada', 'Saudi Arabia'],
        copyOrigin: 'document',
      },
      {
        type: 'chips',
        key: 'service-groups',
        after: 'tensions',
        eyebrow: 'Service groups',
        heading: 'Regulatory support across products and frameworks.',
        items: ['Medical device licences', 'ISO and quality systems', 'CE MDR', 'US FDA', 'BIS', 'Cosmetics', 'Food and nutrition', 'Digital health and SaMD'],
        copyOrigin: 'document',
      },
      {
        type: 'accordion',
        key: 'india-licence-navigator',
        after: 'capabilities',
        eyebrow: 'India licence navigator',
        heading: 'Find the licence type that matches your activity in India.',
        intro: 'Select an activity to see an overview. Detailed form references sit inside each item.',
        items: ['Manufacture', 'Import', 'Test or evaluation', 'Clinical investigation', 'Authorised agent'],
        data: { source: 'licence' },
        copyOrigin: 'document',
      },
      {
        type: 'chips',
        key: 'deliverables',
        after: 'capabilities',
        eyebrow: 'Deliverables',
        heading: 'What you receive.',
        items: ['Classification', 'Gap assessment', 'Dossier', 'Query response', 'Audit readiness', 'Post-approval changes'],
        copyOrigin: 'document',
      },
      {
        type: 'faq',
        key: 'faq',
        after: 'methodology',
        eyebrow: 'FAQ',
        heading: 'Common regulatory questions',
        data: {
          note: 'Website content is general information and not a regulatory determination. Professional fees are separate from government, testing, certification body and out-of-pocket costs, which are set out in proposals.',
        },
        copyOrigin: 'drafted',
      },
    ],
    engagements: [
      { title: 'India licence for an imported device', situation: 'An overseas manufacturer needs an import licence and a local authorised agent.', role: 'Lexium classifies, compiles the dossier and coordinates with the agent.', resultType: 'Submission-ready dossier and licence plan' },
      { title: 'Multi-market regulatory route', situation: 'A company plans to enter several international markets with one product family.', role: 'Lexium maps routes and evidence needs, and sequences submissions.', resultType: 'Multi-market regulatory roadmap' },
      { title: 'Audit preparation', situation: 'A manufacturer faces its first certification audit for a quality system.', role: 'Lexium runs a readiness review, mock audit and corrective action plan.', resultType: 'Audit readiness and action plan' },
    ],
    methodologyHeading: 'How a regulatory engagement runs',
    methodology: method([
      'Clarify products, target markets and the commercial timeline.',
      'Classify products and choose the most efficient route.',
      'Close gaps and build a complete, consistent dossier.',
      'Support submission, queries and post-approval maintenance.',
    ]),
    ctaQuestion: 'Discuss your regulatory pathway',
    disclaimers: ['Website content is general information and not a regulatory determination.', 'Timelines depend on authority review, product complexity and document readiness. Professional fees are separate from government, testing, certification body and out-of-pocket costs.'],
    industries: ['medical-devices-diagnostics', 'healthcare-digital-health', 'cosmetics-personal-care', 'food-nutrition-beverages', 'consumer-health-wellness'],
    seo: { title: 'Medical Device Regulatory and Licences Advisory | Lexium', metaDescription: 'Regulatory strategy with commercial context: CDSCO licences, CE MDR, US FDA, BIS, ISO 13485, cosmetics, food and SaMD — classification to approval.' },
  },

  // ───────────────────────── 05 Manufacturing Advisory ─────────────────────────
  {
    number: '05',
    title: 'Manufacturing Advisory',
    slug: 'manufacturing-advisory',
    shortLabel: 'Manufacturing',
    eyebrow: 'Manufacturing Advisory',
    outcomeLine: 'design the operating platform for scale',
    hero: {
      headline: 'Build the manufacturing platform behind your growth.',
      intro:
        'End-to-end plant setup advisory for medical devices and selected regulated consumer sectors. Lexium connects market feasibility, technology choices, facility concept, regulatory planning and partner selection, so investment in a new manufacturing platform is grounded in demand and ready for approval.',
      image: img('/images/cleanroom-manufacturing', 'Technician working in a clean, modern manufacturing cleanroom', { x: 55, y: 45 }),
      variant: 'split',
    },
    clientQuestions: ['What to make', 'Where to locate', 'Which technology', 'What capacity', 'Which approvals', 'How to de-risk execution'],
    tensionsHeading: 'Manufacturing decisions are long-term commitments.',
    tensions: [
      { title: 'Capital is committed early', body: 'Facility and equipment choices lock in cost and capability long before the first product ships.' },
      { title: 'Approvals shape design', body: 'Quality system and licensing requirements need to inform layout, equipment and processes from the outset.' },
      { title: 'Partners carry risk', body: 'Technology and equipment partners have a direct impact on timelines, quality and the cost of operation.' },
    ],
    capabilities: [
      {
        title: 'Feasibility',
        outcome: 'A grounded decision on whether to invest.',
        summary:
          'We assess market demand, product mix, cost structure and regulatory requirements to test whether a manufacturing investment makes sense. The feasibility study gives promoters and boards an objective basis for the decision, including the key assumptions, risks and conditions for success.',
        deliverables: ['Market and demand assessment', 'Product mix and capacity scenarios', 'Investment and cost estimates', 'Feasibility recommendation'],
      },
      {
        title: 'Product and technology selection',
        outcome: 'The right products and processes for your market.',
        summary:
          'We help you choose which products to make and which technologies and processes to use, considering market fit, regulatory implications, cost and scalability. Where technology transfer or licensing is an option, we help evaluate partners and the terms that support long-term competitiveness.',
        deliverables: ['Product portfolio options', 'Technology and process comparison', 'Technology partner evaluation', 'Selection recommendation'],
      },
      {
        title: 'Business plan',
        outcome: 'A financeable plan for the facility.',
        summary:
          'We build the business plan for the manufacturing platform, linking demand, capacity, pricing, operating costs and investment. The plan sets out phasing, funding needs and key milestones, and is structured to support board approval, lender discussions and conversations with potential investors.',
        deliverables: ['Facility business plan', 'Financial model and scenarios', 'Phasing and funding plan', 'Investor-ready summary'],
      },
      {
        title: 'Facility concept',
        outcome: 'A facility designed around product, quality and flow.',
        summary:
          'We develop the facility concept, including space requirements, process flow, cleanroom needs and utilities, working with your architects and engineers. The concept reflects regulatory expectations and future expansion, so the design brief is clear before detailed engineering and construction begin.',
        deliverables: ['User requirement specification (URS)', 'Concept layouts and flows', 'Area and utilities requirements', 'Design brief for engineers'],
      },
      {
        title: 'Regulatory plan',
        outcome: 'A facility ready for licensing.',
        summary:
          'We map the licences, certifications and quality system requirements for the facility and its products, and build them into the project plan. Early regulatory input avoids costly redesign and gives a clear path to manufacturing licences and certification once the facility is complete.',
        deliverables: ['Licensing and certification map', 'Quality system plan', 'Regulatory milestones in the project plan', 'Licensing dossier plan'],
      },
      {
        title: 'Equipment partners',
        outcome: 'Suppliers selected for capability and support.',
        summary:
          'We prepare specifications, identify suitable equipment suppliers and support evaluation and negotiation. Selection balances technical capability, qualification support, service and total cost, helping you choose partners who will support installation, validation and operation of the facility over the long term.',
        deliverables: ['Equipment specifications', 'Supplier identification and evaluation', 'Comparison and recommendation', 'Contracting support'],
      },
      {
        title: 'Validation and launch readiness',
        outcome: 'A facility qualified and ready to produce.',
        summary:
          'We support planning for qualification and validation, quality system implementation and the transition to commercial production. Readiness reviews confirm that people, processes, documentation and approvals are in place, reducing the risk of delay between completing the facility and the first commercial batch.',
        deliverables: ['Validation master plan', 'Qualification support', 'Quality system readiness review', 'Commercial readiness checklist'],
      },
    ],
    customSections: [
      {
        type: 'journey',
        key: 'delivery-journey',
        after: 'capabilities',
        eyebrow: 'Delivery journey',
        heading: 'From concept to commercial readiness.',
        items: ['Concept', 'Feasibility', 'Design basis', 'Partner selection', 'Setup', 'Qualification', 'Commercial readiness'],
        copyOrigin: 'document',
      },
      {
        type: 'documentStack',
        key: 'document-stack',
        after: 'capabilities',
        eyebrow: 'Document stack',
        heading: 'The documents that carry a facility from idea to approval.',
        items: ['URS', 'Layouts', 'Specifications', 'Quality system', 'Validation plan', 'Licensing dossier'],
        copyOrigin: 'document',
      },
      {
        type: 'chips',
        key: 'sector-applications',
        after: 'engagements',
        eyebrow: 'Sector applications',
        heading: 'Where we apply manufacturing advisory.',
        items: ['Medical devices', 'Diagnostics', 'Cosmetics', 'Nutrition and beverages', 'Consumer health'],
        copyOrigin: 'document',
      },
    ],
    engagements: [
      { title: 'New device manufacturing facility', situation: 'A promoter plans a new facility for medical device production in India.', role: 'Lexium leads feasibility, technology selection, facility concept and regulatory planning.', resultType: 'Feasibility study and facility roadmap' },
      { title: 'Technology partnership', situation: 'A company wants to localise production through a technology partner.', role: 'Lexium identifies and evaluates partners and supports discussions.', resultType: 'Partner recommendation and terms framework' },
      { title: 'Capacity expansion', situation: 'An existing manufacturer needs to expand capacity for new categories.', role: 'Lexium assesses options, plans the regulatory path and prepares the business case.', resultType: 'Expansion plan and business case' },
    ],
    methodologyHeading: 'How a manufacturing engagement runs',
    methodology: method([
      'Define the products, markets and investment ambition.',
      'Test feasibility and select products and technology.',
      'Develop the facility concept, regulatory plan and partners.',
      'Support setup, qualification and commercial readiness.',
    ]),
    ctaQuestion: 'Assess your manufacturing opportunity',
    industries: ['medical-devices-diagnostics', 'cosmetics-personal-care', 'food-nutrition-beverages', 'consumer-health-wellness'],
    nexiomReferralApproved: false,
    seo: { title: 'Medical Device Manufacturing and Plant Setup | Lexium', metaDescription: 'Plant setup advisory for medical devices and regulated consumer sectors: feasibility, technology selection, facility concept, equipment and validation.' },
  },

  // ───────────────────────── 06 Mergers and Acquisitions ─────────────────────────
  {
    number: '06',
    title: 'Mergers and Acquisitions',
    slug: 'mergers-acquisitions',
    shortLabel: 'Mergers and Acquisitions',
    eyebrow: 'Mergers and Acquisitions',
    outcomeLine: 'identify, assess and realise strategic value',
    hero: {
      headline: 'Find the right deal. Create the right value.',
      intro:
        'Lexium advises on acquisitions, divestments, joint ventures and strategic partnerships in healthcare and regulated consumer sectors. We connect strategic intent with market, regulatory and commercial diligence, and stay involved through integration, so each transaction delivers the value it was designed to create.',
      image: img('/images/boardroom-table-minimal', 'Minimal boardroom table in a bright meeting room', { x: 50, y: 55 }),
      variant: 'split',
    },
    clientQuestionStatement: 'Is this the right deal for our strategy — and how will we capture the value after it closes?',
    tensionsHeading: 'Value is won or lost before and after signing.',
    tensions: [
      { title: 'Strategic fit comes first', body: 'Transactions that start from a clear strategy are easier to assess, negotiate and integrate.' },
      { title: 'Regulated assets need specialist diligence', body: 'Licences, approvals and quality systems can carry hidden risk that general diligence may not uncover.' },
      { title: 'Integration decides the outcome', body: 'The value of a deal depends on what happens in the first months after completion.' },
    ],
    capabilities: [
      {
        title: 'M&A strategy',
        outcome: 'A clear rationale for every transaction.',
        summary:
          'We help leadership define the role of acquisitions, partnerships or divestments in the wider strategy, and set clear criteria for what a good deal looks like. A disciplined M&A strategy focuses effort on the opportunities that matter and avoids transactions that distract from core priorities.',
        deliverables: ['Inorganic growth strategy', 'Target criteria and screening framework', 'Deal options appraisal', 'Leadership alignment'],
      },
      {
        title: 'Target screening',
        outcome: 'A focused list of credible opportunities.',
        summary:
          'We identify and screen potential targets or partners against your criteria, using market knowledge and structured research. Profiles cover strategic fit, capabilities, regulatory position and likely availability, so leadership can prioritise approaches and invest time in the opportunities with real potential.',
        deliverables: ['Target longlist', 'Screening and prioritisation', 'Target profiles', 'Approach strategy'],
      },
      {
        title: 'Commercial due diligence',
        outcome: 'Confidence in the market and the plan.',
        summary:
          'We test the commercial case behind a transaction — market position, customer base, growth drivers, competition and the credibility of the business plan. Findings are presented in a clear, decision-focused format that supports valuation, negotiation and the integration plan that follows.',
        deliverables: ['Market and competitive assessment', 'Business plan review', 'Key risks and opportunities', 'Diligence report'],
      },
      {
        title: 'Market and regulatory diligence',
        outcome: 'Clarity on licences, approvals and compliance.',
        summary:
          'We review the regulatory position of the target, including licences, product approvals, quality systems and pending changes. Regulatory findings are linked to commercial impact, highlighting what could affect value, timing or integration and the protections to consider in the transaction documents.',
        deliverables: ['Licence and approval review', 'Quality system assessment', 'Regulatory risk summary', 'Transaction considerations'],
      },
      {
        title: 'Valuation support',
        outcome: 'An informed view of value.',
        summary:
          'We support valuation by building or reviewing the business plan, testing assumptions and assessing synergies and risks. Our analysis informs negotiation strategy, and we coordinate with registered valuers and other licensed advisers wherever a formal valuation or opinion is required.',
        deliverables: ['Business plan and assumption review', 'Synergy assessment', 'Valuation inputs and scenarios', 'Negotiation support'],
      },
      {
        title: 'Deal coordination',
        outcome: 'A well-run process from first contact to completion.',
        summary:
          'We help manage the transaction process — timelines, information flow, workstreams and adviser coordination — so leadership can stay focused on the business. Clear process management reduces delays, keeps parties aligned and helps maintain momentum through diligence, negotiation and completion.',
        deliverables: ['Transaction plan and timeline', 'Workstream coordination', 'Information and data room management', 'Adviser coordination'],
      },
      {
        title: 'Integration and value creation',
        outcome: 'The deal value delivered in practice.',
        summary:
          'We plan and support integration — from the first hundred days to longer-term value creation — covering operations, regulatory transfers, people and commercial priorities. A clear integration plan protects continuity for customers and regulators while delivering the synergies the deal was based on.',
        deliverables: ['Integration plan', 'First hundred days priorities', 'Regulatory transfer plan', 'Value creation tracking'],
      },
    ],
    customSections: [
      {
        type: 'chips',
        key: 'audience',
        after: 'question',
        eyebrow: 'Audience',
        heading: 'Who we advise.',
        items: ['Promoters', 'Strategic buyers', 'Investors', 'International entrants', 'Founder-led businesses'],
        copyOrigin: 'document',
      },
      {
        type: 'journey',
        key: 'deal-journey',
        after: 'capabilities',
        eyebrow: 'Deal journey',
        heading: 'From strategic intent to integration.',
        items: ['Strategic intent', 'Screen', 'Assess', 'Structure', 'Execute', 'Integrate'],
        copyOrigin: 'document',
      },
      {
        type: 'chips',
        key: 'mandate-types',
        after: 'engagements',
        eyebrow: 'Mandate types',
        heading: 'Transactions we support.',
        items: ['Buy-side', 'Sell-side', 'Joint venture', 'Strategic partnership', 'Technology transfer'],
        copyOrigin: 'document',
      },
      {
        type: 'disclaimer',
        key: 'confidentiality',
        after: 'engagements',
        data: { text: 'All conversations are held in confidence. Lexium does not publish details of active mandates or identifiable transactions.' },
        copyOrigin: 'drafted',
      },
    ],
    engagements: [
      { title: 'Buy-side acquisition', situation: 'A strategic buyer wants to accelerate growth through an acquisition in an adjacent category.', role: 'Lexium defines criteria, screens targets and leads commercial and regulatory diligence.', resultType: 'Target recommendation and diligence findings' },
      { title: 'International joint venture', situation: 'An international entrant seeks a local partner to share market access and capability.', role: 'Lexium identifies partners, assesses fit and supports structuring.', resultType: 'Partner selection and joint venture framework' },
      { title: 'Sell-side preparation', situation: 'A founder-led business is considering a sale or strategic investment.', role: 'Lexium prepares the business, materials and process.', resultType: 'Transaction-ready business and process plan' },
    ],
    methodologyHeading: 'How a transaction engagement runs',
    methodology: method([
      'Clarify strategic intent and what the deal must achieve.',
      'Screen and assess opportunities against clear criteria.',
      'Structure the transaction around value and risk.',
      'Coordinate execution and integration to realise value.',
    ]),
    ctaQuestion: 'Discuss a transaction in confidence',
    industries: ['medical-devices-diagnostics', 'healthcare-digital-health', 'cosmetics-personal-care', 'consumer-health-wellness'],
    seo: { title: 'Healthcare Mergers and Acquisitions Advisory | Lexium', metaDescription: 'M&A advisory for healthcare and regulated consumer businesses: strategy, target screening, commercial and regulatory diligence, deals and integration.' },
  },

  // ───────────────────────── 07 Fundraising and IPO Advisory ─────────────────────────
  {
    number: '07',
    title: 'Fundraising and IPO Advisory',
    slug: 'fundraising-ipo-advisory',
    shortLabel: 'Fundraising and IPO Advisory',
    eyebrow: 'Fundraising and IPO Advisory',
    outcomeLine: 'build an investable and market-ready business',
    hero: {
      headline: 'Build the business investors want to back.',
      intro:
        'Investors back businesses with clear strategic choices, credible financials, sound governance and a compelling equity story. Lexium helps founders and promoters build each of these, prepare the materials investors expect, and run a structured process — from private fundraising to SME IPO readiness.',
      image: img('/images/financial-charts-screen-minimal', 'Minimal financial charts displayed on a screen', { x: 50, y: 50 }),
      variant: 'split',
    },
    clientQuestionStatement: 'Capital is an outcome of business readiness—not merely a pitch deck.',
    clientQuestionAccent: 'business readiness',
    tensionsHeading: 'Investors are asking harder questions.',
    tensions: [
      { title: 'Evidence over enthusiasm', body: 'Investors expect growth plans supported by market evidence and a model that reconciles revenue, cash and funding need.' },
      { title: 'Governance is scrutinised', body: 'Board, statutory and management controls are tested early, and gaps can slow or stop a process.' },
      { title: 'Diligence starts sooner', body: 'A structured data room and clear answers to likely questions shorten the path from interest to close.' },
    ],
    capabilities: [
      {
        title: 'Growth strategy',
        outcome: 'A growth thesis investors can believe in.',
        summary:
          'We sharpen the growth strategy behind the raise — where the business will grow, why it will win and what the capital will unlock. A clear, evidence-based thesis is the foundation of the equity story and the business plan, and helps investors understand the opportunity quickly.',
        deliverables: ['Growth thesis', 'Market evidence pack', 'Use of funds logic', 'Equity story outline'],
      },
      {
        title: 'Business plan',
        outcome: 'A plan that links strategy, milestones and capital.',
        summary:
          'We build or refine the business plan so it connects strategic choices with operational milestones, resourcing and funding needs. The plan is written for an investor audience, with clear assumptions and a realistic view of risks, and becomes the reference point for materials and diligence.',
        deliverables: ['Investor-grade business plan', 'Milestone and resourcing plan', 'Risk and mitigation view', 'Executive summary'],
      },
      {
        title: 'Financial model',
        outcome: 'A model that stands up to diligence.',
        summary:
          'We build or review a driver-based financial model that reconciles revenue drivers, margins, working capital, cash and funding need. The model is transparent and easy to test, so investors can explore scenarios and management can answer questions with confidence during the process.',
        deliverables: ['Driver-based financial model', 'Scenario and sensitivity analysis', 'Funding requirement analysis', 'Model guide'],
      },
      {
        title: 'Governance',
        outcome: 'Controls and structures investors expect.',
        summary:
          'We review board composition, statutory compliance, management controls and reporting, and help close the gaps investors are likely to raise. Strengthening governance before a process begins builds credibility with investors and reduces the risk of delays or conditions emerging late in diligence.',
        deliverables: ['Governance gap review', 'Board and committee recommendations', 'Controls and reporting improvements', 'Governance action plan'],
      },
      {
        title: 'Fundraise',
        outcome: 'A structured process with the right investors.',
        summary:
          'We help plan and run the fundraising process — investor targeting, outreach strategy, meetings, information flow and negotiation support — coordinating with SEBI-registered or otherwise licensed intermediaries wherever legally required. A structured process creates momentum and keeps leadership focused on running the business.',
        deliverables: ['Investor targeting', 'Process plan and timeline', 'Meeting and follow-up management', 'Term negotiation support'],
      },
      {
        title: 'Investor materials',
        outcome: 'Clear, consistent materials for every stage.',
        summary:
          'We prepare the materials investors use to assess the opportunity, from a short teaser to a full information memorandum, pitch deck, model and data-room index. Materials tell one consistent story, supported by evidence, and anticipate the questions investors and their advisers will ask.',
        deliverables: ['Teaser and pitch deck', 'Information memorandum', 'Data-room index', 'Management Q&A preparation'],
      },
      {
        title: 'SME IPO readiness',
        outcome: 'A business prepared for public markets.',
        summary:
          'For businesses considering an SME IPO, we assess readiness across strategy, financial reporting, governance and compliance, and build a plan to close gaps. We coordinate with merchant bankers and other licensed intermediaries, who lead the regulated aspects of any listing process.',
        deliverables: ['IPO readiness assessment', 'Readiness roadmap', 'Governance and reporting preparation', 'Intermediary coordination'],
      },
    ],
    customSections: [
      {
        type: 'diagnostic',
        key: 'investor-readiness-diagnostic',
        after: 'capabilities',
        eyebrow: 'Investor readiness diagnostic',
        heading: 'How ready is your business for investors?',
        intro: 'Five questions. Yes, Partly or No. See your result immediately.',
        copyOrigin: 'document',
      },
      {
        type: 'journey',
        key: 'capital-journey',
        after: 'capabilities',
        eyebrow: 'Capital journey',
        heading: 'From preparation to governance after the raise.',
        items: ['Prepare', 'Position', 'Engage', 'Diligence', 'Close', 'Govern'],
        copyOrigin: 'document',
      },
      {
        type: 'chips',
        key: 'investor-materials',
        after: 'engagements',
        eyebrow: 'Investor materials',
        heading: 'The materials investors expect.',
        items: ['Teaser', 'Information memorandum', 'Pitch deck', 'Financial model', 'Data-room index', 'Management Q&A'],
        copyOrigin: 'document',
      },
    ],
    engagements: [
      { title: 'Growth capital raise', situation: 'A founder-led business needs growth capital to expand capacity and markets.', role: 'Lexium sharpens the strategy, builds the model and materials, and supports the process.', resultType: 'Investor-ready materials and structured process' },
      { title: 'Investor readiness programme', situation: 'A company expects to raise within a year but has gaps in governance and reporting.', role: 'Lexium assesses readiness and leads a programme to close the gaps.', resultType: 'Readiness roadmap and improved governance' },
      { title: 'SME IPO preparation', situation: 'A promoter is considering an SME IPO and wants an objective readiness view.', role: 'Lexium assesses readiness and coordinates with licensed intermediaries.', resultType: 'IPO readiness assessment and plan' },
    ],
    methodologyHeading: 'How a capital engagement runs',
    methodology: method([
      'Clarify the capital need, timing and the investors to target.',
      'Strengthen the equity story, plan and model.',
      'Prepare materials, governance and the data room.',
      'Run the process and support governance after close.',
    ]),
    ctaQuestion: 'Assess your capital readiness',
    disclaimers: ['Lexium provides advisory support and coordinates with SEBI-registered or otherwise licensed intermediaries where legally required.'],
    industries: ['medical-devices-diagnostics', 'healthcare-digital-health', 'cosmetics-personal-care', 'food-nutrition-beverages', 'consumer-health-wellness'],
    seo: { title: 'Fundraising and SME IPO Readiness Advisory | Lexium', metaDescription: 'Fundraising and IPO advisory: growth strategy, business plan, financial model, governance, investor materials, data room and SME IPO readiness.' },
  },
];

/** Strings in drafted fields — used to set copyOrigin. Document-only fields are listed in seed.mjs. */
export const SERVICE_DOCUMENT_FIELDS = ['title', 'number', 'outcomeLine', 'hero.headline', 'clientQuestions', 'ctaQuestion'];
