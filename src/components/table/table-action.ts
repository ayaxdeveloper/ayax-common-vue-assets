export class TableComponentAction {
    name: string;
    title: string;
    icon: string;
    single: boolean = true;
    children: TableComponentAction[];
    action: Function;
    needSelectedItem: boolean;
    active = true;
    constructor(init?: Partial<TableComponentAction>) {
        if(init) {
            Object.assign(this, init)
        }
    }
}