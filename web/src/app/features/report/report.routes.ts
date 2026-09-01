import { Routes } from '@angular/router';
import { ReportPage } from './report-page/report-page';

/** Security report — one page, no sub-routes. */
export const reportRoutes: Routes = [{ path: '', component: ReportPage }];
