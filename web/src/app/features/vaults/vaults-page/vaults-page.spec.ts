import { TestBed } from '@angular/core/testing';
import { VaultStore, PERSONAL_VAULT_ID } from '../../../core/vault/vault.store';
import { VaultSyncService } from '../../../core/vault/vault-sync.service';
import { VaultsPage } from './vaults-page';

describe('VaultsPage', () => {
  let store: VaultStore;
  let component: VaultsPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VaultsPage],
    }).compileComponents();

    store = TestBed.inject(VaultStore);
    const syncService = TestBed.inject(VaultSyncService);
    vi.spyOn(syncService, 'syncNow').mockResolvedValue(undefined);

    store.hydrate({
      vaults: [
        { id: PERSONAL_VAULT_ID, name: 'My Vault' },
        { id: 'vault-1', name: 'Vault One' },
      ],
      items: [],
      organizations: [],
      favouriteIds: [],
      tagRegistry: [],
    });

    const fixture = TestBed.createComponent(VaultsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('renaming vaults', () => {
    it('opens the rename dialog', () => {
      component['startRenaming']('vault-1', 'Vault One');
      expect(component['renamingVault']()).toEqual({ id: 'vault-1', name: 'Vault One' });
    });

    it('renames a vault', () => {
      component['startRenaming']('vault-1', 'Vault One');
      component['renameControl'].setValue('Vault One Updated');
      component['confirmRename']();

      expect(store.vaultById('vault-1')?.name).toBe('Vault One Updated');
    });

    it('detects duplicate names', () => {
      component['startRenaming']('vault-1', 'Vault One');
      component['renameControl'].setValue('My Vault');

      expect(component['renameIsDuplicate']()).toBe(true);
    });
  });

  describe('deleting vaults', () => {
    it('opens the delete dialog', () => {
      component['requestDelete']('vault-1', 'Vault One');
      expect(component['deletingVault']()).toEqual({ id: 'vault-1', name: 'Vault One' });
    });

    it('deletes a vault and moves items to personal vault', () => {
      store.createItem({ id: 'item-1', vaultId: 'vault-1', name: 'Item', fields: [], tags: [] });

      component['requestDelete']('vault-1', 'Vault One');
      component['confirmDelete']();

      expect(store.vaultById('vault-1')).toBeUndefined();
      expect(store.itemById('item-1')?.vaultId).toBe(PERSONAL_VAULT_ID);
    });

    it('prevents deleting the personal vault', () => {
      component['requestDelete'](PERSONAL_VAULT_ID, 'My Vault');
      expect(component['deletingVault']()).toBeNull();
    });
  });
});
