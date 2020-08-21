import { FilterOperation } from "./FilterOperation";
import { FilterValue } from "./FilterValue";

export class Filter {
    term: string;
    val: FilterValue;
    op?: FilterOperation;

    constructor(init?: Partial<Filter>) {
        if (init) {
            Object.assign(this, init);
        }
    }

    public static Eq(value: any) {
        return new Filter({ term: "eq", val: new FilterValue({ value }) });
    }

    public static NotEq(value: any) {
        return new Filter({ term: "noteq", val: new FilterValue({ value }) });
    }

    public static Like(value: any) {
        return new Filter({ term: "like", val: new FilterValue({ value: `${value}` }) });
    }

    public static NotLike(value: any) {
        return new Filter({ term: "notlike", val: new FilterValue({ value: `${value}` }) });
    }

    public static Range(values: any[]) {
        const filterValue = new FilterValue();
        if (values[0]) {
            filterValue.left = values[0];
        }
        if (values[1]) {
            filterValue.right = values[1];
        }
        return new Filter({ term: "fromeq toeq", val: filterValue });
    }

    public static NotIn(values: any[]) {
        return new Filter({ term: "notin", val: new FilterValue({ values }) });
    }

    public static In(values: any[]) {
        return new Filter({ term: "in", val: new FilterValue({ values }) });
    }
}
