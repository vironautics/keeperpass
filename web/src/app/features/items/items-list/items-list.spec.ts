import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { PERSONAL_VAULT_ID, VaultStore } from '../../../core/vault/vault.store';
import { ItemsList } from './items-list';

describe('ItemsList — bulk selection', () => {
  let fixture: ComponentFixture<ItemsList>;
  let store: VaultStore;

  const host = () => fixture.nativeElement as HTMLElement;
  const buttonLabelled = (label: string) =>
    [...host().querySelectorAll<HTMLButtonElement>('button')].find(
      (b) => b.getAttribute('aria-label') === label,
    )!;
  const selectButton = () => buttonLabelled('Select multiple items');
  const selectAllButton = () => buttonLabelled('Select or deselect all');
  const moveButton = () => buttonLabelled('Move selected items');
  const deleteButton = () => buttonLabelled('Delete selected items');
  const rowHeaders = () => [
    ...host().querySelectorAll<HTMLButtonElement>('app-item-row [role=checkbox]'),
  ];
  /**
   * spartan's dialogs and selects render into the CDK overlay container, a sibling of
   * the fixture's host, and a closed one is not in the DOM at all — so presence is
   * what "open" means, and everything is looked up from `document`.
   */
  const overlay = () => document.querySelector<HTMLElement>('.cdk-overlay-container')!;
  const dialog = (label: string) =>
    overlay().querySelector<HTMLElement>(`[aria-label="${label}"]`)!;
  const dialogIsOpen = (label: string) => !!overlay()?.querySelector(`[aria-label="${label}"]`);
  const dialogButton = (label: string, text: string) =>
    [...dialog(label).querySelectorAll<HTMLButtonElement>('button')].find((b) =>
      b.textContent?.includes(text),
    )!;
  const moveSelectTrigger = () =>
    dialog('Move To Vault').querySelector<HTMLButtonElement>('button[data-slot=select-trigger]')!;
  const moveSelectOptions = () => [
    ...overlay().querySelectorAll<HTMLElement>('[data-slot=select-item]'),
  ];

  async function openMoveSelect() {
    moveSelectTrigger().click();
    await fixture.whenStable();
  }

  async function enterSelectionMode() {
    selectButton().click();
    await fixture.whenStable();
  }

  async function selectFirstTwoRows() {
    rowHeaders()[0].click();
    rowHeaders()[1].click();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsList],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } },
      ],
    }).compileComponents();

    store = TestBed.inject(VaultStore);
    store.hydrate({
      vaults: [
        { id: PERSONAL_VAULT_ID, name: 'My Vault' },
        { id: 'vault-work', name: 'Work' },
      ],
      items: [],
      organizations: [],
      favouriteIds: [],
    });
    // Named so alphabetical order (see item-filter.ts's sort by name) matches
    // creation order — "first two rows" then unambiguously means item-1/item-2.
    store.createItem({
      id: 'item-1',
      vaultId: PERSONAL_VAULT_ID,
      name: 'Item A',
      fields: [],
      tags: [],
    });
    store.createItem({
      id: 'item-2',
      vaultId: PERSONAL_VAULT_ID,
      name: 'Item B',
      fields: [],
      tags: [],
    });
    store.createItem({
      id: 'item-3',
      vaultId: PERSONAL_VAULT_ID,
      name: 'Item C',
      fields: [],
      tags: [],
    });

    fixture = TestBed.createComponent(ItemsList);
    await fixture.whenStable();
  });

  it('disables Move and Delete until something is selected', async () => {
    await enterSelectionMode();

    expect(moveButton().disabled).toBe(true);
    expect(deleteButton().disabled).toBe(true);

    await selectFirstTwoRows();

    expect(moveButton().disabled).toBe(false);
    expect(deleteButton().disabled).toBe(false);
  });

  describe('Move selected items', () => {
    it('offers every vault as a destination', async () => {
      await enterSelectionMode();
      await selectFirstTwoRows();

      moveButton().click();
      await fixture.whenStable();

      expect(dialogIsOpen('Move To Vault')).toBe(true);
      await openMoveSelect();
      const labels = moveSelectOptions().map((o) => o.textContent?.trim());
      expect(labels).toEqual(['My Vault', 'Work']);
    });

    it('moves exactly the selected items, leaves the rest, and returns to the normal list', async () => {
      await enterSelectionMode();
      await selectFirstTwoRows();

      moveButton().click();
      await fixture.whenStable();

      await openMoveSelect();
      moveSelectOptions()
        .find((o) => o.textContent?.includes('Work'))!
        .click();
      await fixture.whenStable();

      dialogButton('Move To Vault', 'Move').click();
      await fixture.whenStable();

      expect(store.itemById('item-1')!.vaultId).toBe('vault-work');
      expect(store.itemById('item-2')!.vaultId).toBe('vault-work');
      expect(store.itemById('item-3')!.vaultId).toBe(PERSONAL_VAULT_ID);
      expect(dialogIsOpen('Move To Vault')).toBe(false);
      // Back to the normal header — selection mode ended.
      expect(selectButton()).toBeTruthy();
    });

    it('Cancel leaves every item in its original vault', async () => {
      await enterSelectionMode();
      await selectFirstTwoRows();

      moveButton().click();
      await fixture.whenStable();
      dialogButton('Move To Vault', 'Cancel').click();
      await fixture.whenStable();

      expect(store.itemById('item-1')!.vaultId).toBe(PERSONAL_VAULT_ID);
      expect(store.itemById('item-2')!.vaultId).toBe(PERSONAL_VAULT_ID);
      expect(dialogIsOpen('Move To Vault')).toBe(false);
    });
  });

  describe('Delete selected items', () => {
    it('deletes exactly the selected items and returns to the normal list', async () => {
      await enterSelectionMode();
      await selectFirstTwoRows();

      deleteButton().click();
      await fixture.whenStable();
      expect(dialogIsOpen('Delete Items')).toBe(true);

      dialogButton('Delete Items', 'Delete').click();
      await fixture.whenStable();

      expect(store.itemById('item-1')).toBeUndefined();
      expect(store.itemById('item-2')).toBeUndefined();
      expect(store.itemById('item-3')).toBeTruthy();
      expect(dialogIsOpen('Delete Items')).toBe(false);
      expect(selectButton()).toBeTruthy();
    });

    it('Cancel deletes nothing', async () => {
      await enterSelectionMode();
      await selectFirstTwoRows();

      deleteButton().click();
      await fixture.whenStable();
      dialogButton('Delete Items', 'Cancel').click();
      await fixture.whenStable();

      expect(store.itemById('item-1')).toBeTruthy();
      expect(store.itemById('item-2')).toBeTruthy();
      expect(dialogIsOpen('Delete Items')).toBe(false);
    });
  });
});
