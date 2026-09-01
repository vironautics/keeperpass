import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmProgressImports } from '@spartan-ng/helm/progress';
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import { fieldDefinition, FieldType } from '../../../core/models';
import { foldText } from '../../../core/text/fold';
import { COUNTRY_CODES, countryByIso, countryFromNumber } from '../../../core/models/country-codes';
import {
  estimatePasswordStrength,
  inspectCardNumber,
  isValidEmail,
} from '../../../core/validation';
import { Icon } from '../../../ui/icon/icon';
import { IconName } from '../../../ui/icon/icon-glyphs';
import { GeneratePasswordDialog } from '../generate-password-dialog/generate-password-dialog';
import { STRENGTH_COLOURS, STRENGTH_LABELS, strengthPercent } from '../strength-scale';

/** `yyyy-mm-dd` and `yyyy-mm`, the two shapes the model stores. */
function parseFieldDate(value: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(value.trim());
  if (!match) {
    return undefined;
  }
  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, day ? Number(day) : 1);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/** Local parts, not UTC: a date field means the day the user picked, wherever they are. */
function formatFieldDate(date: Date, monthOnly: boolean): string {
  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return monthOnly ? `${year}-${month}` : `${year}-${month}-${day}`;
}

/**
 * The name + value editor for one field row, in `ItemView`'s edit mode.
 *
 * The value is edited through whichever control best matches the field's `FieldType`:
 * a calendar for dates, a country picker for phone numbers, a strength bar under
 * passwords and PINs, brand + checksum for card numbers, an address check for email.
 * The type itself is fixed once a field exists — retyping an existing field is out of
 * scope, same as reordering.
 *
 * Whatever the control, the stored value stays a plain string in the field's own
 * format, so none of this changes what a saved item looks like.
 */
@Component({
  selector: 'app-field-value-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GeneratePasswordDialog,
    HlmButton,
    HlmComboboxImports,
    HlmDatePickerImports,
    HlmInput,
    HlmInputGroupImports,
    HlmItemImports,
    HlmProgressImports,
    HlmTextarea,
    Icon,
    ReactiveFormsModule,
  ],
  templateUrl: './field-value-editor.html',
  host: { class: 'block' },
})
export class FieldValueEditor {
  readonly type = input.required<FieldType>();
  readonly nameControl = input.required<FormControl<string>>();
  readonly valueControl = input.required<FormControl<string>>();

  /** Fires whenever either control's value changes, so a parent form can recompute dirty/valid state. */
  readonly changed = output<void>();

  /** The remove button was clicked — `ItemView` confirms before actually removing it. */
  readonly remove = output<void>();

  private readonly definition = computed(() => fieldDefinition(this.type()));

  protected readonly glyph = computed<IconName>(() => this.definition().icon);
  protected readonly isNote = computed(() => this.type() === FieldType.Note);
  protected readonly isRevealable = computed(() => this.type() === FieldType.Password);
  protected readonly isPin = computed(() => this.type() === FieldType.Pin);
  protected readonly isCredit = computed(() => this.type() === FieldType.Credit);
  protected readonly isEmail = computed(() => this.type() === FieldType.Email);
  protected readonly isPhone = computed(() => this.type() === FieldType.Phone);
  protected readonly isDate = computed(() => this.type() === FieldType.Date);
  protected readonly isMonth = computed(() => this.type() === FieldType.Month);

  /** Whether a password value is currently shown in the clear. */
  protected readonly revealed = signal(false);

  /** Whether the generator dialog is showing. */
  protected readonly generating = signal(false);

  /**
   * The value control's current value, as a signal.
   *
   * The `FormControl` arrives as an input rather than as state this component owns, so
   * everything derived from it — strength, card brand, the parsed date — needs the
   * value mirrored here. Kept in step by the same subscription that raises `changed`.
   */
  protected readonly value = signal('');

  protected readonly countries = COUNTRY_CODES;

  // --- derived, per type ----------------------------------------------------

  private readonly strength = computed(() => estimatePasswordStrength(this.value()).score);

  /**
   * Passwords only.
   *
   * A PIN is not a weak password — it is a PIN. A card's CVC is three digits by
   * definition and a card PIN is four, so scoring them could only ever report a
   * problem the user cannot fix, next to a field they filled in correctly.
   */
  protected readonly showsStrength = computed(() => this.isRevealable());
  protected readonly strengthPercent = computed(() => strengthPercent(this.strength()));
  protected readonly strengthColour = computed(() => STRENGTH_COLOURS[this.strength()]);
  protected readonly strengthLabel = computed(() => STRENGTH_LABELS[this.strength()]);

  protected readonly card = computed(() => inspectCardNumber(this.value()));
  protected readonly emailValid = computed(() => isValidEmail(this.value()));

  protected readonly dateValue = computed(() => parseFieldDate(this.value()));
  protected readonly dateLabel = computed(() => {
    const date = this.dateValue();
    if (!date) {
      return '';
    }
    return this.isMonth()
      ? date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
      : date.toLocaleDateString();
  });

  /** The country whose dial code the value currently starts with, if any. */
  private readonly phoneCountry = computed(() => countryFromNumber(this.value()));
  protected readonly phoneIso = computed(() => this.phoneCountry()?.iso ?? '');

  /** Everything after the dial code — what the user actually types. */
  protected readonly phoneNational = computed(() => {
    const dial = this.phoneCountry()?.dial;
    const raw = this.value();
    return dial && raw.startsWith(dial) ? raw.slice(dial.length).trim() : raw;
  });

  /**
   * How the picker's own trigger prints the chosen date. Its default is
   * `Date.toDateString()` — "Wed Jun 12 2024" — which is not how anyone writes a date.
   */
  protected readonly formatDay = (date: Date): string =>
    date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

  protected readonly formatMonth = (date: Date): string =>
    date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });

  /** The trigger stringifies the value, and the options only exist while it is open. */
  protected readonly countryDialLabel = (iso: string): string => {
    const country = countryByIso(iso);
    return country ? `${country.flag} ${country.dial}` : iso;
  };

  /**
   * What the search box matches. The default filter compares the search against
   * `itemToString`, which here is a flag and a dial code — so typing "germ" would find
   * nothing. This matches the country's name, its dial code and its ISO code instead,
   * ignoring accents so "reunion" finds Réunion.
   */
  protected readonly countryFilter = (iso: string, search: string): boolean => {
    const query = foldText(search);
    if (!query) {
      return true;
    }
    const country = countryByIso(iso);
    if (!country) {
      return false;
    }
    return (
      foldText(country.name).includes(query) ||
      country.dial.replace('+', '').startsWith(query.replace('+', '')) ||
      foldText(country.iso) === query
    );
  };

  /** Username, Totp (the raw base32 secret) and Text; every other type has its own branch. */
  protected readonly nativeType = computed(() => (this.type() === FieldType.Url ? 'url' : 'text'));

  /**
   * A PIN is digits, but not a *number*: `type="number"` brings a spinner, accepts
   * `1e5`, and on some browsers drops a leading zero. A text box with the numeric
   * keypad is what the value actually is.
   */
  protected readonly inputMode = computed(() => (this.isPin() ? 'numeric' : null));

  private readonly nameInput = viewChild<ElementRef<HTMLInputElement>>('nameInput');
  private readonly valueInput = viewChild<ElementRef<HTMLInputElement>>('valueInput');
  private readonly valueTextarea = viewChild<ElementRef<HTMLTextAreaElement>>('valueTextarea');

  constructor() {
    effect((onCleanup) => {
      const subscription = this.nameControl().valueChanges.subscribe(() => this.changed.emit());
      onCleanup(() => subscription.unsubscribe());
    });

    effect((onCleanup) => {
      const control = this.valueControl();
      this.value.set(control.value);

      const subscription = control.valueChanges.subscribe((next) => {
        this.value.set(next);
        this.changed.emit();
      });
      onCleanup(() => subscription.unsubscribe());
    });
  }

  protected toggleRevealed(): void {
    this.revealed.update((revealed) => !revealed);
  }

  /** The generator's suggestion, accepted — revealed so the user can see what landed. */
  protected onGenerated(password: string): void {
    this.valueControl().setValue(password);
    this.revealed.set(true);
  }

  /** The picker emits `null` when its value is cleared, `undefined` when never set. */
  protected onDatePicked(date: Date | null | undefined): void {
    this.valueControl().setValue(date ? formatFieldDate(date, this.isMonth()) : '');
  }

  /** Swaps the dial code at the front, leaving the rest of the number alone. */
  protected onCountryPicked(iso: unknown): void {
    const country = typeof iso === 'string' ? countryByIso(iso) : undefined;
    if (!country) {
      return;
    }
    const national = this.phoneNational();
    this.valueControl().setValue(national ? `${country.dial} ${national}` : country.dial);
  }

  protected onPhoneTyped(event: Event): void {
    const national = (event.target as HTMLInputElement).value;
    const dial = this.phoneCountry()?.dial;
    this.valueControl().setValue(dial ? `${dial} ${national}`.trim() : national);
  }

  /** Focuses the name if it's still empty (a freshly-added field), otherwise the value. */
  focus(): void {
    const target = !this.nameControl().value
      ? this.nameInput()
      : (this.valueInput() ?? this.valueTextarea());
    target?.nativeElement.focus();
  }
}
