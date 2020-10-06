import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-workspace-plugin-jdbc',
  templateUrl: './workspace-plugin-jdbc.component.html',
  styleUrls: ['./workspace-plugin-jdbc.component.scss']
})
export class WorkspacePluginJdbcComponent implements OnInit {

  propsForm = this.fb.group({
    url: ['', Validators.required],
    'table-name': ['', Validators.required]
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  public getProps(): object {
    return Object.assign({}, this.propsForm.value, {
      connector: 'jdbc'
    });
  }
}
