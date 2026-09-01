/**
 * URL-based matching for vault items
 * Prioritizes vault items based on domain matching
 */

import { VaultItem } from './models/vault-item';

export interface MatchedItem {
  item: VaultItem;
  score: number;
  reason: string;
}

export class UrlMatcher {
  /**
   * Match vault items to current URL and sort by relevance
   */
  static matchItems(items: VaultItem[], currentUrl: string): MatchedItem[] {
    return items
      .map((item) => ({
        item,
        score: this.calculateMatchScore(item, currentUrl),
        reason: this.getMatchReason(item, currentUrl),
      }))
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score);
  }

  /**
   * Calculate match score (0-100)
   */
  private static calculateMatchScore(item: VaultItem, currentUrl: string): number {
    const currentDomain = this.extractDomain(currentUrl);
    if (!currentDomain) {
      return 0;
    }

    // Extract URLs from item fields
    const itemUrls = this.extractUrlsFromItem(item);
    if (itemUrls.length === 0) {
      return 0;
    }

    let bestScore = 0;

    for (const itemUrl of itemUrls) {
      const itemDomain = this.extractDomain(itemUrl);
      if (!itemDomain) {
        continue;
      }

      // Exact domain match (e.g., gmail.com === gmail.com)
      if (itemDomain === currentDomain) {
        bestScore = Math.max(bestScore, 100);
      }
      // Subdomain match (e.g., mail.google.com contains google.com)
      else if (itemDomain.endsWith('.' + currentDomain) || currentDomain.endsWith('.' + itemDomain)) {
        bestScore = Math.max(bestScore, 85);
      }
      // Partial match (e.g., google contains goog)
      else if (this.isPartialMatch(itemDomain, currentDomain)) {
        bestScore = Math.max(bestScore, 50);
      }
      // Tag or name contains domain
      else if (
        item.name.toLowerCase().includes(currentDomain) ||
        item.tags.some((tag) => tag.toLowerCase().includes(currentDomain))
      ) {
        bestScore = Math.max(bestScore, 40);
      }
    }

    return bestScore;
  }

  /**
   * Extract all URLs from a vault item
   */
  private static extractUrlsFromItem(item: VaultItem): string[] {
    const urls: string[] = [];

    // Check URL field
    const urlField = item.fields.find((f) => f.type === 'url' || f.name?.toLowerCase() === 'url');
    if (urlField?.value) {
      urls.push(urlField.value);
    }

    // Check website field
    const websiteField = item.fields.find((f) => f.name?.toLowerCase() === 'website');
    if (websiteField?.value) {
      urls.push(websiteField.value);
    }

    return urls;
  }

  /**
   * Extract domain from URL (always lowercase)
   */
  private static extractDomain(url: string): string {
    try {
      const parsed = new URL(url.startsWith('http') ? url : 'https://' + url);
      return (parsed.hostname || '').toLowerCase();
    } catch {
      const match = url.match(/^(?:https?:\/\/)?([^\/\s?#]+)/i);
      return match ? match[1].toLowerCase() : '';
    }
  }

  /**
   * Check if domains have partial match
   */
  private static isPartialMatch(domain1: string, domain2: string): boolean {
    const parts1 = domain1.split('.');
    const parts2 = domain2.split('.');

    // Check if any meaningful parts overlap
    for (const part of parts1) {
      if (part.length >= 4 && domain2.includes(part)) {
        return true;
      }
    }

    for (const part of parts2) {
      if (part.length >= 4 && domain1.includes(part)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get human-readable match reason
   */
  private static getMatchReason(item: VaultItem, currentUrl: string): string {
    const currentDomain = this.extractDomain(currentUrl);
    const itemUrls = this.extractUrlsFromItem(item);

    for (const itemUrl of itemUrls) {
      const itemDomain = this.extractDomain(itemUrl);

      if (itemDomain === currentDomain) {
        return `Domain match: ${itemDomain}`;
      }

      if (itemDomain.endsWith('.' + currentDomain) || currentDomain.endsWith('.' + itemDomain)) {
        return `Subdomain match: ${itemDomain}`;
      }

      if (this.isPartialMatch(itemDomain, currentDomain)) {
        return `Partial match: ${itemDomain}`;
      }
    }

    if (item.name.toLowerCase().includes(currentDomain)) {
      return `Name contains domain`;
    }

    if (item.tags.some((tag) => tag.toLowerCase().includes(currentDomain))) {
      return `Tag contains domain`;
    }

    return 'Possible match';
  }

  /**
   * Get domain-only version of URL for display
   */
  static getDomainOnly(url: string): string {
    return this.extractDomain(url) || url;
  }
}
