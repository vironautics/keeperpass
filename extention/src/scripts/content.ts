/**
 * Content script runs on every webpage
 * Detects login forms using advanced form detection (KeePass-like approach)
 * and sends message to popup for auto-fill
 */

declare const chrome: any;

import { FormDetector } from './form-detector';

interface LoginField {
  selector: string;
  type: 'username' | 'password' | 'email';
}

// Detect login forms using advanced form detection
function detectLoginForms(): LoginField[] {
  const forms = FormDetector.detectForms();
  const loginFields: LoginField[] = [];

  for (const form of forms) {
    if (form.username && (form.username.type === 'username' || form.username.type === 'email' || form.username.type === 'text')) {
      loginFields.push({
        selector: form.username.selector,
        type: form.username.type === 'text' ? 'username' : form.username.type,
      });
    }
    if (form.password) {
      loginFields.push({
        selector: form.password.selector,
        type: 'password',
      });
    }
  }

  return loginFields;
}

// Listen for messages from background script or popup
chrome.runtime.onMessage.addListener((request: any, sender: any, sendResponse: any) => {
  if (request.action === 'detectLoginForms') {
    const forms = detectLoginForms();
    sendResponse({ forms });
  }

  if (request.action === 'autoFill' && request.fields) {
    request.fields.forEach(
      (field: { selector: string; value: string; type: string }) => {
        const element = document.querySelector(
          field.selector
        ) as HTMLInputElement;
        if (element) {
          element.value = field.value;
          element.dispatchEvent(new Event('input', { bubbles: true }));
          element.dispatchEvent(new Event('change', { bubbles: true }));
        }
      },
    );

    sendResponse({ success: true });
  }

  if (request.action === 'contextMenuFill') {
    // Focus the context menu clicked element
    const element = document.activeElement as HTMLInputElement;
    if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
      element.focus();
      element.select?.();
    }
    sendResponse({ success: true });
  }
});

// Auto-detect forms on page load
function autoDetectFormsOnLoad(): void {
  const forms = FormDetector.detectForms();

  if (forms.length > 0) {
    // Notify background script about detected forms
    chrome.runtime.sendMessage({
      action: 'formsDetected',
      count: forms.length,
      forms: forms.map(f => ({
        hasUsername: !!f.username,
        hasPassword: !!f.password,
        passwordFieldCount: f.passwordFields.length
      }))
    }).catch(() => {
      // Silently ignore if background script not available
    });
  }
}

// Detect forms on page load
window.addEventListener('load', () => {
  autoDetectFormsOnLoad();
});

// Also detect forms after a short delay for dynamic content
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    autoDetectFormsOnLoad();
  }, 500);
});
