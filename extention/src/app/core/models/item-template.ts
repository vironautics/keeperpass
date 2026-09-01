import { IconName } from '../../ui/icon/icon-glyphs';
import { FieldType } from './field';

/** A field an item starts with when created from a template. */
export interface ItemTemplateField {
  name: string;
  type: FieldType;
  /** Prefilled value; empty when the user is expected to supply it. */
  value?: string;
}

export interface ItemTemplate {
  id: string;
  /** Shown on the template's button in the create dialog. */
  label: string;
  icon: IconName;
  fields: readonly ItemTemplateField[];
}

/**
 * The kinds of item the create dialog offers, in the order it offers them.
 *
 * Ported from the source app's `ITEM_TEMPLATES`, minus `document` — the
 * source app's file-attachment template. It never got a real attachment-
 * upload flow here, so it created a permanently-empty item; removed rather
 * than left as a dead end. `custom` carries no fields on purpose: it starts
 * blank.
 */
export const ITEM_TEMPLATES: readonly ItemTemplate[] = [
  {
    id: 'website',
    label: 'Website / App',
    icon: 'web',
    fields: [
      { name: 'Username', type: FieldType.Username },
      { name: 'Password', type: FieldType.Password },
      { name: 'URL', type: FieldType.Url },
    ],
  },
  {
    id: 'computer',
    label: 'Computer',
    icon: 'desktop',
    fields: [
      { name: 'Username', type: FieldType.Username },
      { name: 'Password', type: FieldType.Password },
    ],
  },
  {
    id: 'credit-card',
    label: 'Credit Card',
    icon: 'credit',
    fields: [
      { name: 'Card Number', type: FieldType.Credit },
      { name: 'Card Owner', type: FieldType.Text },
      { name: 'Valid Until', type: FieldType.Month },
      { name: 'CVC', type: FieldType.Pin },
      { name: 'PIN', type: FieldType.Pin },
    ],
  },
  {
    id: 'bank-account',
    label: 'Bank Account',
    icon: 'bank',
    fields: [
      { name: 'Account Owner', type: FieldType.Text },
      { name: 'IBAN', type: FieldType.Text },
      { name: 'BIC', type: FieldType.Text },
      { name: 'Card PIN', type: FieldType.Pin },
    ],
  },
  {
    id: 'wifi',
    label: 'WIFI Password',
    icon: 'wifi',
    fields: [
      { name: 'Name', type: FieldType.Text },
      { name: 'Password', type: FieldType.Password },
    ],
  },
  {
    id: 'passport',
    label: 'Passport',
    icon: 'passport',
    fields: [
      { name: 'Full Name', type: FieldType.Text },
      { name: 'Passport Number', type: FieldType.Text },
      { name: 'Country', type: FieldType.Text },
      { name: 'Birthdate', type: FieldType.Date },
      { name: 'Birthplace', type: FieldType.Text },
      { name: 'Issued On', type: FieldType.Date },
      { name: 'Expires', type: FieldType.Date },
    ],
  },
  {
    id: 'note',
    label: 'Note',
    icon: 'note',
    fields: [{ name: 'Note', type: FieldType.Note }],
  },
  {
    id: 'authenticator',
    label: 'Authenticator',
    icon: 'totp',
    fields: [{ name: 'One-Time Password', type: FieldType.Totp }],
  },
  {
    id: 'custom',
    label: 'Custom',
    icon: 'custom',
    fields: [],
  },
];

export const DEFAULT_ITEM_TEMPLATE = ITEM_TEMPLATES[0];

export function itemTemplateById(id: string): ItemTemplate | undefined {
  return ITEM_TEMPLATES.find((template) => template.id === id);
}
