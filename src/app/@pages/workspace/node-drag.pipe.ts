import { Pipe, PipeTransform } from '@angular/core';
import { StreamNode, StreamNodeType } from '../../@core/model';

@Pipe({
  name: 'NodeDrag'
})
export class NodeDragPipe implements PipeTransform {

  transform(node: StreamNode, ...args: unknown[]): boolean {
    if (!node) {
      return false;
    }
    return node?.nodeType === StreamNodeType.Table;
  }
}
