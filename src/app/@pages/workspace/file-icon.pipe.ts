import { Pipe, PipeTransform } from '@angular/core';
import { Tab } from '../../@core/model';

@Pipe({
  name: 'TabFileIcon'
})
export class FileIconPipe implements PipeTransform {


  transform(tab: Tab, ...args: unknown[]): string {

    if (!tab) {
      return this.getIcon('kafka');
    }
    switch (tab?.language) {
      case 'sql':
        return this.getIcon('sql');
      case 'java':
        return this.getIcon('java');
      default:
        return this.getIcon('kafka');
    }
  }

  getIcon(fileType): string {
    return `../../../../assets/icons/nodes/${fileType}.svg`;
  }

}
