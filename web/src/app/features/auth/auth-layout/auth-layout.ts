import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideCloudCheck,
  lucideFileLock2,
  lucideLanguages,
  lucideLockKeyhole,
  lucideMonitor,
  lucideMoon,
  lucideServerOff,
  lucideShieldCheck,
  lucideSun,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { I18nService, TranslatePipe } from '../../../core/i18n';
import { AppLocale } from '../../../core/i18n/locales';
import { TranslationKey } from '../../../core/i18n/translations';
import { ThemePreference, ThemeService } from '../../../core/theme/theme.service';
import { Logo } from '../../../ui/logo/logo';

/** Theme button glyph per preference — the same three states as the sidebar's theme item. */
const THEME_ICONS: Record<ThemePreference, string> = {
  auto: 'lucideMonitor',
  light: 'lucideSun',
  dark: 'lucideMoon',
};

/**
 * Chrome shared by every unauthenticated screen: a top bar with the brand mark and the
 * two settings worth having before sign-in (language and theme), the current step
 * centred below it, and from `lg` up a brand panel beside it. Each step renders into
 * the outlet.
 */
@Component({
  selector: 'app-auth-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Logo, NgIcon, TranslatePipe, HlmButtonImports, HlmDropdownMenuImports],
  providers: [
    provideIcons({
      lucideCheck,
      lucideCloudCheck,
      lucideFileLock2,
      lucideLanguages,
      lucideLockKeyhole,
      lucideMonitor,
      lucideMoon,
      lucideServerOff,
      lucideShieldCheck,
      lucideSun,
    }),
  ],
  templateUrl: './auth-layout.html',
  /** The document does not scroll; this layout owns its own overflow. */
  host: { class: 'absolute inset-0' },
})
export class AuthLayout {
  private readonly i18n = inject(I18nService);
  private readonly theme = inject(ThemeService);

  protected readonly locale = this.i18n.locale;
  protected readonly localeOptions = this.i18n.options;

  protected readonly themePreference = this.theme.preference;
  protected readonly themeIcon = computed(() => THEME_ICONS[this.theme.preference()]);

  /** The three facts about how this app works that are worth stating before sign-in. */
  protected readonly features = [
    {
      icon: 'lucideLockKeyhole',
      title: 'auth.layout.featureEncryption',
      body: 'auth.start.encryptionNote',
    },
    { icon: 'lucideCloudCheck', title: 'auth.layout.featureAccess', body: 'auth.start.accessNote' },
    {
      icon: 'lucideServerOff',
      title: 'auth.layout.featureNoServer',
      body: 'auth.start.noServerNote',
    },
  ] as const satisfies readonly { icon: string; title: TranslationKey; body: TranslationKey }[];

  /** Decorative ciphertext for the vault card: all the storage provider ever holds. */
  protected readonly cipherPreview =
    'Q2lwaGVyVGV4dE9ubHlZb3VyU2VjcmV0Q2FuT3Blbg.7f3a9c2e1b8d4f60a5e2c9b1d7f4a8e3c6b0d9f2a1e5c8b7d4f3a6e9c2b5d8f1a4e7c0b3d6f9a2e5c8b1d4f7a0e3c6';

  protected setLocale(locale: AppLocale): void {
    this.i18n.setLocale(locale);
  }

  protected nextTheme(): void {
    this.theme.next();
  }
}
