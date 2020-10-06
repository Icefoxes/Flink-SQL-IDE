export enum SessionResponseStatus {
    OK = 'OK',
    ERROR = 'ERROR'
}

export interface Notification {
    level?: string;
    message?: string;
}

export interface SessionRegisterRequest {
    command?: string;
}

export interface SessionResponse {
    status?: SessionResponseStatus;
    payload?: string;
    error?: string;
}

/***
 *
 */
export interface SessionRoot {
    payload: SessionCatalog[];
}

export interface SessionCatalog {
    name: string;
    databases: SessionDatabase[];
}

export interface SessionDatabase {
    name: string;
    tables: SessionTable[];
}

export interface SessionTable {
    name: string;
    columns: SessionColumn[];
}

export interface SessionColumn {
    name: string;
    type: string;
    conversion: string;
}
