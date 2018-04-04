import { Vue, Component, Prop } from "vue-property-decorator";
import { HtmlElementType, HtmlElementTypeArray } from "ayax-common-types";
import { FastFilterComponentItem } from "./fast-filter-item";

@Component
export default class FastFilterComponent extends Vue {
    @Prop({default: "grey lighten-1"}) color: string;
    @Prop() filter: object;
    @Prop() fastfilters: FastFilterComponentItem[];
    @Prop() advancedFilter: any[];
    htmlElementTypes = HtmlElementTypeArray.Create();
}