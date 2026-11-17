import mongoose from 'mongoose';
import { ImageSchema, workflowFields, CustomSectionSchema } from './shared.js';

const { Schema, model } = mongoose;
const ref = (name) => [{ type: Schema.Types.ObjectId, ref: name }];

const HeroSchema = new Schema(
  {
    eyebrow: String,
    headline: String,
    intro: String,
    introMobile: String,
    audience: String,
    image: { type: ImageSchema, default: () => ({}) },
    variant: { type: String, enum: ['light', 'dark', 'split'], default: 'split' },
  },
  { _id: false },
);

const CapabilitySchema = new Schema(
  {
    title: String,
    outcome: String,
    summary: String,
    summaryMobile: String,
    deliverables: [String],
  },
  { _id: false },
);

const TensionSchema = new Schema(
  { title: String, body: String, figure: String, source: String, sourceDate: String },
  { _id: false },
);

const EngagementSchema = new Schema({ title: String, situation: String, role: String, resultType: String }, { _id: false });
const StepSchema = new Schema({ title: String, body: String }, { _id: false });

// ---------- Service ----------
const ServiceSchema = new Schema(
  {
    number: { type: String, required: true }, // '01'..'07'
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    eyebrow: String,
    shortLabel: String, // used for home capability tab label
    hero: { type: HeroSchema, default: () => ({}) },
    outcomeLine: String,
    threeCapabilities: [String],
    clientQuestions: [String],
    clientQuestionStatement: String,
    tensionsHeading: String,
    tensions: [TensionSchema],
    capabilities: [CapabilitySchema],
    customSections: [CustomSectionSchema],
    methodology: [StepSchema],
    methodologyHeading: String,
    engagements: [EngagementSchema],
    ctaQuestion: String,
    disclaimers: [String],
    nexiomReferralApproved: { type: Boolean, default: false, select: false },
    industries: ref('Industry'),
    insights: ref('Insight'),
    people: ref('Person'),
    ...workflowFields,
  },
  { timestamps: true },
);

// ---------- Industry ----------
const IndustrySchema = new Schema(
  {
    number: String,
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    order: { type: Number, default: 0 },
    isAnchor: { type: Boolean, default: false },
    hero: { type: HeroSchema, default: () => ({}) },
    proposition: String,
    positioning: String,
    tensionStatement: String,
    tensions: [TensionSchema],
    subsectors: [String],
    clientTypes: [String],
    decisions: [String],
    clientQuestions: [String],
    capabilityModules: [{ _id: false, title: String, body: String, service: String }],
    challenges: [{ _id: false, title: String, body: String }],
    approach: [StepSchema],
    customSections: [CustomSectionSchema],
    cta: String,
    services: ref('Service'),
    insights: ref('Insight'),
    ...workflowFields,
  },
  { timestamps: true },
);

// ---------- Person ----------
const PersonSchema = new Schema(
  {
    name: String,
    role: String,
    biography: String,
    image: { type: ImageSchema, default: () => ({}) },
    linkedin: String,
    expertise: [String],
    experienceClaims: [{ _id: false, text: String, claimOwner: String, source: String }],
    isFounder: { type: Boolean, default: false },
    insights: ref('Insight'),
    services: ref('Service'),
    ...workflowFields,
  },
  { timestamps: true },
);

// ---------- Insight ----------
const InsightSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ['Strategy', 'Markets', 'Regulation', 'Manufacturing', 'M&A', 'Capital', 'Industry'],
      required: true,
    },
    type: {
      type: String,
      enum: ['Article', 'Market perspective', 'Regulatory update', 'Founder viewpoint'],
      default: 'Article',
    },
    standfirst: String,
    author: { type: Schema.Types.ObjectId, ref: 'Person' },
    date: { type: Date, default: Date.now },
    body: Schema.Types.Mixed, // TipTap JSON
    bodyHtml: String, // sanitised HTML rendered from body
    keyTakeaways: [String],
    image: { type: ImageSchema, default: () => ({}) },
    sources: [{ _id: false, label: String, url: String, date: String }],
    readingTime: Number,
    featured: { type: Boolean, default: false },
    services: ref('Service'),
    industries: ref('Industry'),
    ...workflowFields,
  },
  { timestamps: true },
);

// ---------- Region ----------
const RegionSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: String,
    contexts: [String], // 'home' and/or 'global' — where the region appears
    order: Number,
    overview: String,
    capabilities: [String],
    regionStatus: { type: String, enum: ['active', 'hidden'], default: 'active' },
    contactRoute: String, // '/services/india-market-entry/' etc.
    mapCodes: [String], // ISO numeric codes in world-atlas
    services: ref('Service'),
    insights: ref('Insight'),
    ...workflowFields,
  },
  { timestamps: true },
);

// ---------- Regulatory item ----------
const RegulatoryItemSchema = new Schema(
  {
    jurisdiction: { type: String, required: true },
    topic: { type: String, required: true },
    group: { type: String, enum: ['pathway', 'licence', 'faq', 'context'], default: 'pathway' },
    anchor: String,
    order: Number,
    summary: String,
    detail: String, // expandable; form numbers live here only
    reviewedDate: { type: Date, required: [true, 'Regulatory content requires a reviewed date.'] },
    disclaimer: {
      type: String,
      default: 'Website content is general information and not a regulatory determination.',
    },
    pages: [String],
    insights: ref('Insight'),
    ...workflowFields,
  },
  { timestamps: true },
);

// ---------- Case journey ----------
const CaseJourneySchema = new Schema(
  {
    title: String,
    situation: String,
    lexiumRole: String,
    resultType: String,
    sequence: [String], // service slugs in order
    approvalStatus: { type: String, enum: ['pending', 'approved'], default: 'pending' },
    services: ref('Service'),
    industries: ref('Industry'),
    ...workflowFields,
  },
  { timestamps: true },
);

// ---------- Enquiry ----------
const EnquirySchema = new Schema(
  {
    name: String,
    company: String,
    workEmail: String,
    phone: String,
    country: String,
    industry: String,
    serviceInterest: String,
    message: String,
    consent: Boolean,
    routedTo: String,
    routedOwner: String,
    crmTag: { type: String, index: true },
    sourcePage: String,
    utm: Schema.Types.Mixed,
    sessionId: String,
    mailStatus: String,
  },
  { timestamps: true },
);

// ---------- Diagnostic result ----------
const DiagnosticResultSchema = new Schema(
  {
    answers: { type: Schema.Types.Mixed, select: false },
    score: Number,
    band: String,
    email: String,
    emailConsent: Boolean,
    sourcePage: String,
    sessionId: String,
  },
  { timestamps: true },
);

// ---------- Analytics event ----------
const EventSchema = new Schema({
  name: { type: String, index: true },
  params: Schema.Types.Mixed,
  page: String,
  sessionId: String,
  ts: { type: Date, default: Date.now },
});

// ---------- Redirect ----------
const RedirectSchema = new Schema(
  {
    from: { type: String, required: true, unique: true },
    to: { type: String, required: true },
    code: { type: Number, enum: [301, 302], default: 301 },
    auto: Boolean,
  },
  { timestamps: true },
);

// ---------- Site settings (singleton) ----------
const SiteSettingsSchema = new Schema(
  {
    key: { type: String, default: 'site', unique: true },
    email: String,
    website: String,
    officeAddress: String,
    phone: String,
    linkedin: String,
    footerPositioningLine: String,
    positioningStatement: String,
    operatingRegions: [String],
    responseWindow: String,
    newsletterEnabled: { type: Boolean, default: false },
    heroVariants: [{ _id: false, headline: String, note: String, label: String }],
    activeHeroVariant: { type: Number, default: 0 },
    homeTension: String,
    homeTensionAccent: String,
    leadershipLine: String,
    routing: [{ _id: false, selection: String, owner: String, crmTag: String, envKey: String }],
    serviceRouting: Schema.Types.Mixed, // service interest -> routing selection
    updatedBy: String,
  },
  { timestamps: true },
);

// ---------- User ----------
const UserSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true, lowercase: true },
    passwordHash: { type: String, select: false },
    role: { type: String, enum: ['editor', 'approver', 'admin'], default: 'editor' },
  },
  { timestamps: true },
);

// ---------- Page (Home, hubs, About, Contact, legal) ----------
const PageSchema = new Schema(
  {
    key: { type: String, required: true, unique: true }, // home, services, industries, insights, about, contact, privacy, terms
    path: String,
    title: String,
    hero: { type: HeroSchema, default: () => ({}) },
    sections: [CustomSectionSchema],
    cta: String,
    legalPlaceholder: Boolean,
    ...workflowFields,
  },
  { timestamps: true },
);

export const Service = model('Service', ServiceSchema);
export const Industry = model('Industry', IndustrySchema);
export const Person = model('Person', PersonSchema);
export const Insight = model('Insight', InsightSchema);
export const Region = model('Region', RegionSchema);
export const RegulatoryItem = model('RegulatoryItem', RegulatoryItemSchema);
export const CaseJourney = model('CaseJourney', CaseJourneySchema);
export const Enquiry = model('Enquiry', EnquirySchema);
export const DiagnosticResult = model('DiagnosticResult', DiagnosticResultSchema);
export const Event = model('Event', EventSchema);
export const Redirect = model('Redirect', RedirectSchema);
export const SiteSettings = model('SiteSettings', SiteSettingsSchema);
export const User = model('User', UserSchema);
export const Page = model('Page', PageSchema);

/** Models exposed through the generic admin CRUD API. */
export const CONTENT_MODELS = {
  services: Service,
  industries: Industry,
  people: Person,
  insights: Insight,
  regions: Region,
  regulatory: RegulatoryItem,
  journeys: CaseJourney,
  pages: Page,
};
