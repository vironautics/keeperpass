import { Routes } from '@angular/router';
import { homeGuard, setupGuard, startGuard, unlockGuard } from '../../core/auth/auth.guard';
import { AuthLayout } from './auth-layout/auth-layout';

/** Unauthenticated screens. All share the `AuthLayout` chrome. */
export const authRoutes: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      {
        path: 'start',
        title: 'Welcome',
        canMatch: [startGuard],
        loadComponent: () => import('./start/start-page').then((m) => m.StartPage),
      },
      {
        path: 'unlock',
        title: 'Unlock your vault',
        canMatch: [unlockGuard],
        loadComponent: () => import('./unlock/unlock-page').then((m) => m.UnlockPage),
      },
      {
        path: 'setup',
        title: 'Create your vault',
        canMatch: [setupGuard],
        loadComponent: () => import('./setup/setup-page').then((m) => m.SetupPage),
      },
      {
        path: 'recover',
        title: 'Recover Account',
        // Same phase gate as /unlock — this is the only place it's reachable from.
        canMatch: [unlockGuard],
        loadComponent: () => import('./recover/recover-page').then((m) => m.RecoverPage),
      },
      // A bare `/` matches this whole `''` subtree with zero segments left
      // to give a child — Angular renders `AuthLayout` with an empty outlet
      // rather than trying the next top-level route. This explicit leaf
      // catches that case and sends it to whichever step the phase requires.
      { path: '', pathMatch: 'full', canMatch: [homeGuard], children: [] },
    ],
  },
];
