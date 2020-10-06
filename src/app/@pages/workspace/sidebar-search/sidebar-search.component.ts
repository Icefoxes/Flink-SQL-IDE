import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar-search',
  templateUrl: './sidebar-search.component.html',
  styleUrls: ['./sidebar-search.component.scss']
})
export class SidebarSearchComponent implements OnInit {

  showReplace = false;

  searchText = '';

  constructor() { }

  ngOnInit(): void {
  }

}
