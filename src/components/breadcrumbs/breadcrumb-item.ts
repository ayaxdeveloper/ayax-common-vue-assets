export class BreadCrumbItem {
    text: string;
    disabled: boolean;
    route: string;
    constructor(init?: Partial<BreadCrumbItem>) {
        if (init) {
            Object.assign(this, init);
        }
    }
}