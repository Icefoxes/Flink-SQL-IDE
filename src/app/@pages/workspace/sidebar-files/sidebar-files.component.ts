import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { select } from '@ngrx/store';
import {
  MenuItem,
  ResourceTable,
  ResourceUDF,
  StreamNode,
  StreamNodeType
} from '../../../@core/model';
import { Store, State } from '../../../@core/state';
import { PROJECT_NODES, RESOURCE_NDOES } from 'src/app/@core/state/shared';
import { MenuService } from '../../../@core/service';

@Component({
  selector: 'app-sidebar-files',
  templateUrl: './sidebar-files.component.html',
  styleUrls: ['./sidebar-files.component.scss']
})
export class SidebarFilesComponent implements OnInit {
  showFiles = true;

  showResources = true;

  projects$: Observable<StreamNode[]>;

  resources$: Observable<StreamNode[]>;

  source$: Observable<StreamNode[]>;

  sink$: Observable<StreamNode[]>;

  udf$: Observable<StreamNode[]>;

  resources = RESOURCE_NDOES;

  projects = PROJECT_NODES;

  selectStreamNodes = (tables: ResourceTable[]) => {
    const nodes: StreamNode[] = [];
    tables.forEach(t => {
      nodes.push({
        name: t.name,
        nodeType: StreamNodeType.Table,
        children: [...t.columns.map(col => {
          return {
            name: col.name,
            nodeType: StreamNodeType.Column,
            children: []
          } as StreamNode;
        })]
      });
    });
    return nodes;
  }

  selectUDFStreamNodes = (udfs: ResourceUDF[]) => {
    const nodes: StreamNode[] = [];
    udfs.forEach(t => {
      nodes.push({
        name: t.title,
        nodeType: StreamNodeType.UDF,
        children: []
      });
    });
    return nodes;
  }

  selectJobStreamNodes = (jobs: string[]) => {
    const nodes: StreamNode[] = [];
    jobs.forEach(t => {
      nodes.push({
        name: t,
        nodeType: StreamNodeType.Job,
        children: []
      });
    });
    return nodes;
  }

  constructor(
    private readonly store: Store<State>,
    private readonly menuService: MenuService) {
    this.source$ = this.store.pipe(select(root => root.resources.source), map(this.selectStreamNodes));
    this.sink$ = this.store.pipe(select(root => root.resources.sink), map(this.selectStreamNodes));
    this.udf$ = this.store.pipe(select(root => root.resources.udf), map(this.selectUDFStreamNodes));
    this.resources$ = combineLatest([this.source$, this.sink$, this.udf$]).pipe(map(data => {
      this.resources[0].children[0].children = [...data[0]];
      this.resources[0].children[1].children = [...data[1]];
      this.resources[0].children[2].children = [...data[2]];
      return this.resources;
    }));

    this.projects$ = combineLatest([this.store.pipe(
      select(root => root.jobs.jobs.map(j => j.name)),
      distinctUntilChanged(),
      map(this.selectJobStreamNodes))])
      .pipe(map(nodes => {
        this.projects[0].children = [...nodes[0]];
        return this.projects;
      }));
  }

  ngOnInit(): void {
  }

  toggleDigram(): void {
    this.showResources = !this.showResources;
  }

  toggleResouce(): void {
    this.showFiles = !this.showFiles;
  }

  OnMenuItem(menuItem: MenuItem): void {
    this.menuService.onMenuItem(menuItem);
  }
}
