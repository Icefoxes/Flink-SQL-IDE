import { Component, OnInit } from '@angular/core';

enum WorkspaceSideBar {
  Explorer = 'Explorer',
  Search = 'Search',
  Session = 'Session',
  Setting = 'Setting',
  None = ''
}

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {

  activeSideBar: WorkspaceSideBar = WorkspaceSideBar.None;

  constructor() { }

  ngOnInit(): void {
  }

  onToggleSidebar(sidebar: WorkspaceSideBar): void {
    if (sidebar === this.activeSideBar && this.activeSideBar !== WorkspaceSideBar.None) {
      this.activeSideBar = WorkspaceSideBar.None;
    }
    else {
      this.activeSideBar = sidebar;
    }
  }
}
