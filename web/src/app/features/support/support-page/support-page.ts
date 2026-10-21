import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowRight,
  lucideBookOpen,
  lucideCloud,
  lucideCpu,
  lucideDatabase,
  lucideFolderLock,
  lucideKeyRound,
  lucideLifeBuoy,
  lucideLock,
  lucideLogIn,
  lucideMail,
  lucideMessageCircleQuestion,
  lucideMonitorSmartphone,
  lucideSend,
  lucideShieldCheck,
} from '@ng-icons/lucide';
import { HlmAccordionImports } from '@spartan-ng/helm/accordion';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmSidebarTrigger } from '@spartan-ng/helm/sidebar';
import { TranslatePipe, TranslationKey } from '../../../core/i18n';

/** One fact in "What protects it". */
interface Protection {
  icon: string;
  term: TranslationKey;
  description: TranslationKey;
}

/**
 * How the app works and who to ask: a reading column of cards, one per question people
 * actually arrive with, ending in the FAQ and a way to get in touch.
 */
@Component({
  selector: 'app-support-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, HlmAccordionImports, HlmButton, HlmSidebarTrigger, TranslatePipe],
  providers: [
    provideIcons({
      lucideArrowRight,
      lucideBookOpen,
      lucideCloud,
      lucideCpu,
      lucideDatabase,
      lucideFolderLock,
      lucideKeyRound,
      lucideLifeBuoy,
      lucideLock,
      lucideLogIn,
      lucideMail,
      lucideMessageCircleQuestion,
      lucideMonitorSmartphone,
      lucideSend,
      lucideShieldCheck,
    }),
  ],
  templateUrl: './support-page.html',
  host: { class: 'bg-card absolute inset-x-0 bottom-0 top-[var(--inset-top,0px)] flex flex-col' },
})
export class SupportPage {
  protected readonly protections: readonly Protection[] = [
    {
      icon: 'lucideKeyRound',
      term: 'support.protects.secretTerm',
      description: 'support.protects.secretDescription',
    },
    {
      icon: 'lucideCpu',
      term: 'support.protects.kdfTerm',
      description: 'support.protects.kdfDescription',
    },
    {
      icon: 'lucideLock',
      term: 'support.protects.encryptionTerm',
      description: 'support.protects.encryptionDescription',
    },
    {
      icon: 'lucideFolderLock',
      term: 'support.protects.storageAccessTerm',
      description: 'support.protects.storageAccessDescription',
    },
  ];

  protected readonly signInSteps = [
    { title: 'support.signingIn.step1Title', description: 'support.signingIn.step1Description' },
    { title: 'support.signingIn.step2Title', description: 'support.signingIn.step2Description' },
  ] as const satisfies readonly { title: TranslationKey; description: TranslationKey }[];

  /**
   * The plain-text answers, in the order they are asked. The first and the last two carry
   * markup of their own and are written out in the template around this list.
   */
  protected readonly faqs = [
    { q: 'support.faq.seeQ', a: 'support.faq.seeA' },
    { q: 'support.faq.syncQ', a: 'support.faq.syncA' },
    { q: 'support.faq.providerQ', a: 'support.faq.providerA' },
    { q: 'support.faq.importQ', a: 'support.faq.importA' },
  ] as const satisfies readonly { q: TranslationKey; a: TranslationKey }[];
}
