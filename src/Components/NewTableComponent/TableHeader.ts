import { CacheItem } from "ayax-common-cache";
import { DateHelper } from "ayax-common-helpers";
import { SortableField } from "ayax-common-types";

export class TableComponentHeader {
    align = "left";
    value: string;
    text: string;
    dictionary?: string;
    dictionaryPromise?: Promise<CacheItem[]>;
    items: CacheItem[];
    isVisible = true;
    hiddenable = true;
    width?: number;
    formatter: (value: any) => void;
    sortBy?: SortableField;
    sortable = false;
    mask: string;
    type: TableComponentHeaderType = TableComponentHeaderType.string;
    order: number;
    custom = false;
    constructor(init?: Partial<TableComponentHeader>) {
        if (init) {
            Object.assign(this, init);
        }
    }
    public static String(init: Partial<TableComponentHeader>) {
        return new TableComponentHeader(init);
    }

    public static Date(init: Partial<TableComponentHeader>) {
        init.formatter = (value) => DateHelper.formatDate(value);
        init.type = TableComponentHeaderType.date;
        return new TableComponentHeader(init);
    }

    public static DateTime(init: Partial<TableComponentHeader>) {
        init.formatter = (value) => DateHelper.formatDate(value, "DD.MM.YYYY HH:mm");
        init.type = TableComponentHeaderType.datetime;
        return new TableComponentHeader(init);
    }

    public static Boolean(init: Partial<TableComponentHeader>) {
        init.formatter = (value: boolean) => {
            return value === true ? "Да" : "Нет"; 
        };
        init.type = TableComponentHeaderType.boolean;
        return new TableComponentHeader(init);
    }
}

export enum TableComponentHeaderType {
    string, date, datetime, boolean
}