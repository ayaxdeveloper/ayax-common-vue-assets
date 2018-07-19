import { SelectItem } from "ayax-common-types";
import { HtmlElementType } from "ayax-common-types";

export class FormComponentItem {
    name: string;
    title: string;
    type: HtmlElementType;
    items?: SelectItem[];
    itemsFromPromise?: Promise<SelectItem[]>;
    dictionary: string;
    mask: string;
    returnMaskedValue = false;
    required = false;
    disabled = false;
    hidden = false;
    dense = true;
    hint: string;
    rules: any[];
    model: any = null;
    row = 0;
    multiple = false;

    constructor(init?: Partial<FormComponentItem>) {
        if (init) {
            Object.assign(this, init);
        }
    }
    public static Input(init: Partial<FormComponentItem>) {
        init.type = HtmlElementType.input;
        return new FormComponentItem(init);
    }
    public static Select(init: Partial<FormComponentItem>) {
        init.type = HtmlElementType.select;
        return new FormComponentItem(init);
    } 
    public static Date(init: Partial<FormComponentItem>) {
        init.type = HtmlElementType.date;
        return new FormComponentItem(init);
    }
    public static DateTime(init: Partial<FormComponentItem>) {
        init.type = HtmlElementType.datetime;
        return new FormComponentItem(init);
    }
    public static Checkbox(init: Partial<FormComponentItem>) {
        init.type = HtmlElementType.checkbox;
        return new FormComponentItem(init);
    }

    public static TextArea(init: Partial<FormComponentItem>) {
        init.type = HtmlElementType.textarea;
        return new FormComponentItem(init);
    }
    public static Hidden(init: Partial<FormComponentItem>) {
        init.type = HtmlElementType.hidden;
        return new FormComponentItem(init);
    }
}