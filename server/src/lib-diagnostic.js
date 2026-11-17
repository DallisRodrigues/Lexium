/** Investor readiness diagnostic (§9.10). Yes=2, Partly=1, No=0; max 10. */
export const DIAGNOSTIC_QUESTIONS = [
  { area: 'Growth', question: 'Is the three-year growth thesis supported by market evidence?' },
  { area: 'Economics', question: 'Does the financial model reconcile revenue drivers, cash and funding need?' },
  { area: 'Governance', question: 'Are statutory, board and management controls documented?' },
  { area: 'Narrative', question: 'Can management explain the use of funds and value creation clearly?' },
  { area: 'Diligence', question: 'Is a structured data room substantially ready?' },
];

export const POINTS = { Yes: 2, Partly: 1, No: 0 };

export function bandFor(score) {
  if (score <= 4) return 'Foundation';
  if (score <= 7) return 'Investor-readying';
  return 'Market-ready';
}

export function scoreDiagnostic(answers) {
  const summary = DIAGNOSTIC_QUESTIONS.map(({ area }) => {
    const a = answers[area];
    const pts = POINTS[a];
    return { area, points: pts, label: pts === 2 ? 'Strength' : pts === 1 ? 'Partly in place' : 'Gap to address' };
  });
  const score = summary.reduce((n, s) => n + s.points, 0);
  return { score, band: bandFor(score), summary };
}
