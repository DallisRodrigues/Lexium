import mongoose from 'mongoose';

const { Schema } = mongoose;

export const SeoSchema = new Schema(
  {
    title: { type: String, default: '' }, // 50–60 chars; service/industry first, Lexium second
    metaDescription: { type: String, default: '' }, // 140–160 chars
    canonical: { type: String, default: '' },
    ogImage: { type: String, default: '' },
    noindex: { type: Boolean, default: false },
  },
  { _id: false },
);

export const ImageSchema = new Schema(
  {
    src: { type: String, default: '' },
    alt: { type: String, default: '' },
    decorative: { type: Boolean, default: false },
    focalPoint: { x: { type: Number, default: 50 }, y: { type: Number, default: 50 } },
    credit: { type: String, default: '' },
    width: Number,
    height: Number,
    widths: [Number],
    placeholder: String,
    mobileSrc: String,
  },
  { _id: false },
);

ImageSchema.pre('validate', function () {
  if (this.src && !this.decorative && !this.alt) {
    this.invalidate('alt', 'Alternative text is required unless the image is marked decorative.');
  }
});

/** Workflow + audit fields shared by every content model. */
export const workflowFields = {
  status: {
    type: String,
    enum: ['draft', 'review', 'published', 'scheduled', 'archived'],
    default: 'draft',
    index: true,
  },
  approver: { type: Schema.Types.ObjectId, ref: 'User' },
  approverName: String,
  approvedAt: Date,
  publishAt: Date,
  copyOrigin: { type: String, enum: ['document', 'drafted'], default: 'drafted' },
  verificationRequired: { type: Boolean, default: false },
  claimOwner: String,
  claimSource: String,
  seo: { type: SeoSchema, default: () => ({}) },
  history: [
    {
      _id: false,
      action: String,
      by: String,
      at: { type: Date, default: Date.now },
      note: String,
    },
  ],
  createdBy: String,
  updatedBy: String,
};

/** Typed custom block for page-specific modules (stored in customSections[]). */
export const CustomSectionSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        'statement',
        'chips',
        'journey',
        'process',
        'matrix',
        'documentStack',
        'regionSelector',
        'pathwaySelector',
        'accordion',
        'faq',
        'diagnostic',
        'cards',
        'blocks',
        'tabs',
        'disclaimer',
        'decisionModel',
        'regulatoryContext',
        'geometric',
      ],
    },
    key: String,
    eyebrow: String,
    heading: String,
    intro: String,
    items: [Schema.Types.Mixed],
    data: Schema.Types.Mixed,
    after: String, // which core section this module follows (e.g. 'capabilities')
    copyOrigin: { type: String, enum: ['document', 'drafted'], default: 'document' },
  },
  { _id: false },
);

/** Word counting used by CMS content-limit validation (§5.6). */
export const wordCount = (s = '') => (String(s).trim().match(/\S+/g) || []).length;

export const LIMITS = {
  heroHeadline: 12,
  heroIntro: 70,
  heroIntroMobile: 55,
  capabilitySummary: [40, 60],
  capabilitySummaryMobile: [35, 45],
  cardTitle: 6,
  cardBody: 35,
  cardBodyMobile: 30,
};

/**
 * Statuses visible on the public site. In local preview (CONTENT_PREVIEW=true) items awaiting
 * approval ('review') are shown with a preview ribbon; in production only 'published' is served.
 */
export const isPreview = () => process.env.CONTENT_PREVIEW === 'true';
export const visibleFilter = () => ({ status: { $in: isPreview() ? ['published', 'review'] : ['published'] } });
