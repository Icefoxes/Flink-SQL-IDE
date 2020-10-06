import { createAction, props } from '@ngrx/store';
import { Tab } from '../../model';

export const CloseTab = createAction('[TAB] Close TBA', props<{ title: string }>());

export const AddTab = createAction('[TAB] Add Tab', props<{ tab: Tab }>());

export const ActivateTab = createAction('[TAB] Activate Tab', props<{ tab: Tab }>());

export const TabActiveChanged = createAction('[TAB] Tab Active Changed');

export const EditTab = createAction('[TAB] Tab Edit ', props<{ title: string }>());

export const LockEditTab = createAction('[TAB] LOCK Tab Edit ', props<{ title: string }>());

export const AutoSave = createAction('[TAB] Auto Save', props<{ title: string; content: string }>());
