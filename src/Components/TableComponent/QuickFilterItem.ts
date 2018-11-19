export class QuickFilterItem {
    id: number;
    custom?: boolean;
    name: string;
    filter: Array<{ filterName: string; filterValue: any[] }>;
    table: string;
    userId: number;
    constructor(init?: Partial<QuickFilterItem>) {
        if (init) {
            Object.assign(this, init);
        }
    }
}
