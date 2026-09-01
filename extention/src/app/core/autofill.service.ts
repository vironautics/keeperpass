import { Injectable } from '@angular/core';
import { VaultItem } from './models/vault-item';
import { UrlMatcher, MatchedItem } from './url-matcher';

declare const chrome: any;

interface AutoFillField {
  selector: string;
  value: string;
  type: string;
}

interface LoginFormField {
  selector: string;
  type: 'username' | 'password' | 'email';
}

const CHROME_API_TIMEOUT_MS = 3000;

/**
 * Service for auto-filling login credentials into webpage forms
 */
@Injectable({ providedIn: 'root' })
export class AutoFillService {
  /**
   * Send message to content script with timeout and error handling
   */
  private sendMessage<T>(
    tabId: number,
    message: Record<string, unknown>,
    timeoutMs: number = CHROME_API_TIMEOUT_MS,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Chrome message timeout after ${timeoutMs}ms`));
      }, timeoutMs);

      chrome.tabs.sendMessage(tabId, message, (response: any) => {
        clearTimeout(timeoutId);

        if (chrome.runtime.lastError) {
          reject(new Error(`Chrome API error: ${chrome.runtime.lastError.message}`));
          return;
        }

        resolve(response as T);
      });
    });
  }

  /**
   * Get tab by ID with error handling
   */
  private getTab(tabId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.tabs.get(tabId, (tab: any) => {
        if (chrome.runtime.lastError) {
          reject(new Error(`Chrome API error: ${chrome.runtime.lastError.message}`));
          return;
        }

        if (!tab) {
          reject(new Error('Tab not found'));
          return;
        }

        resolve(tab);
      });
    });
  }

  /**
   * Detect login forms on the current webpage
   */
  async detectLoginForms(tabId: number): Promise<LoginFormField[]> {
    try {
      const response = await this.sendMessage<{ forms: LoginFormField[] }>(
        tabId,
        { action: 'detectLoginForms' },
      );
      return response?.forms || [];
    } catch (error) {
      console.error('Failed to detect login forms:', error);
      return [];
    }
  }

  /**
   * Extract username and password fields from vault item
   */
  extractCredentials(item: VaultItem): { username?: string; password?: string; email?: string } {
    const credentials: { username?: string; password?: string; email?: string } = {};

    for (const field of item.fields) {
      if (field.type === 'username' || field.name?.toLowerCase() === 'username') {
        credentials.username = field.value;
      }
      if (field.type === 'password' || field.name?.toLowerCase() === 'password') {
        credentials.password = field.value;
      }
      if (field.type === 'email' || field.name?.toLowerCase() === 'email') {
        credentials.email = field.value;
      }
    }

    return credentials;
  }

  /**
   * Get current tab URL with error handling
   */
  async getTabUrl(tabId: number): Promise<string> {
    try {
      const tab = await this.getTab(tabId);
      return tab.url || '';
    } catch (error) {
      console.error('Failed to get tab URL:', error);
      return '';
    }
  }

  /**
   * Sort vault items by URL match relevance
   */
  async sortByUrlMatch(items: VaultItem[], tabId: number): Promise<MatchedItem[]> {
    try {
      const tabUrl = await this.getTabUrl(tabId);
      if (!tabUrl) {
        return [];
      }
      return UrlMatcher.matchItems(items, tabUrl);
    } catch (error) {
      console.error('Failed to sort by URL match:', error);
      return [];
    }
  }

  /**
   * Auto-fill detected login form with credentials
   */
  async autoFill(tabId: number, item: VaultItem): Promise<boolean> {
    const credentials = this.extractCredentials(item);

    if (!credentials.username && !credentials.password && !credentials.email) {
      console.warn('No credentials found in item');
      return false;
    }

    // Detect forms on the page
    const forms = await this.detectLoginForms(tabId);

    if (forms.length === 0) {
      console.warn('No login forms detected');
      return false;
    }

    // Build fields to fill
    const fieldsToFill: AutoFillField[] = [];

    for (const form of forms) {
      if (form.type === 'username' && credentials.username) {
        fieldsToFill.push({
          selector: form.selector,
          value: credentials.username,
          type: 'username',
        });
      } else if (form.type === 'email' && (credentials.email || credentials.username)) {
        fieldsToFill.push({
          selector: form.selector,
          value: credentials.email || credentials.username || '',
          type: 'email',
        });
      } else if (form.type === 'password' && credentials.password) {
        fieldsToFill.push({
          selector: form.selector,
          value: credentials.password,
          type: 'password',
        });
      }
    }

    if (fieldsToFill.length === 0) {
      console.warn('No matching form fields to fill');
      return false;
    }

    // Send auto-fill message to content script
    try {
      const response = await this.sendMessage<{ success: boolean }>(
        tabId,
        { action: 'autoFill', fields: fieldsToFill },
      );
      return response?.success || false;
    } catch (error) {
      console.error('Auto-fill failed:', error);
      return false;
    }
  }
}
