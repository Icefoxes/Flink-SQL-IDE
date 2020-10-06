import { createReducer, on } from '@ngrx/store';
import { ResourceTable, ResourceUDF } from '../../model';
import { FILE_TABLE, KAFKA_TABLE, UDF } from '../shared/local.state';
import * as ResourceActions from './actions';

export interface State {
    source: ResourceTable[];
    sink: ResourceTable[];
    udf: ResourceUDF[];
}

const initialState: State = {
    source: [KAFKA_TABLE],
    sink: [FILE_TABLE],
    udf: [UDF],
};

const buildReducer = createReducer(
    initialState,
    on(ResourceActions.AddSource, (state, { table }) => Object.assign({}, state, {
        source: [...state.source, table]
    })
    ),
    on(ResourceActions.AddSink, (state, { table }) => Object.assign({}, state, {
        sink: [...state.sink, table]
    })
    ),
);

export function reducer(state: State, action: any): any {
    return buildReducer(state, action);
}
