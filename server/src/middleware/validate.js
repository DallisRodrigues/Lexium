import sanitizeHtml from 'sanitize-html';

export const clean = (s) => sanitizeHtml(String(s ?? ''), { allowedTags: [], allowedAttributes: {} }).trim();

export const validate = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({
      error: 'Please check the highlighted fields.',
      fields: Object.fromEntries(parsed.error.issues.map((i) => [i.path.join('.'), i.message])),
    });
  }
  req.valid = parsed.data;
  next();
};

export const ARTICLE_HTML = {
  allowedTags: ['h2', 'h3', 'h4', 'p', 'br', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'blockquote', 'figure', 'figcaption', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'code'],
  allowedAttributes: { a: ['href', 'rel', 'target'], img: ['src', 'alt', 'width', 'height', 'loading'] },
  allowedSchemes: ['https', 'mailto'],
  allowedSchemesAppliedToAttributes: ['href'],
  transformTags: { a: sanitizeHtml.simpleTransform('a', { rel: 'noopener' }) },
};
