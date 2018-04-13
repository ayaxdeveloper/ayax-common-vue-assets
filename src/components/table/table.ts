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

@Component({
    components: {
        'a-table-filter': TableFilterComponent
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
    innerSelected: any[] = [];
    totalItems = 1;

    created() {
        if(this.selected) {
            this.innerSelected = this.selected;
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
        this.headers.forEach((item)=>{
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
        return this.headers.filter(x => x.filter != null).length > 0;
    }

    @Emit()
    onRowAction(item: IEntity, name: string) {}

    firstAction(item: IEntity) {
        if(this.actions) {
            this.onRowAction(item, this.actions[0].name);
        }
    }
}