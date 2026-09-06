import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { ClipboardService } from '../../../core/clipboard/clipboard.service';
import {
  AUDIT_DESCRIPTIONS,
  AUDIT_ICONS,
  AUDIT_LABELS,
  AuditResult,
  Field,
  FieldType,
  fieldDefinition,
  fieldIsSecret,
  formatFieldValue,
} from '../../../core/models';
import { generateTotp } from '../../../core/otp/totp';
import { Icon } from '../../../ui/icon/icon';
import { IconName } from '../../../ui/icon/icon-glyphs';
import { Totp } from '../totp/totp';

/** How long the copy confirmation stays on the button. */
const COPIED_FEEDBACK_MS = 1000;

/** An audit finding rendered as a warning badge beside the field name. */
interface FieldFinding {
  type: string;
  icon: IconName;
  label: string;
  description: string;
}

/**
 * One field of an item, read-only.
 *
 * Secrets start masked and are revealed per field, so opening an item never puts
 * every password on screen at once.
 */
@Component({
  selector: 'app-item-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmBadge, HlmButton, HlmItemImports, Icon, Totp],
  templateUrl: './item-field.html',
  host: { class: 'block' },
})
export class ItemField {
  readonly field = input.required<Field>();

  /** Findings the audit reported against this particular field. */
  readonly auditResults = input<readonly AuditResult[]>([]);

  protected readonly masked = signal(true);
  protected readonly copied = signal(false);

  private readonly definition = computed(() => fieldDefinition(this.field().type));

  protected readonly icon = computed(() => this.definition().icon);
  protected readonly iconGlyph = computed(() => this.field().iconGlyph);
  protected readonly displayName = computed(() => this.field().name || 'Unnamed');
  protected readonly isMaskable = computed(() => fieldIsSecret(this.field()));
  protected readonly isSecret = computed(() => fieldIsSecret(this.field()));
  protected readonly isTotp = computed(() => this.field().type === FieldType.Totp);
  protected readonly isNote = computed(() => this.field().type === FieldType.Note);

  protected readonly displayValue = computed(() =>
    formatFieldValue(this.field(), this.isMaskable() && this.masked()),
  );

  protected readonly findings = computed<FieldFinding[]>(() =>
    this.auditResults().map((result) => ({
      type: result.type,
      icon: AUDIT_ICONS[result.type],
      label: AUDIT_LABELS[result.type],
      description: AUDIT_DESCRIPTIONS[result.type],
    })),
  );

  private readonly clipboard = inject(ClipboardService);

  protected toggleMasked(): void {
    this.masked.update((masked) => !masked);
  }

  /**
   * Copies the field's value — or, for a TOTP field, the currently valid
   * *generated code* rather than the secret it's derived from, matching
   * what `<app-totp>` actually displays right next to this button.
   */
  protected async copy(): Promise<void> {
    const field = this.field();
    if (!field.value) {
      return;
    }

    let value: string;
    if (field.type === FieldType.Totp) {
      try {
        value = await generateTotp(field.value);
      } catch {
        return;
      }
    } else {
      value = field.value;
    }

    await this.clipboard.copy(value);

    this.copied.set(true);
    setTimeout(() => this.copied.set(false), COPIED_FEEDBACK_MS);
  }
}
