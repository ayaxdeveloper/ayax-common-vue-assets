export class BreadCrumbItem {
    text: String;
    disabled: Boolean;
    route: String;
    constructor(init?: Partial<BreadCrumbItem>) {
        if(init) {
            Object.assign(this, init);
        }
    }
}