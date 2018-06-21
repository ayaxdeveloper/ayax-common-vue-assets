import { SortableField } from "ayax-common-types";
import { DateHelper } from "ayax-common-helpers";
import { CacheItem } from "ayax-common-cache";

export class TableComponentHeader {
    align: string = "left";
    value: string;
    text: string;
    dictionary?: string;
    dictionaryPromise?: Promise<CacheItem[]>
    items: CacheItem[];
    isVisible: boolean = true;
    hiddenable: boolean = true;
    width?: number;
    formatter: (value: any) => void;
    sortBy?: SortableField;
    sortable: boolean = false;
    mask: string;
    type: TableComponentHeaderType = TableComponentHeaderType.string;
    order: number;
    custom: boolean = false;
    constructor(init?: Partial<TableComponentHeader>) {
        if (init) {
            Object.assign(this, init);
        }
    }
    public static String(init: Partial<TableComponentHeader>) {
        return new TableComponentHeader(init);
    }

    public static Date(init: Partial<TableComponentHeader>) {
        init.formatter = (value) => { return DateHelper.formatDate(value) };
        init.type = TableComponentHeaderType.date;
        return new TableComponentHeader(init);
    }

    public static DateTime(init: Partial<TableComponentHeader>) {
        init.formatter = (value) => { return DateHelper.formatDate(value, 'DD.MM.YYYY HH:mm') };
        init.type = TableComponentHeaderType.datetime;
        return new TableComponentHeader(init);
    }

    public static Boolean(init: Partial<TableComponentHeader>) {
        init.formatter = (value: boolean) => {
            return value == true ? 'Да' : 'Нет' 
        };
        init.type = TableComponentHeaderType.boolean;
        return new TableComponentHeader(init);
    }
}

export enum TableComponentHeaderType {
    string, date, datetime, boolean
}