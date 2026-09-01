import { Routes } from '@angular/router';
import { SettingsPage } from './settings-page/settings-page';

/** A single page — profile, master password and data transfer are sections of it. */
export const settingsRoutes: Routes = [{ path: '', component: SettingsPage }];
