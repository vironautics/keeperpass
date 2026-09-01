import { IconName } from '../../ui/icon/icon-glyphs';

/**
 * The kinds of value a vault item can hold.
 *
 * The string values are part of the vault's stored format — they are written
 * into the encrypted file and read back by every later version of the app — so
 * treat them as append-only. A new kind of value gets a new member; an existing
 * one is never renamed, or every item already using it decodes as something
 * else.
 */
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

/** One named value inside an item. The name is the user's; the type drives display. */
export interface Field {
  name: string;
  value: string;
  type: FieldType;
}

/**
 * How a field type presents itself: what to call it, what to draw beside it,
 * and how much care its value needs on screen.
 *
 * Presentation only — nothing here interprets a value, which is what lets a
 * screen render a field type it has no special handling for. Keeping it in one
 * table also means a new field type is a single entry rather than a switch
 * statement in every component that draws a field.
 */
export interface FieldDefinition {
  type: FieldType;
  /** What the "Add Field" menu calls this kind of value. */
  label: string;
  icon: IconName;
  /** Held back behind a reveal toggle, and set in a monospace face when shown. */
  secret: boolean;
  /** Whether the editor gives the value room for more than one line. */
  multiline: boolean;
}

/**
 * Every field type, in the order the "Add Field" menu offers them.
 *
 * Ordered by how often a password manager actually needs them: credentials
 * first, then the dated and numeric kinds an identity or a card needs, then the
 * two free-text catch-alls last, where they don't crowd out the specific types
 * that carry real behaviour.
 */
export const FIELD_DEFINITIONS: Record<FieldType, FieldDefinition> = {
  [FieldType.Username]: {
    type: FieldType.Username,
    label: 'Username',
    icon: 'user',
    secret: false,
    multiline: false,
  },
  [FieldType.Password]: {
    type: FieldType.Password,
    label: 'Password',
    icon: 'lock',
    secret: true,
    // Long generated passwords need to wrap rather than scroll out of sight.
    multiline: true,
  },
  [FieldType.Email]: {
    type: FieldType.Email,
    label: 'Email',
    icon: 'email',
    secret: false,
    multiline: false,
  },
  [FieldType.Url]: {
    type: FieldType.Url,
    label: 'URL',
    icon: 'web',
    secret: false,
    multiline: false,
  },
  [FieldType.Date]: {
    type: FieldType.Date,
    label: 'Date',
    icon: 'date',
    secret: false,
    multiline: false,
  },
  [FieldType.Month]: {
    type: FieldType.Month,
    label: 'Month',
    icon: 'month',
    secret: false,
    multiline: false,
  },
  [FieldType.Credit]: {
    type: FieldType.Credit,
    label: 'Card Number',
    icon: 'credit',
    secret: true,
    multiline: false,
  },
  [FieldType.Phone]: {
    type: FieldType.Phone,
    label: 'Phone',
    icon: 'phone',
    secret: false,
    multiline: false,
  },
  [FieldType.Pin]: {
    type: FieldType.Pin,
    label: 'PIN',
    icon: 'lock',
    secret: true,
    multiline: false,
  },
  [FieldType.Totp]: {
    // Not a secret in the reveal-toggle sense: what the item shows is the
    // rolling six-digit code, and `<app-totp>` never puts the seed on screen.
    type: FieldType.Totp,
    label: 'Authenticator Code',
    icon: 'totp',
    secret: false,
    multiline: false,
  },
  [FieldType.Note]: {
    type: FieldType.Note,
    label: 'Formatted Note',
    icon: 'note',
    secret: false,
    multiline: true,
  },
  [FieldType.Text]: {
    type: FieldType.Text,
    label: 'Text',
    icon: 'text',
    secret: false,
    multiline: true,
  },
};

/**
 * The definition for a type, falling back to plain text.
 *
 * The fallback is what makes an older vault safe to open in a newer app and the
 * reverse: an unrecognised type still renders as the text it is, instead of
 * throwing on a lookup and taking the whole item view down with it.
 */
export function fieldDefinition(type: FieldType): FieldDefinition {
  return FIELD_DEFINITIONS[type] ?? FIELD_DEFINITIONS[FieldType.Text];
}

const MASK_CHARACTER = '•';

/**
 * Replaces every character with a dot, leaving line breaks alone.
 *
 * Keeping the breaks preserves the value's shape, so a masked multi-line secret
 * still occupies the height it will occupy once revealed and the layout doesn't
 * jump when it is.
 */
export function maskValue(value: string): string {
  return value.replace(/[^\n]/g, MASK_CHARACTER);
}

/**
 * A field's value as it should appear, given whether it is currently hidden.
 *
 * Masking wins over formatting: there is no point rendering a date nicely if the
 * whole thing is dots. Dates and months are the only types reformatted at all,
 * because they are stored in the ISO form the native pickers use and nobody
 * reads `2026-08` as a month.
 */
export function formatFieldValue(field: Field, hidden: boolean): string {
  const definition = fieldDefinition(field.type);

  if (definition.secret && hidden) {
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
