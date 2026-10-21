/**
 * Date formatting shared by the item detail panes.
 *
 * Every formatter is built for the interface language (`formattingLocale`), not the
 * browser's, and reading that locale is what makes a computed or template using these
 * re-run when the language changes. Formatters are cached per locale — building an
 * `Intl` formatter is not free, and a long list formats a date per row.
 */
import { formattingLocale } from '../../core/i18n';

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

interface Formatters {
  relative: Intl.RelativeTimeFormat;
  dateTime: Intl.DateTimeFormat;
  date: Intl.DateTimeFormat;
}

const formattersByLocale = new Map<string, Formatters>();

function formatters(): Formatters {
  const locale = formattingLocale();
  let cached = formattersByLocale.get(locale);
  if (!cached) {
    cached = {
      relative: new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }),
      dateTime: new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }),
      date: new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }),
    };
    formattersByLocale.set(locale, cached);
  }
  return cached;
}

export function formatDateTime(date: Date): string {
  return formatters().dateTime.format(date);
}

/** Date only — for rows where the time of day says nothing (a vault's or tag's age). */
export function formatDate(date: Date): string {
  return formatters().date.format(date);
}

/** "3 days ago", "in 2 months" — picks the largest unit that fits. */
export function formatRelativeToNow(date: Date, now = Date.now()): string {
  const elapsed = date.getTime() - now;
  const magnitude = Math.abs(elapsed);
  const { relative } = formatters();

  const match = RELATIVE_UNITS.find(({ ms }) => magnitude >= ms);
  if (!match) {
    return relative.format(Math.round(elapsed / 1000), 'second');
  }

  return relative.format(Math.round(elapsed / match.ms), match.unit);
}
