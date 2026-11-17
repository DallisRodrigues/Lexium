/** Lead routing table (§8.4). Owner emails come from .env; mapping is overridable via SiteSettings.routing. */
export const DEFAULT_ROUTING = [
  { selection: 'Regulatory and Licences', owner: 'Regulatory lead', crmTag: 'REGULATORY', envKey: 'LEAD_REGULATORY' },
  { selection: 'Manufacturing Advisory', owner: 'Plant setup lead', crmTag: 'MANUFACTURING', envKey: 'LEAD_MANUFACTURING' },
  { selection: 'Market Entry', owner: 'Strategy and markets lead', crmTag: 'MARKET ENTRY', envKey: 'LEAD_MARKET_ENTRY' },
  { selection: 'Mergers and Acquisitions', owner: 'Transaction lead', crmTag: 'M&A', envKey: 'LEAD_MA' },
  { selection: 'Fundraising and IPO Advisory', owner: 'Capital advisory lead', crmTag: 'CAPITAL', envKey: 'LEAD_CAPITAL' },
  { selection: 'General', owner: 'Central business development', crmTag: 'GENERAL', envKey: 'LEAD_GENERAL' },
];

/** Contact form "Service interest" option → routing selection. Editable in SiteSettings.serviceRouting. */
export const SERVICE_INTEREST_OPTIONS = [
  'Strategy Consulting',
  'Market Entry (India)',
  'Market Entry (Global)',
  'Regulatory and Licences',
  'Manufacturing Advisory',
  'Mergers and Acquisitions',
  'Fundraising and IPO Advisory',
  'General',
];

export const DEFAULT_SERVICE_ROUTING = {
  'Strategy Consulting': 'Market Entry',
  'Market Entry (India)': 'Market Entry',
  'Market Entry (Global)': 'Market Entry',
  'Regulatory and Licences': 'Regulatory and Licences',
  'Manufacturing Advisory': 'Manufacturing Advisory',
  'Mergers and Acquisitions': 'Mergers and Acquisitions',
  'Fundraising and IPO Advisory': 'Fundraising and IPO Advisory',
  General: 'General',
};

export function resolveRoute(serviceInterest, settings) {
  const table = settings?.routing?.length ? settings.routing : DEFAULT_ROUTING;
  const map = { ...DEFAULT_SERVICE_ROUTING, ...(settings?.serviceRouting || {}) };
  const selection = map[serviceInterest] || 'General';
  const row = table.find((r) => r.selection === selection) || table.find((r) => r.selection === 'General');
  return { ...row, email: process.env[row.envKey] || process.env.LEAD_GENERAL };
}
