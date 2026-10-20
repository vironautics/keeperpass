import { inject, Injectable } from '@angular/core';
import { SessionStore } from '../auth/session.store';
import { CLOUD_PROVIDERS } from './cloud-providers';
import { CloudProvider, ProviderId } from './provider';

/** Looks providers up by id, and knows which one the current session uses. */
@Injectable({ providedIn: 'root' })
export class ProviderRegistry {
  private readonly providers = inject(CLOUD_PROVIDERS);
  private readonly session = inject(SessionStore);

  list(): readonly CloudProvider[] {
    return this.providers;
  }

  /** The providers the sign-in screen offers: registered, and configured in this build. */
  available(): readonly CloudProvider[] {
    return this.providers.filter((provider) => provider.auth.isConfigured());
  }

  get(id: ProviderId): CloudProvider {
    const provider = this.providers.find((candidate) => candidate.auth.id === id);
    if (!provider) {
      throw new Error(`No sign-in provider is registered for "${id}".`);
    }
    return provider;
  }

  /** The provider the current session signed in with. */
  active(): CloudProvider {
    return this.get(this.session.providerId());
  }
}
