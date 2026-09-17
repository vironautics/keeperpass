import { TranslationKey } from '../i18n/translations';
import { IconName } from '../../ui/icon/icon-glyphs';
import { FieldType } from './field';

/** A field a new item starts out with. */
export interface ItemTemplateField {
  nameKey: TranslationKey;
  type: FieldType;
  /** Prefilled value; left out when the user is the one who supplies it. */
  value?: string;
}

/** One of the choices the create dialog offers, and the item it produces. */
export interface ItemTemplate {
  /** Stable slug, used to identify a template in code and in tests — never shown. */
  id: string;
  /** Shown on the template's button in the create dialog. */
  labelKey: TranslationKey;
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
    labelKey: 'items.templates.website',
    icon: 'web',
    fields: [
      { nameKey: 'field.type.username', type: FieldType.Username },
      { nameKey: 'field.type.password', type: FieldType.Password },
      { nameKey: 'field.type.url', type: FieldType.Url },
    ],
  },
  {
    id: 'computer',
    labelKey: 'items.templates.computer',
    icon: 'computer',
    fields: [
      { nameKey: 'field.type.username', type: FieldType.Username },
      { nameKey: 'field.type.password', type: FieldType.Password },
    ],
  },
  {
    id: 'credit-card',
    labelKey: 'items.templates.creditCard',
    icon: 'credit',
    fields: [
      { nameKey: 'field.type.credit', type: FieldType.Credit },
      { nameKey: 'items.templates.fields.cardholder', type: FieldType.Text },
      { nameKey: 'items.templates.fields.expiresOn', type: FieldType.Month },
      // Two different secrets, and mixing them up locks the card: the CVC is
      // the code printed on it, the PIN the one typed into a terminal.
      { nameKey: 'items.templates.fields.cvc', type: FieldType.Pin },
      { nameKey: 'field.type.pin', type: FieldType.Pin },
    ],
  },
  {
    id: 'bank-account',
    labelKey: 'items.templates.bankAccount',
    icon: 'bank',
    fields: [
      { nameKey: 'items.templates.fields.accountHolder', type: FieldType.Text },
      { nameKey: 'items.templates.fields.iban', type: FieldType.Text },
      { nameKey: 'items.templates.fields.bic', type: FieldType.Text },
      { nameKey: 'items.templates.fields.cardPin', type: FieldType.Pin },
    ],
  },
  {
    id: 'wifi',
    labelKey: 'items.templates.wifi',
    icon: 'wifi',
    fields: [
      { nameKey: 'items.templates.fields.networkName', type: FieldType.Text },
      { nameKey: 'field.type.password', type: FieldType.Password },
    ],
  },
  {
    id: 'passport',
    labelKey: 'items.templates.passport',
    icon: 'passport',
    fields: [
      { nameKey: 'items.templates.fields.fullName', type: FieldType.Text },
      { nameKey: 'items.templates.fields.passportNumber', type: FieldType.Text },
      { nameKey: 'items.templates.fields.issuingCountry', type: FieldType.Text },
      { nameKey: 'items.templates.fields.dateOfBirth', type: FieldType.Date },
      { nameKey: 'items.templates.fields.placeOfBirth', type: FieldType.Text },
      { nameKey: 'items.templates.fields.issuedOn', type: FieldType.Date },
      { nameKey: 'items.templates.fields.expiresOn', type: FieldType.Date },
    ],
  },
  {
    id: 'note',
    labelKey: 'items.templates.note',
    icon: 'note',
    fields: [{ nameKey: 'field.type.note', type: FieldType.Note }],
  },
  {
    id: 'authenticator',
    labelKey: 'items.templates.authenticator',
    icon: 'totp',
    fields: [{ nameKey: 'field.type.totp', type: FieldType.Totp }],
  },
  {
    id: 'custom',
    labelKey: 'items.templates.custom',
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
