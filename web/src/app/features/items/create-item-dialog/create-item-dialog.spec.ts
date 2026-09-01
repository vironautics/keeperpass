import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ITEM_TEMPLATES } from '../../../core/models';
import { ItemDraftStore } from '../../../core/vault/item-draft.store';
import { PERSONAL_VAULT_ID, VaultStore } from '../../../core/vault/vault.store';
import { CreateItemDialog } from './create-item-dialog';

describe('CreateItemDialog', () => {
  let fixture: ComponentFixture<CreateItemDialog>;
  let store: VaultStore;
  let draftStore: ItemDraftStore;
  let router: Router;

  /**
   * The dialog renders into the CDK overlay container, a sibling of the component
   * host, so everything is looked up from there rather than under `host()`.
   */
  const dialog = () =>
    document.querySelector<HTMLElement>('.cdk-overlay-container [aria-label="New Vault Item"]')!;
  const templateButtons = () => [
    ...dialog().querySelectorAll<HTMLButtonElement>('.template-grid button.template'),
  ];
  const footerButtons = () => [
    ...dialog().querySelectorAll<HTMLButtonElement>('[data-slot=dialog-footer] button'),
  ];
  const cancelButton = () => footerButtons()[0];
  const createButton = () => footerButtons()[1];
  const vaultTriggerText = () =>
    dialog().querySelector<HTMLElement>('[data-slot=select-value]')?.textContent?.trim();
  const vaultOptions = async () => {
    dialog().querySelector<HTMLButtonElement>('button[data-slot=select-trigger]')!.click();
    await fixture.whenStable();
    return [
      ...document.querySelectorAll<HTMLElement>('.cdk-overlay-container [data-slot=select-item]'),
    ];
  };
  const pressedTemplates = () =>
    templateButtons()
      .filter((button) => button.getAttribute('aria-pressed') === 'true')
      .map((button) => button.textContent?.replace(/[^\x20-\x7E]/g, '').trim());

  const open = async () => {
    fixture.componentInstance.open.set(true);
    await fixture.whenStable();
  };

  const pickTemplate = async (label: string) => {
    templateButtons()
      .find((button) => button.textContent?.includes(label))!
      .click();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateItemDialog],
      providers: [provideRouter([])],
    }).compileComponents();

    store = TestBed.inject(VaultStore);
    draftStore = TestBed.inject(ItemDraftStore);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    // The dialog's vault picker needs more than the personal vault to be
    // worth testing — hydrate with a shared vault too, same shape `/unlock`
    // would after fetching a real account's data.
    store.hydrate({
      vaults: [
        { id: PERSONAL_VAULT_ID, name: 'My Vault' },
        { id: 'vault-engineering', name: 'Engineering', organizationId: 'org-northwind' },
        { id: 'vault-finance', name: 'Finance', organizationId: 'org-northwind' },
      ],
      items: [],
      organizations: [{ id: 'org-northwind', name: 'Northwind Design' }],
      favouriteIds: [],
    });

    fixture = TestBed.createComponent(CreateItemDialog);
    await fixture.whenStable();
  });

  it('offers every template, in the order the model lists them', async () => {
    await open();
    const labels = templateButtons().map((b) => b.textContent?.replace(/[^\x20-\x7E]/g, '').trim());
    expect(labels).toEqual(ITEM_TEMPLATES.map((t) => t.label));
  });

  it('defaults to the personal vault and the first template', async () => {
    await open();
    // The trigger shows the selected vault's label, which is what the user reads.
    expect(vaultTriggerText()).toBe(store.labelForVault(store.personalVault()!.id));
    expect(pressedTemplates()).toEqual(['Website or App']);
  });

  it('lists every vault by its qualified label', async () => {
    await open();
    const labels = (await vaultOptions()).map((o) => o.textContent?.trim());
    expect(labels).toEqual([
      'My Vault',
      'Northwind Design / Engineering',
      'Northwind Design / Finance',
    ]);
  });

  it('keeps exactly one template selected', async () => {
    await open();
    await pickTemplate('Credit Card');
    expect(pressedTemplates()).toEqual(['Credit Card']);
  });

  it('starts a draft in the chosen vault with the selected template, without touching the store', async () => {
    await open();
    await pickTemplate('Wi-Fi Network');

    createButton().click();
    await fixture.whenStable();

    expect(store.items()).toHaveLength(0);

    const [, id] = (router.navigate as ReturnType<typeof vi.fn>).mock.calls[0][0] as [
      string,
      string,
    ];
    const draft = draftStore.get(id)!;
    expect(draft).toBeTruthy();
    expect(draft.vaultId).toBe(store.personalVault()!.id);
    expect(draft.template.id).toBe('wifi');
  });

  it('navigates to the draft in edit mode and closes', async () => {
    await open();

    createButton().click();
    await fixture.whenStable();

    expect(router.navigate).toHaveBeenCalledTimes(1);
    const [route, options] = (router.navigate as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(route[0]).toBe('/items');
    expect(typeof route[1]).toBe('string');
    expect(options).toEqual({ queryParams: { edit: true, new: true } });
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('adds nothing, and starts no draft, when cancelled', async () => {
    await open();

    cancelButton().click();
    await fixture.whenStable();

    expect(store.items()).toHaveLength(0);
    expect(fixture.componentInstance.open()).toBe(false);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('starts fresh each time it opens', async () => {
    await open();
    await pickTemplate('Passport');

    cancelButton().click();
    await fixture.whenStable();
    await open();

    expect(pressedTemplates()).toEqual(['Website or App']);
    expect(vaultTriggerText()).toBe(store.labelForVault(store.personalVault()!.id));
  });
});
