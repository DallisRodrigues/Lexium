/** Subtle geometric / chart visual for Strategy Consulting (no stock photography). Decorative. */
export default function GeometricVisual({ variant = 'strategy', className = '' }) {
  if (variant === 'services')
    return (
      <svg viewBox="0 0 600 520" role="presentation" aria-hidden="true" className={`absolute inset-0 h-full w-full bg-lx-palegrey ${className}`} preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: 7 }).map((_, i) => (
          <rect key={i} x={70 + i * 62} y={420 - i * 50} width="52" height={50 + i * 50} fill={i === 6 ? '#F36F21' : '#092744'} opacity={i === 6 ? 1 : 0.1 + i * 0.1} />
        ))}
        <line x1="40" y1="470" x2="560" y2="470" stroke="#243746" strokeOpacity=".3" />
      </svg>
    );
  return (
    <svg viewBox="0 0 600 520" role="presentation" aria-hidden="true" className={`absolute inset-0 h-full w-full bg-lx-navy ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="lxgrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#fff" strokeOpacity=".07" />
        </pattern>
      </defs>
      <rect width="600" height="520" fill="url(#lxgrid)" />
      {/* Opportunity → Advantage → Economics → Execution: four ascending planes */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${90 + i * 110} ${380 - i * 70})`}>
          <rect width="90" height={60 + i * 70} fill="#fff" fillOpacity={0.06 + i * 0.05} stroke="#fff" strokeOpacity=".25" />
          <text x="0" y="-12" fill="#fff" fillOpacity=".7" fontSize="13" fontFamily="Inter Variable, sans-serif">{['Opportunity', 'Advantage', 'Economics', 'Execution'][i]}</text>
        </g>
      ))}
      <polyline points="135,380 245,310 355,240 465,170" fill="none" stroke="#F36F21" strokeWidth="2" />
      {[[135, 380], [245, 310], [355, 240], [465, 170]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="5" fill="#F36F21" />)}
      <line x1="60" y1="460" x2="560" y2="460" stroke="#fff" strokeOpacity=".3" />
    </svg>
  );
}
