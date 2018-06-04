import { SelectItem } from "ayax-common-types";

export class FilterValue {
    value?: any;
    values?: any[];
    left?: any;
    right?: any;
    constructor(init?: Partial<FilterValue>) {
        if (init) {
            Object.assign(this, init);
        }
    }
}

export class Filter {
    term: string;
    val: FilterValue;
    op?: FilterOperation;

    constructor(init?: Partial<Filter>) {
        if (init) {
            Object.assign(this, init);
        }
    }

    public static And(init: Partial<Filter>) {
        init.op = FilterOperation.And;
        return new Filter(init);
    }

    public static Or(init: Partial<Filter>) {
        init.op = FilterOperation.Or;
        return new Filter(init);
    }

    public static Not(init: Partial<Filter>) {
        init.op = FilterOperation.And;
        return new Filter(init);
    }
}

export enum FilterOperation {
    And = 0,
    Or = 1,
    Not = 2
}

export class TableFilterComponentItem {
    name?: string;
    appearance: TableFilterComponentItemAppearance;
    requestName: string;
    requestType: TableFilterComponentItemType;
    inputType?: TableFilterComponentItemInputType;
    label?: String;
    icon?: String;
    hint?: String;
    placeholder?: String;
    selectItems?: SelectItem[];
    selectItemsFromDictionary: string;
    selectItemsFromPromise: Promise<SelectItem[]>;
    values: any[] = [];
    private term: string;
    constructor(init: Partial<TableFilterComponentItem>) {
        Object.assign(this, init);
    }
    
    public FormRequestFilters(): Filter[] | Filter | null {
        switch(this.requestType) {
            case TableFilterComponentItemType.InputEq:
                if(this.values[0]) {
                    return new Filter({term: "eq", val: new FilterValue({ value: this.values[0] })});
                }
                break;
            case TableFilterComponentItemType.InputLike:
                if(this.values[0]) {
                    return new Filter({term: "like", val: new FilterValue({ value: `${this.values[0]}`})});
                }
                break;
            case TableFilterComponentItemType.InputRange:
                let filterValue = new FilterValue();

                if(this.values[0]) {
                    filterValue.left = this.values[0];
                }
                if(this.values[1]) {
                    filterValue.right = this.values[1];
                }
                if(this.values[0] || this.values[1]) {
                    return new Filter({term: "from to", val: filterValue});
                }
                break;
            case TableFilterComponentItemType.SelectSingle:
                if(this.values[0]) {
                    return new Filter({term: "eq", val: new FilterValue({value: this.values[0]})});
                }
                break;
            case TableFilterComponentItemType.SelectMultiple:
                if(this.values.length > 0) {
                    return new Filter({term: "in", val: new FilterValue({values: this.values})});
                }
                break;
            default:
            return null
        }
        return null;
    }
}

export enum TableFilterComponentItemType {
    InputEq, InputLike, SelectSingle, SelectMultiple, InputRange
}

export enum TableFilterComponentShortkey {
    applyFilter
}

export enum TableFilterComponentItemAppearance {
    Header, Topbar, TopbarHeader, AllFilters
}

export enum TableFilterComponentItemInputType {
    Date
}