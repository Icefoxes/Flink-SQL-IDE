import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'workspace', loadChildren: () => import('./workspace/workspace.module').then(mod => mod.WorkspaceModule) },
  { path: '', redirectTo: 'workspace', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
