import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ResourceTable } from '../../../../@core/model';

@Component({
  selector: 'app-workspace-plugin-kafka',
  templateUrl: './workspace-plugin-kafka.component.html',
  styleUrls: ['./workspace-plugin-kafka.component.scss']
})
export class WorkspacePluginKafkaComponent implements OnInit {

  formats = ['json', 'avro', 'avro-sr', 'csv'];

  modes = ['earliest-offset', 'latest-offset', 'group-offsets', 'timestamp', 'specific-offsets'];

  propsForm = this.fb.group({
    'properties.bootstrap.servers': ['localhost:9092', Validators.required],
    topic: ['', Validators.required],
    'properties.group.id': ['ngx-designer-dev', Validators.required],
    format: ['json', Validators.required],
    'scan.startup.mode': ['earliest-offset', Validators.required],
    'scan.startup.specific-offsets': [],
    'scan.startup.timestamp-millis': [],
  });

  showSpecificOffset = false;
  showTimestamp = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.propsForm.controls['scan.startup.mode'].valueChanges.subscribe(v => {
      this.showSpecificOffset = (v === 'specific-offsets');
      this.showTimestamp = (v === 'timestamp');
    });
  }

  public getProps(): object {
    return Object.assign({}, this.propsForm.value, {
      connector: 'kafka'
    });
  }
}
