import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { FieldType, ITEM_TEMPLATES } from '../../../core/models';
import { ItemDraftStore } from '../../../core/vault/item-draft.store';
import { PERSONAL_VAULT_ID, VaultStore } from '../../../core/vault/vault.store';
import { ItemView } from './item-view';

describe('ItemView', () => {
  let fixture: ComponentFixture<ItemView>;
  let store: VaultStore;
  let router: Router;
  let itemId: string;

  const host = () => fixture.nativeElement as HTMLElement;
  const nameInput = () => host().querySelector<HTMLInputElement>('input.name-input');
  const editButton = () =>
    [...host().querySelectorAll<HTMLButtonElement>('button')].find(
      (b) => b.getAttribute('aria-label') === 'Edit item',
    )!;
  const favouriteButton = () =>
    [...host().querySelectorAll<HTMLButtonElement>('button')].find(
      (b) => b.getAttribute('aria-label') === 'Favorite',
    )!;
  const moreOptionsButton = () =>
    [...host().querySelectorAll<HTMLButtonElement>('button')].find(
      (b) => b.getAttribute('aria-label') === 'More options',
    )!;

  /**
   * spartan's dialogs, menus and selects render into the CDK overlay container,
   * which is a sibling of the component host rather than inside it — so anything
   * that used to be found under `host()` is looked up here instead. Each dialog
   * carries an `aria-label` naming it, which is what tells the six apart.
   */
  const overlay = () => document.querySelector<HTMLElement>('.cdk-overlay-container')!;
  const dialog = (label: string) =>
    overlay().querySelector<HTMLElement>(`[aria-label="${label}"]`)!;
  const dialogIsOpen = (label: string) => !!overlay()?.querySelector(`[aria-label="${label}"]`);
  const buttonsIn = (label: string) => [
    ...dialog(label).querySelectorAll<HTMLButtonElement>('button'),
  ];
  const menuItems = () => [
    ...overlay().querySelectorAll<HTMLButtonElement>('[data-slot=dropdown-menu-item]'),
  ];

  const moveMenuItem = () => menuItems().find((b) => b.textContent?.includes('Move To Vault'))!;
  const deleteMenuItem = () => menuItems().find((b) => b.textContent?.includes('Delete Item'))!;
  const fieldRows = () => [...host().querySelectorAll('app-field-value-editor')];
  const fieldValueInputs = () => [
    ...host().querySelectorAll<HTMLInputElement>('app-field-value-editor input.value-input'),
  ];
  const fieldNameInputs = () => [
    ...host().querySelectorAll<HTMLInputElement>('app-field-value-editor input.name-input'),
  ];
  const fieldRemoveButtons = () => [
    ...host().querySelectorAll<HTMLButtonElement>('app-field-value-editor .field-remove'),
  ];
  const removeFieldDialogOpen = () => dialogIsOpen('Remove Field');
  const confirmRemoveFieldButton = () =>
    buttonsIn('Remove Field').find((b) => b.textContent?.includes('Remove'))!;
  const cancelRemoveFieldButton = () =>
    buttonsIn('Remove Field').find((b) => b.textContent?.includes('Cancel'))!;
  const saveCancelButtons = () => [
    ...host().querySelectorAll<HTMLButtonElement>('.save-cancel-row button'),
  ];
  const saveButton = () => saveCancelButtons().find((b) => b.textContent?.includes('Save'))!;
  const cancelButton = () => saveCancelButtons().find((b) => b.textContent?.includes('Cancel'))!;
  const addFieldTrigger = () => host().querySelector<HTMLButtonElement>('.add-field-trigger')!;
  const addFieldDialogOpen = () => dialogIsOpen('Add Field');
  const addFieldOptions = () => [
    ...dialog('Add Field').querySelectorAll<HTMLButtonElement>('.menu-row'),
  ];
  const moveDialogOpen = () => dialogIsOpen('Move To Vault');
  const moveSelectTrigger = () =>
    dialog('Move To Vault').querySelector<HTMLButtonElement>('button[data-slot=select-trigger]')!;
  const moveSelectOptions = () => [
    ...overlay().querySelectorAll<HTMLElement>('[data-slot=select-item]'),
  ];
  const moveConfirmButton = () =>
    buttonsIn('Move To Vault').find((b) => b.textContent?.trim() === 'Move')!;
  const moveCancelButton = () =>
    buttonsIn('Move To Vault').find((b) => b.textContent?.includes('Cancel'))!;
  const deleteDialogOpen = () => dialogIsOpen('Delete Item');
  const deleteConfirmButton = () =>
    buttonsIn('Delete Item').find((b) => b.textContent?.includes('Delete'))!;
  const deleteCancelButton = () =>
    buttonsIn('Delete Item').find((b) => b.textContent?.includes('Cancel'))!;
  const tagChips = () => [...host().querySelectorAll('.tags [data-slot=badge]')];
  const tagRemoveButton = (name: string) =>
    tagChips()
      .find((chip) => chip.textContent?.includes(name))!
      .querySelector<HTMLButtonElement>('.tag-remove')!;

  /** The tag picker is a combobox, so its list and search box live in the overlay. */
  const tagPickerTrigger = () =>
    host().querySelector<HTMLButtonElement>('.tag-picker [data-slot=combobox-trigger]')!;
  const tagSearchInput = () => overlay().querySelector<HTMLInputElement>('input')!;
  const tagOptions = () => [
    ...overlay().querySelectorAll<HTMLElement>('.tag-option:not([data-hidden])'),
  ];
  const tagCreateOption = () => overlay().querySelector<HTMLElement>('.tag-create');
  const historyRows = () => [...host().querySelectorAll<HTMLElement>('.history-row')];
  const historyEntryButtons = () => [
    ...host().querySelectorAll<HTMLButtonElement>('.history-entry-button'),
  ];
  const historyDeleteButtons = () => [
    ...host().querySelectorAll<HTMLButtonElement>('.history-delete'),
  ];
  const historyDialogOpen = () => dialogIsOpen('Version History');
  const historyDialogText = () => dialog('Version History').textContent ?? '';
  const restoreHistoryButton = () =>
    buttonsIn('Version History').find((b) => b.textContent?.includes('Restore'))!;
  const historyCancelButton = () =>
    buttonsIn('Version History').find((b) => b.textContent?.includes('Cancel'))!;
  const deleteHistoryDialogOpen = () => dialogIsOpen('Delete Version');
  const confirmDeleteHistoryButton = () =>
    buttonsIn('Delete Version').find((b) => b.textContent?.includes('Delete'))!;
  const cancelDeleteHistoryButton = () =>
    buttonsIn('Delete Version').find((b) => b.textContent?.includes('Cancel'))!;

  async function pressEnter(input: HTMLInputElement) {
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await fixture.whenStable();
  }

  function createTestItem(name = 'Original') {
    const template = ITEM_TEMPLATES.find((t) => t.id === 'website')!;
    return store.createItem({
      id: crypto.randomUUID(),
      vaultId: PERSONAL_VAULT_ID,
      name,
      icon: template.icon,
      fields: template.fields.map((field) => ({
        name: field.name,
        type: field.type,
        value: field.value ?? '',
      })),
      tags: [],
    });
  }

  async function typeInto(input: HTMLInputElement, value: string) {
    input.value = value;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  async function openTagPicker() {
    tagPickerTrigger().click();
    await fixture.whenStable();
  }

  /** Types a name into the picker's search box and takes its "Create …" row. */
  async function addTagByTyping(name: string) {
    await openTagPicker();
    await typeInto(tagSearchInput(), name);
    tagCreateOption()!.click();
    await fixture.whenStable();
  }

  async function enterEdit() {
    fixture.componentRef.setInput('edit', true);
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemView],
      providers: [provideRouter([])],
    }).compileComponents();

    store = TestBed.inject(VaultStore);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    store.hydrate({
      vaults: [
        { id: PERSONAL_VAULT_ID, name: 'My Vault' },
        { id: 'vault-work', name: 'Work' },
      ],
      items: [],
      organizations: [],
      favouriteIds: [],
    });

    itemId = createTestItem().id;

    fixture = TestBed.createComponent(ItemView);
    fixture.componentRef.setInput('itemId', itemId);
    await fixture.whenStable();
  });

  it('renders read-only fields and an enabled Edit button by default', () => {
    expect(host().querySelector('app-item-field')).toBeTruthy();
    expect(editButton().disabled).toBe(false);
  });

  it('clicking Edit navigates into edit mode via a query param', async () => {
    editButton().click();
    await fixture.whenStable();

    expect(router.navigate).toHaveBeenCalledWith(['/items', itemId], {
      queryParams: { edit: true },
    });
  });

  it('renders editable controls, seeded with current values, once edit is true', async () => {
    await enterEdit();

    expect(host().querySelector('h1')).toBeFalsy();
    expect(nameInput()!.value).toBe('Original');
    expect(fieldRows()).toHaveLength(3); // Username, Password, URL
    expect(fieldValueInputs()).toHaveLength(3);
    expect(host().querySelector('app-item-field')).toBeFalsy();
  });

  it('shows Save and Cancel as soon as edit mode starts, before anything changes', async () => {
    await enterEdit();

    expect(saveButton()).toBeTruthy();
    expect(cancelButton()).toBeTruthy();
    expect(cancelButton().disabled).toBe(false);
    // Nothing to save yet — Save itself stays disabled until the form is dirty.
    expect(saveButton().disabled).toBe(true);

    await typeInto(nameInput()!, 'Renamed');

    expect(saveButton().disabled).toBe(false);
  });

  it('Cancel works immediately after entering edit mode, with nothing changed', async () => {
    await enterEdit();

    cancelButton().click();
    await fixture.whenStable();

    expect(router.navigate).toHaveBeenCalledWith(['/items', itemId]);
  });

  it('keeps Save disabled while a field is invalid, even though dirty', async () => {
    await enterEdit();

    await typeInto(nameInput()!, '');

    expect(saveButton().disabled).toBe(true);
  });

  it('Save writes the edited name and field values, then leaves edit mode', async () => {
    await enterEdit();

    await typeInto(nameInput()!, 'Renamed');
    await typeInto(fieldValueInputs()[0], 'new-username');

    saveButton().click();
    await fixture.whenStable();

    const saved = store.itemById(itemId)!;
    expect(saved.name).toBe('Renamed');
    expect(saved.fields[0].value).toBe('new-username');
    expect(router.navigate).toHaveBeenCalledWith(['/items', itemId]);
  });

  it('Cancel discards edits without writing to the store', async () => {
    await enterEdit();

    await typeInto(nameInput()!, 'Renamed');
    cancelButton().click();
    await fixture.whenStable();

    expect(store.itemById(itemId)!.name).toBe('Original');
    expect(router.navigate).toHaveBeenCalledWith(['/items', itemId]);
  });

  it('resets the form when itemId changes mid-edit', async () => {
    await enterEdit();

    await typeInto(nameInput()!, 'Half-typed');

    const otherItemId = createTestItem('Other').id;
    fixture.componentRef.setInput('itemId', otherItemId);
    await fixture.whenStable();

    expect(nameInput()!.value).toBe('Other');
  });

  describe('Tags', () => {
    it('shows the item’s existing tags read-only outside edit mode', async () => {
      store.updateItem(itemId, { tags: ['work', 'infra'] });
      fixture = TestBed.createComponent(ItemView);
      fixture.componentRef.setInput('itemId', itemId);
      await fixture.whenStable();

      expect(tagChips()).toHaveLength(2);
      expect(tagChips().map((chip) => chip.textContent?.trim())).toEqual([
        expect.stringContaining('work'),
        expect.stringContaining('infra'),
      ]);
      expect(host().querySelector('.tag-picker')).toBeFalsy();
    });

    it('adds a typed tag through the picker and closes it, without saving yet', async () => {
      await enterEdit();

      await addTagByTyping('work');

      expect(tagChips()).toHaveLength(1);
      expect(store.itemById(itemId)!.tags).toEqual([]);
      expect(saveButton().disabled).toBe(false);
    });

    it('offers nothing to create for a blank name or one the item already has', async () => {
      await enterEdit();

      await openTagPicker();
      await typeInto(tagSearchInput(), '   ');
      expect(tagCreateOption()).toBeFalsy();
      expect(tagChips()).toHaveLength(0);

      await typeInto(tagSearchInput(), 'work');
      tagCreateOption()!.click();
      await fixture.whenStable();

      // Now that the item has it, the picker neither lists nor offers to create it.
      await openTagPicker();
      await typeInto(tagSearchInput(), 'work');
      expect(tagOptions()).toHaveLength(0);
      expect(tagCreateOption()).toBeFalsy();
      expect(tagChips()).toHaveLength(1);
    });

    it('keeps its own label after a pick, rather than showing the picked tag', async () => {
      await enterEdit();

      await addTagByTyping('work');

      expect(tagPickerTrigger().textContent).toContain('Add tag');
    });

    it('removes a tag via its remove button', async () => {
      store.updateItem(itemId, { tags: ['work', 'infra'] });
      await enterEdit();

      tagRemoveButton('work').click();
      await fixture.whenStable();

      expect(tagChips().map((chip) => chip.textContent)).not.toContain(
        expect.stringContaining('work'),
      );
      expect(tagChips()).toHaveLength(1);
      expect(saveButton().disabled).toBe(false);
    });

    it('Save persists added and removed tags', async () => {
      store.updateItem(itemId, { tags: ['work', 'infra'] });
      await enterEdit();

      tagRemoveButton('infra').click();
      await addTagByTyping('urgent');

      saveButton().click();
      await fixture.whenStable();

      expect(store.itemById(itemId)!.tags).toEqual(['work', 'urgent']);
    });

    it('Cancel discards tag edits without writing to the store', async () => {
      store.updateItem(itemId, { tags: ['work'] });
      await enterEdit();

      tagRemoveButton('work').click();
      await addTagByTyping('urgent');

      cancelButton().click();
      await fixture.whenStable();

      expect(store.itemById(itemId)!.tags).toEqual(['work']);
    });

    describe("the tag picker's list", () => {
      beforeEach(() => {
        // Tags from another item — count ties broken alphabetically, so
        // "infra" sorts before "urgent" (see VaultStore.tags()).
        const otherId = createTestItem('Other').id;
        store.updateItem(otherId, { tags: ['urgent', 'infra'] });
      });

      it('lists the tags already used elsewhere in the vault', async () => {
        await enterEdit();
        await openTagPicker();

        expect(tagOptions().map((o) => o.textContent?.trim())).toEqual([
          expect.stringContaining('infra'),
          expect.stringContaining('urgent'),
        ]);
      });

      it('filters the list as the search is typed', async () => {
        await enterEdit();
        await openTagPicker();

        await typeInto(tagSearchInput(), 'urg');

        expect(tagOptions().map((o) => o.textContent?.trim())).toEqual([
          expect.stringContaining('urgent'),
        ]);
      });

      it('excludes tags already on this item', async () => {
        store.updateItem(itemId, { tags: ['urgent'] });
        await enterEdit();
        await openTagPicker();

        expect(tagOptions().map((o) => o.textContent?.trim())).toEqual([
          expect.stringContaining('infra'),
        ]);
      });

      it('picking one from the list adds it as a tag', async () => {
        await enterEdit();
        await openTagPicker();

        tagOptions()
          .find((o) => o.textContent?.includes('infra'))!
          .click();
        await fixture.whenStable();

        expect(tagChips().map((chip) => chip.textContent)).toEqual([
          expect.stringContaining('infra'),
        ]);
        expect(store.itemById(itemId)!.tags).toEqual([]); // not saved yet
      });
    });
  });

  describe('Add Field', () => {
    it('is always present while editing, even before anything changes', async () => {
      await enterEdit();
      expect(addFieldTrigger()).toBeTruthy();
      expect(saveButton().disabled).toBe(true); // present, but nothing to save yet
    });

    it('opens as a modal dialog, not an anchored popover', async () => {
      await enterEdit();
      expect(addFieldDialogOpen()).toBe(false);

      addFieldTrigger().click();
      await fixture.whenStable();

      expect(addFieldDialogOpen()).toBe(true);
    });

    it('offers every field type, in FIELD_DEFINITIONS order', async () => {
      await enterEdit();
      addFieldTrigger().click();
      await fixture.whenStable();

      // The glyph is a sibling of the label, so read the title slot rather than the whole row.
      const labels = addFieldOptions().map((b) =>
        b.querySelector('[data-slot=item-title]')?.textContent?.trim(),
      );
      expect(labels).toEqual([
        'Username',
        'Password',
        'Email',
        'URL',
        'Date',
        'Month',
        'Card Number',
        'Phone',
        'PIN',
        'Authenticator Code',
        'Formatted Note',
        'Text',
      ]);
    });

    it('adds a blank field of the chosen type, defaulting its name from the type, and closes the modal', async () => {
      await enterEdit();
      addFieldTrigger().click();
      await fixture.whenStable();

      addFieldOptions()
        .find((b) => b.textContent?.includes('PIN'))!
        .click();
      await fixture.whenStable();

      expect(fieldRows()).toHaveLength(4);
      expect(fieldNameInputs().at(-1)!.value).toBe('PIN');
      expect(fieldValueInputs().at(-1)!.value).toBe('');
      // Digits, but not a `number` input — see field-value-editor.spec.ts.
      expect(fieldValueInputs().at(-1)!.getAttribute('inputmode')).toBe('numeric');
      expect(addFieldDialogOpen()).toBe(false);
    });

    it('marks the form dirty as soon as a field is added, even before typing a value', async () => {
      await enterEdit();
      addFieldTrigger().click();
      await fixture.whenStable();
      addFieldOptions()[0].click();
      await fixture.whenStable();

      expect(saveButton().disabled).toBe(false);
    });

    it("lets a newly-added field's name be renamed", async () => {
      await enterEdit();
      addFieldTrigger().click();
      await fixture.whenStable();
      addFieldOptions()[0].click(); // Username
      await fixture.whenStable();

      await typeInto(fieldNameInputs().at(-1)!, 'Backup Username');

      expect(fieldNameInputs().at(-1)!.value).toBe('Backup Username');
    });

    it('Save persists the added field, alongside the existing ones', async () => {
      await enterEdit();
      addFieldTrigger().click();
      await fixture.whenStable();
      addFieldOptions()
        .find((b) => b.textContent?.includes('Email'))!
        .click();
      await fixture.whenStable();

      await typeInto(fieldNameInputs().at(-1)!, 'Recovery Email');
      await typeInto(fieldValueInputs().at(-1)!, 'me@example.com');

      saveButton().click();
      await fixture.whenStable();

      const saved = store.itemById(itemId)!;
      expect(saved.fields).toHaveLength(4);
      expect(saved.fields.at(-1)).toEqual({
        name: 'Recovery Email',
        type: FieldType.Email,
        value: 'me@example.com',
      });
    });

    it('Cancel discards an added field without writing to the store', async () => {
      await enterEdit();
      addFieldTrigger().click();
      await fixture.whenStable();
      addFieldOptions()[0].click();
      await fixture.whenStable();
      expect(fieldRows()).toHaveLength(4);

      cancelButton().click();
      await fixture.whenStable();

      expect(store.itemById(itemId)!.fields).toHaveLength(3);
    });

    describe('removing a field', () => {
      it('asks for confirmation rather than removing immediately', async () => {
        await enterEdit();

        fieldRemoveButtons()[0].click();
        await fixture.whenStable();

        expect(removeFieldDialogOpen()).toBe(true);
        expect(fieldRows()).toHaveLength(3); // nothing removed yet
      });

      it('removes the field, and only that one, once confirmed', async () => {
        await enterEdit();

        fieldRemoveButtons()[1].click(); // Password, of Username/Password/URL
        await fixture.whenStable();
        confirmRemoveFieldButton().click();
        await fixture.whenStable();

        expect(fieldRows()).toHaveLength(2);
        expect(fieldNameInputs().map((input) => input.value)).toEqual(['Username', 'URL']);
        expect(removeFieldDialogOpen()).toBe(false);
      });

      it('marks the form dirty once a field is actually removed', async () => {
        await enterEdit();
        fieldRemoveButtons()[0].click();
        await fixture.whenStable();

        confirmRemoveFieldButton().click();
        await fixture.whenStable();

        expect(saveButton().disabled).toBe(false);
      });

      it('Cancel leaves every field in place', async () => {
        await enterEdit();
        fieldRemoveButtons()[0].click();
        await fixture.whenStable();

        cancelRemoveFieldButton().click();
        await fixture.whenStable();

        expect(removeFieldDialogOpen()).toBe(false);
        expect(fieldRows()).toHaveLength(3);
        expect(saveButton().disabled).toBe(true); // still nothing to save
      });

      it('Save persists a removal, alongside any other edits', async () => {
        await enterEdit();
        fieldRemoveButtons()[0].click(); // Username
        await fixture.whenStable();
        confirmRemoveFieldButton().click();
        await fixture.whenStable();

        saveButton().click();
        await fixture.whenStable();

        const saved = store.itemById(itemId)!;
        expect(saved.fields).toHaveLength(2);
        expect(saved.fields.map((field) => field.name)).toEqual(['Password', 'URL']);
      });

      it('Cancelling the whole edit undoes a staged removal, without writing to the store', async () => {
        await enterEdit();
        fieldRemoveButtons()[0].click();
        await fixture.whenStable();
        confirmRemoveFieldButton().click();
        await fixture.whenStable();
        expect(fieldRows()).toHaveLength(2);

        cancelButton().click();
        await fixture.whenStable();

        expect(store.itemById(itemId)!.fields).toHaveLength(3);
      });
    });
  });

  describe('Move to vault', () => {
    it('offers every vault except the item’s current one', async () => {
      moreOptionsButton().click();
      await fixture.whenStable();
      moveMenuItem().click();
      await fixture.whenStable();

      expect(moveDialogOpen()).toBe(true);

      moveSelectTrigger().click();
      await fixture.whenStable();

      const labels = moveSelectOptions().map((o) => o.textContent?.trim());
      expect(labels).toEqual(['Work']);
    });

    it('moves the item and closes, without leaving edit mode (there is none to leave)', async () => {
      moreOptionsButton().click();
      await fixture.whenStable();
      moveMenuItem().click();
      await fixture.whenStable();

      moveConfirmButton().click();
      await fixture.whenStable();

      expect(store.itemById(itemId)!.vaultId).toBe('vault-work');
      expect(moveDialogOpen()).toBe(false);
    });

    it('Cancel leaves the item in its original vault', async () => {
      moreOptionsButton().click();
      await fixture.whenStable();
      moveMenuItem().click();
      await fixture.whenStable();

      moveCancelButton().click();
      await fixture.whenStable();

      expect(store.itemById(itemId)!.vaultId).toBe(PERSONAL_VAULT_ID);
      expect(moveDialogOpen()).toBe(false);
    });
  });

  describe('Delete item', () => {
    it('asks for confirmation before deleting anything', async () => {
      moreOptionsButton().click();
      await fixture.whenStable();
      deleteMenuItem().click();
      await fixture.whenStable();

      expect(deleteDialogOpen()).toBe(true);
      expect(store.itemById(itemId)).toBeTruthy();
    });

    it('deletes the item and navigates back to the list on confirm', async () => {
      moreOptionsButton().click();
      await fixture.whenStable();
      deleteMenuItem().click();
      await fixture.whenStable();

      deleteConfirmButton().click();
      await fixture.whenStable();

      expect(store.itemById(itemId)).toBeUndefined();
      expect(router.navigate).toHaveBeenCalledWith(['/items']);
    });

    it('Cancel leaves the item untouched', async () => {
      moreOptionsButton().click();
      await fixture.whenStable();
      deleteMenuItem().click();
      await fixture.whenStable();

      deleteCancelButton().click();
      await fixture.whenStable();

      expect(store.itemById(itemId)).toBeTruthy();
      expect(deleteDialogOpen()).toBe(false);
    });
  });

  describe('Favorite', () => {
    it('toggles on click, reflected in the button state', async () => {
      expect(favouriteButton().getAttribute('aria-pressed')).toBe('false');

      favouriteButton().click();
      await fixture.whenStable();

      expect(store.isFavourite(itemId)).toBe(true);
      expect(favouriteButton().getAttribute('aria-pressed')).toBe('true');
    });
  });

  describe('New item (unsaved draft)', () => {
    let draftStore: ItemDraftStore;
    let draftId: string;
    let itemsBefore: number;

    beforeEach(async () => {
      draftStore = TestBed.inject(ItemDraftStore);
      const template = ITEM_TEMPLATES.find((t) => t.id === 'website')!;
      draftId = draftStore.start(PERSONAL_VAULT_ID, template);
      itemsBefore = store.items().length; // the outer beforeEach's `itemId` item — a draft adds nothing to this

      fixture = TestBed.createComponent(ItemView);
      fixture.componentRef.setInput('itemId', draftId);
      fixture.componentRef.setInput('edit', true);
      fixture.componentRef.setInput('new', true);
      await fixture.whenStable();
    });

    it('renders the template’s fields, empty, with an empty name — and nothing in the store yet', () => {
      expect(nameInput()!.value).toBe('');
      expect(fieldRows()).toHaveLength(3);
      expect(fieldValueInputs().every((input) => input.value === '')).toBe(true);
      expect(store.itemById(draftId)).toBeUndefined();
      expect(store.items()).toHaveLength(itemsBefore);
    });

    it('keeps Save disabled until a name is entered', async () => {
      expect(saveButton().disabled).toBe(true);

      await typeInto(nameInput()!, 'GitHub');

      expect(saveButton().disabled).toBe(false);
    });

    it('does not write to the store while still composing', async () => {
      await typeInto(nameInput()!, 'GitHub');
      await typeInto(fieldValueInputs()[0], 'ada');

      expect(store.items()).toHaveLength(itemsBefore);
    });

    it('Save creates the item (with that exact id), clears the draft, and syncs', async () => {
      await typeInto(nameInput()!, 'GitHub');
      await typeInto(fieldValueInputs()[0], 'ada');

      saveButton().click();
      await fixture.whenStable();

      const saved = store.itemById(draftId)!;
      expect(saved).toBeTruthy();
      expect(saved.name).toBe('GitHub');
      expect(saved.fields[0].value).toBe('ada');
      expect(saved.vaultId).toBe(PERSONAL_VAULT_ID);
      expect(store.items()).toHaveLength(itemsBefore + 1);
      expect(draftStore.get(draftId)).toBeUndefined();
      expect(router.navigate).toHaveBeenCalledWith(['/items', draftId]);
    });

    it('Cancel discards the draft and returns to the list, without touching the store', async () => {
      await typeInto(nameInput()!, 'Half-typed');

      cancelButton().click();
      await fixture.whenStable();

      expect(store.items()).toHaveLength(itemsBefore);
      expect(draftStore.get(draftId)).toBeUndefined();
      expect(router.navigate).toHaveBeenCalledWith(['/items']);
    });

    it('hides the History section — there is no history for something not yet saved', () => {
      expect(host().textContent).not.toContain('History');
    });
  });

  describe('History', () => {
    it('lists each past version, most recent first, alongside the current one', async () => {
      store.updateItem(itemId, { name: 'Second' });
      store.updateItem(itemId, { name: 'Third' });
      await fixture.whenStable();

      expect(historyRows()).toHaveLength(2);
    });

    it('opens a version on click, showing its name, tags and fields', async () => {
      // updateItem() snapshots the *pre*-patch state — give the item a tag
      // first, then rename it, so the resulting history entry (the state
      // right after the first update) has both a name and a tag to show.
      store.updateItem(itemId, { tags: ['work'] });
      store.updateItem(itemId, { name: 'Renamed' });
      await fixture.whenStable();

      historyEntryButtons()[0].click();
      await fixture.whenStable();

      expect(historyDialogOpen()).toBe(true);
      expect(historyDialogText()).toContain('Original');
      expect(historyDialogText()).toContain('work');
    });

    it('Restore applies the old name/fields/tags, snapshotting the current state first', async () => {
      store.updateItem(itemId, { name: 'Renamed' });
      await fixture.whenStable();

      historyEntryButtons()[0].click();
      await fixture.whenStable();
      restoreHistoryButton().click();
      await fixture.whenStable();

      const item = store.itemById(itemId)!;
      expect(item.name).toBe('Original');
      expect(item.history[0].name).toBe('Renamed'); // the pre-restore state, preserved
      expect(historyDialogOpen()).toBe(false);
    });

    it('Cancel leaves the item untouched', async () => {
      store.updateItem(itemId, { name: 'Renamed' });
      await fixture.whenStable();

      historyEntryButtons()[0].click();
      await fixture.whenStable();
      historyCancelButton().click();
      await fixture.whenStable();

      expect(store.itemById(itemId)!.name).toBe('Renamed');
      expect(historyDialogOpen()).toBe(false);
    });

    it('deletes a version after confirming, and only that one', async () => {
      store.updateItem(itemId, { name: 'Second' });
      store.updateItem(itemId, { name: 'Third' });
      await fixture.whenStable();
      expect(store.itemById(itemId)!.history).toHaveLength(2);

      historyDeleteButtons()[0].click();
      await fixture.whenStable();
      expect(deleteHistoryDialogOpen()).toBe(true);

      confirmDeleteHistoryButton().click();
      await fixture.whenStable();

      const history = store.itemById(itemId)!.history;
      expect(history).toHaveLength(1);
      expect(deleteHistoryDialogOpen()).toBe(false);
    });

    it('Cancel deletes nothing', async () => {
      store.updateItem(itemId, { name: 'Second' });
      await fixture.whenStable();

      historyDeleteButtons()[0].click();
      await fixture.whenStable();
      cancelDeleteHistoryButton().click();
      await fixture.whenStable();

      expect(store.itemById(itemId)!.history).toHaveLength(1);
    });
  });
});
