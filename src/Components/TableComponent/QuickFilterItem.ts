export class QuickFilterItem {
    id: number;
    custom?: boolean;
    filter: { text: string; filters: Array<{ filterName: string; filterValue: any[] }> };
    table: string;
    userId: number;
    constructor(init?: Partial<QuickFilterItem>) {
        if (init) {
            Object.assign(this, init);
        }
    }
}
