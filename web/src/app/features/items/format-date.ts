/** Date formatting shared by the item detail panes. */

const RELATIVE_UNITS: readonly {
  readonly unit: Intl.RelativeTimeFormatUnit;
  readonly ms: number;
}[] = [
  { unit: 'year', ms: 365 * 24 * 60 * 60 * 1000 },
  { unit: 'month', ms: 30 * 24 * 60 * 60 * 1000 },
  { unit: 'week', ms: 7 * 24 * 60 * 60 * 1000 },
  { unit: 'day', ms: 24 * 60 * 60 * 1000 },
  { unit: 'hour', ms: 60 * 60 * 1000 },
  { unit: 'minute', ms: 60 * 1000 },
];

const relativeFormat = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});
const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });

export function formatDateTime(date: Date): string {
  return dateTimeFormat.format(date);
}

/** Date only — for rows where the time of day says nothing (a vault's or tag's age). */
export function formatDate(date: Date): string {
  return dateFormat.format(date);
}

/** "3 days ago", "in 2 months" — picks the largest unit that fits. */
export function formatRelativeToNow(date: Date, now = Date.now()): string {
  const elapsed = date.getTime() - now;
  const magnitude = Math.abs(elapsed);

  const match = RELATIVE_UNITS.find(({ ms }) => magnitude >= ms);
  if (!match) {
    return relativeFormat.format(Math.round(elapsed / 1000), 'second');
  }

  return relativeFormat.format(Math.round(elapsed / match.ms), match.unit);
}
