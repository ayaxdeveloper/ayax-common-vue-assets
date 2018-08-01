import { FilterOperation } from "./FilterOperation";
import { FilterValue } from "./FilterValue";
export declare class Filter {
    term: string;
    val: FilterValue;
    op?: FilterOperation;
    constructor(init?: Partial<Filter>);
    static And(init: Partial<Filter>): Filter;
    static Or(init: Partial<Filter>): Filter;
    static Not(init: Partial<Filter>): Filter;
}
