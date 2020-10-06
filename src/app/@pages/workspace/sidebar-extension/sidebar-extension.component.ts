import { Component, OnInit } from '@angular/core';
import { RxStompService } from '@stomp/ng2-stompjs';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  SessionCatalog,
  SessionRoot,
  StreamNode,
  StreamNodeType
} from 'src/app/@core/model';
import {
  REQUEST_CATALOG,
  REQUEST_CLOSE,
  RESPONSE_CATALOG
} from '../channel';

// export declare enum RxStompState {
//   CONNECTING = 0,
//   OPEN = 1,
//   CLOSING = 2,
//   CLOSED = 3
// }

@Component({
  selector: 'app-sidebar-extension',
  templateUrl: './sidebar-extension.component.html',
  styleUrls: ['./sidebar-extension.component.scss']
})
export class SidebarExtensionComponent implements OnInit {
  ShowSessions = true;

  sessions$: Observable<StreamNode[]>;

  sessionSetup: boolean;

  constructor(
    private rxStompService: RxStompService) {
  }

  processCatalog(catalogs: SessionCatalog[]): StreamNode[] {
    const currentSession: StreamNode[] = [];
    catalogs.forEach(catalog => {
      currentSession.push({
        name: catalog.name,
        nodeType: StreamNodeType.SessionCatalog,
        children: [...catalog.databases.map(database => {
          return {
            name: database.name,
            nodeType: StreamNodeType.SessionDatabase,
            children: [...database.tables.map(table => {
              return {
                name: table.name,
                nodeType: StreamNodeType.SessionTable,
                children: [...table.columns.map(col => {
                  return {
                    name: col.name,
                    nodeType: StreamNodeType.SessionColumn,
                    children: []
                  } as StreamNode;
                })]
              } as StreamNode;
            })]
          } as StreamNode;
        })]
      });
    });
    return currentSession;
  }

  ngOnInit(): void {
    this.rxStompService.connectionState$
      .subscribe(
        state => {
          this.sessionSetup = (state === 1);
        }
      );

    this.sessions$ = this.rxStompService.watch(RESPONSE_CATALOG)
      .pipe(
        map(res => JSON.parse(res.body) as SessionRoot),
        map(root => this.processCatalog(root.payload))
      );
    this.onRefresh();
  }

  toggleSessions(): void {
    this.ShowSessions = !this.ShowSessions;
  }

  onClose(): void {
    this.rxStompService.publish({ destination: REQUEST_CLOSE });
  }

  onRefresh(): void {
    this.rxStompService.publish({ destination: REQUEST_CATALOG });
  }
}
