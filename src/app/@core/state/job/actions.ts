import { createAction, props } from '@ngrx/store';

export const OpenJob = createAction('[Job] Open Job', props<{ title: string }>());

export const AutoSave = createAction('[Job] Auto Save', props<{ title: string; content: string }>());

export const CreateJob = createAction('[Job] Open Job', props<{ title: string }>());

export const EditJob = createAction('[Job] Edit Job', props<{ title: string }>());

export const PromoteJob = createAction('[Job] Promote Job', props<{ title: string; updatedBy: string }>());
