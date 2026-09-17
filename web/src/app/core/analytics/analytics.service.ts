import { inject, Injectable, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Reports page views to GA4 on every route change.
 *
 * `index.html` loads gtag.js with `send_page_view: false` — an Angular route
 * change is a `pushState`, not a document load, so GA's own automatic
 * pageview would only ever fire once. This sends one `page_view` per
 * `NavigationEnd` instead, using the route's resolved title (see
 * `app.routes.ts`) and path so entries land distinctly rather than all
 * under `/`.
 *
 * Deliberately page views only — anything finer (clicks, field values) risks
 * sending vault content (item names, emails) that shows up as element text
 * throughout this app.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService implements OnDestroy {
  private readonly router = inject(Router);
  private readonly title = inject(Title);

  private subscription?: Subscription;

  /** Called once at startup; runs for the life of the app. */
  start(): void {
    this.subscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.trackPageView(event.urlAfterRedirects));
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private trackPageView(path: string): void {
    window.gtag?.('event', 'page_view', {
      page_path: path,
      page_title: this.title.getTitle(),
      page_location: window.location.href,
    });
  }
}
