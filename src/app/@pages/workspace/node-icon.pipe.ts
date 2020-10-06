import { Pipe, PipeTransform } from '@angular/core';
import { StreamNode, StreamNodeType } from '../../@core/model';

@Pipe({
  name: 'NodeIcon'
})
export class NodeIconPipe implements PipeTransform {

  transform(node: StreamNode, ...args: unknown[]): string {
    let expanded = false;
    if (args && args.length === 1) {
      expanded = args[0] as boolean;
    }

    if (!node) {
      return this.getIcon('folder-src-open');
    }

    switch (node?.nodeType) {
      case StreamNodeType.ProjectRoot:
      case StreamNodeType.ResourceRoot:
      case StreamNodeType.ReviewRoot:
        return this.getIcon(expanded ? 'folder-docs-open' : 'folder-docs');
      case StreamNodeType.Job:
      case StreamNodeType.Review:
        return this.getIcon('sql');
      case StreamNodeType.SourceRoot:
      case StreamNodeType.SinkRoot:
      case StreamNodeType.SessionDatabase:
        return this.getIcon(expanded ? 'folder-database-open' : 'folder-database');
      case StreamNodeType.Table:
      case StreamNodeType.SessionTable:
        return this.getIcon(expanded ? 'folder-mappings-open' : 'folder-mappings');
      case StreamNodeType.UDFRoot:
        return this.getIcon(expanded ? 'folder-src-open' : 'folder-src');
      case StreamNodeType.UDF:
        return this.getIcon('java');
      case StreamNodeType.Column:
      case StreamNodeType.SessionColumn:
        return this.getIcon('3d');
      case StreamNodeType.SessionCatalog:
        return this.getIcon(expanded ? 'folder-layout-open' : 'folder-layout');
    }
  }

  getIcon(fileType: string): string {
    return `../../../../assets/icons/nodes/${fileType}.svg`;
  }
}
