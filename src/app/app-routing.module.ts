import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'apps', loadChildren: () => import('./@pages/pages.module').then(mod => mod.PagesModule) },
  { path: '', redirectTo: 'apps', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
