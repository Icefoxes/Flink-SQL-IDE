import { ActionReducer, createReducer, on } from '@ngrx/store';
import { Tab } from '../../model';
import * as TabActions from './actions';
import { hasActive, tabExsits } from './selector';
import { LOCAL_TABS } from '../shared/local.state';

export interface State {
    readonly tabs: Tab[];
}

export const initialState: State = {
    tabs: [...LOCAL_TABS]
};

const buildReducer = createReducer(
    initialState,
    on(TabActions.CloseTab, (tabState: State, { title }) => Object.assign({
        tabs: tabState.tabs.filter(t => t.title !== title)
    })),
    on(TabActions.ActivateTab, (tabState: State, { tab }) => ({
        tabs: tabState.tabs.map((t: Tab) => {
            return Object.assign({}, t, { active: t.title === tab.title });
        })
    })),
    on(TabActions.AutoSave, (state: State, { title, content }) => ({
        tabs: state.tabs.map(tab => {
            if (tab.title === title) {
                return Object.assign({}, tab, {
                    content
                });
            }
            return tab;
        })
    })),
    on(TabActions.AddTab, (tabState, { tab }) => ({
        tabs: tabExsits(tabState.tabs, tab.title) ?
            tabState.tabs.map((t: Tab) => {
                return Object.assign({}, t, { active: t.title === tab.title }) as Tab;
            }) :
            [...tabState.tabs.map((t: Tab) => Object.assign({}, t, { active: false })), tab]
    })),
    on(TabActions.TabActiveChanged, (tabState: State) => ({
        tabs: hasActive(tabState.tabs) ?
            tabState.tabs :
            tabState.tabs.map((tab, idx) => {
                if (idx === tabState.tabs.length - 1) {
                    return Object.assign({}, tab, {
                        active: true
                    });
                }
                return tab;
            })

    })),
    on(TabActions.EditTab, (tabState: State, { title }) => ({
        tabs: tabState.tabs.map(tab => {
            if (tab.title === title) {
                return Object.assign({}, tab, {
                    canEdit: true
                }) as Tab;
            }
            return tab;
        })
    })),
    on(TabActions.LockEditTab, (tabState: State, { title }) => ({
        tabs: tabState.tabs.map(tab => {
            if (tab.title === title) {
                return Object.assign({}, tab, {
                    canEdit: false
                }) as Tab;
            }
            return tab;
        })
    })),
);

export function reducer(state: State, action: any): ActionReducer<State, any> {
    return buildReducer(state, action);
}
