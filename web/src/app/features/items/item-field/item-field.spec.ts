import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClipboardService } from '../../../core/clipboard/clipboard.service';
import { Field, FieldType } from '../../../core/models';
import { ItemField } from './item-field';

/** "12345678901234567890" — the RFC 6238 appendix B test secret, also used in totp.spec.ts. */
const RFC_6238_SECRET = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';

class FakeClipboardService {
  copied: string[] = [];

  async copy(value: string): Promise<void> {
    this.copied.push(value);
  }
}

describe('ItemField — copy', () => {
  let fixture: ComponentFixture<ItemField>;
  let clipboard: FakeClipboardService;

  const host = () => fixture.nativeElement as HTMLElement;
  const copyButton = () =>
    [...host().querySelectorAll<HTMLButtonElement>('button')].find(
      (b) => b.getAttribute('aria-label') === 'Copy value',
    )!;

  async function setField(field: Field): Promise<void> {
    fixture.componentRef.setInput('field', field);
    await fixture.whenStable();
  }

  beforeEach(async () => {
    clipboard = new FakeClipboardService();

    await TestBed.configureTestingModule({
      imports: [ItemField],
      providers: [{ provide: ClipboardService, useValue: clipboard }],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemField);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("copies a regular field's value as-is", async () => {
    await setField({ name: 'Username', type: FieldType.Username, value: 'ada' });

    copyButton().click();
    await fixture.whenStable();

    expect(clipboard.copied).toEqual(['ada']);
  });

  it('copies the current generated TOTP code, not the stored secret', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(59_000); // RFC 6238 vector at 59s → '287082'

    await setField({ name: 'One-Time Password', type: FieldType.Totp, value: RFC_6238_SECRET });

    copyButton().click();

    // Real Web Crypto doesn't resolve within a single `whenStable()` flush —
    // see unlock-page.spec.ts's `submit()` for the same pattern.
    await vi.waitFor(async () => {
      await fixture.whenStable();
      expect(clipboard.copied).toEqual(['287082']);
    });
    expect(clipboard.copied[0]).not.toBe(RFC_6238_SECRET);
  });

  it('does nothing for an invalid TOTP secret rather than copying garbage', async () => {
    await setField({
      name: 'One-Time Password',
      type: FieldType.Totp,
      value: 'not-valid-base32!!',
    });

    copyButton().click();
    await fixture.whenStable();

    expect(clipboard.copied).toEqual([]);
  });

  it('does nothing for an empty field', async () => {
    await setField({ name: 'Note', type: FieldType.Note, value: '' });

    copyButton().click();
    await fixture.whenStable();

    expect(clipboard.copied).toEqual([]);
  });
});
