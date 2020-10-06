import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { DataDirection } from 'src/app/@core/model';

@Component({
  selector: 'app-workspace-plugin-source',
  templateUrl: './workspace-plugin-source.component.html',
  styleUrls: ['./workspace-plugin-source.component.scss']
})
export class WorkspacePluginSourceComponent implements OnInit {
  SUPPORTED_SOURCE = [
    { type: 'Kafka', icon: 'kafka.svg' },
    { type: 'File System', icon: 'filesystem.svg' },
    { type: 'JDBC', icon: 'jdbc.svg' },
  ];

  SUPPORTED_SINK = [
    { type: 'Kafka', icon: 'kafka.svg' },
    { type: 'File System', icon: 'filesystem.svg' },
    { type: 'JDBC', icon: 'jdbc.svg' },
  ];

  items = [];

  type = '';

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.pipe(filter(par => par?.type), map(par => par.type as DataDirection))
      .subscribe(t => {
        this.type = t;
        if (t === DataDirection.Source) {
          this.items = [...this.SUPPORTED_SOURCE];
        }
        else if (t === DataDirection.Sink) {
          this.items = [...this.SUPPORTED_SINK];
        }
      });
  }

  ngOnInit(): void {
  }

}
