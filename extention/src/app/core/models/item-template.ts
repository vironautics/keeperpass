import { TranslationKey } from '../i18n/translations';
import { IconName } from '../../ui/icon/icon-glyphs';
import { FieldType } from './field';

/** A field an item starts with when created from a template. */
export interface ItemTemplateField {
  nameKey: TranslationKey;
  type: FieldType;
  /** Prefilled value; empty when the user is expected to supply it. */
  value?: string;
}

export interface ItemTemplate {
  id: string;
  /** Shown on the template's button in the create dialog. */
  labelKey: TranslationKey;
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
    icon: 'desktop',
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
      { nameKey: 'items.templates.fields.cardNumber', type: FieldType.Credit },
      { nameKey: 'items.templates.fields.cardOwner', type: FieldType.Text },
      { nameKey: 'items.templates.fields.validUntil', type: FieldType.Month },
      { nameKey: 'items.templates.fields.cvc', type: FieldType.Pin },
      { nameKey: 'field.type.pin', type: FieldType.Pin },
    ],
  },
  {
    id: 'bank-account',
    labelKey: 'items.templates.bankAccount',
    icon: 'bank',
    fields: [
      { nameKey: 'items.templates.fields.accountOwner', type: FieldType.Text },
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
      { nameKey: 'items.templates.fields.name', type: FieldType.Text },
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
      { nameKey: 'items.templates.fields.country', type: FieldType.Text },
      { nameKey: 'items.templates.fields.birthdate', type: FieldType.Date },
      { nameKey: 'items.templates.fields.birthplace', type: FieldType.Text },
      { nameKey: 'items.templates.fields.issuedOn', type: FieldType.Date },
      { nameKey: 'items.templates.fields.expires', type: FieldType.Date },
    ],
  },
  {
    id: 'note',
    labelKey: 'items.templates.note',
    icon: 'note',
    fields: [{ nameKey: 'items.templates.fields.note', type: FieldType.Note }],
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

export const DEFAULT_ITEM_TEMPLATE = ITEM_TEMPLATES[0];

export function itemTemplateById(id: string): ItemTemplate | undefined {
  return ITEM_TEMPLATES.find((template) => template.id === id);
}
