import nodemailer from 'nodemailer';

let transport;
export function mailer() {
  transport ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST || '127.0.0.1',
    port: Number(process.env.SMTP_PORT || 1025),
    secure: false,
    ignoreTLS: true,
  });
  return transport;
}

const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export async function sendLeadEmails(enquiry, route, settings) {
  const from = process.env.MAIL_FROM || 'Lexium Consulting <no-reply@lexiumconsulting.com>';
  const rows = [
    ['CRM tag', enquiry.crmTag],
    ['Routed to', route.owner],
    ['Name', enquiry.name],
    ['Company', enquiry.company],
    ['Work email', enquiry.workEmail],
    ['Phone', enquiry.phone || '—'],
    ['Country', enquiry.country],
    ['Industry', enquiry.industry],
    ['Service interest', enquiry.serviceInterest],
    ['Source page', enquiry.sourcePage || '—'],
  ];
  const html = `<h2>New website enquiry — ${esc(enquiry.crmTag)}</h2><table>${rows
    .map(([k, v]) => `<tr><th align="left" style="padding:4px 12px 4px 0">${esc(k)}</th><td>${esc(v)}</td></tr>`)
    .join('')}</table><h3>Brief message</h3><p style="white-space:pre-wrap">${esc(enquiry.message)}</p>`;

  await mailer().sendMail({
    from,
    to: route.email,
    replyTo: enquiry.workEmail,
    subject: `[${enquiry.crmTag}] Website enquiry — ${enquiry.company}`,
    html,
    text: rows.map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\n${enquiry.message}`,
    headers: { 'X-Lexium-CRM-Tag': enquiry.crmTag, 'X-Lexium-Owner': route.owner },
  });

  const window = settings?.responseWindow || 'We aim to respond within two business days.';
  await mailer().sendMail({
    from,
    to: enquiry.workEmail,
    subject: 'Thank you for contacting Lexium Consulting',
    text: `Dear ${enquiry.name},\n\nThank you for telling us about the decision or opportunity you are working through. ${window}\n\nLexium Consulting\n${settings?.email || 'info@lexiumconsulting.com'}`,
  });
}

export async function sendDiagnosticSummary(to, result, summary) {
  await mailer().sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: `Your investor readiness result: ${result.band}`,
    text: `Your investor readiness score: ${result.score} of 10 — ${result.band}.\n\n${summary
      .map((s) => `${s.area}: ${s.label}`)
      .join('\n')}\n\nTo discuss your capital readiness, reply to this email or visit the Lexium website.`,
  });
}
