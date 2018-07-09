export class SidebarComponentItem {
    title: string;
    isSystem = false;
    visible = true;
    route?: string = null;
    href?: string = null;
    icon?: string;
    subItems?: SidebarComponentItem[] = [];
    newTab = false;
    expanded = false;
    arrowDirection = "mdi-chevron-down";
    constructor(init?: Partial<SidebarComponentItem>) {
        if (init) { 
            Object.assign(this, init);
        }
    }
}