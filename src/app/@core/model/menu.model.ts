import { StreamNode } from './tree.model';

export interface MenuItem {
    node: StreamNode;
    action: MenuItemAction;
}

export enum MenuItemAction {
    SELECT_COLUMN = 'select_column',
    INSERT_PROPERTIS = 'insert_properties',
    TOGGLE_EDIT = 'toggle_edit',
}
