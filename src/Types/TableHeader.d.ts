import { CacheItem } from "ayax-common-cache";
import { SortableField } from "ayax-common-types";
export declare class TableComponentHeader {
    align: string;
    value: string;
    text: string;
    dictionary?: string;
    dictionaryPromise?: Promise<CacheItem[]>;
    items: CacheItem[];
    isVisible: boolean;
    hiddenable: boolean;
    width?: number;
    formatter: (value: any) => void;
    sortBy?: SortableField;
    sortable: boolean;
    mask: string;
    type: TableComponentHeaderType;
    order: number;
    custom: boolean;
    constructor(init?: Partial<TableComponentHeader>);
    static String(init: Partial<TableComponentHeader>): TableComponentHeader;
    static Date(init: Partial<TableComponentHeader>): TableComponentHeader;
    static DateTime(init: Partial<TableComponentHeader>): TableComponentHeader;
    static Boolean(init: Partial<TableComponentHeader>): TableComponentHeader;
}
export declare enum TableComponentHeaderType {
    string = 0,
    date = 1,
    datetime = 2,
    boolean = 3
}
