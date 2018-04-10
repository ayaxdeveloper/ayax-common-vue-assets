import { SelectItem } from "ayax-common-types";
import { HtmlElementType } from "ayax-common-types";

    export class FastFilterComponentItem {
        type: HtmlElementType;
        name: String; 
        label: String;
        items: SelectItem[]; 
        default: String;
        hint: String;
        constructor(init?: Partial<FastFilterComponentItem>) {
            if(init) {
                Object.assign(this, init)
            }
        }
        public static Input(init: Partial<FastFilterComponentItem>) {
            init.type = HtmlElementType.input;
            return new FastFilterComponentItem(init);
        }
        public static Btn(init: Partial<FastFilterComponentItem>) {
            init.type = HtmlElementType.btn;
            return new FastFilterComponentItem(init);
        }
        public static Select(init: Partial<FastFilterComponentItem>) {
            init.type = HtmlElementType.select;
            return new FastFilterComponentItem(init);
        }
        public static Checkbox(init: Partial<FastFilterComponentItem>) {
            init.type = HtmlElementType.checkbox;
            return new FastFilterComponentItem(init);
        }
    }
