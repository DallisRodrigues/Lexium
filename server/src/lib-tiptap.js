/** Minimal TipTap/ProseMirror JSON → HTML renderer (output is sanitised afterwards). */
const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function marks(text, list = []) {
  return list.reduce((t, m) => {
    if (m.type === 'bold') return `<strong>${t}</strong>`;
    if (m.type === 'italic') return `<em>${t}</em>`;
    if (m.type === 'code') return `<code>${t}</code>`;
    if (m.type === 'link') return `<a href="${esc(m.attrs?.href)}">${t}</a>`;
    return t;
  }, esc(text));
}

export function tiptapToHtml(node) {
  if (!node) return '';
  if (typeof node === 'string') return node;
  const kids = () => (node.content || []).map(tiptapToHtml).join('');
  switch (node.type) {
    case 'doc': return kids();
    case 'paragraph': return `<p>${kids()}</p>`;
    case 'heading': { const l = Math.min(Math.max(node.attrs?.level || 2, 2), 4); return `<h${l}>${kids()}</h${l}>`; }
    case 'text': return marks(node.text, node.marks);
    case 'bulletList': return `<ul>${kids()}</ul>`;
    case 'orderedList': return `<ol>${kids()}</ol>`;
    case 'listItem': return `<li>${kids()}</li>`;
    case 'blockquote': return `<blockquote>${kids()}</blockquote>`;
    case 'hardBreak': return '<br>';
    case 'horizontalRule': return '<hr>';
    case 'image': return `<img src="${esc(node.attrs?.src)}" alt="${esc(node.attrs?.alt || '')}" loading="lazy">`;
    default: return kids();
  }
}
