import { FieldType, VaultItem } from '../../../core/models';

/** DuckDuckGo's favicon proxy. `{hostname}` is filled in below. */
const FAVICON_PROXY = 'https://icons.duckduckgo.com/ip3';

/**
 * Where to fetch the icon for an item, from whatever it has in a URL field —
 * or `undefined` when it has nothing usable, in which case the caller draws its
 * own glyph instead.
 *
 * Three shapes have to be handled, because a URL field is free text and people
 * type all three: a full `https://example.com/login` (take the hostname), a bare
 * `example.com` (already the hostname — `URL` refuses it for want of a scheme),
 * and a `*.example.com` wildcard someone wrote to cover subdomains (the `*.` is
 * a matching pattern, not part of any host).
 *
 * Worth knowing: this asks a third party for the icon, so the hostname — not the
 * item, not the password — is visible to that service. The alternative is no
 * icons at all, since the app cannot reach the sites themselves.
 */
export function itemFaviconUrl(item: VaultItem): string | undefined {
  const field = item.fields.find((candidate) => candidate.type === FieldType.Url)?.value;
  if (!field) {
    return undefined;
  }

  const hostname = hostnameFrom(field);
  return hostname ? `${FAVICON_PROXY}/${hostname}.ico` : undefined;
}

const WILDCARD_PREFIX = '*.';

/** The host to ask about, with any subdomain wildcard taken back off. */
function hostnameFrom(url: string): string {
  const host = parseHostname(url);
  return host.startsWith(WILDCARD_PREFIX) ? host.slice(WILDCARD_PREFIX.length) : host;
}

function parseHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    // No scheme, so `URL` won't parse it: treat what we were given as the host.
    return url;
  }
}
