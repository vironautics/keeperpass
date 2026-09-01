import { IconName } from '../../ui/icon/icon-glyphs';
import { FieldType } from './field';

/** A field a new item starts out with. */
export interface ItemTemplateField {
  name: string;
  type: FieldType;
  /** Prefilled value; left out when the user is the one who supplies it. */
  value?: string;
}

/** One of the choices the create dialog offers, and the item it produces. */
export interface ItemTemplate {
  /** Stable slug, used to identify a template in code and in tests — never shown. */
  id: string;
  /** Shown on the template's button in the create dialog. */
  label: string;
  icon: IconName;
  fields: readonly ItemTemplateField[];
}

/**
 * The kinds of item the create dialog offers, in the order it offers them.
 *
 * A template is a head start, not a schema: it decides which fields the item
 * opens with, and from that point on every field can be renamed, retyped or
 * removed like any other. So the bar for adding one is low — it only has to save
 * more typing than choosing it costs — and the bar for the fields inside one is
 * "would nearly everyone filling this in want it", since deleting an unwanted
 * field is more work than adding a missing one.
 *
 * Ordered by how often each is reached for. `custom` is last and deliberately
 * empty: it is the escape hatch for everything this list does not cover, and it
 * would be a worse one if it arrived with fields to clear out first.
 */
export const ITEM_TEMPLATES: readonly ItemTemplate[] = [
  {
    id: 'website',
    label: 'Website or App',
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
    icon: 'computer',
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
      { name: 'Cardholder', type: FieldType.Text },
      { name: 'Expires On', type: FieldType.Month },
      // Two different secrets, and mixing them up locks the card: the CVC is
      // the code printed on it, the PIN the one typed into a terminal.
      { name: 'CVC', type: FieldType.Pin },
      { name: 'PIN', type: FieldType.Pin },
    ],
  },
  {
    id: 'bank-account',
    label: 'Bank Account',
    icon: 'bank',
    fields: [
      { name: 'Account Holder', type: FieldType.Text },
      { name: 'IBAN', type: FieldType.Text },
      { name: 'BIC', type: FieldType.Text },
      { name: 'Card PIN', type: FieldType.Pin },
    ],
  },
  {
    id: 'wifi',
    label: 'Wi-Fi Network',
    icon: 'wifi',
    fields: [
      { name: 'Network Name', type: FieldType.Text },
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
      { name: 'Issuing Country', type: FieldType.Text },
      { name: 'Date of Birth', type: FieldType.Date },
      { name: 'Place of Birth', type: FieldType.Text },
      { name: 'Issued On', type: FieldType.Date },
      { name: 'Expires On', type: FieldType.Date },
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
    fields: [{ name: 'Authenticator Code', type: FieldType.Totp }],
  },
  {
    id: 'custom',
    label: 'Custom',
    icon: 'custom',
    fields: [],
  },
];

/** What the create dialog starts on: the reason most people open it. */
export const DEFAULT_ITEM_TEMPLATE = ITEM_TEMPLATES[0];

/** `undefined` for an id this build doesn't know, which callers must handle. */
export function itemTemplateById(id: string): ItemTemplate | undefined {
  return ITEM_TEMPLATES.find((template) => template.id === id);
}
