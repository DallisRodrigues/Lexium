const csrf = () => document.cookie.match(/(?:^|; )lx_csrf=([^;]+)/)?.[1] || '';

export class ApiError extends Error {
  constructor(status, body) {
    super(body?.error || `Request failed (${status})`);
    this.status = status;
    this.body = body;
  }
}

export async function api(path, { method = 'GET', body, headers = {}, raw } = {}) {
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
  const res = await fetch(`/api${path}`, {
    method,
    credentials: 'same-origin',
    headers: {
      ...(body && !isForm ? { 'Content-Type': 'application/json' } : {}),
      ...(method !== 'GET' ? { 'X-CSRF-Token': csrf() } : {}),
      ...headers,
    },
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });
  if (raw) return res;
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, data);
  return data;
}

/** Query-key factory used across pages (and by the prerenderer's dehydrated state). */
export const q = {
  nav: () => ({ queryKey: ['nav'], queryFn: () => api('/nav') }),
  settings: () => ({ queryKey: ['settings'], queryFn: () => api('/settings') }),
  page: (key) => ({ queryKey: ['page', key], queryFn: () => api(`/pages/${key}`) }),
  services: () => ({ queryKey: ['services'], queryFn: () => api('/services') }),
  service: (slug) => ({ queryKey: ['service', slug], queryFn: () => api(`/services/${slug}`) }),
  industries: () => ({ queryKey: ['industries'], queryFn: () => api('/industries') }),
  industry: (slug) => ({ queryKey: ['industry', slug], queryFn: () => api(`/industries/${slug}`) }),
  insights: (category = 'All', page = 1, limit = 9) => ({
    queryKey: ['insights', category, page, limit],
    queryFn: () => api(`/insights?category=${encodeURIComponent(category)}&page=${page}&limit=${limit}`),
  }),
  insight: (slug) => ({ queryKey: ['insight', slug], queryFn: () => api(`/insights/${slug}`) }),
  related: ({ service = '', industry = '', exclude = '' }) => ({
    queryKey: ['related', service, industry, exclude],
    queryFn: () => api(`/insights/related?service=${service}&industry=${industry}&exclude=${exclude}`),
  }),
  regions: (context = '') => ({ queryKey: ['regions', context], queryFn: () => api(`/regions${context ? `?context=${context}` : ''}`) }),
  regulatory: (page) => ({ queryKey: ['regulatory', page], queryFn: () => api(`/regulatory${page ? `?page=${page}` : ''}`) }),
  journeys: () => ({ queryKey: ['journeys'], queryFn: () => api('/journeys') }),
  people: () => ({ queryKey: ['people'], queryFn: () => api('/people') }),
};
