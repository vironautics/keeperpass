import { Routes } from '@angular/router';
import { GeneratorPage } from './generator-page/generator-page';

/** Passphrase and random-string generator — one page, no sub-routes. */
export const generatorRoutes: Routes = [{ path: '', component: GeneratorPage }];
