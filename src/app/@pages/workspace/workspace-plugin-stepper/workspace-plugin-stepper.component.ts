import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Connector, DataDirection, ResourceTable, ResourceTableColumn } from 'src/app/@core/model';
import { State, Store } from '../../../@core/state';
import { AddSource, AddSink } from '../../../@core/state/resource/actions';
import { WorkspacePluginFilesystemComponent } from './workspace-plugin-filesystem/workspace-plugin-filesystem.component';
import { WorkspacePluginJdbcComponent } from './workspace-plugin-jdbc/workspace-plugin-jdbc.component';
import { WorkspacePluginKafkaComponent } from './workspace-plugin-kafka/workspace-plugin-kafka.component';

export interface DataColumn {
  name: string;
  position: number;
  type: string;
}

@Component({
  selector: 'app-workspace-plugin-stepper',
  templateUrl: './workspace-plugin-stepper.component.html',
  styleUrls: ['./workspace-plugin-stepper.component.scss']
})
export class WorkspacePluginStepperComponent implements OnInit, AfterViewInit {
  @ViewChild('kafka')
  kafkaProps: WorkspacePluginKafkaComponent;

  @ViewChild('fs')
  fsProps: WorkspacePluginFilesystemComponent;

  @ViewChild('jdbc')
  jdbcProps: WorkspacePluginJdbcComponent;

  types = ['string', 'int', 'byte', 'float', 'double', 'long', 'int'];

  displayedColumns: string[] = ['position', 'name', 'type'];

  data: DataColumn[] = [];

  dataSource = new MatTableDataSource<DataColumn>(this.data);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  columnForm: FormGroup;

  finalForm: FormGroup;

  from: Connector;
  type: DataDirection;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private fb: FormBuilder,
    private store: Store<State>,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.pipe(filter(par => par?.type && par?.connector))
      .subscribe(t => {
        this.from = t.connector;
        this.type = t.type;
      });
  }

  ngOnInit(): void {
    this.columnForm = this.fb.group({
      name: [''],
      type: [''],
    });
    this.finalForm = this.fb.group({
      tableName: ['', Validators.required]
    });
  }

  onFinished(): void {
    const table: ResourceTable = {
      name: this.finalForm.value?.tableName,
      columns: this.dataSource.data.map(t => {
        return {
          name: t.name,
          type: t.type
        } as ResourceTableColumn;
      })
    };

    switch (this.from) {
      case Connector.Kafka:
        table.type = 'kafka';
        table.props = this.kafkaProps.getProps();
        break;
      case Connector.FileSystem:
        table.type = 'filesystem';
        table.props = this.fsProps.getProps();
        break;
      case Connector.JDBC:
        table.type = 'jdbc';
        table.props = this.jdbcProps.getProps();
    }

    this.store.dispatch(this.type === DataDirection.Source ? AddSource({ table }) : AddSink({ table }));

    this.router.navigate(['/apps/workspace']);
  }

  onAdd(): void {
    this.dataSource.data = [...this.dataSource.data, Object.assign({}, this.columnForm.value, {
      position: this.dataSource.data.length + 1
    })];
  }
}
