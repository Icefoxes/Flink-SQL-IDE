import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-workspace-plugin-filesystem',
  templateUrl: './workspace-plugin-filesystem.component.html',
  styleUrls: ['./workspace-plugin-filesystem.component.scss']
})
export class WorkspacePluginFilesystemComponent implements OnInit {

  formats = ['json', 'avro', 'csv'];

  propsForm = this.fb.group({
    path: ['', Validators.required],
    format: ['', Validators.required]
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  public getProps(): object {
    return Object.assign({}, this.propsForm.value, {
      connector: 'filesystem'
    });
  }
}
