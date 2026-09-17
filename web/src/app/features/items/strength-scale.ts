import { TranslationKey } from '../../core/i18n';
import { StrengthScore } from '../../core/validation';

/** What each score is called, wherever a strength meter is drawn. */
export const STRENGTH_LABELS: readonly TranslationKey[] = [
  'strength.veryWeak',
  'strength.weak',
  'strength.fair',
  'strength.strong',
  'strength.veryStrong',
];

/**
 * Red below "fair", then the accent — a bar that is always one colour says nothing.
 *
 * Shared so the meter under a password field and the one in the generator dialog
 * cannot disagree about what "strong" looks like.
 */
export const STRENGTH_COLOURS = [
  'bg-destructive',
  'bg-destructive',
  'bg-primary/60',
  'bg-primary',
  'bg-primary',
] as const;

/** Five scores over a 0–100 bar, so the weakest still shows something. */
export function strengthPercent(score: StrengthScore): number {
  return ((score + 1) / STRENGTH_LABELS.length) * 100;
}
