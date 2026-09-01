/**
 * Shared `{ value, label }` shape for anything that feeds a picker —
 * `AVAILABLE_LOCALES`, the generator's separator/language lists, the popup's
 * vault/tag filters. Previously re-exported from the legacy `ui/select`
 * widget; lives here now that spartan's `hlm-select` has no matching type of
 * its own to import instead.
 */
export interface SelectOption {
  /** The form value. Keep it a string so the control stays serialisable. */
  value: string;
  label: string;
  disabled?: boolean;
}
