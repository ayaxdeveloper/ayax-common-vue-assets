import { Pagination } from "ayax-common-types";
import ActionItem from "../ActionbarComponent/ActionItem";
import { TableFilterComponentItem } from "../TableFilterComponent/TableFilterComponentItem";
import { TableComponentHeader } from "./TableHeader";

export default class TableOptions {
    getData: (request) => Promise<any>;
    tableName = "tableComponent";
    headers: TableComponentHeader[] = [];
    actions: ActionItem[] = [];
    filters: TableFilterComponentItem[] = [];
    selectable = true; 
    selectableSingle = false; 
    clearSelected = 0;
    reloadData = 0;
    title = "";
    topbarColor = "secondary";
    actionbarColor = "primary";
    darkTopbar = true;
    darkActionbar = true;
    pagination: Pagination = {page: 1, perPage: 10, totalItems: 0};
    configurable = true;
    rowColor: (item) => string = () => "";
    maxHeight = null;
    constructor(init?: Partial<TableOptions>) {
        if (init) {
            Object.assign(this, init);
        }
    }
}