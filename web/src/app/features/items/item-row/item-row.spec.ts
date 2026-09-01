import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ClipboardService } from '../../../core/clipboard/clipboard.service';
import { Field, FieldType, VaultItem } from '../../../core/models';
import { ItemRow } from './item-row';

/** "12345678901234567890" — the RFC 6238 appendix B test secret, also used in totp.spec.ts. */
const RFC_6238_SECRET = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';

class FakeClipboardService {
  copied: string[] = [];

  async copy(value: string): Promise<void> {
    this.copied.push(value);
  }
}

function itemWithFields(fields: Field[]): VaultItem {
  return {
    id: 'item-1',
    vaultId: 'vault-personal',
    name: 'Item',
    fields,
    tags: [],
    updated: new Date(),
    history: [],
  };
}

describe('ItemRow — copy', () => {
  let fixture: ComponentFixture<ItemRow>;
  let clipboard: FakeClipboardService;

  const host = () => fixture.nativeElement as HTMLElement;
  const fieldButtons = () => [
    ...host().querySelectorAll<HTMLButtonElement>('[data-slot=item-footer] button[data-slot=item]'),
  ];

  beforeEach(async () => {
    clipboard = new FakeClipboardService();

    await TestBed.configureTestingModule({
      imports: [ItemRow],
      providers: [provideRouter([]), { provide: ClipboardService, useValue: clipboard }],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemRow);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("copies a regular field's value as-is", async () => {
    fixture.componentRef.setInput(
      'item',
      itemWithFields([{ name: 'Username', type: FieldType.Username, value: 'ada' }]),
    );
    await fixture.whenStable();

    fieldButtons()[0].click();
    await fixture.whenStable();

    expect(clipboard.copied).toEqual(['ada']);
  });

  it('copies the current generated TOTP code, not the stored secret', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(59_000); // RFC 6238 vector at 59s → '287082'

    fixture.componentRef.setInput(
      'item',
      itemWithFields([{ name: 'One-Time Password', type: FieldType.Totp, value: RFC_6238_SECRET }]),
    );
    await fixture.whenStable();

    fieldButtons()[0].click();

    // Real Web Crypto doesn't resolve within a single `whenStable()` flush —
    // see unlock-page.spec.ts's `submit()` for the same pattern.
    await vi.waitFor(async () => {
      await fixture.whenStable();
      expect(clipboard.copied).toEqual(['287082']);
    });
    expect(clipboard.copied[0]).not.toBe(RFC_6238_SECRET);
  });

  it('does nothing for an invalid TOTP secret rather than copying garbage', async () => {
    fixture.componentRef.setInput(
      'item',
      itemWithFields([
        { name: 'One-Time Password', type: FieldType.Totp, value: 'not-valid-base32!!' },
      ]),
    );
    await fixture.whenStable();

    fieldButtons()[0].click();
    await fixture.whenStable();

    expect(clipboard.copied).toEqual([]);
  });
});
