import { Tab } from '../../model';
import { State } from './reducer';

export const selectTabs = (tabState: State) => tabState.tabs;

export const selectActiveTab = (tabs: Tab[]) => tabs.find(t => t?.active);

export const tabExsits = (tabs: Tab[], title: string) => tabs.find(t => t.title === title) !== undefined;

export const hasActive = (tabs: Tab[]) => {
    return tabs.length === 0 || tabs.filter(t => t?.active)?.length > 0;
};



