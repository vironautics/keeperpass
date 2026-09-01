import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { isValidEmail } from './email';
import { LIMITS, LimitName } from './limits';
import {
  estimatePasswordStrength,
  MIN_MASTER_PASSWORD_SCORE,
  StrengthScore,
} from './password-strength';
import {
  hasBidiControl,
  hasControlCharacters,
  hasInvisibleCharacters,
  hasLineBreak,
} from './text-safety';

/**
 * Angular bindings for the validation rules.
 *
 * Each returns a named error key so the template can pick a message; none of
 * them modify the value. Validators that rewrite what the user typed are a
 * hazard in a password manager — a "helpfully" trimmed password is a password
 * that no longer opens the account.
 */

/** Skip validation on empty values; `Validators.required` owns that decision. */
function isEmpty(control: AbstractControl): boolean {
  const value: unknown = control.value;
  return value === null || value === undefined || value === '';
}

export function emailValidator(): ValidatorFn {
  return (control) =>
    isEmpty(control) || isValidEmail(String(control.value)) ? null : { email: true };
}

/** Length ceiling taken from the shared limits table. */
export function maxLength(limit: LimitName): ValidatorFn {
  return Validators.maxLength(LIMITS[limit]);
}

/**
 * Rejects text that would render differently from how it is stored.
 * Use on anything the user reads to make a trust decision: item names, URLs,
 * tags, organisation and group names.
 */
export function displaySafeValidator(): ValidatorFn {
  return (control) => {
    if (isEmpty(control)) {
      return null;
    }

    const value = String(control.value);
    const errors: ValidationErrors = {};

    if (hasControlCharacters(value)) {
      errors['controlCharacters'] = true;
    }
    if (hasBidiControl(value)) {
      errors['bidiControl'] = true;
    }
    if (hasInvisibleCharacters(value)) {
      errors['invisibleCharacters'] = true;
    }

    return Object.keys(errors).length > 0 ? errors : null;
  };
}

/** `displaySafe` plus a ban on line breaks, for fields rendered on one line. */
export function singleLineValidator(): ValidatorFn {
  return (control) => {
    const errors = displaySafeValidator()(control);
    if (!isEmpty(control) && hasLineBreak(String(control.value))) {
      return { ...errors, lineBreak: true };
    }
    return errors;
  };
}

/** Rejects a value that is only whitespace, without altering it. */
export function nonBlankValidator(): ValidatorFn {
  return (control) =>
    isEmpty(control) || String(control.value).trim() !== '' ? null : { blank: true };
}

/**
 * Grades a master password on resistance to offline brute force.
 * Reports the achieved score alongside the error so the UI can show a meter.
 */
export function masterPasswordValidator(
  minimumScore: StrengthScore = MIN_MASTER_PASSWORD_SCORE,
): ValidatorFn {
  return (control) => {
    if (isEmpty(control)) {
      return null;
    }

    const { score, entropy } = estimatePasswordStrength(String(control.value));
    return score >= minimumScore ? null : { weakPassword: { score, entropy, minimumScore } };
  };
}

/** Confirms two controls in the same group hold identical values. */
export function matchesValidator(
  sourceControlName: string,
  confirmControlName: string,
): ValidatorFn {
  return (group) => {
    const source = group.get(sourceControlName);
    const confirm = group.get(confirmControlName);

    if (!source || !confirm || confirm.value === '') {
      return null;
    }

    return source.value === confirm.value ? null : { mismatch: true };
  };
}
