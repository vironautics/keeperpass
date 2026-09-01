import { FieldType, VaultItem } from '../../../core/models';

/**
 * Builds the DuckDuckGo favicon-proxy URL for an item's `Url` field, or
 * `undefined` if the item has none.
 *
 * Mirrors the original app's resolution: `new URL(...).hostname` for a proper
 * absolute URL, falling back to the raw field value for a bare host or a
 * `*.example.com` wildcard pattern (used to match subdomains), which `URL`
 * can't parse without a scheme.
 */
export function itemFaviconUrl(item: VaultItem): string | undefined {
  let url = item.fields.find((field) => field.type === FieldType.Url)?.value;
  if (!url) {
    return undefined;
  }

  try {
    url = new URL(url).hostname;
  } catch {
    // Not an absolute URL — used as-is below.
  }

  const hostname = url.startsWith('*.') ? url.replace('*.', '') : url;
  return hostname ? `https://icons.duckduckgo.com/ip3/${hostname}.ico` : undefined;
}
