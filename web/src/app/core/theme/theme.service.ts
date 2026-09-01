import { computed, DOCUMENT, effect, inject, Injectable, signal } from '@angular/core';

export type ThemePreference = 'auto' | 'light' | 'dark';
export type Theme = 'light' | 'dark';

/** Order the theme button steps through. */
const NEXT_PREFERENCE: Record<ThemePreference, ThemePreference> = {
  auto: 'dark',
  dark: 'light',
  light: 'auto',
};

/** Shared with the pre-bootstrap script in index.html — keep the two in step. */
export const THEME_STORAGE_KEY = 'keeperpass.theme';

const PREFERENCES: readonly ThemePreference[] = ['auto', 'light', 'dark'];

function isPreference(value: unknown): value is ThemePreference {
  return PREFERENCES.includes(value as ThemePreference);
}

/**
 * Resolves the active theme and reflects it onto the document as `dark` on `<html>` —
 * the one class the whole app keys off, both for the CSS variables (`:root.dark` in
 * spartan.css) and for Tailwind's `dark:` variant, which compiles to `&:is(.dark *)`.
 * `auto` follows the OS setting and keeps following it.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  readonly preference = signal<ThemePreference>('auto');

  private readonly prefersDark = signal(false);

  readonly theme = computed<Theme>(() => {
    const preference = this.preference();
    if (preference !== 'auto') {
      return preference;
    }
    return this.prefersDark() ? 'dark' : 'light';
  });

  constructor() {
    // Absent in non-browser environments (tests, SSR); `auto` then resolves to light.
    const view = this.document.defaultView;
    if (typeof view?.matchMedia === 'function') {
      const query = view.matchMedia('(prefers-color-scheme: dark)');
      this.prefersDark.set(query.matches);
      query.addEventListener('change', (event) => this.prefersDark.set(event.matches));
    }

    const stored = this.readStoredPreference();
    if (stored) {
      this.preference.set(stored);
    }

    effect(() => {
      this.document.documentElement.classList.toggle('dark', this.theme() === 'dark');
    });

    effect(() => this.writeStoredPreference(this.preference()));
  }

  /**
   * `localStorage` access throws outright when the browser blocks storage (Safari private
   * browsing, a site-data policy), so both sides are guarded: a failure just means the
   * preference does not survive a reload.
   */
  private readStoredPreference(): ThemePreference | undefined {
    try {
      const stored = this.document.defaultView?.localStorage.getItem(THEME_STORAGE_KEY);
      return isPreference(stored) ? stored : undefined;
    } catch {
      return undefined;
    }
  }

  private writeStoredPreference(preference: ThemePreference): void {
    try {
      this.document.defaultView?.localStorage.setItem(THEME_STORAGE_KEY, preference);
    } catch {
      /* storage unavailable — the in-memory signal is still authoritative */
    }
  }

  /** Cycles auto -> dark -> light -> auto, matching the menu's theme button. */
  next(): void {
    this.preference.update((current) => NEXT_PREFERENCE[current]);
  }
}
