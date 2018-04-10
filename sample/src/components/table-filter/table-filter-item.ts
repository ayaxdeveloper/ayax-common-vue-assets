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
    name: string;
    type: TableFilterComponentItemType;
    selectItems?: SelectItem[];
    selectItemsFromDictionary: string;
    values: any[] = [];
    private term: string;
    constructor(init?: Partial<TableFilterComponentItem>) {
        if(init) {
            Object.assign(this, init);
        }
    }
    public static Input(name: string, equals?: boolean): TableFilterComponentItem {
        return new TableFilterComponentItem({ 
            name: name, 
            type: equals ? TableFilterComponentItemType.InputEq : TableFilterComponentItemType.InputLike
        });
    }
    public static InputRange(name: string): TableFilterComponentItem {
        return new TableFilterComponentItem({ 
            name: name, 
            type: TableFilterComponentItemType.InputRange,
        });
    }

    public static Select(name: string, selectItems: SelectItem[], multiple?: boolean) {
        return new TableFilterComponentItem({
            name: name,
            selectItems: selectItems,
            type: multiple ? TableFilterComponentItemType.SelectMultiple : TableFilterComponentItemType.SelectSingle
        });
    }

    public static SelectFromDictonary(name: string, dictionary: string, multiple?: boolean) {
        return new TableFilterComponentItem({
            name: name,
            selectItemsFromDictionary: dictionary,
            type: multiple ? TableFilterComponentItemType.SelectMultiple : TableFilterComponentItemType.SelectSingle
        });
    }

    public FormRequestFilters(): Filter[] | Filter | null {
        switch(this.type) {
            case TableFilterComponentItemType.InputEq:
                if(this.values[0]) {
                    return new Filter({term: "eq", val: new FilterValue({ value: this.values[0] })});
                }
                break;
            case TableFilterComponentItemType.InputLike:
                if(this.values[0]) {
                    return new Filter({term: "like", val: new FilterValue({ value: `%${this.values[0]}%`})});
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