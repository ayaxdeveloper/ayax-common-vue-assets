export class TableComponentAction {
    name: string;
    title: string;
    icon: string;
    constructor(init?: Partial<TableComponentAction>) {
        if(init) {
            Object.assign(this, init)
        }
    }
}