import { SelectItem, SortableField, Dictionary } from "ayax-common-types";
import { TableFilterComponentItem } from "../table-filter/table-filter-item";
import { DateHelper } from "ayax-common-helpers";
import { CacheItem } from "ayax-common-cache";

export class TableComponentHeader {
    align: string = "left";
    value: string;
    text: string;
    dictionary: string;
    items: Dictionary[] | CacheItem[];
    hidden: boolean = false;
    filter: TableFilterComponentItem;
    width?: number;
    formatter: (value: any) => void;
    sortBy?: SortableField;
    sortable: boolean = false;
    mask: string;
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
        return new TableComponentHeader(init);
    }

    public static DateTime(init: Partial<TableComponentHeader>) {
        init.formatter = (value) => { return DateHelper.formatDate(value, 'DD.MM.YYYY HH:mm') };
        return new TableComponentHeader(init);
    }

    public static Boolean(init: Partial<TableComponentHeader>) {
        init.formatter = (value: boolean) => { 

            return value == true ? 'Да' : 'Нет' 
        };
        return new TableComponentHeader(init);
    }
}

export enum TableComponentHeaderType {
    string, date, datetime, boolean
}