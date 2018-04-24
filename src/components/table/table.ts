import { Component, Vue, Prop, Watch, Inject, Emit } from 'vue-property-decorator';
import { Pagination, IPagination } from 'ayax-common-types';
import { TableComponentHeader, TableComponentHeaderType } from './table-header';
import { SelectItem, guid } from 'ayax-common-types';
import * as moment from 'moment';
import TableFilterComponent from '../table-filter/table-filter.vue';
import { TableFilterComponentShortkey } from '../table-filter/table-filter-item';
import { SortableField } from 'ayax-common-types';
import { IEntity } from 'ayax-common-types';
import { TableComponentAction } from './table-action';
import draggable from 'vuedraggable';

@Component({
    components: {
        'a-table-filter': TableFilterComponent,
        'draggable': draggable
    }
})
export default class TableComponent extends Vue {
    configActionsWidth = 50;
    configSelectableWidth = 50;

    @Prop() headers: TableComponentHeader[];
    @Prop() actions: TableComponentAction[];
    @Prop() items: any[];
    @Prop({ default: false}) selectable: boolean; 
    @Prop({ default: false}) selectableSingle: boolean; 
    @Prop({ default: false }) loading: boolean;
    @Prop() pagination: IPagination;
    @Prop() selected: any[];
    @Prop() title: string;
    innerSelected: any[] = [];
    totalItems = 1;
    isTableMenuVisible = false;
    showFilters = true;
    showFiltersMessage = 'Скрыть фильтры';
    editableHeaders = [];
    headerSettings = [];
    
    created() {
        this.headers.forEach(el => {
            this.editableHeaders.push(el);
        });
        if(this.selected) {
            this.innerSelected = this.selected;
        }
        if(localStorage.getItem(`${this.$route.name}_list_show-filters`) != 'false'){
            this.showFilters = true;
        }else {
            this.showFilters = false;
            this.showFiltersMessage = 'Показать фильтры'
        }
        if(localStorage.getItem(`${this.$route.name}_table_settings`) != null){
            let data = JSON.parse(localStorage.getItem(`${this.$route.name}_table_settings`));
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

    @Watch('innerSelected')
    onSelectChanged(newVal, oldVal) {
        if(newVal != oldVal) {
            this.$emit("onSelect", newVal.map((item) => {
                return item.id
            }));
        }
    }

    toggleFilters() {
        this.isTableMenuVisible = false;
        if(this.showFilters){
            this.showFilters = false;
            localStorage.setItem(`${this.$route.name}_list_show-filters`, 'false');
            this.showFiltersMessage = 'Показать фильтры'
        }else {
            this.showFilters = true;
            localStorage.setItem(`${this.$route.name}_list_show-filters`, 'true');
            this.showFiltersMessage = 'Скрыть фильтры'
        }
    }

    onChangeVisible(item) {
        this.headerSettings.forEach(el => {
            if(el.value == item.value){
                el.isVisible = item.isVisible;
            }
        })
        localStorage.setItem(`${this.$route.name}_table_settings`, JSON.stringify(this.headerSettings));
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
        localStorage.setItem(`${this.$route.name}_table_settings`, JSON.stringify(this.headerSettings));
    }

    resetTableSettings() {
        localStorage.removeItem(`${this.$route.name}_table_settings`);
        localStorage.removeItem(`${this.$route.name}_list_show-filters`);
        this.showFilters = true;
        this.isTableMenuVisible = false;
        this.showFiltersMessage = 'Скрыть фильтры';
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
    applyFilter() {}

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
        if (this.innerSelected.length) this.innerSelected = [];
        else this.innerSelected = this.items.slice();
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

    get FiltersExist() {
        return this.editableHeaders.filter(x => x.filter != null).length > 0;
    }

    @Emit()
    onRowAction(item: IEntity, name: string) {}

    firstAction(item: IEntity) {
        if(this.actions) {
            this.onRowAction(item, this.actions[0].name);
        }
    }
}