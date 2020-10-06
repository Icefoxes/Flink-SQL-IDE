import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar-setting',
  templateUrl: './sidebar-setting.component.html',
  styleUrls: ['./sidebar-setting.component.scss']
})
export class SidebarSettingComponent implements OnInit {
  ShowSettings = true;

  constructor() { }

  ngOnInit(): void {
  }

  toggleSettings(): void {
    this.ShowSettings = !this.ShowSettings;
  }
}
