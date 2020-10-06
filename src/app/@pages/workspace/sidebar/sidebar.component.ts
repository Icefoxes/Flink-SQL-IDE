import { Component, EventEmitter, Output } from '@angular/core';
import { WorkspaceSideBar } from '../workspace.enum';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Output()
  toggleSidebar = new EventEmitter<WorkspaceSideBar>();

  toggleSideBarContent(content: any): void {
    this.toggleSidebar.emit(content);
  }
}
