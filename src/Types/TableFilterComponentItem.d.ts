import { SelectItem } from "ayax-common-types";
import { Filter } from "./Filter";
import { TableFilterComponentItemAppearance } from "./TableFilterComponentItemAppearance";
import { TableFilterComponentItemInputType } from "./TableFilterComponentItemInputType";
import { TableFilterComponentItemType } from "./TableFilterComponentItemType";
export declare class TableFilterComponentItem {
    name?: string;
    appearance: TableFilterComponentItemAppearance;
    requestName: string;
    requestType: TableFilterComponentItemType;
    inputType: TableFilterComponentItemInputType;
    label?: string;
    icon?: string;
    hint?: string;
    buttonText?: string;
    buttonClickedText?: string;
    largeInput: boolean;
    placeholder?: string;
    selectItems?: SelectItem[];
    selectItemsFromDictionary: string;
    selectItemsFromPromise: Promise<SelectItem[]>;
    values: any[];
    constructor(init: Partial<TableFilterComponentItem>);
    FormRequestFilters(): Filter[] | Filter | null;
}
