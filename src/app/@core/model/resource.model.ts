export interface ResourceTable {
    name: string;
    columns: ResourceTableColumn[];
    type?: string;
    props?: object;
}

export interface ResourceTableColumn {
    name: string;
    type: string;
}

export interface ResourceUDF {
    title: string;
    content: string;
    language?: string;
}
