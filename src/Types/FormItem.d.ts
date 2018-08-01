import { SelectItem } from "ayax-common-types";
import { HtmlElementType } from "ayax-common-types";
export declare class FormComponentItem {
    name: string;
    title: string;
    type: HtmlElementType;
    items?: SelectItem[];
    itemsFromPromise?: Promise<SelectItem[]>;
    dictionary: string;
    mask: string;
    returnMaskedValue: boolean;
    required: boolean;
    disabled: boolean;
    hidden: boolean;
    dense: boolean;
    hint: string;
    rules: any[];
    model: any;
    row: number;
    multiple: boolean;
    constructor(init?: Partial<FormComponentItem>);
    static Input(init: Partial<FormComponentItem>): FormComponentItem;
    static Select(init: Partial<FormComponentItem>): FormComponentItem;
    static Date(init: Partial<FormComponentItem>): FormComponentItem;
    static DateTime(init: Partial<FormComponentItem>): FormComponentItem;
    static Checkbox(init: Partial<FormComponentItem>): FormComponentItem;
    static TextArea(init: Partial<FormComponentItem>): FormComponentItem;
    static Hidden(init: Partial<FormComponentItem>): FormComponentItem;
}
