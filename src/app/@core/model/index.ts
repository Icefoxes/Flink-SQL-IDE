export * from './tab.model';
export * from './resource.model';
export * from './tree.model';
export * from './job.model';
export * from './session.model';
export * from './menu.model';


export enum Connector {
    Kafka = 'Kafka',
    JDBC = 'JDBC',
    FileSystem = 'File System'
}

export enum DataDirection {
    Source = 'source',
    Sink = 'sink'
}

