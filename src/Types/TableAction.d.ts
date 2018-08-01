export declare class TableComponentAction {
    name: string;
    title: string;
    icon: string;
    single: boolean;
    children: TableComponentAction[];
    action: Function;
    needSelectedItem: boolean;
    active: boolean;
    spaceNext: boolean;
    loading: boolean;
    constructor(init?: Partial<TableComponentAction>);
}
