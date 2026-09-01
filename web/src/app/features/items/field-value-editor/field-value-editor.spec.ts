import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { FieldType } from '../../../core/models';
import { FieldValueEditor } from './field-value-editor';

@Component({
  imports: [FieldValueEditor],
  template: `<app-field-value-editor
    [type]="type()"
    [nameControl]="nameControl()"
    [valueControl]="valueControl()"
    (changed)="changedCount = changedCount + 1"
    (remove)="removeCount = removeCount + 1"
  />`,
})
class Host {
  readonly type = signal(FieldType.Username);
  readonly nameControl = signal(new FormControl('Username', { nonNullable: true }));
  readonly valueControl = signal(new FormControl('', { nonNullable: true }));
  readonly editor = viewChild.required(FieldValueEditor);
  changedCount = 0;
  removeCount = 0;
}

describe('FieldValueEditor', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;

  const element = () => fixture.nativeElement as HTMLElement;
  // The marker classes are on the controls themselves now, not on a wrapper.
  const nameField = () => element().querySelector<HTMLInputElement>('input.name-input')!;
  const valueField = () => element().querySelector<HTMLInputElement>('input.value-input')!;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await fixture.whenStable();
  });

  const nativeTypeFor = async (type: FieldType) => {
    host.type.set(type);
    await fixture.whenStable();
    return valueField()?.getAttribute('type');
  };

  const attributeFor = async (type: FieldType, attribute: string) => {
    host.type.set(type);
    await fixture.whenStable();
    return valueField()?.getAttribute(attribute);
  };

  it('maps each FieldType to the right native input type', async () => {
    expect(await nativeTypeFor(FieldType.Email)).toBe('email');
    expect(await nativeTypeFor(FieldType.Url)).toBe('url');
    expect(await nativeTypeFor(FieldType.Phone)).toBe('tel');
    expect(await nativeTypeFor(FieldType.Password)).toBe('password');
    expect(await nativeTypeFor(FieldType.Username)).toBe('text');
    expect(await nativeTypeFor(FieldType.Totp)).toBe('text');
    expect(await nativeTypeFor(FieldType.Text)).toBe('text');
  });

  it('gives digits-only values a numeric keypad rather than type=number', async () => {
    // `type="number"` brings a spinner, accepts `1e5`, and can drop a leading zero,
    // none of which a PIN or a card number wants.
    expect(await attributeFor(FieldType.Pin, 'inputmode')).toBe('numeric');
    expect(await attributeFor(FieldType.Credit, 'inputmode')).toBe('numeric');
  });

  it('gives dates a picker instead of a native date input', async () => {
    host.type.set(FieldType.Date);
    await fixture.whenStable();
    expect(element().querySelector('hlm-date-picker')).toBeTruthy();
    expect(element().querySelector('input.value-input')).toBeFalsy();

    host.type.set(FieldType.Month);
    await fixture.whenStable();
    expect(element().querySelector('hlm-month-year-picker')).toBeTruthy();
    expect(element().querySelector('input.value-input')).toBeFalsy();
  });

  it('renders a textarea, not an input, for Note fields', async () => {
    host.type.set(FieldType.Note);
    await fixture.whenStable();

    expect(element().querySelector('textarea.value-input')).toBeTruthy();
    expect(element().querySelector('input.value-input')).toBeFalsy();
    // The name field is still a plain input either way.
    expect(element().querySelector('input.name-input')).toBeTruthy();
  });

  it('only Password fields get the reveal toggle', async () => {
    host.type.set(FieldType.Password);
    await fixture.whenStable();
    expect(element().querySelector('.reveal')).toBeTruthy();

    host.type.set(FieldType.Username);
    await fixture.whenStable();
    expect(element().querySelector('.reveal')).toBeFalsy();
  });

  it('writes typed text through to the passed-in value control', async () => {
    valueField().value = 'hello';
    valueField().dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(host.valueControl().value).toBe('hello');
  });

  it('writes typed text through to the passed-in name control', async () => {
    nameField().value = 'Backup Password';
    nameField().dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(host.nameControl().value).toBe('Backup Password');
  });

  it('reflects programmatic control updates', async () => {
    host.valueControl().setValue('set externally');
    await fixture.whenStable();

    expect(valueField().value).toBe('set externally');
  });

  it('emits changed when the value control changes', async () => {
    valueField().value = 'hello';
    valueField().dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(host.changedCount).toBe(1);
  });

  it('emits changed when the name control changes', async () => {
    nameField().value = 'Renamed';
    nameField().dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(host.changedCount).toBe(1);
  });

  it('emits remove when its remove button is clicked', () => {
    const removeButton = element().querySelector<HTMLButtonElement>('.field-remove')!;

    removeButton.click();

    expect(host.removeCount).toBe(1);
  });

  it('re-subscribes when given a new control instance', async () => {
    host.valueControl.set(new FormControl('replaced', { nonNullable: true }));
    await fixture.whenStable();

    expect(valueField().value).toBe('replaced');

    host.valueControl().setValue('changed again');
    await fixture.whenStable();
    expect(host.changedCount).toBe(1);
  });

  describe('focus()', () => {
    it('focuses the name field when the name is empty (a freshly-added field)', async () => {
      host.nameControl.set(new FormControl('', { nonNullable: true }));
      await fixture.whenStable();

      host.editor().focus();
      expect(document.activeElement).toBe(nameField());
    });

    it('focuses the value field when the name is already filled in', async () => {
      host.nameControl.set(new FormControl('Username', { nonNullable: true }));
      await fixture.whenStable();

      host.editor().focus();
      expect(document.activeElement).toBe(valueField());
    });
  });
});
