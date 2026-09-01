import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VaultStore } from '../../../core/vault/vault.store';
import { CreateVaultDialog } from './create-vault-dialog';

describe('CreateVaultDialog', () => {
  let fixture: ComponentFixture<CreateVaultDialog>;
  let store: VaultStore;

  /**
   * The dialog renders into the CDK overlay container — a sibling of the fixture's
   * host, not a descendant — so everything is looked up from `document`. See
   * "Testing a spartan surface" in SPARTAN.md.
   */
  const dialog = () =>
    document.querySelector<HTMLElement>('.cdk-overlay-container [aria-label="New Vault"]')!;
  const nameInput = () => dialog().querySelector<HTMLInputElement>('input')!;
  const footerButtons = () => [
    ...dialog().querySelectorAll<HTMLButtonElement>('[data-slot=dialog-footer] button'),
  ];
  const cancelButton = () => footerButtons()[0];
  const createButton = () => footerButtons()[1];

  const open = async () => {
    fixture.componentInstance.open.set(true);
    await fixture.whenStable();
  };

  const type = async (value: string) => {
    nameInput().value = value;
    nameInput().dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CreateVaultDialog] }).compileComponents();

    store = TestBed.inject(VaultStore);
    fixture = TestBed.createComponent(CreateVaultDialog);
    await fixture.whenStable();
  });

  it('keeps Create disabled until a name is entered', async () => {
    await open();
    expect(createButton().disabled).toBe(true);

    await type('Family');
    expect(createButton().disabled).toBe(false);
  });

  it('creates a vault with the given name and closes', async () => {
    await open();
    await type('Family');

    const before = store.vaults().length;
    createButton().click();
    await fixture.whenStable();

    expect(store.vaults().length).toBe(before + 1);
    expect(store.vaults().at(-1)!.name).toBe('Family');
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('trims surrounding whitespace from the name', async () => {
    await open();
    await type('  Family  ');

    createButton().click();
    await fixture.whenStable();

    expect(store.vaults().at(-1)!.name).toBe('Family');
  });

  it('adds nothing when cancelled', async () => {
    await open();
    await type('Family');

    const before = store.vaults().length;
    cancelButton().click();
    await fixture.whenStable();

    expect(store.vaults().length).toBe(before);
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('starts fresh each time it opens', async () => {
    await open();
    await type('Half-typed');

    cancelButton().click();
    await fixture.whenStable();
    await open();

    expect(nameInput().value).toBe('');
  });
});
