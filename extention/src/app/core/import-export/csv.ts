import { Field, FieldType, VaultItem } from '../models';

/**
 * CSV encoding and decoding for vault data.
 *
 * The shape matches the source app's exporter: the first two columns are always
 * `name` and `tags` (tags comma-joined), followed by one column per distinct
 * field name across the exported items. A cell is empty where an item has no
 * field of that name.
 *
 * CSV holds secrets in the clear. That is inherent to the format, and the reason
 * the export dialog warns before producing one.
 */

const NEEDS_QUOTING = /["\n\r,]/;

function encodeField(value: string): string {
  return NEEDS_QUOTING.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function encodeCsv(rows: readonly (readonly string[])[]): string {
  return rows.map((row) => row.map(encodeField).join(',')).join('\r\n');
}

/**
 * Parses RFC 4180 CSV: double quotes escape delimiters, `""` is a literal quote,
 * and quoted fields may span newlines.
 */
export function parseCsv(text: string): string[][] {
  const withoutBom = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;

  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let index = 0; index < withoutBom.length; index++) {
    const char = withoutBom[index];

    if (inQuotes) {
      if (char !== '"') {
        field += char;
      } else if (withoutBom[index + 1] === '"') {
        field += '"';
        index++;
      } else {
        inQuotes = false;
      }
      continue;
    }

    switch (char) {
      case '"':
        inQuotes = true;
        break;
      case ',':
        row.push(field);
        field = '';
        break;
      case '\n':
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
        break;
      case '\r':
        break;
      default:
        field += char;
    }
  }

  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

export function itemsToCsv(items: readonly VaultItem[]): string {
  const fieldNames: string[] = [];

  for (const item of items) {
    for (const field of item.fields) {
      if (!fieldNames.includes(field.name)) {
        fieldNames.push(field.name);
      }
    }
  }

  const header = ['name', 'tags', ...fieldNames];

  const rows = items.map((item) => {
    const row = [item.name, item.tags.join(','), ...fieldNames.map(() => '')];

    for (const field of item.fields) {
      row[2 + fieldNames.indexOf(field.name)] = field.value;
    }

    return row;
  });

  return encodeCsv([header, ...rows]);
}

/** An item parsed out of a file, before it is given an id and a vault. */
export interface ItemDraft {
  name: string;
  tags: string[];
  fields: Field[];
}

/**
 * Column name to field type, so an imported password is not treated as text.
 *
 * Deliberately spelled out here in plain English rather than derived from
 * `FIELD_DEFINITIONS`' (translated) `labelKey`s: a CSV's column headings are
 * part of the file format, not UI copy, so they don't change with the active
 * locale — an export made while reading the popup in French still has to
 * import cleanly after switching to German. See `TYPE_ALIASES` below for the
 * further, non-canonical spellings this also accepts.
 */
const TYPES_BY_COLUMN_NAME = new Map<string, FieldType>([
  ['username', FieldType.Username],
  ['password', FieldType.Password],
  ['email address', FieldType.Email],
  ['url', FieldType.Url],
  ['ip / host', FieldType.IpHost],
  ['date', FieldType.Date],
  ['month', FieldType.Month],
  ['credit card number', FieldType.Credit],
  ['phone number', FieldType.Phone],
  ['pin', FieldType.Pin],
  ['one-time password', FieldType.Totp],
  ['certificate', FieldType.Certificate],
  ['ssh / private key', FieldType.SshKey],
  ['recovery codes', FieldType.RecoveryCodes],
  ['richtext / markdown', FieldType.Note],
  ['plain text', FieldType.Text],
]);

const TYPE_ALIASES = new Map<string, FieldType>([
  ['url', FieldType.Url],
  ['website', FieldType.Url],
  ['login uri', FieldType.Url],
  ['user', FieldType.Username],
  ['user name', FieldType.Username],
  ['login', FieldType.Username],
  ['login username', FieldType.Username],
  ['e-mail', FieldType.Email],
  ['login password', FieldType.Password],
  ['pass', FieldType.Password],
  ['note', FieldType.Note],
  ['notes', FieldType.Note],
  ['totp', FieldType.Totp],
  ['otp', FieldType.Totp],
  ['one-time password', FieldType.Totp],
]);

export function inferFieldType(columnName: string): FieldType {
  const key = columnName.trim().toLowerCase();
  return TYPES_BY_COLUMN_NAME.get(key) ?? TYPE_ALIASES.get(key) ?? FieldType.Text;
}

/**
 * Turns parsed CSV rows into item drafts.
 *
 * The first row is the header. Rows shorter than the header are padded rather
 * than rejected: a partial row is still worth importing.
 */
export function csvToItemDrafts(rows: readonly (readonly string[])[]): ItemDraft[] {
  const [header, ...body] = rows;

  if (!header) {
    return [];
  }

  const fieldColumns = header.slice(2).map((name, index) => ({
    name,
    type: inferFieldType(name),
    index: index + 2,
  }));

  return body
    .filter((row) => row.some((cell) => cell.trim() !== ''))
    .map((row) => ({
      name: row[0] ?? '',
      tags: (row[1] ?? '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      fields: fieldColumns
        .filter((column) => (row[column.index] ?? '') !== '')
        .map((column) => ({
          name: column.name,
          type: column.type,
          value: row[column.index],
        })),
    }));
}
