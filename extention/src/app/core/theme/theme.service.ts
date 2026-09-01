import { computed, DOCUMENT, effect, inject, Injectable, signal } from '@angular/core';

export type ThemePreference = 'auto' | 'light' | 'dark';
export type Theme = 'light' | 'dark';

/** Order the theme button steps through. */
const NEXT_PREFERENCE: Record<ThemePreference, ThemePreference> = {
  auto: 'dark',
  dark: 'light',
  light: 'auto',
};

/**
 * Resolves the active theme and reflects it onto the document as `dark` on
 * `<html>` — the one class spartan.css keys off, both for its CSS variables
 * (`:root.dark`) and for Tailwind's `dark:` variant, which compiles to
 * `&:is(.dark *)`. `auto` follows the OS setting and keeps following it.
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

    effect(() => {
      this.document.documentElement.classList.toggle('dark', this.theme() === 'dark');
    });
  }

  /** Cycles auto -> dark -> light -> auto, matching the menu's theme button. */
  next(): void {
    this.preference.update((current) => NEXT_PREFERENCE[current]);
  }
}
