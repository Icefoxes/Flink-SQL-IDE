import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
// 3rd party - Monaco Editor
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ToastrModule } from 'ngx-toastr';
// material
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
// relative
import { WorkspaceRoutingModule } from './workspace-routing.module';
import { WorkspaceHeaderComponent } from './workspace-header/workspace-header.component';
import { WorkspaceEditorComponent } from './workspace-editor/workspace-editor.component';

import { WorkspaceComponent } from './workspace.component';
import { SidebarFilesComponent } from './sidebar-files/sidebar-files.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarSearchComponent } from './sidebar-search/sidebar-search.component';
import { SidebarExtensionComponent } from './sidebar-extension/sidebar-extension.component';
import { SidebarSettingComponent } from './sidebar-setting/sidebar-setting.component';
import { TerminalComponent } from './workspace-terminal/terminal.component';
import { WorkspaceTreeComponent } from './sidebar-files/tree/workspace-tree.component';

import { FileIconPipe } from './file-icon.pipe';
import { ArrowDirectionPipe } from './arrow.direction.pipe';
import { NodeIconPipe } from './node-icon.pipe';
import { NodeDragPipe } from './node-drag.pipe';
import { WorkspacePluginStepperComponent } from './workspace-plugin-stepper/workspace-plugin-stepper.component';
import { WorkspacePluginFilesystemComponent } from './workspace-plugin-stepper/workspace-plugin-filesystem/workspace-plugin-filesystem.component';
import { WorkspacePluginJdbcComponent } from './workspace-plugin-stepper/workspace-plugin-jdbc/workspace-plugin-jdbc.component';
import { WorkspacePluginKafkaComponent } from './workspace-plugin-stepper/workspace-plugin-kafka/workspace-plugin-kafka.component';
import { WorkspacePluginSourceComponent } from './workspace-plugin-stepper/workspace-plugin-source/workspace-plugin-source.component';
import { FileCreateComponent } from './modal/file-create/file-create.component';
import { FileDeleteComponent } from './modal/file-delete/file-delete.component';
import { SidebarReviewComponent } from './sidebar-review/sidebar-review.component';


const MATERIAL = [
  MatSnackBarModule,
  MatFormFieldModule,
  MatInputModule,
  MatCardModule,
  MatIconModule,
  MatTreeModule,
  MatSelectModule,
  MatStepperModule,
  MatButtonModule,
  MatTableModule,
  MatPaginatorModule,
  MatDialogModule
];

const COMPONETS = [
  WorkspaceHeaderComponent,
  WorkspaceEditorComponent,
  SidebarFilesComponent,
  SidebarComponent,
  SidebarSearchComponent,
  SidebarExtensionComponent,
  SidebarSettingComponent,
  SidebarReviewComponent,
  WorkspaceComponent,
  TerminalComponent,
  WorkspaceHeaderComponent,
  WorkspaceTreeComponent,
  WorkspacePluginStepperComponent,
  WorkspacePluginKafkaComponent,
  WorkspacePluginJdbcComponent,
  WorkspacePluginFilesystemComponent,
  WorkspacePluginSourceComponent,
  FileDeleteComponent,
  FileCreateComponent
];

const PIPES = [
  FileIconPipe,
  ArrowDirectionPipe,
  NodeIconPipe,
  NodeDragPipe
];

@NgModule({
  declarations: [...COMPONETS, ...PIPES],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule,
    WorkspaceRoutingModule,
    MonacoEditorModule,
    AngularSvgIconModule,
    StoreModule,
    ...MATERIAL
  ]
})
export class WorkspaceModule { }
