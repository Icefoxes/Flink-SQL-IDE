import {
    Component,
    EventEmitter,
    HostListener,
    Input,
    Output,
    TemplateRef,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import { Router } from '@angular/router';
import {
    fromEvent,
    Observable,
    Subscription
} from 'rxjs';
import {
    filter,
    first,
    mergeMap,
    take
} from 'rxjs/operators';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { select } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
// relative
import { State, Store } from '../../../../@core/state';
import { AddTab } from '../../../../@core/state/tab/actions';
import { CreateJob } from '../../../../@core/state/job/actions';
import {
    DataDirection,
    DOMNode,
    FlatNode,
    MenuItem,
    MenuItemAction,
    StreamNode,
    StreamNodeType
} from '../../../../@core/model';

import { FileCreateComponent } from '../../modal/file-create/file-create.component';
import { MenuService } from 'src/app/@core/service';



enum Operation {
    add = 'add',
    edit = 'edit',
    delete = 'delete'
}

@Component({
    selector: 'app-workspace-tree',
    templateUrl: './workspace-tree.component.html',
    styleUrls: ['./workspace-tree.component.scss']
})
export class WorkspaceTreeComponent {

    @ViewChild('userMenu') userMenu: TemplateRef<any>;

    overlayRef: OverlayRef | null;

    sub: Subscription;

    @Output()
    menuItem = new EventEmitter<MenuItem>();

    private _data: Observable<StreamNode[]>;

    get data(): Observable<StreamNode[]> {
        return this._data;
    }

    @Input()
    set data(value: Observable<StreamNode[]>) {
        this._data = value;
        value?.subscribe(t => {
            this.dataSource.data = t;
        });
    }

    treeFlattener: MatTreeFlattener<StreamNode, FlatNode>;

    dataSource: MatTreeFlatDataSource<StreamNode, FlatNode, FlatNode>;

    treeControl = new FlatTreeControl<FlatNode>(
        node => node.level, node => node.expandable);

    private transformer = (node: StreamNode, level: number) => {
        return {
            expandable: !!node.children && node.children.length > 0,
            name: node.name,
            level,
            nodeType: node.nodeType
        };
    }



    openDialog(): void {
        const dialogRef = this.dialog.open(FileCreateComponent, {
            width: '400px',
            data: { name: '' }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            if (result) {
                this.store.dispatch(CreateJob({ title: result }));
            }
        });
    }

    constructor(
        private readonly menuService: MenuService,
        public dialog: MatDialog,
        private store: Store<State>,
        private router: Router,
        public overlay: Overlay,
        public viewContainerRef: ViewContainerRef
    ) {
        this.treeFlattener = new MatTreeFlattener(this.transformer, node => node.level, node => node.expandable, node => node.children);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    }

    @HostListener('click', ['$event'])
    OnActionItemClick(event: any): void {
        const action = this.getAction(event);
        const node = this.getNode(event);
        if (node?.nodeType === StreamNodeType.SourceRoot &&
            action === Operation.add) {
            this.router.navigate(['apps/workspace/source', { type: DataDirection.Source }]);
        }

        if (node?.nodeType === StreamNodeType.SinkRoot &&
            action === Operation.add) {
            this.router.navigate(['apps/workspace/source', { type: DataDirection.Sink }]);
        }

        if (node?.nodeType === StreamNodeType.ProjectRoot &&
            action === Operation.add) {
            this.openDialog();
        }
    }


    hasChild = (_: number, node: FlatNode) => node.expandable;

    canAdd(node: StreamNode): boolean {
        return node?.nodeType === StreamNodeType.ProjectRoot ||
            node?.nodeType === StreamNodeType.SourceRoot ||
            node?.nodeType === StreamNodeType.SinkRoot ||
            node?.nodeType === StreamNodeType.UDFRoot;
    }

    canEdit(node: StreamNode): boolean {
        return node?.nodeType === StreamNodeType.Job ||
            node?.nodeType === StreamNodeType.UDF ||
            node?.nodeType === StreamNodeType.Table;
    }

    canDelete(node: StreamNode): boolean {
        return node?.nodeType === StreamNodeType.Job ||
            node?.nodeType === StreamNodeType.UDF ||
            node?.nodeType === StreamNodeType.Table;
    }

    OnUserClick(name: string, nodeType: StreamNodeType): void {
        console.log(name, nodeType);
        if (nodeType === StreamNodeType.Job) {
            this.store.pipe(
                select(root => root.jobs.jobs),
                mergeMap(jobs => jobs),
                filter(job => job.name === name),
                first()
            ).subscribe(job => {
                this.menuService.onHideShowDiffer();
                this.store.dispatch(AddTab({
                    tab: {
                        title: job.name,
                        content: job.content,
                        language: 'sql',
                        active: true,
                        canEdit: !job.readonly
                    }
                }));
            });
        }

        if (nodeType === StreamNodeType.UDF) {
            this.store.pipe(
                select(root => root.resources.udf),
                mergeMap(udfs => udfs),
                filter(udf => udf.title === name),
                first()
            ).subscribe(udf => {
                this.menuService.onHideShowDiffer();
                this.store.dispatch(AddTab({
                    tab: {
                        title: udf.title,
                        content: udf.content,
                        language: udf.language,
                        active: true
                    }
                }));
            });
        }

        if (nodeType === StreamNodeType.Review) {
            this.store.pipe(
                select(root => root.jobs.jobs.find(j => j.name === name)),
                first()
            ).subscribe(job => {
               this.menuService.onShowDifferEvent(job);
            });
        }
    }

    OnDrag(ev: DragEvent): void {
        const node = this.getNode(ev);
        if (node && node?.name && node?.nodeType) {
            ev.dataTransfer.setData('table', JSON.stringify(node));
        }
    }


    getNode(e: any): DOMNode {
        const treeNode = e.path.find(t => t.nodeName === 'MAT-TREE-NODE') as HTMLElement;
        if (!treeNode) {
            return;
        }
        const name = treeNode.attributes.getNamedItem('data-name')?.value;
        const nodeType = treeNode.attributes.getNamedItem('data-node')?.value;
        return {
            name,
            nodeType: nodeType as StreamNodeType
        };
    }

    getAction(e: any): Operation {
        const actionItem = e.path.find(x => x.classList?.contains('action-icon'));
        if (!actionItem) {
            return;
        }
        return actionItem.attributes.getNamedItem('data-action')?.value as Operation;
    }

    onClickTreeNode(name, nodeType): void {
        console.log(name, nodeType);
    }

    open(e: MouseEvent, node: StreamNode): void {
        const { x, y } = e;
        this.close();
        const positionStrategy = this.overlay.position()
            .flexibleConnectedTo({ x, y })
            .withPositions([
                {
                    originX: 'start',
                    originY: 'bottom',
                    overlayX: 'start',
                    overlayY: 'top',
                }
            ]);

        this.overlayRef = this.overlay.create({
            positionStrategy,
            scrollStrategy: this.overlay.scrollStrategies.close()
        });

        this.overlayRef.attach(new TemplatePortal(this.userMenu, this.viewContainerRef, {
            $implicit: node
        }));

        this.sub = fromEvent<MouseEvent>(document, 'click')
            .pipe(
                filter(event => {
                    const clickTarget = event.target as HTMLElement;
                    return !!this.overlayRef && !this.overlayRef.overlayElement.contains(clickTarget);
                }),
                take(1)
            ).subscribe(() => this.close());

        e.preventDefault();
    }

    close(): void {
        this.sub?.unsubscribe();
        this.overlayRef?.dispose();
        this.overlayRef = null;
    }

    onSelect(node: StreamNode): void {
        this.menuItem.emit({
            node,
            action: MenuItemAction.SELECT_COLUMN
        });
        this.close();
    }

    onToggleEdit(node: StreamNode): void {
        this.menuItem.emit({
            node,
            action: MenuItemAction.TOGGLE_EDIT
        });
        this.close();
    }

    onInsert(node: StreamNode): void {
        this.menuItem.emit({
            node,
            action: MenuItemAction.INSERT_PROPERTIS
        });
        this.close();
    }
}
