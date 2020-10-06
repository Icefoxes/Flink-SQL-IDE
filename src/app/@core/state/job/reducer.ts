import { createReducer, on } from '@ngrx/store';
import { Job } from '../../model/job.model';
import { JOBS } from '../shared/local.state';
import * as JobActions from './actions';

export interface State {
    jobs: Job[];
}

const initialState: State = {
    jobs: [...JOBS],
};

const buildReducer = createReducer(
    initialState,
    on(JobActions.OpenJob, (state, { title }) => ({
        jobs: state.jobs,
    })),
    on(JobActions.CreateJob, (state, { title }) => ({
        jobs: [...state.jobs, {
            name: title + '.sql',
            content: ''
        }],
    })),
    on(JobActions.AutoSave, (state, { title, content }) => ({
        jobs: state.jobs.map(job => {
            if (job.name === title) {
                return Object.assign({}, job, {
                    content
                });
            }
            return job;
        })
    })),

    on(JobActions.EditJob, (state, { title }) => ({
        jobs: state.jobs.map(job => {
            if (job.name === title) {
                return Object.assign({}, job, {
                    readonly: false
                });
            }
            return job;
        })
    })),

    on(JobActions.PromoteJob, (state, { title, updatedBy }) => ({
        jobs: state.jobs.map(job => {
            if (job.name === title) {
                return Object.assign({}, job, {
                    readonly: true,
                    promoted: true,
                    approved: false,
                    updatedAt: new Date(),
                    updatedBy
                }) as Job;
            }
            return job;
        })
    })),
);

export function reducer(state: State, action: any): any {
    return buildReducer(state, action);
}
