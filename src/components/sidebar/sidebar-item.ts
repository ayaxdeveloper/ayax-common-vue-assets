export class SidebarComponentItem {
    title: string;
    isSystem?: boolean = false;
    visible?: boolean = true;
    route?: string = null;
    href?: string = null;
    icon?: string;
    subItems?: SidebarComponentItem[] = [];
    newTab?: boolean = false;
    expanded?: boolean = false;
    arrowDirection?: string = "keyboard_arrow_down";
    constructor(init?: Partial<SidebarComponentItem>) {
        if (init) { 
            Object.assign(this, init);
        }
    }
}