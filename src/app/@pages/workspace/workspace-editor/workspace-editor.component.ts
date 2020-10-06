import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, first, map, mergeMap, takeUntil } from 'rxjs/operators';
// 3rd party
import { MonacoStandaloneCodeEditor } from '@materia-ui/ngx-monaco-editor';
import { RxStompService } from '@stomp/ng2-stompjs';
import { select } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
// relative
import { State, Store } from '../../../@core/state';
import * as TabActions from '../../../@core/state/tab/actions';
import { AutoSave, EditJob, PromoteJob } from '../../../@core/state/job/actions';
import { selectActiveTab } from '../../../@core/state/tab/selector';
import {
  Tab,
  SessionRegisterRequest,
  ResourceTable,
  DOMNode,
  Notification, StreamNodeType, MenuItemAction, MenuItem
} from '../../../@core/model';
import {
  RESPONSE_NOTIFICATION,
  REQUEST_EXECUTE,
  REQUEST_EXPLAIN
} from '../channel';
import { TableParser } from '../table.parse';
import { MenuService } from 'src/app/@core/service/menu.service';

@Component({
  selector: 'app-workspace-editor',
  templateUrl: './workspace-editor.component.html',
  styleUrls: ['./workspace-editor.component.scss']
})
export class WorkspaceEditorComponent implements OnInit, OnDestroy {
  showDiff = false;

  editorOptions = {
    theme: 'vs-dark',
    fontSize: '12px',
    fontFamily: `Consolas`,
    // Enable that scrolling can go one screen size after the last line.
    scrollBeyondLastLine: true,
    autoIndent: false,
    readOnly: false
  };

  differEditorOptions = {
    theme: 'vs-dark',
    fontSize: '12px',
    fontFamily: `Consolas`,
    // Enable that scrolling can go one screen size after the last line.
    scrollBeyondLastLine: true,
    autoIndent: false,
    readOnly: false,
    renderSideBySide: true,
    originalEditable: false,
    renderIndicators: true,
    ignoreTrimWhitespace: false,
    language: 'sql'
  };

  modelChanged = new Subject<string>();

  editorOptions$: Observable<any>;


  originalCode = '';

  modifiedCode = '';

  showTerminal = false;

  private destroy$ = new Subject();

  activeTab: Tab;

  code$: Observable<string>;

  tabs$: Observable<Tab[]>;

  hasTabs$: Observable<boolean>;

  source: ResourceTable[];

  sink: ResourceTable[];

  editor: MonacoStandaloneCodeEditor;

  private _code: string;

  get code(): string {
    return this._code;
  }

  set code(value: string) {
    this._code = value;
    this.modelChanged.next(value);
  }

  constructor(
    private store: Store<State>,
    private toastr: ToastrService,
    private menuService: MenuService,
    private rxStompService: RxStompService) {

    this.store.pipe(select(root => root.resources.source)).subscribe(data => this.source = data);
    this.store.pipe(select(root => root.resources.sink)).subscribe(data => this.sink = data);
    this.store.pipe(select(root => root.tabs.tabs.find(t => t?.active))).subscribe(data => this.activeTab = data);
    this.tabs$ = this.store.pipe(select(root => root.tabs.tabs));


    this.hasTabs$ = this.tabs$.pipe(map(tabs => tabs.length !== 0));

    this.editorOptions$ = this.tabs$.pipe(
      select(selectActiveTab),
      map(tab => (Object.assign({}, this.editorOptions, { language: tab?.language, readOnly: !tab?.canEdit })))
    );
    this.tabs$
      .pipe(takeUntil(this.destroy$), select(selectActiveTab), map(tab => tab?.content))
      .subscribe(state => this.code = state);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openSnackBar(message: string, level: string): void {
    if (level === 'WARNING') {
      this.toastr.warning(message, 'WARNING', {
        timeOut: 5000
      });
    }
    else if (level === 'ERROR') {
      this.toastr.error(message, 'ERROR', {
        timeOut: 5000
      });
    }
    this.toastr.success(message, '', {
      timeOut: 5000
    });
  }

  ngOnInit(): void {
    this.rxStompService.watch(RESPONSE_NOTIFICATION)
      .subscribe(response => {
        const notification = JSON.parse(response?.body)?.payload as Notification;
        console.log(notification);
        if (notification) {
          this.openSnackBar(notification.message, notification.level);
        }
      });

    this.modelChanged
      .pipe(
        debounceTime(1000),
        distinctUntilChanged())
      .subscribe(changedCode => {
        if (this.activeTab) {
          this.store.dispatch(AutoSave({ title: this.activeTab.title, content: changedCode }));
          this.store.dispatch(TabActions.AutoSave({ title: this.activeTab.title, content: changedCode }));
        }
      });
    this.menuService.menu$.subscribe(item => {
      this.handleMenuItems(item);
    });

    this.menuService.ShowDifferEvent$.subscribe(job => {
      this.showDiff = true;
      this.originalCode = job.saved;
      this.modifiedCode = job.content;
    });

    this.menuService.HideShowDiffer$.subscribe(_ => {
      this.showDiff = false;
    })
  }

  saveAndPromote(): void {
    this.store.dispatch(PromoteJob({ title: this.activeTab.title, updatedBy: 'admin' }));
    this.store.dispatch(TabActions.LockEditTab({ title: this.activeTab.title }));
  }

  handleMenuItems(item: MenuItem): void {
    if (item?.node.nodeType === StreamNodeType.Job && item?.action === MenuItemAction.TOGGLE_EDIT) {
      this.store.dispatch(EditJob({ title: item.node.name }));
      this.store.dispatch(TabActions.EditTab({ title: item.node.name }));
    }


    if (item?.node?.nodeType === StreamNodeType.Table && item?.action === MenuItemAction.SELECT_COLUMN) {
      const sourceTable = this.source.find(s => s.name === item?.node?.name);
      if (sourceTable) {
        this.editor.trigger('keyboard', 'type', { text: new TableParser(sourceTable).parseColumn() });
        return;
      }

      const sinkTable = this.sink.find(s => s.name === item?.node?.name);
      if (sinkTable) {
        this.editor.trigger('keyboard', 'type', { text: new TableParser(sinkTable).parseColumn() });
      }
    }

    if (item?.node?.nodeType === StreamNodeType.Table && item?.action === MenuItemAction.INSERT_PROPERTIS) {
      const sourceTable = this.source.find(s => s.name === item?.node?.name);
      if (sourceTable) {
        this.editor.trigger('keyboard', 'type', { text: new TableParser(sourceTable).parseInsertInto() });
        return;
      }

      const sinkTable = this.sink.find(s => s.name === item?.node?.name);
      if (sinkTable) {
        this.editor.trigger('keyboard', 'type', { text: new TableParser(sinkTable).parseInsertInto() });
      }
    }
  }

  executeSQL(query: string): void {
    const body = JSON.stringify({ command: query } as SessionRegisterRequest);
    this.rxStompService.publish({ destination: REQUEST_EXECUTE, body });
  }

  explanQuery(query: string): void {
    const body = JSON.stringify({ command: query } as SessionRegisterRequest);
    this.rxStompService.publish({ destination: REQUEST_EXPLAIN, body });
  }

  editorInit(editor): void {
    // Here you can access editor instance
    this.editor = editor;
    const that = this;
    this.editor.addAction({
      // An unique identifier of the contributed action.
      id: 'my-unique-id',
      // A label of the action that will be presented to the user.
      label: 'Execute SQL',

      // An optional array of keybindings for the action.
      keybindings: [
        monaco.KeyCode.F5,
      ],
      // A precondition for this action.
      precondition: null,
      // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
      keybindingContext: null,
      contextMenuGroupId: 'Flink_SQL',
      contextMenuOrder: 1.5,
      // Method that will be executed when the action is triggered.
      // @param editor The editor instance is passed in as a convinience
      run(ed): void | Promise<void> {
        that.executeSQL(ed.getModel().getValueInRange(ed.getSelection()));
      }
    });

    this.editor.addAction({
      // An unique identifier of the contributed action.
      id: 'explan_query',
      // A label of the action that will be presented to the user.
      label: 'Explain',

      // An optional array of keybindings for the action.
      keybindings: [
        monaco.KeyCode.F6,
      ],
      // A precondition for this action.
      precondition: null,
      // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
      keybindingContext: null,
      contextMenuGroupId: 'Flink_SQL',
      contextMenuOrder: 1.5,
      // Method that will be executed when the action is triggered.
      // @param editor The editor instance is passed in as a convinience
      run(ed): void | Promise<void> {
        that.explanQuery(ed.getModel().getValueInRange(ed.getSelection()));
      }
    });

    this.editor.addAction({
      // An unique identifier of the contributed action.
      id: 'toggle_terminal',
      // A label of the action that will be presented to the user.
      label: 'Toggle Terminal',

      // An optional array of keybindings for the action.
      keybindings: [
        // tslint:disable-next-line: no-bitwise
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.US_BACKTICK,
      ],
      // A precondition for this action.
      precondition: null,
      // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
      keybindingContext: null,
      contextMenuGroupId: 'Flink_SQL',
      contextMenuOrder: 1.5,
      // Method that will be executed when the action is triggered.
      // @param editor The editor instance is passed in as a convinience
      run(ed): void | Promise<void> {
        that.toggleTerminal();
      }
    });

    this.editor.addAction({
      // An unique identifier of the contributed action.
      id: 'save_for_promote',
      // A label of the action that will be presented to the user.
      label: 'Save & Promote',

      // An optional array of keybindings for the action.
      keybindings: [
        monaco.KeyCode.F9,
      ],
      // A precondition for this action.
      precondition: null,
      // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
      keybindingContext: null,
      contextMenuGroupId: 'Flink_SQL',
      contextMenuOrder: 1.5,
      // Method that will be executed when the action is triggered.
      // @param editor The editor instance is passed in as a convinience
      run(ed): void | Promise<void> {
        that.saveAndPromote();
      }
    });
  }

  ActivateTab(tab: Tab): void {
    this.store.dispatch(TabActions.ActivateTab({ tab }));
  }

  CloseTab(tab: Tab): void {
    this.store.dispatch(TabActions.CloseTab({ title: tab.title }));
    this.store.dispatch(TabActions.TabActiveChanged());
  }

  toggleTerminal(): void {
    this.showTerminal = !this.showTerminal;
  }

  onDrop(ev: DragEvent): void {
    console.log(ev);
    const data = ev.dataTransfer.getData('table');
    if (data) {

      const node = JSON.parse(data) as DOMNode;
      console.log(node);

      const sourceTable = this.source.find(s => s.name === node?.name);
      if (sourceTable) {
        this.editor.trigger('keyboard', 'type', { text: new TableParser(sourceTable).parse() });
        return;
      }

      const sinkTable = this.sink.find(s => s.name === node?.name);
      if (sinkTable) {
        this.editor.trigger('keyboard', 'type', { text: new TableParser(sinkTable).parse() });
      }
      ev.dataTransfer.clearData('table');
    }
  }

  onDragOver(event: any): void {
    event.preventDefault();
  }
}
