export declare class SidebarComponentItem {
    title: string;
    isSystem: boolean;
    visible: boolean;
    route?: string;
    href?: string;
    icon?: string;
    subItems?: SidebarComponentItem[];
    newTab: boolean;
    expanded: boolean;
    arrowDirection: string;
    constructor(init?: Partial<SidebarComponentItem>);
}
