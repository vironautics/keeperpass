import { Routes } from '@angular/router';
import { ItemsPage } from './items-page/items-page';

/**
 * The vault.
 *
 * `ItemsPage` holds the list and stays mounted; the detail pane is whichever
 * child route matches. The empty-path child renders the placeholder, so "no item
 * open" is a real route rather than a special case in the template.
 */
export const itemsRoutes: Routes = [
  {
    path: '',
    component: ItemsPage,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./no-item-selected/no-item-selected').then((m) => m.NoItemSelected),
      },
      {
        path: ':itemId',
        loadComponent: () => import('./item-view/item-view').then((m) => m.ItemView),
      },
    ],
  },
];
