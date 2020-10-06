import * as fromTab from './tab/reducer';
import * as fromResource from './resource/reducer';
import * as fromJob from './job/reducer';

export interface State {
    jobs: fromJob.State;
    tabs: fromTab.State;
    resources: fromResource.State;
}

export const reducers = {
    jobs: fromJob.reducer,
    tabs: fromTab.reducer,
    resources: fromResource.reducer,
};

