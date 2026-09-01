import { IconName } from '../../ui/icon/icon-glyphs';

/** The kinds of value a vault item can hold. */
export enum FieldType {
  Username = 'username',
  Password = 'password',
  Email = 'email',
  Url = 'url',
  Date = 'date',
  Month = 'month',
  Credit = 'credit',
  Phone = 'phone',
  Pin = 'pin',
  Totp = 'totp',
  Note = 'note',
  Text = 'text',
}

export interface Field {
  name: string;
  value: string;
  type: FieldType;
}

export interface FieldDefinition {
  type: FieldType;
  /** Label shown in the "add field" menu. */
  name: string;
  icon: IconName;
  /** Whether the value is hidden until the user reveals it. */
  masked: boolean;
  multiline: boolean;
}

/**
 * Presentation metadata per field type. Order matters — it is the order the
 * "add field" menu offers them in.
 */
export const FIELD_DEFINITIONS: Record<FieldType, FieldDefinition> = {
  [FieldType.Username]: {
    type: FieldType.Username,
    name: 'Username',
    icon: 'user',
    masked: false,
    multiline: false,
  },
  [FieldType.Password]: {
    type: FieldType.Password,
    name: 'Password',
    icon: 'lock',
    masked: true,
    multiline: true,
  },
  [FieldType.Email]: {
    type: FieldType.Email,
    name: 'Email Address',
    icon: 'email',
    masked: false,
    multiline: false,
  },
  [FieldType.Url]: {
    type: FieldType.Url,
    name: 'URL',
    icon: 'web',
    masked: false,
    multiline: false,
  },
  [FieldType.Date]: {
    type: FieldType.Date,
    name: 'Date',
    icon: 'date',
    masked: false,
    multiline: false,
  },
  [FieldType.Month]: {
    type: FieldType.Month,
    name: 'Month',
    icon: 'month',
    masked: false,
    multiline: false,
  },
  [FieldType.Credit]: {
    type: FieldType.Credit,
    name: 'Credit Card Number',
    icon: 'credit',
    masked: true,
    multiline: false,
  },
  [FieldType.Phone]: {
    type: FieldType.Phone,
    name: 'Phone Number',
    icon: 'phone',
    masked: false,
    multiline: false,
  },
  [FieldType.Pin]: {
    type: FieldType.Pin,
    name: 'PIN',
    icon: 'lock',
    masked: true,
    multiline: false,
  },
  [FieldType.Totp]: {
    type: FieldType.Totp,
    name: 'One-Time Password',
    icon: 'totp',
    masked: false,
    multiline: false,
  },
  [FieldType.Note]: {
    type: FieldType.Note,
    name: 'Richtext / Markdown',
    icon: 'note',
    masked: false,
    multiline: true,
  },
  [FieldType.Text]: {
    type: FieldType.Text,
    name: 'Plain Text',
    icon: 'text',
    masked: false,
    multiline: true,
  },
};

export function fieldDefinition(type: FieldType): FieldDefinition {
  return FIELD_DEFINITIONS[type] ?? FIELD_DEFINITIONS[FieldType.Text];
}

const MASK_CHARACTER = '•';

/** Replaces every character except line breaks, matching the original's `mask()`. */
export function maskValue(value: string): string {
  return value.replace(/[^\n]/g, MASK_CHARACTER);
}

/** Formats a field for display, masking it when it is a secret that stays hidden. */
export function formatFieldValue(field: Field, masked: boolean): string {
  const definition = fieldDefinition(field.type);

  if (definition.masked && masked) {
    return maskValue(field.value);
  }

  switch (field.type) {
    case FieldType.Date:
      return new Date(field.value).toLocaleDateString();
    case FieldType.Month:
      return new Date(field.value).toLocaleDateString(undefined, {
        year: 'numeric',
        month: '2-digit',
      });
    default:
      return field.value;
  }
}
