import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  untracked,
  viewChild,
  viewChildren,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import {
  AuditResult,
  Field,
  FIELD_DEFINITIONS,
  FieldDefinition,
  fieldDefinition,
  fieldIsSecret,
  FieldType,
  formatFieldValue,
  HistoryEntry,
  VaultItem,
} from '../../../core/models';
import { AuditService } from '../../../core/audit/audit.service';
import { RecentItemsService } from '../../../core/recent/recent-items.service';
import { foldText } from '../../../core/text/fold';
import {
  displaySafeValidator,
  LIMITS,
  maxLength,
  singleLineValidator,
} from '../../../core/validation';
import { ItemDraft, ItemDraftStore } from '../../../core/vault/item-draft.store';
import { tagColor } from '../../../core/vault/tag-color';
import { VaultSyncService } from '../../../core/vault/vault-sync.service';
import { VaultStore } from '../../../core/vault/vault.store';
import { FieldValueEditor } from '../field-value-editor/field-value-editor';
import { formatDateTime, formatRelativeToNow } from '../format-date';
import { ItemField } from '../item-field/item-field';
import { IconPickerDialog } from '../item-icon/icon-picker-dialog/icon-picker-dialog';
import { ItemIcon } from '../item-icon/item-icon';
import { Icon } from '../../../ui/icon/icon';
import { IconName } from '../../../ui/icon/icon-glyphs';

/**
 * One field, staged for editing.
 *
 * The source of truth for structure (how many fields, in what order) while
 * `edit()` is true — unlike `fields()`, which stays a direct, read-only
 * pass-through of `item().fields` for read mode. A field's type is fixed
 * once staged; only its name and value are.
 */
interface EditableField {
  type: FieldType;
  nameControl: FormControl<string>;
  valueControl: FormControl<string>;
  /** Effective secret flag — `field.secret ?? fieldDefinition(type).secret`, toggleable. */
  secret: boolean;
  /** A catalogue icon overriding the type's default, if one was picked. */
  iconGlyph?: string;
}

/** One choice in the "Move To Vault" select. */
interface VaultOption {
  value: string;
  label: string;
}

/** Order-independent comparison, since adding/removing tags doesn't reorder the rest. */
function sameTags(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((tag) => b.includes(tag));
}

/**
 * One row of the history diff: today's field beside the field that sat at the
 * same index when the entry was saved.
 *
 * Both halves are optional, and each absence means something specific.
 * `current*` is filled in only when it differs from the old value — there is
 * nothing to strike through when a field never changed. `history*` is filled in
 * only when a field existed at that index back then, so a field added since
 * shows up as new rather than as a change from nothing.
 *
 * Pairing by index is the honest limit of this view: fields have no identity of
 * their own, so a field that was *moved* reads as two fields that both changed.
 * The alternative is matching on name, which gets a rename wrong instead —
 * neither is right, and index at least matches the order on screen.
 */
interface HistoryFieldRow {
  glyph: IconName;
  currentName?: string;
  currentValue?: string;
  historyName?: string;
  historyValue?: string;
}

/** Tags grouped for the diff view: added since / removed since / present in both. */
interface HistoryTagDiff {
  added: readonly string[];
  removed: readonly string[];
  unchanged: readonly string[];
}

function historyFieldRows(
  currentFields: readonly Field[],
  historyFields: readonly Field[],
): HistoryFieldRow[] {
  return currentFields.map((field, index) => {
    const historyField = historyFields[index];
    const nameChanged = !historyField || field.name !== historyField.name;
    const valueChanged = !historyField || field.value !== historyField.value;

    return {
      glyph: fieldDefinition((historyField ?? field).type).icon,
      currentName: nameChanged ? field.name || 'Unnamed' : undefined,
      currentValue: valueChanged ? field.value : undefined,
      historyName: historyField ? historyField.name || 'Unnamed' : undefined,
      historyValue: historyField ? historyField.value : undefined,
    };
  });
}

function historyTagDiff(
  currentTags: readonly string[],
  historyTags: readonly string[],
): HistoryTagDiff {
  return {
    added: currentTags.filter((tag) => !historyTags.includes(tag)),
    removed: historyTags.filter((tag) => !currentTags.includes(tag)),
    unchanged: historyTags.filter((tag) => currentTags.includes(tag)),
  };
}

/** Caps how many existing tags the tag-draft suggestion list offers at once. */
/**
 * The value of the picker's "Create …" row. A `\u0000` prefix cannot occur in a tag
 * name — `displaySafeValidator` rejects control characters — so this can never
 * collide with a real one.
 */
const NEW_TAG_VALUE = '\u0000create-tag';

function editableFieldFrom(field: Field): EditableField {
  return {
    type: field.type,
    nameControl: new FormControl(field.name, {
      nonNullable: true,
      validators: [maxLength('fieldName'), singleLineValidator()],
    }),
    valueControl: new FormControl(field.value, {
      nonNullable: true,
      validators: fieldValueValidators(field.type),
    }),
    secret: fieldIsSecret(field),
    iconGlyph: field.iconGlyph,
  };
}

/** Types whose value can run long enough to need the generous "note" length cap and line breaks. */
const LONG_TEXT_TYPES = new Set([
  FieldType.Note,
  FieldType.Certificate,
  FieldType.SshKey,
  FieldType.RecoveryCodes,
]);

/**
 * Validators for a field's value control, by type.
 *
 * Password/Pin/Credit are opaque secrets, not text a user reads to make a
 * trust decision — only their length is capped (see `text-safety.ts`'s doc
 * comment on why "dangerous-looking" characters are legitimate password
 * content). Everything else gets the same bidi/control-character guard as
 * the item name; Note and the other long-text types additionally allow line
 * breaks.
 */
function fieldValueValidators(type: FieldType): ValidatorFn[] {
  const lengthCap = maxLength(LONG_TEXT_TYPES.has(type) ? 'noteValue' : 'fieldValue');

  switch (type) {
    case FieldType.Password:
    case FieldType.Pin:
    case FieldType.Credit:
      return [lengthCap];
    case FieldType.Note:
    case FieldType.Certificate:
    case FieldType.SshKey:
    case FieldType.RecoveryCodes:
      return [lengthCap, displaySafeValidator()];
    default:
      return [lengthCap, singleLineValidator()];
  }
}

/**
 * The detail pane: everything held against one item, built from spartan.
 *
 * Naming, field *values* and tags are editable (`edit()`); adding/removing/
 * reordering fields and expiration are not — those stay read-only
 * affordances, same as moving and deleting.
 *
 * `itemId` arrives from the route via `withComponentInputBinding`, and so
 * does `edit` — set via `?edit=true` on the URL, the same query-param idiom
 * `import-dialog.ts` already uses elsewhere in this app.
 *
 * `new` (also a query param) marks a brand-new, unsaved item: `itemId` in
 * that case is an `ItemDraftStore` draft's id, not yet a real `VaultStore`
 * item — `item()` falls back to synthesizing one from the draft's template
 * so the rest of this component (form, validation, `canSave`) doesn't need
 * to know the difference. Nothing reaches `VaultStore` — or Drive — until
 * `save()` actually runs.
 *
 * Every dialog here is driven from a signal through spartan's `state` /
 * `stateChanged` pair rather than from a trigger button, because the thing that
 * opens them is a menu item or a row, not the dialog's own trigger.
 */
@Component({
  selector: 'app-item-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FieldValueEditor,
    HlmAlertDialogImports,
    HlmBadge,
    HlmButton,
    HlmComboboxImports,
    HlmDialogImports,
    HlmDropdownMenuImports,
    HlmEmptyImports,
    HlmInput,
    HlmItemImports,
    HlmSelectImports,
    IconPickerDialog,
    ItemField,
    ItemIcon,
    Icon,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './item-view.html',
  /** Fills the detail pane. See `ItemsPage` for why routed views position themselves. */
  host: { class: 'bg-card absolute inset-0' },
})
export class ItemView {
  /** Route parameter. */
  readonly itemId = input.required<string>();

  /** Query parameter — `?edit=true` puts the view in edit mode. */
  readonly edit = input(false, { transform: booleanAttribute });

  /**
   * Query parameter — `?new=true` means `itemId` is an unsaved `ItemDraftStore`
   * draft. Aliased since the property can't be named `new` — that's a
   * reserved word as an identifier, even though it's a legal property name.
   */
  readonly isNew = input(false, { alias: 'new', transform: booleanAttribute });

  private readonly store = inject(VaultStore);
  private readonly router = inject(Router);
  private readonly vaultSync = inject(VaultSyncService);
  private readonly draftStore = inject(ItemDraftStore);
  private readonly recentItems = inject(RecentItemsService);
  private readonly auditService = inject(AuditService);
  private readonly host = inject(ElementRef<HTMLElement>);

  protected readonly item = computed<VaultItem | undefined>(() => {
    const stored = this.store.itemById(this.itemId());
    if (stored) {
      return stored;
    }

    const draft = this.isNew() ? this.draftStore.get(this.itemId()) : undefined;
    return draft ? this.draftToItem(draft) : undefined;
  });

  protected readonly found = computed(() => !!this.item());

  /**
   * The item's icon as it should render right now — the stored `iconGlyph`
   * while just viewing, but the staged `editableIconGlyph` while editing, so
   * picking a new icon in `IconPickerDialog` previews immediately instead of
   * waiting for Save.
   */
  protected readonly previewIconItem = computed<VaultItem | undefined>(() => {
    const item = this.item();
    return item ? { ...item, iconGlyph: this.editableIconGlyph() } : undefined;
  });
  protected readonly name = computed(() => this.item()?.name ?? '');
  protected readonly tags = computed(() => this.item()?.tags ?? []);
  protected readonly fields = computed<readonly Field[]>(() => this.item()?.fields ?? []);
  protected readonly history = computed<readonly HistoryEntry[]>(() => this.item()?.history ?? []);

  /** Index into `history()` shown in the view/restore dialog, or `null` when it's closed. */
  protected readonly viewingHistoryIndex = signal<number | null>(null);

  protected readonly viewingHistoryEntry = computed<HistoryEntry | undefined>(() => {
    const index = this.viewingHistoryIndex();
    return index === null ? undefined : this.history()[index];
  });

  /** Whether the current item's name differs from the version being viewed. */
  protected readonly viewingHistoryNameChanged = computed(() => {
    const entry = this.viewingHistoryEntry();
    return !!entry && entry.name !== this.name();
  });

  private readonly viewingHistoryTagDiff = computed<HistoryTagDiff>(() => {
    const entry = this.viewingHistoryEntry();
    return entry
      ? historyTagDiff(this.tags(), entry.tags)
      : { added: [], removed: [], unchanged: [] };
  });

  /** Tags on the current item that weren't there yet at this version — shown struck through. */
  protected readonly viewingHistoryTagsAdded = computed(() => this.viewingHistoryTagDiff().added);
  /** Tags present at this version that have since been removed — shown filled. */
  protected readonly viewingHistoryTagsRemoved = computed(
    () => this.viewingHistoryTagDiff().removed,
  );
  /** Tags present both then and now — shown plain. */
  protected readonly viewingHistoryTagsUnchanged = computed(
    () => this.viewingHistoryTagDiff().unchanged,
  );

  /** One row per *current* field, diffed against the entry at the same index. */
  protected readonly viewingHistoryFieldRows = computed<HistoryFieldRow[]>(() => {
    const entry = this.viewingHistoryEntry();
    return entry ? historyFieldRows(this.fields(), entry.fields) : [];
  });

  /** Fields the history entry has beyond the current item's field count — existed then, doesn't as a current slot now. */
  protected readonly viewingHistoryOnlyFields = computed<readonly Field[]>(() => {
    const entry = this.viewingHistoryEntry();
    return entry ? entry.fields.slice(this.fields().length) : [];
  });

  /** Index into `history()` pending delete confirmation, or `null` when it's closed. */
  protected readonly deletingHistoryIndex = signal<number | null>(null);

  protected readonly vaultLabel = computed(() => {
    const item = this.item();
    return item ? this.store.labelForVault(item.vaultId) : '';
  });

  protected readonly isFavourite = computed(() => this.store.isFavourite(this.itemId()));

  protected readonly updatedAt = computed(() => {
    const updated = this.item()?.updated;
    return updated ? formatDateTime(updated) : '';
  });

  protected readonly updatedAgo = computed(() => {
    const updated = this.item()?.updated;
    return updated ? formatRelativeToNow(updated) : '';
  });

  protected readonly hasExpiry = computed(() => !!this.item()?.expiresAt);

  /**
   * Read from the date rather than the audit result: the audit runs
   * periodically, so between runs its verdict can lag what the date says.
   */
  protected readonly isExpired = computed(() => {
    const expiresAt = this.item()?.expiresAt;
    return !!expiresAt && expiresAt.getTime() < Date.now();
  });

  protected readonly expiryLabel = computed(() => (this.isExpired() ? 'Expired' : 'Expires'));

  protected readonly expiryAgo = computed(() => {
    const expiresAt = this.item()?.expiresAt;
    return expiresAt ? formatRelativeToNow(expiresAt) : '';
  });

  protected findingsFor(fieldIndex: number): readonly AuditResult[] {
    return this.auditService
      .findingsFor(this.itemId())
      .filter((result) => result.fieldIndex === fieldIndex);
  }

  protected tagColor(tag: string): string {
    return tagColor(tag);
  }

  /** The glyph for a field type, for the "Add Field" menu. */
  protected glyphFor(definition: FieldDefinition): IconName {
    return definition.icon;
  }

  protected historyDate(entry: HistoryEntry): string {
    return formatDateTime(entry.updated);
  }

  protected historyAgo(entry: HistoryEntry): string {
    return formatRelativeToNow(entry.updated);
  }

  protected historyFieldGlyph(field: Field): IconName {
    return fieldDefinition(field.type).icon;
  }

  /**
   * Shown in full, never masked. Reaching a history entry already means an
   * unlocked vault, an open item and a deliberate click into its past — a
   * reveal toggle at the end of that would guard nothing, and the whole point
   * of looking is to compare the old value against the current one.
   */
  protected historyFieldValue(field: Field): string {
    return formatFieldValue(field, false);
  }

  protected viewHistoryEntry(index: number): void {
    this.viewingHistoryIndex.set(index);
  }

  protected closeHistoryEntry(): void {
    this.viewingHistoryIndex.set(null);
  }

  /**
   * Restoring is just another edit: `VaultStore.updateItem()` snapshots the
   * item's *current* state into history before applying the old one, so
   * restoring a version is itself undoable, the same way any other save is.
   */
  protected confirmRestoreHistory(): void {
    const item = this.item();
    const index = this.viewingHistoryIndex();
    if (!item || index === null) {
      return;
    }

    this.store.restoreHistoryEntry(item.id, index);
    void this.auditService.runAuditForItem(item.id);
    void this.vaultSync.syncNow();
    this.viewingHistoryIndex.set(null);
  }

  protected requestDeleteHistoryEntry(index: number): void {
    this.deletingHistoryIndex.set(index);
  }

  protected cancelDeleteHistoryEntry(): void {
    this.deletingHistoryIndex.set(null);
  }

  protected confirmDeleteHistoryEntry(): void {
    const item = this.item();
    const index = this.deletingHistoryIndex();
    if (!item || index === null) {
      return;
    }

    this.store.deleteHistoryEntry(item.id, index);
    void this.vaultSync.syncNow();
    this.deletingHistoryIndex.set(null);
  }

  protected toggleFavourite(): void {
    this.store.toggleFavourite(this.itemId());
    void this.vaultSync.syncNow();
  }

  // --- Editing -------------------------------------------------------------

  /** Rows the "Add Field" dialog offers, in `FIELD_DEFINITIONS`' own order. */
  protected readonly fieldTypeOptions: readonly FieldDefinition[] =
    Object.values(FIELD_DEFINITIONS);

  protected readonly nameControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, maxLength('itemName'), singleLineValidator()],
  });

  /**
   * The source of truth for field structure while editing — see
   * `EditableField`. Rebuilt from `item()` by `resetForm`; grown by
   * `addField`.
   */
  protected readonly editableFields = signal<EditableField[]>([]);

  /** Source of truth for tags while editing — see `editableFields` above. */
  protected readonly editableTags = signal<string[]>([]);

  /** Staged icon override while editing — see `previewIconItem`. `undefined` means "use the default icon". */
  protected readonly editableIconGlyph = signal<string | undefined>(undefined);

  /** Whether `IconPickerDialog` is showing. */
  protected readonly iconPickerOpen = signal(false);

  protected readonly tagDraftControl = new FormControl('', {
    nonNullable: true,
    validators: [maxLength('tagName'), singleLineValidator()],
  });

  /**
   * What is typed in the tag picker's search box.
   *
   * Mirrored into `tagDraftControl` on every keystroke, so a *new* name is still
   * validated by the same rules as before (length, single line) and `addTag()` needs
   * no second code path.
   */
  protected readonly tagSearch = signal('');

  /** The sentinel the "Create …" row carries, so it is not mistaken for a tag name. */
  protected readonly newTagValue = NEW_TAG_VALUE;

  /** Every tag in the vault the item does not already have. The picker searches these. */
  protected readonly tagOptions = computed(() => {
    const existing = new Set(this.editableTags());
    return this.store.tags().filter((tag) => !existing.has(tag.name));
  });

  /**
   * The name to offer creating: what was typed, unless a tag by that name already
   * exists — in which case that tag is in the list above and offering to create a
   * second one would be a lie.
   */
  protected readonly newTagName = computed(() => {
    const typed = this.tagSearch().trim();
    if (!typed || this.tagTooLong()) {
      return '';
    }
    const known = [...this.store.tags().map((tag) => tag.name), ...this.editableTags()];
    return known.some((name) => foldText(name) === foldText(typed)) ? '' : typed;
  });

  /** The one rule a single-line search box can break. */
  protected readonly tagTooLong = computed(() => this.tagSearch().trim().length > LIMITS.tagName);

  /**
   * The picker's own filter. The default one matches the search against the item's
   * value, which is the tag name — right for the tags, wrong for the "Create …" row,
   * whose value is a sentinel and which has to stay visible whatever is typed.
   */
  protected readonly tagFilter = (value: string, search: string): boolean =>
    value === NEW_TAG_VALUE || foldText(value).includes(foldText(search));

  /**
   * `editableFields` holds independently-mutable `FormControl`s, not
   * something `toSignal()` can watch declaratively. Each `FieldValueEditor`
   * bumps this on `(changed)`, which `dirty`/`canSave` read to force
   * recomputation, keeping those two pure `computed()`s.
   */
  private readonly fieldsChangedTick = signal(0);

  private readonly nameValue = toSignal(this.nameControl.valueChanges, {
    initialValue: this.nameControl.value,
  });
  private readonly nameStatus = toSignal(this.nameControl.statusChanges, {
    initialValue: this.nameControl.status,
  });

  private readonly fieldEditors = viewChildren(FieldValueEditor);
  private readonly nameInput = viewChild<ElementRef<HTMLInputElement>>('nameInput');

  /** Whether the "Add Field" dialog is showing. */
  protected readonly addingField = signal(false);

  /** Index into `editableFields()` pending remove confirmation, or `null` when there isn't one. */
  protected readonly removingFieldIndex = signal<number | null>(null);

  /** Whether `IconPickerDialog` is showing for a field (as opposed to the item itself). */
  protected readonly fieldIconPickerOpen = signal(false);

  /** Index into `editableFields()` currently having its icon picked. */
  protected readonly fieldIconPickerIndex = signal<number | null>(null);

  // --- Move to vault / Delete -----------------------------------------------

  protected readonly movingItem = signal(false);

  protected readonly moveVaultControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  private readonly moveVaultValue = toSignal(this.moveVaultControl.valueChanges, {
    initialValue: this.moveVaultControl.value,
  });

  /** Every vault except the one the item is already in. */
  protected readonly moveVaultOptions = computed<VaultOption[]>(() => {
    const currentVaultId = this.item()?.vaultId;
    return this.store
      .vaults()
      .filter((vault) => vault.id !== currentVaultId)
      .map((vault) => ({ value: vault.id, label: this.store.labelForVault(vault.id) }));
  });

  protected readonly canMove = computed(() => !!this.moveVaultValue());

  /**
   * The trigger stringifies the *value*, and the option elements only exist while
   * the dropdown is open — so without this a closed trigger shows a raw vault id
   * instead of the vault's name.
   */
  protected readonly vaultOptionLabel = (vaultId: string): string =>
    this.store.labelForVault(vaultId);

  protected readonly deleteRequested = signal(false);

  protected readonly dirty = computed(() => {
    this.fieldsChangedTick();
    // A new item has no prior saved state to compare against — every save
    // of it is meaningful, so it's always treated as dirty rather than
    // waiting for a change relative to its (still empty) starting point.
    if (this.isNew()) {
      return true;
    }
    const item = this.item();
    if (!item) {
      return false;
    }
    if (this.nameValue() !== item.name) {
      return true;
    }
    if (!sameTags(this.editableTags(), item.tags)) {
      return true;
    }
    if (this.editableIconGlyph() !== item.iconGlyph) {
      return true;
    }
    const staged = this.editableFields();
    if (staged.length !== item.fields.length) {
      return true;
    }
    return staged.some((entry, i) => {
      const original = item.fields[i];
      return (
        entry.nameControl.value !== original.name ||
        entry.valueControl.value !== original.value ||
        entry.secret !== fieldIsSecret(original) ||
        entry.iconGlyph !== original.iconGlyph
      );
    });
  });

  protected readonly canSave = computed(() => {
    this.fieldsChangedTick();
    return (
      this.dirty() &&
      this.nameStatus() === 'VALID' &&
      this.editableFields().every((entry) => entry.nameControl.valid && entry.valueControl.valid)
    );
  });

  constructor() {
    effect(() => this.resetForm(this.item()));

    // Entering edit mode puts the caret in the name, matching what the legacy
    // `autofocus` input did. Keyed on `edit()` alone so it fires once per
    // transition rather than on every recomputation — and it gives up if focus
    // is already somewhere in this panel, since by the time the timeout runs the
    // user may have clicked into a field of their own.
    effect(() => {
      if (!this.edit()) {
        return;
      }
      untracked(() =>
        setTimeout(() => {
          const input = this.nameInput()?.nativeElement;
          if (input && !this.host.nativeElement.contains(document.activeElement)) {
            input.focus();
          }
        }),
      );
    });

    // Records "you opened this item" once per navigation — keyed on itemId()/
    // isNew() only (not item()), so editing the item afterwards doesn't
    // re-record it on every keystroke's worth of signal recomputation. A
    // brand-new, unsaved draft doesn't count as "used" yet; it isn't real
    // vault data until Save.
    effect(() => {
      const id = this.itemId();
      const isNew = this.isNew();
      if (isNew) {
        return;
      }

      untracked(() => {
        if (this.store.itemById(id)) {
          this.recentItems.recordVisit(id);
        }
      });
    });
  }

  protected bumpFieldsChanged(): void {
    this.fieldsChangedTick.update((tick) => tick + 1);
  }

  protected startEditing(): void {
    void this.router.navigate(['/items', this.itemId()], { queryParams: { edit: true } });
  }

  protected openAddField(): void {
    this.addingField.set(true);
  }

  /**
   * Adds a blank field of the chosen type and puts the cursor in it.
   *
   * The field arrives named after its type — "Password", "Card Number" — because
   * that is what it usually ends up being called, and a name that is already
   * right beats an empty one that has to be filled in before the field means
   * anything. It is an ordinary editable name, so renaming it costs nothing.
   */
  protected addField(definition: FieldDefinition): void {
    this.editableFields.update((fields) => [
      ...fields,
      editableFieldFrom({ name: definition.label, type: definition.type, value: '' }),
    ]);
    this.bumpFieldsChanged();
    this.addingField.set(false);

    setTimeout(() => this.fieldEditors().at(-1)?.focus());
  }

  /**
   * Asks before removing, rather than removing and offering an undo: the value
   * is a secret the user may hold nowhere else, and it is not on screen — a
   * masked field is a row of dots, so nobody can tell from looking whether the
   * one they are about to delete is the one they meant.
   */
  protected requestRemoveField(index: number): void {
    this.removingFieldIndex.set(index);
  }

  protected cancelRemoveField(): void {
    this.removingFieldIndex.set(null);
  }

  protected confirmRemoveField(): void {
    const index = this.removingFieldIndex();
    if (index === null) {
      return;
    }

    this.editableFields.update((fields) => fields.filter((_, i) => i !== index));
    this.bumpFieldsChanged();
    this.removingFieldIndex.set(null);
  }

  /**
   * Flips whether one staged field masks its value — the "***-style" toggle.
   *
   * Mutates the entry in place rather than replacing it in the array: `@for`
   * tracks `editableFields()` by entry identity (see `item-view.html`), so a
   * new object at the same index would tear down and rebuild that row's
   * `FieldValueEditor`, losing its own local reveal state. Same reason
   * `bumpFieldsChanged()` exists for the form controls below.
   */
  protected toggleFieldSecret(index: number): void {
    const entry = this.editableFields()[index];
    if (!entry) {
      return;
    }
    entry.secret = !entry.secret;
    this.bumpFieldsChanged();
  }

  protected openFieldIconPicker(index: number): void {
    this.fieldIconPickerIndex.set(index);
    this.fieldIconPickerOpen.set(true);
  }

  protected onFieldIconPicked(glyph: string | undefined): void {
    const index = this.fieldIconPickerIndex();
    const entry = index === null ? undefined : this.editableFields()[index];
    if (!entry) {
      return;
    }
    entry.iconGlyph = glyph;
    this.bumpFieldsChanged();
  }

  /**
   * Commits a tag — the typed draft by default, or one picked straight from
   * `tagSuggestions()`. A picked tag skips the draft's own validators: it was
   * already validated when it was first added to some item, so re-checking
   * it here would only reject it for reasons that don't apply to a pick.
   */
  protected addTag(pickedTag?: string): void {
    const value = (pickedTag ?? this.tagDraftControl.value).trim();

    if (!value || this.editableTags().includes(value)) {
      return;
    }
    if (pickedTag === undefined && this.tagDraftControl.invalid) {
      return;
    }

    this.editableTags.update((tags) => [...tags, value]);
    this.tagDraftControl.setValue('');
  }

  protected removeTag(tag: string): void {
    this.editableTags.update((tags) => tags.filter((existing) => existing !== tag));
  }

  protected onTagSearch(search: string): void {
    this.tagSearch.set(search);
    // The draft control is what validates a new name; keep it in step with the box.
    this.tagDraftControl.setValue(search);
  }

  /** A row was clicked: either an existing tag, or "Create <what was typed>". */
  protected onTagPicked(picked: unknown): void {
    if (typeof picked !== 'string') {
      return;
    }

    if (picked === NEW_TAG_VALUE) {
      // Goes through the draft control, so the validators still have their say.
      this.addTag();
    } else {
      this.addTag(picked);
    }

    this.tagSearch.set('');
    this.tagDraftControl.setValue('');
  }

  protected save(): void {
    if (!this.canSave()) {
      return;
    }

    const name = this.nameControl.value.trim();
    const fields = this.editableFields().map((entry) => ({
      name: entry.nameControl.value.trim(),
      type: entry.type,
      value: entry.valueControl.value,
      // Only stored when it overrides the type's own default — keeps an
      // un-toggled field's vault entry identical to what it always was.
      secret: entry.secret === fieldDefinition(entry.type).secret ? undefined : entry.secret,
      iconGlyph: entry.iconGlyph,
    }));
    const tags = this.editableTags();

    if (this.isNew()) {
      const draft = this.draftStore.get(this.itemId());
      if (!draft) {
        return;
      }

      const item = this.store.createItem({
        id: draft.id,
        vaultId: draft.vaultId,
        name,
        icon: draft.template.icon,
        iconGlyph: this.editableIconGlyph(),
        fields,
        tags,
      });

      this.draftStore.clear();
      void this.auditService.runAuditForItem(item.id);
      void this.vaultSync.syncNow();
      void this.router.navigate(['/items', item.id]);
      return;
    }

    const item = this.item();
    if (!item) {
      return;
    }

    this.store.updateItem(item.id, { name, fields, tags, iconGlyph: this.editableIconGlyph() });
    void this.auditService.runAuditForItem(item.id);
    void this.vaultSync.syncNow();
    void this.router.navigate(['/items', item.id]);
  }

  protected cancel(): void {
    if (this.isNew()) {
      this.draftStore.clear();
      void this.router.navigate(['/items']);
      return;
    }

    this.resetForm(this.item());
    void this.router.navigate(['/items', this.itemId()]);
  }

  protected openMove(): void {
    this.moveVaultControl.setValue(this.moveVaultOptions()[0]?.value ?? '');
    this.movingItem.set(true);
  }

  protected cancelMove(): void {
    this.movingItem.set(false);
  }

  protected confirmMove(): void {
    const item = this.item();
    const vaultId = this.moveVaultControl.value;
    if (!item || !vaultId) {
      return;
    }

    this.store.moveItem(item.id, vaultId);
    void this.vaultSync.syncNow();
    this.movingItem.set(false);
  }

  protected requestDelete(): void {
    this.deleteRequested.set(true);
  }

  protected cancelDelete(): void {
    this.deleteRequested.set(false);
  }

  protected confirmDelete(): void {
    const item = this.item();
    if (!item) {
      return;
    }

    this.store.deleteItem(item.id);
    this.recentItems.forget(item.id);
    void this.vaultSync.syncNow();
    this.deleteRequested.set(false);
    void this.router.navigate(['/items']);
  }

  private resetForm(item: VaultItem | undefined): void {
    this.nameControl.setValue(item?.name ?? '');
    this.editableFields.set((item?.fields ?? []).map(editableFieldFrom));
    this.editableTags.set([...(item?.tags ?? [])]);
    this.editableIconGlyph.set(item?.iconGlyph);
    this.tagDraftControl.setValue('');
  }

  protected openIconPicker(): void {
    this.iconPickerOpen.set(true);
  }

  protected onIconPicked(glyph: string | undefined): void {
    this.editableIconGlyph.set(glyph);
  }

  /** A brand-new, not-yet-saved item — same shape a real one would have, seeded from the draft's template. */
  private draftToItem(draft: ItemDraft): VaultItem {
    return {
      id: draft.id,
      vaultId: draft.vaultId,
      name: '',
      icon: draft.template.icon,
      fields: draft.template.fields.map((field) => ({
        name: field.name,
        type: field.type,
        value: field.value ?? '',
      })),
      tags: [],
      updated: new Date(),
      history: [],
    };
  }
}
