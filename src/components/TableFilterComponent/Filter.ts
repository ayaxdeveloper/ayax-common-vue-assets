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

    public static And(init: Partial<Filter>) {
        init.op = FilterOperation.And;
        return new Filter(init);
    }

    public static Or(init: Partial<Filter>) {
        init.op = FilterOperation.Or;
        return new Filter(init);
    }

    public static Not(init: Partial<Filter>) {
        init.op = FilterOperation.Not;
        return new Filter(init);
    }
}