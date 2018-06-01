import { Component, Vue, Prop, Watch, Inject, Emit } from 'vue-property-decorator';
import { Pagination, IPagination } from 'ayax-common-types';
import { TableComponentHeader, TableComponentHeaderType } from './table-header';
import { SelectItem, guid } from 'ayax-common-types';
import * as moment from 'moment';
import TableFilterComponent from '../table-filter/table-filter.vue';
import { TableFilterComponentShortkey, TableFilterComponentItem, TableFilterComponentItemAppearance, TableFilterComponentItemInputType } from '../table-filter/table-filter-item';
import { SortableField } from 'ayax-common-types';
import { IEntity } from 'ayax-common-types';
import { TableComponentAction } from './table-action';
import draggable from 'vuedraggable';
import ActionbarComponent from '../actionbar/actionbar.vue';

@Component({
    components: {
        'a-table-filter': TableFilterComponent,
        'a-actionbar': ActionbarComponent,
        'draggable': draggable
    }
})
export default class TableComponent extends Vue {
    configActionsWidth = 50;
    configSelectableWidth = 50;
    
    @Prop() headers: TableComponentHeader[];
    @Prop() actions: TableComponentAction[];
    @Prop({default: () => []}) tableFilters: TableFilterComponentItem[];
    @Prop() items: any[];
    @Prop({ default: true}) selectable: boolean; 
    @Prop({ default: false}) selectableSingle: boolean; 
    @Prop({ default: false }) loading: boolean;
    @Prop() pagination: IPagination;
    @Prop() selected: any[];
    @Prop({default: ''}) title: string;
    @Prop({default: ''}) entity: string;
    @Prop({default: 'secondary'}) topbarColor: string;
    @Prop({default: 'primary'}) actionbarColor: string;
    @Prop({default: true}) topbarIsDark: boolean;
    @Prop({default: true}) actionbarIsDark: boolean;
    @Prop({default: false}) configure: boolean;
    @Prop({default: false}) showHeaderFiltersByDefault: boolean;
    applyFilterButtonVisibility = true;
    innerSelected: any[] = [];
    totalItems = 1;
    isTableMenuVisible = false;
    showFilters = this.showHeaderFiltersByDefault;
    showFiltersMessage = this.showHeaderFiltersByDefault ? 'Показать фильтры' : 'Скрыть фильтры';
    showAllFilters = false;
    editableHeaders = [];
    headerSettings = [];
    itemSelected = false;
    tableIdentifier = `${this.title}_${this.entity}`.replace(/\s+/g, '_').replace('-', '_');
    headerFilters: TableFilterComponentItem[] = [];
    topbarFilters: TableFilterComponentItem[] = [];
    allFilters: TableFilterComponentItem[] = [];
    lastQuery: string;
    
    created() {
        this.headers.forEach(el => {
            this.editableHeaders.push(el);
        });
        this.tableFilters.forEach(el => {
            switch(el.appearance) {
                case TableFilterComponentItemAppearance.Header:
                    this.headerFilters.push(el);
                    this.allFilters.push(el);
                    break;
                case TableFilterComponentItemAppearance.Topbar:
                    this.topbarFilters.push(el);
                    break;
                case TableFilterComponentItemAppearance.TopbarHeader:
                    this.headerFilters.push(el);
                    this.topbarFilters.push(el);
                    break;
                case TableFilterComponentItemAppearance.AllFilters:
                    this.allFilters.push(el);
                    break;
            }
        });
        if(this.selected) {
            this.innerSelected = this.selected;
        }
        if(localStorage.getItem(`${this.tableIdentifier}_list_show-filters`) != 'true'){
            this.showFilters = false;
        } else {
            this.showFilters = true;
            this.showFiltersMessage = 'Скрыть фильтры'
        }
        if(JSON.parse(localStorage.getItem(`${this.tableIdentifier}_list_show-all-filters`))) {
            this.showAllFilters = true;
        }
        if(localStorage.getItem(`${this.tableIdentifier}_table_settings`) != null){
            let data = JSON.parse(localStorage.getItem(`${this.tableIdentifier}_table_settings`));
            data.forEach(settingsElement => {
                this.editableHeaders.forEach(headerElement => {
                    if(settingsElement.value == headerElement.value) {
                        headerElement.isVisible = settingsElement.isVisible;
                        headerElement.order = settingsElement.order;
                    }
                })
            });
            this.headerSettings = data;
            this.editableHeaders.sort(function(a, b){return a.order - b.order});
        }else {
            this.editableHeaders.forEach(el => {
                let newItem = {value: '', isVisible: true, order: 0};
                newItem.value = el.value;
                newItem.isVisible = el.isVisible;
                newItem.order = el.order;
                this.headerSettings.push(newItem);
            })
        }
    }

    applyQuery() {
        if(!(Object.keys(this.$route.query).length === 0 && this.$route.query.constructor === Object)) {
            if(this.$route.query[`${this.tableIdentifier}`] !== undefined) {
                this.tableFilters.forEach(filter => {
                    filter.values = [];
                })
                this.editableHeaders.forEach(header => {
                    if(header.sortable && header.sortBy) {
                        header.sortBy = undefined;
                    }
                })
                JSON.parse(this.$route.query[`${this.tableIdentifier}`]).forEach(query => {
                    if(query.isSort) {
                        this.editableHeaders.forEach(header => {
                            if(header.sortable && query.name == header.value) {
                                if(!header.sortBy) {
                                    header.sortBy = new SortableField();
                                }
                                if(query.isdesc == undefined) {
                                    header.sortBy = undefined;
                                }else {
                                    header.sortBy.isdesc = query.isdesc;
                                }
                            }
                        })
                    }
                    if(query.requestName) {
                        this.tableFilters.forEach(filter => {
                            if(filter.requestName == query.requestName && query.values && query.values.length > 0) {
                                filter.values = query.values;
                                this.applyFilterButtonVisibility = false;
                            }
                        })
                    }  
                })
            }
        }
    }

    @Watch('$route.query')
    onQueryChange() {
        if(!(Object.keys(this.$route.query).length === 0 && this.$route.query.constructor === Object)) {
            if(this.lastQuery != JSON.stringify(this.$route.query)){
                this.applyQuery();
                this.applyFilter();
            }
        }else {
            this.editableHeaders.forEach(header => {
                if(header.sortable) {
                    if(header.sortBy) {
                        header.sortBy = undefined;
                    }
                }
            })
            this.tableFilters.forEach(el => {
                el.values = [];
            })
            this.applyFilter();
        }   
    }

    @Watch('innerSelected')
    onSelectChanged(newVal, oldVal) {
        if(newVal != oldVal) {
            this.$emit("onSelect", newVal.map((item) => {
                return item.id
            }));
        }
        if(this.innerSelected.length > 0) {
            this.itemSelected = true;
        } else {
            this.itemSelected = false;
        }
    }

    toggleFilters() {
        this.isTableMenuVisible = false;
        if(this.showFilters){
            this.showFilters = false;
            localStorage.setItem(`${this.tableIdentifier}_list_show-filters`, 'false');
            this.showFiltersMessage = 'Показать фильтры'
        }else {
            this.showFilters = true;
            localStorage.setItem(`${this.tableIdentifier}_list_show-filters`, 'true');
            this.showFiltersMessage = 'Скрыть фильтры'
        }
    }

    showAllFiltersBtn() {
        this.showAllFilters = !this.showAllFilters;
        localStorage.setItem(`${this.tableIdentifier}_list_show-all-filters`, JSON.stringify(this.showAllFilters));
    }

    onChangeVisible(item) {
        this.headerSettings.forEach(el => {
            if(el.value == item.value){
                el.isVisible = item.isVisible;
            }
        })
        localStorage.setItem(`${this.tableIdentifier}_table_settings`, JSON.stringify(this.headerSettings));
    }

    onUpdateDraggable() {
        for(var i = 0; i < this.editableHeaders.length; i++){
            this.editableHeaders[i].order = i;
            this.headerSettings.forEach(el => {
                if(el.value == this.editableHeaders[i].value){
                    el.order = this.editableHeaders[i].order;
                }
            })
        }
        localStorage.setItem(`${this.tableIdentifier}_table_settings`, JSON.stringify(this.headerSettings));
    }

    resetTableSettings() {
        localStorage.removeItem(`${this.tableIdentifier}_table_settings`);
        localStorage.removeItem(`${this.tableIdentifier}_list_show-filters`);
        this.showFilters = true;
        this.isTableMenuVisible = false;
        this.showFiltersMessage = 'Показать фильтры';
        this.editableHeaders = [];
        this.headers.forEach(el => {
            el.isVisible = true;
            this.editableHeaders.push(el);       
        });
    }

    getFromDictionary(header: TableComponentHeader, id: number) {
        if(!header || !header.items) {
            return "Нет";
        }
        let val = header.items.find(x=>x.id == id);
        if(val) {
            return val.name;
        }
        return "Нет";
    }

    @Emit()
    applyFilter() {
        if(this.pagination.page > 1) {
            this.pagination.page = 1;
        }
        let query = {};
        let filters = [];
        this.tableFilters.forEach(filter => {
            if(filter.values && filter.values.length > 0) {
                filters.push({
                    requestName: filter.requestName,
                    name: filter.name ? filter.name : undefined,
                    values: filter.values
                })
            }
        })
        this.editableHeaders.forEach(header => {
            if(header.sortable && header.sortBy) {
                filters.push({
                    isSort: true,
                    name: header.value, 
                    isdesc: header.sortBy ? header.sortBy.isdesc : undefined
                });
            }
        })
        if(filters.length > 0) {
            query[`${this.tableIdentifier}`] = JSON.stringify(filters);
            this.$router.push({path: this.$route.path, query: query}); 
        }
        this.lastQuery = JSON.stringify(query);
        this.applyFilterButtonVisibility = false;
    }

    applyFormatterIfExists(header: TableComponentHeader, value) {
        if(header.formatter) {
            return header.formatter(value);
        } else {
            return value;
        }
    }

    get GetTotalPages() {
        return this.pagination.rowsPerPage ? Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage) : 1
    }

    selectClick(props) {
        if(this.selectableSingle) {
            if(props.selected) {
                props.selected = false;
            } else {
                props.selected = true;
                this.innerSelected = [props.item];
            }
        } else {
            props.selected = !props.selected
        }
    };

    toggleAll () {
        if (this.innerSelected.length) {
            this.innerSelected = [];
        } else {
            this.innerSelected = this.items.slice();
        }
    };

    changeSort (headerValue: string) {
        this.editableHeaders.forEach((item)=>{
            if(item.value == headerValue && item.sortable) {
                if(!item.sortBy) {
                    item.sortBy = new SortableField();
                }
                item.sortBy.isdesc = !item.sortBy.isdesc;
            } else {
                item.sortBy = undefined;
            }
        });
        this.applyFilter();
    };

    currentHeaderFilter(headerValue) {
       return this.headerFilters.filter(filter => filter.name == headerValue)[0];
    }

    @Emit()
    onRowAction(item: IEntity, name: string) {}

    @Emit()
    onBarAction(items: any[], name: string) {}

    firstAction(item: IEntity) {
        if(this.actions && this.actions.filter(x=>x.single && x.active).length > 0) {
            this.onRowAction(item, this.actions.filter(x=>x.single && x.active)[0].name);
        }
    }
}