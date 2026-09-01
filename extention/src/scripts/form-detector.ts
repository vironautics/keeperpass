/**
 * Advanced form detection and field identification
 * Based on KeePassXC-Browser's approach
 */

export interface FormField {
  element: HTMLInputElement;
  selector: string;
  type: 'username' | 'password' | 'email' | 'text';
  confidence: number; // 0-100
  matchReasons: string[]; // Why this field was selected
}

export interface DetectedForm {
  form?: HTMLFormElement;
  username?: FormField | null;
  password?: FormField | null;
  passwordFields: FormField[];
  url?: string;
  submissionUrl?: string;
}

export class FormDetector {
  /**
   * Detect all forms and their credential fields on the page
   */
  static detectForms(): DetectedForm[] {
    const forms: DetectedForm[] = [];
    const processedElements = new Set<HTMLElement>();

    // Check all forms
    for (const form of document.forms) {
      const detected = this.detectFormFields(form);
      if (detected.username || detected.password) {
        forms.push(detected);
        processedElements.add(form);
      }
    }

    // Check for orphaned fields not in forms
    const allInputs = Array.from(document.querySelectorAll('input'));
    for (const input of allInputs) {
      if (input.form && processedElements.has(input.form)) {
        continue; // Already processed
      }

      const detected = this.detectFieldsFromInputs([input]);
      if (detected.username || detected.password) {
        forms.push(detected);
      }
    }

    return forms;
  }

  /**
   * Detect credential fields within a specific form
   */
  static detectFormFields(form: HTMLFormElement): DetectedForm {
    const inputs = Array.from(form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input:not([type])'));
    return this.detectFieldsFromInputs(inputs as HTMLInputElement[], form);
  }

  /**
   * Detect fields from an array of inputs
   */
  static detectFieldsFromInputs(inputs: HTMLInputElement[], form?: HTMLFormElement): DetectedForm {
    const result: DetectedForm = {
      form,
      passwordFields: [],
    };

    let usernameField: FormField | null = null;
    const passwordFields: FormField[] = [];

    for (const input of inputs) {
      if (!this.isVisible(input) || this.shouldIgnore(input)) {
        continue;
      }

      const field = this.classifyField(input);
      if (!field) {
        continue;
      }

      if (field.type === 'password') {
        passwordFields.push(field);
      } else if (!usernameField || field.confidence > usernameField.confidence) {
        usernameField = field;
      }
    }

    result.username = usernameField;
    result.password = passwordFields[0]; // First password field
    result.passwordFields = passwordFields;

    if (form) {
      result.url = form.action;
      result.submissionUrl = this.getFormSubmissionUrl(form);
    }

    return result;
  }

  /**
   * Classify an input field as username/email/password/text
   */
  private static classifyField(input: HTMLInputElement): FormField | null {
    const selector = this.getUniqueSelector(input);
    const matchReasons: string[] = [];
    let confidence = 0;

    // Check type attribute
    const type = input.type?.toLowerCase() || '';
    if (type === 'password') {
      confidence = 100;
      matchReasons.push('type=password');
      return { element: input, selector, type: 'password', confidence, matchReasons };
    }

    if (type === 'email') {
      confidence = 95;
      matchReasons.push('type=email');
      return { element: input, selector, type: 'email', confidence, matchReasons };
    }

    // Check name attribute
    const name = (input.name || '').toLowerCase();
    const namePatterns = {
      email: ['email', 'mail', 'e-mail', 'emailaddress'],
      username: ['username', 'user', 'login', 'userid', 'user_id', 'account'],
      password: ['password', 'pass', 'pwd', 'passwd'],
    };

    for (const [fieldType, patterns] of Object.entries(namePatterns)) {
      if (patterns.some(p => name.includes(p))) {
        confidence = 80;
        matchReasons.push(`name contains "${fieldType}"`);
        return { element: input, selector, type: fieldType as any, confidence, matchReasons };
      }
    }

    // Check ID attribute
    const id = (input.id || '').toLowerCase();
    for (const [fieldType, patterns] of Object.entries(namePatterns)) {
      if (patterns.some(p => id.includes(p))) {
        confidence = 70;
        matchReasons.push(`id contains "${fieldType}"`);
        return { element: input, selector, type: fieldType as any, confidence, matchReasons };
      }
    }

    // Check associated label
    const label = this.getAssociatedLabel(input);
    if (label) {
      const labelText = label.textContent?.toLowerCase() || '';
      for (const [fieldType, patterns] of Object.entries(namePatterns)) {
        if (patterns.some(p => labelText.includes(p))) {
          confidence = 75;
          matchReasons.push(`label text contains "${fieldType}"`);
          return { element: input, selector, type: fieldType as any, confidence, matchReasons };
        }
      }
    }

    // Check aria-label
    const ariaLabel = (input.getAttribute('aria-label') || '').toLowerCase();
    for (const [fieldType, patterns] of Object.entries(namePatterns)) {
      if (patterns.some(p => ariaLabel.includes(p))) {
        confidence = 75;
        matchReasons.push(`aria-label contains "${fieldType}"`);
        return { element: input, selector, type: fieldType as any, confidence, matchReasons };
      }
    }

    // Check placeholder
    const placeholder = (input.placeholder || '').toLowerCase();
    if (placeholder.length > 0) {
      let fieldType: 'password' | 'email' | 'username' | 'text' | null = null;

      if (placeholder.includes('password')) {
        fieldType = 'password';
      } else if (placeholder.includes('email') || placeholder.includes('e-mail')) {
        fieldType = 'email';
      } else if (placeholder.includes('username') || placeholder.includes('user')) {
        fieldType = 'username';
      }

      if (fieldType) {
        confidence = 65;
        matchReasons.push('placeholder text');
        return { element: input, selector, type: fieldType, confidence, matchReasons };
      }
    }

    // Check autocomplete attribute
    const autoComplete = (input.autocomplete || '').toLowerCase();
    if (autoComplete.includes('username')) {
      confidence = 85;
      matchReasons.push('autocomplete=username');
      return { element: input, selector, type: 'username', confidence, matchReasons };
    }
    if (autoComplete.includes('email')) {
      confidence = 90;
      matchReasons.push('autocomplete=email');
      return { element: input, selector, type: 'email', confidence, matchReasons };
    }
    if (autoComplete.includes('current-password')) {
      confidence = 90;
      matchReasons.push('autocomplete=current-password');
      return { element: input, selector, type: 'password', confidence, matchReasons };
    }

    // Default text field
    if (type === 'text' || type === '') {
      confidence = 30;
      matchReasons.push('default text field');
      return { element: input, selector, type: 'text', confidence, matchReasons };
    }

    return null;
  }

  /**
   * Get associated label for an input field
   */
  private static getAssociatedLabel(input: HTMLInputElement): HTMLLabelElement | null {
    // Check label with for attribute
    if (input.id) {
      const label = document.querySelector(`label[for="${CSS.escape(input.id)}"]`);
      if (label) {
        return label as HTMLLabelElement;
      }
    }

    // Check if input is inside a label
    const parentLabel = input.closest('label');
    if (parentLabel) {
      return parentLabel;
    }

    return null;
  }

  /**
   * Generate a unique CSS selector for an element
   */
  private static getUniqueSelector(element: HTMLInputElement): string {
    // Prefer ID
    if (element.id) {
      return `#${CSS.escape(element.id)}`;
    }

    // Prefer name
    if (element.name) {
      return `input[name="${CSS.escape(element.name)}"]`;
    }

    // Build path from ancestors
    let path: string[] = [];
    let el: Element | null = element;

    while (el && el !== document.body) {
      let index = 0;
      let sibling = el.previousElementSibling;

      while (sibling) {
        if (sibling.tagName === el.tagName) {
          index++;
        }
        sibling = sibling.previousElementSibling;
      }

      path.unshift(`${el.tagName.toLowerCase()}:nth-of-type(${index + 1})`);
      el = el.parentElement;
    }

    return path.join(' > ');
  }

  /**
   * Check if element is visible
   */
  private static isVisible(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element);
    return (
      element.offsetParent !== null &&
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0'
    );
  }

  /**
   * Check if field should be ignored
   */
  private static shouldIgnore(input: HTMLInputElement): boolean {
    const type = (input.type || '').toLowerCase();
    const ignoreTypes = ['hidden', 'submit', 'button', 'reset', 'file', 'checkbox', 'radio'];

    if (ignoreTypes.includes(type)) {
      return true;
    }

    const name = (input.name || '').toLowerCase();
    const ignorePatterns = ['captcha', 'recaptcha', 'verify', 'otp', 'security'];

    if (ignorePatterns.some(p => name.includes(p))) {
      return true;
    }

    return false;
  }

  /**
   * Get the form submission URL
   */
  private static getFormSubmissionUrl(form: HTMLFormElement): string {
    if (form.action) {
      return form.action;
    }

    return window.location.href;
  }

  /**
   * Find the form submit button
   */
  static getFormSubmitButton(form: HTMLFormElement): HTMLElement | null {
    // Look for submit button
    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
    if (submitButton) {
      return submitButton as HTMLElement;
    }

    // Look for button with common login classes
    const loginButton = form.querySelector('button.login, button.signin, button[type="button"]:last-of-type');
    if (loginButton) {
      return loginButton as HTMLElement;
    }

    return null;
  }
}
