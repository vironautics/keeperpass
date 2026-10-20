import { FieldType, VaultItem } from '../../../core/models';

/** DuckDuckGo's favicon proxy; tried first. The hostname is appended below. */
const DUCKDUCKGO_PROXY = 'https://icons.duckduckgo.com/ip3';

/** Google's favicon service, for the sites DuckDuckGo has never crawled. */
const GOOGLE_PROXY = 'https://www.google.com/s2/favicons?sz=64&domain=';

/**
 * Where to fetch the icon for an item (best candidate first), from whatever it has in a URL field —
 * or an empty list when it has nothing usable, in which case the caller draws its
 * own glyph instead.
 *
 * Three shapes have to be handled, because a URL field is free text and people
 * type all three: a full `https://example.com/login` (take the hostname), a bare
 * `example.com` (already the hostname — `URL` refuses it for want of a scheme),
 * and a `*.example.com` wildcard someone wrote to cover subdomains (the `*.` is
 * a matching pattern, not part of any host).
 *
 * Worth knowing: this asks third parties (DuckDuckGo, then Google) for the icon, so the hostname — not the
 * item, not the password — is visible to that service. The alternative is no
 * icons at all, since the app cannot reach the sites themselves.
 */
export function itemFaviconUrls(item: VaultItem): string[] {
  const field = item.fields.find((candidate) => candidate.type === FieldType.Url)?.value;
  if (!field) {
    return [];
  }

  const hosts = hostnameCandidates(hostnameFrom(field));
  return [
    ...hosts.map((host) => `${DUCKDUCKGO_PROXY}/${host}.ico`),
    ...hosts.map((host) => `${GOOGLE_PROXY}${host}`),
  ];
}

/**
 * The host itself, then each parent domain down to two labels: the proxy only has
 * icons for hosts it has crawled, and `login.app.example.com` usually has none while
 * `example.com` does. The caller walks the list as each one fails to load.
 */
function hostnameCandidates(hostname: string): string[] {
  if (!hostname) {
    return [];
  }

  const labels = hostname.split('.');
  const candidates = [hostname];
  for (let i = 1; i <= labels.length - 2; i++) {
    candidates.push(labels.slice(i).join('.'));
  }
  return candidates;
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
    return url.trim().split(/[/?#]/)[0];
  }
}
