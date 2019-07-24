import { Pagination, SearchResponse } from "ayax-common-types";
import { ActionItem } from "../ActionbarComponent/ActionItem";
import { TableFilterComponentItem } from "../TableFilterComponent/TableFilterComponentItem";
import { TableComponentHeader } from "./TableHeader";

export class TableOptions {
    autoRefreshEnable = false; 
    autoRefresh = 0; 
    autoRefreshOptions: number[] = [30, 60, 120]
    searchData: (request) => Promise<SearchResponse<any[]>>;
    rawData: (request) => Promise<any[]>;
    tableName = "tableComponent";
    headers: TableComponentHeader[] = [];
    actions: ActionItem[] = [];
    filters: TableFilterComponentItem[] = [];
    hiddenFilters: TableFilterComponentItem[] = [];
    filterGroups: string[] = [];
    quickFilters = false;
    quickFilterPromise: (request) => Promise<any[]> | null = null;
    selectable = true;
    selectableSingle = false;
    clearSelected = 0;
    resizeHeader = 0;
    reloadData = 0;
    title = "";
    topbarColor = "secondary";
    actionbarColor = "primary";
    darkTopbar = true;
    darkActionbar = true;
    pagination: Pagination = { page: 1, perPage: 10, totalItems: 0 };
    configurable = true;
    rowColor: (item) => string = () => "";
    maxHeight = window.innerHeight - 295;
    constructor(init?: Partial<TableOptions>) {
        if (init) {
            Object.assign(this, init);
        }
    }
}
