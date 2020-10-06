import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ArrowDirectionPipe'
})
export class ArrowDirectionPipe implements PipeTransform {

  transform(value: boolean, ...args: unknown[]): string {
    return !value ? this.getIcon('down') : this.getIcon('right');
  }

  getIcon(fileType: string): string {
    return `../../../../assets/icons/actions/${fileType}.svg`;
  }
}
