import { createAction, props } from '@ngrx/store';
import { ResourceTable } from '../../model';

export const AddSource = createAction('[Resource] Add Source', props<{ table: ResourceTable }>());

export const AddSink = createAction('[Resource] Add Sink', props<{ table: ResourceTable }>());
