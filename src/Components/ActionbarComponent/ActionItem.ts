export default class ActionItem {
    name: string;
    title: string;
    icon: string;
    single = false;
    children: ActionItem[];
    action: Function;
    needSelectedItem = false;
    active = true;
    spaceNext = false;
    loading = false;
    hint = "";
    constructor(init?: Partial<ActionItem>) {
        if (init) {
            Object.assign(this, init);
        }
    }
}