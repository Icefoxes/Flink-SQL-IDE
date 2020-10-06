export enum StreamNodeType {
    SessionCatalog = 'SessionCatalog',
        SessionDatabase = 'SessionDatabase',
            SessionTable = 'SessionTable',
                SessionColumn = 'SessionColumn',

    ProjectRoot = 'ProjectRoot',
        Job = 'Job',

    UDFRoot = 'UDFRoot',
        UDF = 'UDF',

    ResourceRoot = 'ResourceRoot',
        SourceRoot = 'SourceRoot',
        SinkRoot = 'SinkRoot',
            Table = 'Table',
                Column = 'Column',
    ReviewRoot = 'ReviewRoot',
    Review = 'Review'
}

export interface StreamNode {
    name: string;
    nodeType?: StreamNodeType;
    children?: StreamNode[];
}

/** Flat node with expandable and level information */
export interface FlatNode {
    expandable: boolean;
    nodeType?: StreamNodeType;
    name: string;
    level: number;
}

export interface DOMNode {
    name?: string;
    nodeType: StreamNodeType;
}
