import { Routes } from '@angular/router';
import { authGuard, homeGuard } from './core/auth/auth.guard';
import { AppShell } from './layout/app-shell/app-shell';

export const routes: Routes = [
  // Fully signed-in application, framed by the navigation shell.
  {
    path: '',
    component: AppShell,
    canMatch: [authGuard],
    children: [
      {
        path: 'items',
        title: 'Vault',
        loadChildren: () => import('./features/items/items.routes').then((m) => m.itemsRoutes),
      },
      {
        path: 'settings',
        title: 'Settings',
        loadChildren: () =>
          import('./features/settings/settings.routes').then((m) => m.settingsRoutes),
      },
      {
        path: 'generator',
        title: 'Password Generator',
        loadChildren: () =>
          import('./features/generator/generator.routes').then((m) => m.generatorRoutes),
      },
      {
        path: 'tags',
        title: 'Tags',
        loadChildren: () => import('./features/tags/tags.routes').then((m) => m.tagsRoutes),
      },
      {
        path: 'vaults',
        title: 'My Vaults',
        loadChildren: () => import('./features/vaults/vaults.routes').then((m) => m.vaultsRoutes),
      },
      {
        path: 'report',
        title: 'Security Report',
        loadChildren: () => import('./features/report/report.routes').then((m) => m.reportRoutes),
      },
      {
        path: 'support',
        title: 'Support',
        loadChildren: () =>
          import('./features/support/support.routes').then((m) => m.supportRoutes),
      },
      {
        path: 'policies',
        title: 'Policies',
        loadChildren: () =>
          import('./features/policies/policies.routes').then((m) => m.policiesRoutes),
      },
    ],
  },
  // The sign-in flow's steps (`/start`, `/unlock`), on their own full-bleed
  // backdrop. Each step guards itself — see auth.routes.ts.
  {
    path: '',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  // A bare `/`, or any unmatched URL, or a flow step visited out of order: send it to the right home.
  { path: '**', canMatch: [homeGuard], children: [] },
];
