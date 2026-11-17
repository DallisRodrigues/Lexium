// Pages, settings, regions, regulatory items, case journeys, people.
const img = (src, alt, focalPoint = { x: 50, y: 50 }) => ({ src, alt, decorative: false, focalPoint });
const SOURCE_DOC = 'Lexium — Website Information Architecture and Developer Wireframe (21 October 2026)';

export const POSITIONING =
  'Lexium helps ambitious healthcare and regulated consumer businesses move from opportunity to execution—through strategy, market entry, regulation, manufacturing, mergers and acquisitions, and capital advisory.';

// ─────────────────────────── Site settings ───────────────────────────
export const settings = {
  key: 'site',
  email: 'info@lexiumconsulting.com',
  website: 'www.lexiumconsulting.com',
  officeAddress: '', // CMS: approved office address — to be confirmed
  phone: '', // footer/contact only; never in primary navigation
  linkedin: '',
  positioningStatement: POSITIONING,
  footerPositioningLine: 'Helping ambitious healthcare and regulated consumer businesses move from opportunity to execution.',
  operatingRegions: ['India', 'Africa', 'MENA', 'CIS', 'South Asia', 'ASEAN', 'Latin America'],
  responseWindow: 'We aim to respond within two business days.',
  newsletterEnabled: false,
  heroVariants: [
    { label: 'Recommended', headline: 'Strategy to scale for healthcare and regulated consumer markets', note: 'Clear, broad and credible.' },
    { label: 'Alternative', headline: 'Turn regulated-market complexity into commercial advantage', note: 'More assertive and regulation-led.' },
    { label: 'Alternative', headline: 'Where strategy, regulation and capital converge', note: 'Shorter but more abstract.' },
  ],
  activeHeroVariant: 0,
  leadershipLine: 'Leadership experience: 30+ years of sector experience, 1000+ project exposure across 50+ countries.',
};

// ─────────────────────────── Pages ───────────────────────────
export const pages = [
  {
    key: 'home',
    path: '/',
    title: 'Home',
    hero: {
      headline: 'Strategy to scale for healthcare and regulated consumer markets',
      intro: 'Lexium connects market opportunity, regulatory pathways, manufacturing decisions, transactions and capital.',
      image: img('/images/home-minimal-architecture-daylight', 'Minimal white architecture in bright daylight', { x: 60, y: 50 }),
    },
    sections: [
      { type: 'chips', key: 'credentials', items: ['India expertise', 'Global market access', 'Regulatory depth', 'Manufacturing execution', 'Capital readiness'], copyOrigin: 'document' },
      {
        type: 'statement',
        key: 'tension',
        eyebrow: 'Why connected advice',
        data: {
          text: 'Growth in regulated markets is never one decision. Market entry, approvals, manufacturing, deals and capital shape each other — so they need to be decided together, not by isolated advisers.',
          accent: 'decided together',
        },
        copyOrigin: 'drafted',
      },
      {
        type: 'tabs',
        key: 'capabilities',
        eyebrow: 'Capabilities',
        heading: 'Six capabilities. One connected platform.',
        items: [
          { label: 'Strategy', services: ['strategy-consulting'], count: 4 },
          { label: 'Market Entry', services: ['india-market-entry', 'global-market-entry'], count: 5 },
          { label: 'Regulatory', services: ['regulatory-licences'], count: 5 },
          { label: 'Manufacturing', services: ['manufacturing-advisory'], count: 5 },
          { label: 'Mergers and Acquisitions', services: ['mergers-acquisitions'], count: 4 },
          { label: 'Fundraising and IPO Advisory', services: ['fundraising-ipo-advisory'], count: 5 },
        ],
        copyOrigin: 'document',
      },
      { type: 'cards', key: 'industries', heading: 'Deep sector focus across healthcare and regulated consumer markets.', copyOrigin: 'drafted' },
      {
        type: 'regionSelector',
        key: 'regions',
        heading: 'Grounded in India. Building growth across selected global markets.',
        intro: 'Select a region to see how Lexium supports market entry and expansion.',
        copyOrigin: 'drafted',
      },
      {
        type: 'process',
        key: 'how-we-work',
        heading: 'A clear path from ambition to execution.',
        items: [
          { title: 'Frame the ambition', body: 'Agree what success looks like and the decisions that matter most.' },
          { title: 'Find the advantage', body: 'Identify where the business can build a lasting edge.' },
          { title: 'Design the pathway', body: 'Connect markets, regulation, operations and capital into one plan.' },
          { title: 'Mobilise execution', body: 'Coordinate partners and teams to deliver results.' },
        ],
        copyOrigin: 'document',
      },
      { type: 'cards', key: 'insights', heading: 'Latest perspectives', copyOrigin: 'drafted' },
    ],
    cta: 'What could your next growth chapter look like?',
    seo: { title: 'Healthcare and Regulated Markets Consulting | Lexium', metaDescription: POSITIONING },
  },
  {
    key: 'services',
    path: '/services/',
    title: 'What We Do',
    hero: {
      headline: 'Decisions that move businesses forward.',
      intro: 'From growth strategy to funding, Lexium connects the choices required to enter, build and scale regulated businesses.',
    },
    sections: [
      {
        type: 'journey',
        key: 'model',
        heading: 'One connected advisory model.',
        intro: 'Each service stands on its own, and each connects to the next decision in the journey.',
        items: ['Decide', 'Enter', 'Comply', 'Build', 'Transact', 'Fund', 'Scale'],
        copyOrigin: 'document',
      },
      { type: 'cards', key: 'services', heading: 'Seven services, working as one platform.', copyOrigin: 'drafted' },
      {
        type: 'cards',
        key: 'journeys',
        heading: 'How the services connect in practice.',
        intro: 'Illustrative journeys showing the sequence of services typically involved. No client names or results are shown.',
        copyOrigin: 'drafted',
      },
    ],
    cta: 'Discuss the decision in front of you',
    seo: { title: 'Consulting Services for Regulated Markets | Lexium', metaDescription: 'Strategy, India and global market entry, regulatory and licences, manufacturing, M&A and fundraising — connected advisory for regulated businesses.' },
  },
  {
    key: 'industries',
    path: '/industries/',
    title: 'Industries',
    hero: {
      headline: 'Sector expertise where regulation, markets and capital converge.',
      intro: 'Lexium advises businesses across medical technology, healthcare and regulated consumer markets—from strategy and market entry to manufacturing, transactions and fundraising.',
    },
    sections: [
      {
        type: 'chips',
        key: 'themes',
        heading: 'Themes that cut across every sector we serve.',
        items: ['Localisation', 'Regulatory change', 'Digital models', 'Manufacturing resilience', 'Capital'],
        copyOrigin: 'document',
      },
    ],
    cta: 'Discuss your sector opportunity',
    seo: { title: 'Healthcare and Consumer Industries We Serve | Lexium', metaDescription: 'Medical devices and diagnostics, healthcare and digital health, cosmetics, food and nutrition, and consumer health — sector advisory from Lexium.' },
  },
  {
    key: 'insights',
    path: '/insights/',
    title: 'Insights',
    hero: {
      headline: 'Perspectives on growth in regulated markets.',
      intro: 'Analysis and viewpoints on strategy, market entry, regulation, manufacturing, transactions and capital.',
    },
    sections: [],
    seo: { title: 'Insights: Growth in Regulated Healthcare Markets | Lexium', metaDescription: 'Perspectives from Lexium on strategy, India and global markets, regulation, manufacturing, M&A and capital for healthcare and consumer businesses.' },
  },
  {
    key: 'about',
    path: '/about/',
    title: 'About Lexium',
    hero: {
      headline: 'Senior advice. Practical execution. Global ambition.',
      intro: 'Lexium is an integrated advisory firm for healthcare and regulated consumer businesses, combining senior judgement with hands-on delivery across strategy, markets, regulation, manufacturing, transactions and capital.',
      image: img('/images/modern-office-atrium-white', 'Bright modern office atrium with white surfaces', { x: 50, y: 50 }),
    },
    sections: [
      {
        type: 'blocks',
        key: 'firm',
        heading: 'Founded in 2018.',
        intro:
          'Lexium began by helping companies navigate regulatory approvals and enter new markets. Working closely with clients on those decisions showed that regulation, market access, manufacturing, transactions and capital are rarely separate questions.\n\nThe firm has since grown into an integrated advisory platform, so clients can work with one team from first strategic choice through to execution.',
        copyOrigin: 'drafted',
      },
      {
        type: 'cards',
        key: 'why',
        heading: 'Why clients choose Lexium.',
        items: [
          { title: 'Sector depth', body: 'Focused on healthcare and regulated consumer markets, where specialist knowledge matters.' },
          { title: 'Connected capabilities', body: 'Strategy, markets, regulation, manufacturing, deals and capital under one roof.' },
          { title: 'India advantage', body: 'Grounded in India, with experience of how the market and its regulators work.' },
          { title: 'Execution orientation', body: 'Advice designed to be implemented, with support through delivery.' },
        ],
        copyOrigin: 'document',
      },
      { type: 'cards', key: 'leadership', heading: 'Leadership', copyOrigin: 'drafted' },
      {
        type: 'regionSelector',
        key: 'global',
        heading: 'Experience across India and selected global markets.',
        intro: 'Regional experience reflects the prior careers and leadership experience of the Lexium team, and is described here without implying local offices.',
        copyOrigin: 'drafted',
      },
      {
        type: 'cards',
        key: 'values',
        heading: 'The values behind our work.',
        items: [
          { title: 'Clarity', body: 'Plain answers to complex questions.' },
          { title: 'Integrity', body: 'Honest advice, held in confidence.' },
          { title: 'Evidence', body: 'Recommendations grounded in facts and sources.' },
          { title: 'Ownership', body: 'We stay accountable for what we help deliver.' },
        ],
        copyOrigin: 'document',
      },
      { type: 'cards', key: 'cta', heading: 'Work with Lexium', copyOrigin: 'document' },
    ],
    cta: 'Work with Lexium',
    seo: { title: 'About Lexium Consulting — Founded in 2018 | Lexium', metaDescription: 'Lexium is an integrated advisory firm for healthcare and regulated consumer businesses: senior advice, practical execution and global ambition.' },
  },
  {
    key: 'contact',
    path: '/contact/',
    title: 'Contact',
    hero: {
      headline: 'Tell us the decision or opportunity you are working through.',
      intro: 'Share a few details and the right member of the Lexium team will respond.',
    },
    sections: [],
    seo: { title: 'Contact Lexium — Discuss Your Growth Ambition | Lexium', metaDescription: 'Tell us the decision or opportunity you are working through. Contact Lexium about strategy, market entry, regulation, manufacturing, M&A or capital.' },
  },
  {
    key: 'privacy',
    path: '/privacy/',
    title: 'Privacy notice',
    legalPlaceholder: true,
    hero: { headline: 'Privacy notice' },
    sections: [
      { type: 'blocks', key: 'what', heading: 'What we collect', intro: 'When you submit an enquiry we collect your name, company, work email, optional phone number, country, industry, service interest and message. If you choose to receive your investor readiness summary by email, we collect your email address.' },
      { type: 'blocks', key: 'why', heading: 'Why we collect it', intro: 'We use this information only to respond to your enquiry and route it to the right member of our team. We do not sell personal data.' },
      { type: 'blocks', key: 'analytics', heading: 'Analytics and cookies', intro: 'Essential cookies keep the site secure and remember your consent choice. Anonymous, first-party analytics run only if you accept them, and never include message text or diagnostic answers. You can change your choice at any time from the footer.' },
      { type: 'blocks', key: 'rights', heading: 'Your rights', intro: 'You can ask to access, correct or delete your personal data by emailing info@lexiumconsulting.com.' },
    ],
    seo: { title: 'Privacy Notice, Cookies and Your Data Rights | Lexium', metaDescription: 'How Lexium Consulting collects, uses and protects personal data submitted through this website, including enquiries, analytics consent and your rights.', noindex: false },
  },
  {
    key: 'terms',
    path: '/terms/',
    title: 'Terms of use',
    legalPlaceholder: true,
    hero: { headline: 'Terms of use' },
    sections: [
      { type: 'blocks', key: 'info', heading: 'General information only', intro: 'Content on this website is general information. It is not legal, regulatory, financial or investment advice, and it is not a regulatory determination. Speak with Lexium about your specific circumstances.' },
      { type: 'blocks', key: 'ip', heading: 'Intellectual property', intro: 'Content on this website belongs to Lexium Consulting unless otherwise stated. Photographs are used under their respective licences.' },
      { type: 'blocks', key: 'liability', heading: 'Liability', intro: 'Lexium Consulting takes care to keep this website accurate but does not guarantee that it is complete or current.' },
    ],
    seo: { title: 'Terms of Use for the Lexium Consulting Website | Lexium', metaDescription: 'Terms governing use of the Lexium Consulting website, including the general-information nature of content, intellectual property and liability.' },
  },
];

// ─────────────────────────── Regions ───────────────────────────
const EU = ['040', '056', '100', '191', '196', '203', '208', '233', '246', '250', '276', '300', '348', '372', '380', '428', '440', '442', '470', '528', '616', '620', '642', '703', '705', '724', '752'];
export const regions = [
  {
    name: 'India', slug: 'india', contexts: ['home'], order: 1, contactRoute: '/services/india-market-entry/', mapCodes: ['356'],
    overview: 'Lexium’s home market. We help international manufacturers, brands and investors enter India, and help Indian businesses build the platform for growth at home and abroad.',
    capabilities: ['Market entry', 'Authorised agent', 'Licensing', 'Local manufacturing', 'Partnerships'],
  },
  {
    name: 'Africa', slug: 'africa', contexts: ['home', 'global'], order: 2, contactRoute: '/services/global-market-entry/',
    mapCodes: ['024', '072', '108', '120', '140', '148', '178', '180', '204', '226', '231', '232', '262', '266', '270', '288', '324', '384', '404', '426', '430', '450', '454', '466', '478', '508', '516', '562', '566', '624', '646', '686', '694', '706', '710', '716', '728', '729', '732', '748', '768', '800', '834', '854', '894'],
    overview: 'Market prioritisation, regulatory routes and distributor partnerships for businesses expanding into selected African markets.',
    capabilities: ['Market prioritisation', 'Regulatory route', 'Distributor search'],
  },
  {
    name: 'MENA', slug: 'mena', contexts: ['home', 'global'], order: 3, contactRoute: '/services/global-market-entry/',
    mapCodes: ['012', '048', '275', '364', '368', '376', '400', '414', '422', '434', '504', '512', '634', '682', '760', '784', '788', '818', '887'],
    overview: 'Support for entering Middle East and North African markets, including regulatory registration and partner selection.',
    capabilities: ['Country screening', 'Regulatory route', 'Partner due diligence'],
  },
  {
    name: 'CIS', slug: 'cis', contexts: ['home', 'global'], order: 4, contactRoute: '/services/global-market-entry/',
    mapCodes: ['031', '051', '112', '398', '417', '498', '643', '762', '795', '860'],
    overview: 'Market assessment and partner-led entry for businesses considering selected CIS markets.',
    capabilities: ['Market prioritisation', 'Distributor search', 'Commercial launch'],
  },
  {
    name: 'South Asia', slug: 'south-asia', contexts: ['home', 'global'], order: 5, contactRoute: '/services/global-market-entry/',
    mapCodes: ['004', '050', '064', '144', '462', '524', '586'],
    overview: 'Regional expansion across neighbouring South Asian markets, building on experience in India.',
    capabilities: ['Country screening', 'Regulatory route', 'Distributor search'],
  },
  {
    name: 'ASEAN', slug: 'asean', contexts: ['global'], order: 6, contactRoute: '/services/global-market-entry/',
    mapCodes: ['096', '104', '116', '360', '418', '458', '608', '702', '704', '764'],
    overview: 'Market prioritisation and partner-led entry across selected Southeast Asian markets.',
    capabilities: ['Market prioritisation', 'Regulatory route', 'Localisation'],
  },
  {
    name: 'Latin America', slug: 'latin-america', contexts: ['global'], order: 7, contactRoute: '/services/global-market-entry/',
    mapCodes: ['032', '068', '076', '152', '170', '188', '192', '214', '218', '222', '320', '332', '340', '484', '558', '591', '600', '604', '858', '862'],
    overview: 'Regulatory routes, partner search and launch planning for selected Latin American markets.',
    capabilities: ['Regulatory route', 'Distributor search', 'Commercial launch'],
  },
  {
    name: 'selected global markets', slug: 'selected-global-markets', contexts: ['home'], order: 8, contactRoute: '/services/global-market-entry/',
    mapCodes: ['840', '826', '124', '036', ...EU],
    overview: 'Regulatory pathway and market entry support for selected established markets, including the European Union, United States, United Kingdom, Canada and Australia.',
    capabilities: ['Regulatory route', 'Partner search', 'Market entry'],
  },
];

// ─────────────────────────── Regulatory items ───────────────────────────
const REG_PAGES = ['regulatory-licences'];
const reg = (o) => ({ pages: REG_PAGES, verificationRequired: true, claimSource: 'To be verified by the Lexium regulatory lead against current regulations', ...o });

export const regulatoryItems = [
  // Pathway selector (8 jurisdictions)
  reg({ group: 'pathway', order: 1, jurisdiction: 'India', topic: 'CDSCO and the Medical Devices Rules', summary: 'Medical devices and IVDs are regulated by the Central Drugs Standard Control Organisation under the Medical Devices Rules, 2017, using a risk-based classification from Class A to Class D.', detail: 'Lower-risk manufacturing licences are generally handled by State Licensing Authorities and higher-risk licences by the Central Licensing Authority. Overseas manufacturers typically act through an Indian authorised agent who holds the import licence.\n\nTimelines depend on authority review, product complexity and document readiness.' }),
  reg({ group: 'pathway', order: 2, jurisdiction: 'European Union', topic: 'EU MDR and IVDR', summary: 'Devices are placed on the market under Regulation (EU) 2017/745 (MDR) or 2017/746 (IVDR), with CE marking following conformity assessment.', detail: 'Most devices above the lowest risk class require assessment by a notified body. Manufacturers outside the EU appoint an EU authorised representative. Technical documentation, clinical evaluation and post-market surveillance are central to the route.' }),
  reg({ group: 'pathway', order: 3, jurisdiction: 'United States', topic: 'US FDA device pathways', summary: 'The US Food and Drug Administration regulates devices by risk class, with common routes including 510(k) premarket notification, De Novo classification and premarket approval.', detail: 'Establishments register with FDA and list their devices. Quality system requirements apply to manufacturers, and a US agent is required for foreign establishments.' }),
  reg({ group: 'pathway', order: 4, jurisdiction: 'United Kingdom', topic: 'MHRA and UK market access', summary: 'The Medicines and Healthcare products Regulatory Agency regulates devices placed on the Great Britain market, with UKCA marking and transitional recognition of CE marking.', detail: 'Manufacturers outside the UK appoint a UK Responsible Person and register devices with the MHRA. Northern Ireland follows EU rules.' }),
  reg({ group: 'pathway', order: 5, jurisdiction: 'Brazil', topic: 'ANVISA notification and registration', summary: 'ANVISA regulates devices in Brazil using risk classes I to IV, with notification for lower-risk products and registration for higher-risk products.', detail: 'Foreign manufacturers act through a Brazilian registration holder. Higher-risk devices typically require Brazilian Good Manufacturing Practice certification, and some electrical equipment requires additional conformity certification.' }),
  reg({ group: 'pathway', order: 6, jurisdiction: 'Australia', topic: 'TGA and the ARTG', summary: 'The Therapeutic Goods Administration requires most devices to be included in the Australian Register of Therapeutic Goods before supply.', detail: 'An Australian sponsor applies for inclusion. Evidence of conformity assessment, including comparable overseas approvals in some cases, supports the application.' }),
  reg({ group: 'pathway', order: 7, jurisdiction: 'Canada', topic: 'Health Canada device licensing', summary: 'Health Canada classifies devices from Class I to Class IV. Class II to IV devices require a Medical Device Licence; Class I devices are typically sold under an establishment licence.', detail: 'Quality management system certification under the Medical Device Single Audit Program is generally required for Class II to IV licences.' }),
  reg({ group: 'pathway', order: 8, jurisdiction: 'Saudi Arabia', topic: 'SFDA marketing authorisation', summary: 'The Saudi Food and Drug Authority requires a medical device marketing authorisation before devices are placed on the Saudi market.', detail: 'Foreign manufacturers appoint a Saudi authorised representative. Approvals from recognised reference jurisdictions can support the application.' }),

  // India licence navigator — form numbers only inside the expandable detail
  reg({ group: 'licence', order: 1, anchor: 'licence-manufacture', jurisdiction: 'India', topic: 'Manufacture', summary: 'A manufacturing licence is required to manufacture medical devices for sale or distribution in India. The licensing authority depends on the device risk class.', detail: 'Class A and B: application on Form MD-3 to the State Licensing Authority; licence granted on Form MD-5.\n\nClass C and D: application on Form MD-7 to the Central Licensing Authority; licence granted on Form MD-9.\n\nA quality management system and audit are part of the process.' }),
  reg({ group: 'licence', order: 2, anchor: 'licence-import', jurisdiction: 'India', topic: 'Import', summary: 'An import licence is required to import medical devices for sale or distribution. It is usually held by the Indian authorised agent of the overseas manufacturer.', detail: 'Application on Form MD-14 to the Central Licensing Authority; licence granted on Form MD-15.' }),
  reg({ group: 'licence', order: 3, anchor: 'licence-test', jurisdiction: 'India', topic: 'Test or evaluation', summary: 'A test licence allows devices to be manufactured or imported in small quantities for testing, evaluation, clinical investigation, demonstration or training.', detail: 'Manufacture for test or evaluation: application on Form MD-12; licence on Form MD-13.\n\nImport for test or evaluation: application on Form MD-16; licence on Form MD-17.' }),
  reg({ group: 'licence', order: 4, anchor: 'licence-clinical', jurisdiction: 'India', topic: 'Clinical investigation', summary: 'Permission is required to conduct a clinical investigation of an investigational medical device in India.', detail: 'Application on Form MD-22 to the Central Licensing Authority; permission granted on Form MD-23. Ethics committee approval and registration requirements also apply.' }),
  reg({ group: 'licence', order: 5, anchor: 'licence-authorised-agent', jurisdiction: 'India', topic: 'Authorised agent', summary: 'Overseas manufacturers appoint an authorised agent in India, who holds the import licence and acts as the local point of regulatory responsibility.', detail: 'The authorised agent is appointed through a power of attorney and takes on obligations including post-market responsibilities. Clear agreements between the manufacturer, agent and distributors are essential.' }),

  // FAQ (deep-linkable)
  reg({ group: 'faq', order: 1, anchor: 'faq-timelines', jurisdiction: 'General', topic: 'How long does approval take?', summary: 'Timelines depend on authority review, product complexity and document readiness. We do not promise absolute timelines.', detail: 'We build a dependency-based plan that shows the steps within your control — such as testing, documentation and quality system readiness — and the steps that depend on the authority.' }),
  reg({ group: 'faq', order: 2, anchor: 'faq-applicant', jurisdiction: 'General', topic: 'Who is responsible as the applicant?', summary: 'The applicant — usually the manufacturer or its authorised agent — is legally responsible for the application and for ongoing compliance.', detail: 'Lexium supports the applicant with strategy, documentation and coordination. Legal responsibility for the licence remains with the licence holder.' }),
  reg({ group: 'faq', order: 3, anchor: 'faq-fees', jurisdiction: 'General', topic: 'What about government fees?', summary: 'Government fees are set by each authority and are payable by the applicant. They are separate from Lexium’s professional fees.', detail: 'Professional fees are separate from government, testing, certification body and out-of-pocket costs. Our proposals set these out clearly.' }),
  reg({ group: 'faq', order: 4, anchor: 'faq-testing', jurisdiction: 'General', topic: 'What testing and evidence will we need?', summary: 'Evidence requirements depend on the device, its risk class and the target market, and may include performance testing, biocompatibility, electrical safety, software validation and clinical data.', detail: 'A gap assessment early in the project identifies what exists, what is missing and how long it will take to obtain.' }),

  // Food regulatory context (industry page)
  reg({ pages: ['food-nutrition-beverages'], group: 'context', order: 1, anchor: 'context-fssai', jurisdiction: 'India', topic: 'FSSAI licensing and product categories', summary: 'Food businesses in India are licensed or registered by the Food Safety and Standards Authority of India, and products must fit a defined category or obtain approval as a non-specified food or ingredient.', detail: 'Health supplements, nutraceuticals and foods for special dietary or medical purposes are governed by dedicated regulations, which set requirements for ingredients, permitted levels and labelling.' }),
  reg({ pages: ['food-nutrition-beverages'], group: 'context', order: 2, anchor: 'context-claims', jurisdiction: 'India', topic: 'Claims, ingredients and labels', summary: 'Nutrition and health claims, ingredient use and labelling must meet FSSAI requirements, including rules on advertising and claims and on labelling and display.', detail: 'Claims need to be supported by evidence and expressed within permitted wording. Labels must carry the mandatory declarations required for the product category.' }),
  reg({ pages: ['food-nutrition-beverages'], group: 'context', order: 3, anchor: 'context-international', jurisdiction: 'International', topic: 'International pathways', summary: 'Export markets apply their own rules for categories, novel ingredients, claims and labels. Requirements in the European Union, United States and GCC differ materially.', detail: 'We map the route for each target market and coordinate with in-country specialists where local registration or representation is required.' }),
].map((r) => ({ ...r, reviewedDate: new Date('2026-11-17'), disclaimer: 'Website content is general information and not a regulatory determination.' }));

// ─────────────────────────── Case journeys ───────────────────────────
export const journeys = [
  { title: 'Global manufacturer entering India', situation: 'An international manufacturer wants to sell in India and later localise production.', sequence: ['india-market-entry', 'regulatory-licences', 'manufacturing-advisory'] },
  { title: 'Indian company going global', situation: 'An Indian business wants to grow exports and establish in priority markets.', sequence: ['strategy-consulting', 'global-market-entry', 'regulatory-licences', 'mergers-acquisitions'] },
  { title: 'Founder preparing to raise capital', situation: 'A founder-led business needs a sharper strategy and investor-ready foundations before raising.', sequence: ['strategy-consulting', 'fundraising-ipo-advisory'] },
];

// ─────────────────────────── People ───────────────────────────
export const people = [
  {
    name: 'Founder — name to be confirmed',
    role: 'Founder, Lexium Consulting',
    isFounder: true,
    biography: 'Professional profile to be supplied by Lexium. The founder leads the firm’s work across strategy, regulated markets, manufacturing, transactions and capital, drawing on long experience in the sector.',
    expertise: ['Medical devices and diagnostics', 'Regulatory strategy', 'Market entry', 'Manufacturing', 'Transactions and capital'],
    experienceClaims: [
      { text: '30+ years of sector experience', claimOwner: 'Lexium leadership', source: SOURCE_DOC },
      { text: '1000+ project exposure across 50+ countries', claimOwner: 'Lexium leadership', source: SOURCE_DOC },
    ],
    verificationRequired: true,
    claimOwner: 'Lexium leadership',
    claimSource: SOURCE_DOC,
  },
];
