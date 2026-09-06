import { Field, FieldType, VaultItem } from '../models';

/**
 * CSV encoding and decoding for vault data.
 *
 * One row per item: the first two columns are always `name` and `tags` (every
 * tag comma-joined into that one cell), and after them comes one column per
 * distinct field name found across the items being exported, left empty for an
 * item that has no field of that name. A single wide table is the only shape
 * every other password manager can both produce and read, which is the entire
 * reason to offer CSV — it is the format that gets data *out* of this app and
 * into somewhere else.
 *
 * What it cannot do is keep a secret: every password is in the file in the
 * clear. That is the format, not this implementation, and it is why the export
 * dialog says so before writing one.
 */

const NEEDS_QUOTING = /["\n\r,]/;

/** Written as an escape on purpose: the character itself is invisible in source. */
const BYTE_ORDER_MARK = '\ufeff';

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
  // Spreadsheet exports routinely start with a byte-order mark; left in place it
  // becomes part of the first heading and no column matches anything again.
  const withoutBom = text.startsWith(BYTE_ORDER_MARK) ? text.slice(1) : text;

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
 * The column headings that identify a field type, lower-cased.
 *
 * Deliberately its own table rather than a fold over `FIELD_DEFINITIONS`
 * labels: those labels are display strings and are free to be reworded, and
 * parsing that silently changes when someone improves a menu label is parsing
 * nobody can reason about. Spelling the headings out here also leaves room for
 * what *other* managers call the same column, and for what earlier versions of
 * this app wrote — an export made last year has to keep importing.
 *
 * Every name must appear once across the whole table; `columnTypes()` refuses a
 * duplicate rather than letting declaration order quietly pick a winner.
 */
const COLUMN_HEADINGS: Readonly<Record<FieldType, readonly string[]>> = {
  [FieldType.Username]: ['username', 'user name', 'user', 'login', 'login username'],
  [FieldType.Password]: ['password', 'login password', 'pass'],
  [FieldType.Email]: ['email', 'email address', 'e-mail'],
  [FieldType.Url]: ['url', 'website', 'web site', 'login uri'],
  [FieldType.IpHost]: ['ip', 'ip address', 'host', 'hostname', 'ip / host', 'server'],
  [FieldType.Date]: ['date'],
  [FieldType.Month]: ['month'],
  [FieldType.Credit]: ['card number', 'credit card number'],
  [FieldType.Phone]: ['phone', 'phone number', 'telephone', 'mobile'],
  [FieldType.Pin]: ['pin', 'cvc', 'cvv'],
  [FieldType.Totp]: ['authenticator code', 'one-time password', 'totp', 'otp'],
  [FieldType.Certificate]: ['certificate', 'cert'],
  [FieldType.SshKey]: ['ssh key', 'ssh / private key', 'private key', 'ssh private key'],
  [FieldType.RecoveryCodes]: ['recovery codes', 'backup codes', 'recovery code'],
  [FieldType.Note]: ['formatted note', 'richtext / markdown', 'note', 'notes'],
  [FieldType.Text]: ['text', 'plain text'],
};

/** Inverts `COLUMN_HEADINGS`, failing loudly on a heading claimed by two types. */
function columnTypes(): Map<string, FieldType> {
  const types = new Map<string, FieldType>();

  for (const [type, headings] of Object.entries(COLUMN_HEADINGS)) {
    for (const heading of headings) {
      const claimed = types.get(heading);
      if (claimed) {
        throw new Error(`CSV column "${heading}" is claimed by both ${claimed} and ${type}`);
      }
      types.set(heading, type as FieldType);
    }
  }

  return types;
}

const TYPES_BY_COLUMN_HEADING = columnTypes();

/**
 * The type to give a column, from its heading alone.
 *
 * Unrecognised headings become `Text`, which loses nothing: the heading and the
 * value are both imported either way, and only the icon, the reveal toggle and
 * the editor's shape differ. Guessing from the *values* instead would be the
 * alternative, and a wrong guess there is worse than a plain-text field — a
 * column of digits read as a PIN would arrive masked and unreadable.
 */
export function inferFieldType(columnName: string): FieldType {
  return TYPES_BY_COLUMN_HEADING.get(columnName.trim().toLowerCase()) ?? FieldType.Text;
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
