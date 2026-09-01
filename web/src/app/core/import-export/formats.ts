/**
 * File format the app can read and write. Only CSV, KeeperPass to KeeperPass,
 * is supported for now.
 */
export interface TransferFormat {
  id: string;
  label: string;
}

export const CSV_FORMAT: TransferFormat = { id: 'csv', label: 'CSV' };

export const EXPORT_FORMATS: readonly TransferFormat[] = [CSV_FORMAT];

export const IMPORT_FORMATS: readonly TransferFormat[] = [CSV_FORMAT];

/** File extensions the import picker accepts. */
export const IMPORT_ACCEPT = '.csv,text/plain';
