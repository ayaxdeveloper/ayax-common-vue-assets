import { SelectItem } from "ayax-common-types";
import { Filter } from "./Filter";
import { FilterValue } from "./FilterValue";
import { TableFilterComponentItemAppearance } from "./TableFilterComponentItemAppearance";
import { TableFilterComponentItemInputType } from "./TableFilterComponentItemInputType";
import { TableFilterComponentItemType } from "./TableFilterComponentItemType";

export class TableFilterComponentItem {
    name?: string;
    appearance: TableFilterComponentItemAppearance;
    requestName: string;
    requestType: TableFilterComponentItemType = TableFilterComponentItemType.Eq;
    inputType: TableFilterComponentItemInputType = TableFilterComponentItemInputType.Text;
    label?: string;
    icon?: string;
    hint?: string;
    buttonText?: string;
    buttonClickedText?: string;
    largeInput = false;
    placeholder?: string;
    selectItems?: SelectItem[];
    selectItemsFromDictionary: string;
    selectItemsFromPromise: Promise<SelectItem[]>;
    values: any[] = [];
    active = true;

    constructor(init: Partial<TableFilterComponentItem>) {
        Object.assign(this, init);
    }
    
    public FormRequestFilters(): Filter[] | Filter | null {
        switch (this.requestType) {
            case TableFilterComponentItemType.Eq:
                if (this.values[0]) {
                    return new Filter({term: "eq", val: new FilterValue({ value: this.values[0] })});
                }
                break;
            case TableFilterComponentItemType.Like:
                if (this.values[0]) {
                    return new Filter({term: "like", val: new FilterValue({ value: `${this.values[0]}`})});
                }
                break;
            case TableFilterComponentItemType.Range:
                const filterValue = new FilterValue();

                if (this.values[0]) {
                    filterValue.left = this.values[0];
                }
                if (this.values[1]) {
                    filterValue.right = this.values[1];
                }
                if (this.values[0] || this.values[1]) {
                    return new Filter({term: "fromeq toeq", val: filterValue});
                }
                break;
            case TableFilterComponentItemType.In:
                if (this.values.length > 0) {
                    return new Filter({term: "in", val: new FilterValue({values: this.values})});
                }
                break;
            default:
            return null;
        }
        return null;
    }
}