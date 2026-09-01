import { Routes } from '@angular/router';
import { TagsPage } from './tags-page/tags-page';

/** Tag management — one page, no sub-routes. */
export const tagsRoutes: Routes = [{ path: '', component: TagsPage }];
