import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WorkspaceEditorComponent } from './workspace-editor/workspace-editor.component';
import { WorkspacePluginSourceComponent } from './workspace-plugin-stepper/workspace-plugin-source/workspace-plugin-source.component';
import { WorkspacePluginStepperComponent } from './workspace-plugin-stepper/workspace-plugin-stepper.component';
import { WorkspaceComponent } from './workspace.component';

const routes: Routes = [
    {
        path: '',
        component: WorkspaceComponent,
        children: [
            { path: 'source', component: WorkspacePluginSourceComponent },
            { path: 'stepper', component: WorkspacePluginStepperComponent },
            { path: '', component: WorkspaceEditorComponent }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WorkspaceRoutingModule { }
