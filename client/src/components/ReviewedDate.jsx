import { format } from 'date-fns';

export default function ReviewedDate({ date, className = '' }) {
  if (!date) return null;
  const d = new Date(date);
  return (
    <p className={`t-meta t-num ${className}`}>
      Reviewed: <time dateTime={d.toISOString().slice(0, 10)}>{format(d, 'd MMMM yyyy')}</time>
    </p>
  );
}
