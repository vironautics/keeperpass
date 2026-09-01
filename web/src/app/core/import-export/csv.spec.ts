import { FieldType, VaultItem } from '../models';
import { csvToItemDrafts, encodeCsv, inferFieldType, itemsToCsv, parseCsv } from './csv';

function item(overrides: Partial<VaultItem> & Pick<VaultItem, 'id' | 'name'>): VaultItem {
  return {
    vaultId: 'vault-a',
    fields: [],
    tags: [],
    updated: new Date('2026-01-01T00:00:00Z'),
    history: [],
    ...overrides,
  };
}

describe('parseCsv', () => {
  it('splits plain rows and columns', () => {
    expect(parseCsv('a,b\n1,2')).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ]);
  });

  it('accepts CRLF as well as LF', () => {
    expect(parseCsv('a,b\r\n1,2\r\n')).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ]);
  });

  it('keeps delimiters that sit inside quotes', () => {
    expect(parseCsv('name,note\n"Smith, John","line one\nline two"')).toEqual([
      ['name', 'note'],
      ['Smith, John', 'line one\nline two'],
    ]);
  });

  it('reads a doubled quote as one literal quote', () => {
    expect(parseCsv('a\n"say ""hi"""')).toEqual([['a'], ['say "hi"']]);
  });

  it('preserves empty cells rather than dropping them', () => {
    expect(parseCsv('a,b,c\n1,,3')).toEqual([
      ['a', 'b', 'c'],
      ['1', '', '3'],
    ]);
  });

  it('strips a leading byte order mark', () => {
    expect(parseCsv('﻿name\nAda')).toEqual([['name'], ['Ada']]);
  });

  it('returns nothing for empty input', () => {
    expect(parseCsv('')).toEqual([]);
  });
});

describe('encodeCsv', () => {
  it('quotes only what needs quoting', () => {
    expect(encodeCsv([['plain', 'has,comma', 'has"quote', 'has\nnewline']])).toBe(
      'plain,"has,comma","has""quote","has\nnewline"',
    );
  });

  it('round-trips anything parseCsv can read', () => {
    const rows = [
      ['name', 'tags', 'Password'],
      ['Smith, John', 'work,personal', 'p"a,s\ns'],
      ['', '', ''],
    ];
    expect(parseCsv(encodeCsv(rows))).toEqual(rows);
  });
});

describe('itemsToCsv', () => {
  it('leads with name and tags, then one column per distinct field', () => {
    const csv = itemsToCsv([
      item({
        id: '1',
        name: 'GitHub',
        tags: ['work', 'dev'],
        fields: [
          { name: 'Username', type: FieldType.Username, value: 'ada' },
          { name: 'Password', type: FieldType.Password, value: 'secret' },
        ],
      }),
      item({
        id: '2',
        name: 'Wi-Fi',
        fields: [{ name: 'Network', type: FieldType.Text, value: 'Guest' }],
      }),
    ]);

    expect(parseCsv(csv)).toEqual([
      ['name', 'tags', 'Username', 'Password', 'Network'],
      ['GitHub', 'work,dev', 'ada', 'secret', ''],
      ['Wi-Fi', '', '', '', 'Guest'],
    ]);
  });

  it('emits just the header when there is nothing to export', () => {
    expect(parseCsv(itemsToCsv([]))).toEqual([['name', 'tags']]);
  });
});

describe('inferFieldType', () => {
  it('recognises field types by their display name', () => {
    expect(inferFieldType('Password')).toBe(FieldType.Password);
    expect(inferFieldType('  email address ')).toBe(FieldType.Email);
    expect(inferFieldType('URL')).toBe(FieldType.Url);
  });

  it('recognises common names used by other exporters', () => {
    expect(inferFieldType('login_uri'.replace('_', ' '))).toBe(FieldType.Url);
    expect(inferFieldType('notes')).toBe(FieldType.Note);
    expect(inferFieldType('otp')).toBe(FieldType.Totp);
  });

  it('falls back to text for anything unrecognised', () => {
    expect(inferFieldType('Sort Code')).toBe(FieldType.Text);
  });
});

describe('csvToItemDrafts', () => {
  const rows = parseCsv(
    [
      'name,tags,Username,Password,Sort Code',
      'GitHub,"work,dev",ada,secret,',
      'Bank,,,,04-00-04',
    ].join('\n'),
  );

  it('reads names, tags and typed fields', () => {
    expect(csvToItemDrafts(rows)[0]).toEqual({
      name: 'GitHub',
      tags: ['work', 'dev'],
      fields: [
        { name: 'Username', type: FieldType.Username, value: 'ada' },
        { name: 'Password', type: FieldType.Password, value: 'secret' },
      ],
    });
  });

  it('skips columns the row leaves empty', () => {
    expect(csvToItemDrafts(rows)[1]).toEqual({
      name: 'Bank',
      tags: [],
      fields: [{ name: 'Sort Code', type: FieldType.Text, value: '04-00-04' }],
    });
  });

  it('ignores blank rows', () => {
    expect(csvToItemDrafts(parseCsv('name,tags\nA,\n,\n'))).toHaveLength(1);
  });

  it('returns nothing when there is no header', () => {
    expect(csvToItemDrafts([])).toEqual([]);
  });

  it('survives a round trip through the exporter', () => {
    const original = item({
      id: '1',
      name: 'Smith, John',
      tags: ['work'],
      fields: [{ name: 'Password', type: FieldType.Password, value: 'p"a,s\ns' }],
    });

    const [draft] = csvToItemDrafts(parseCsv(itemsToCsv([original])));

    expect(draft.name).toBe(original.name);
    expect(draft.tags).toEqual(original.tags);
    expect(draft.fields).toEqual(original.fields);
  });
});
