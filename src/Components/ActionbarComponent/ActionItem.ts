export class ActionItem {
    name: string;
    title: string;
    icon: string;
    single = false;
    children: ActionItem[];
    condition?: (item: any) => boolean;
    disabled: boolean;
    action: Function;
    needSelectedItem = false;
    active = true;
    spaceNext = false;
    loading = false;
    hint = "";
    style = { };
    separator = false;
    constructor(init?: Partial<ActionItem>) {
        if (init) {
            Object.assign(this, init);
        }
    }
}
