export class FilterValue {
    value?: any;
    values?: any[];
    left?: any;
    right?: any;
    constructor(init?: Partial<FilterValue>) {
        if (init) {
            Object.assign(this, init);
        }
    }
}