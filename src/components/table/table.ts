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
import { ResizeObserver } from 'vue-resize';

@Component({
    components: {
        'a-table-filter': TableFilterComponent,
        'draggable': draggable,
        'resize-observer': ResizeObserver
    }
})
export default class TableComponent extends Vue {
    configActionsWidth = 50;
    configSelectableWidth = 50;
    
    @Prop() headers: TableComponentHeader[];
    @Prop() actions: TableComponentAction[];
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
    applyFilterButtonVisibility = true;
    innerSelected: any[] = [];
    totalItems = 1;
    isTableMenuVisible = false;
    showFilters = true;
    showFiltersMessage = 'Скрыть фильтры';
    editableHeaders = [];
    headerSettings = [];
    tableContainer;
    actionbar;
    itemSelected = false;
    tableIdentifier = `${this.title}_${this.entity}`.replace(/\s+/g, '_').replace('-', '_');
 
    mounted() {
        this.tableContainer = document.getElementsByClassName('tableContainer');
        this.actionbar = document.getElementsByClassName('actionbar');
        this.applyQuery();
    }

    created() {
        if(this.actions){
           this.addWindowEvents(); 
        }
        this.headers.forEach(el => {
            this.editableHeaders.push(el);
        });
        if(this.selected) {
            this.innerSelected = this.selected;
        }
        if(localStorage.getItem(this.tableIdentifier + `_list_show-filters`) != 'false'){
            this.showFilters = true;
        }else {
            this.showFilters = false;
            this.showFiltersMessage = 'Показать фильтры'
        }
        if(localStorage.getItem(this.tableIdentifier + `_table_settings`) != null){
            let data = JSON.parse(localStorage.getItem(this.tableIdentifier + `_table_settings`));
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
                JSON.parse(this.$route.query[`${this.tableIdentifier}`]).forEach(el => {
                    this.editableHeaders.forEach(header => {
                        if(el.name == header.value){
                            if(header.sortable) {
                                if(!header.sortBy) {
                                    header.sortBy = new SortableField();
                                }
                                if(el.isdesc == null) {
                                    header.sortBy = undefined;
                                }else {
                                    header.sortBy.isdesc = el.isdesc;
                                }
                            }
                            if(header.filter && el.values.length > 0) {
                                header.filter.values = el.values;
                            }
                        }
                    })
                })
            }
        }
    }

    @Watch('$route.query')
    onQueryChange() {
        if(!(Object.keys(this.$route.query).length === 0 && this.$route.query.constructor === Object)) {
            this.applyQuery();
            this.applyFilter();
        }else {
            this.editableHeaders.forEach(header => {
                if(header.sortable) {
                    if(header.sortBy) {
                        header.sortBy = undefined;
                    }
                }
                if(header.filter) {
                    header.filter.values = [];
                }
            })
            this.applyFilter();
        }    
    }


    addWindowEvents() {
        window.onresize = () => {
            this.actionbarSize();
        }
        window.onscroll = () => {
            [].forEach.call(this.tableContainer, elem => {
                this.toggleActionbar(elem);
            })
        }
    }

    isElementInViewPort(el) {
        var rect = el.getBoundingClientRect();
        return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document. documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document. documentElement.clientWidth)
      );
    }

    isPartOfElementInViewPort(el) {
        var top = el.offsetTop;
        var left = el.offsetLeft;
        var width = el.offsetWidth;
        var height = el.offsetHeight;
        while(el.offsetParent) {
            el = el.offsetParent;
            top += el.offsetTop;
            left += el.offsetLeft;
        }
        return (
            top < (window.pageYOffset + window.innerHeight) &&
            left < (window.pageXOffset + window.innerWidth) &&
            (top + height) > window.pageYOffset &&
            (left + width) > window.pageXOffset
        );
    }

    actionbarSize() {
        [].forEach.call(this.actionbar, el => {
            el.style.width = this.tableContainer[0].offsetWidth.toString() + 'px';
        })
    }

    toggleActionbar(elem) {
        let actionBarElement = elem.querySelector('.actionbar');
        if(!actionBarElement) {
            return;
        }
        if(this.isPartOfElementInViewPort(actionBarElement) && !this.isElementInViewPort(actionBarElement)) {
            actionBarElement.classList.add('actionbarFixed');
        }else {
            actionBarElement.classList.remove('actionbarFixed');
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
            localStorage.setItem(`${this.title}_${this.entity}_list_show-filters`, 'false');
            this.showFiltersMessage = 'Показать фильтры'
        }else {
            this.showFilters = true;
            localStorage.setItem(`${this.title}_${this.entity}_list_show-filters`, 'true');
            this.showFiltersMessage = 'Скрыть фильтры'
        }
    }

    onChangeVisible(item) {
        this.headerSettings.forEach(el => {
            if(el.value == item.value){
                el.isVisible = item.isVisible;
            }
        })
        localStorage.setItem(this.tableIdentifier + `_table_settings`, JSON.stringify(this.headerSettings));
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
        localStorage.setItem(this.tableIdentifier + `_table_settings`, JSON.stringify(this.headerSettings));
    }

    resetTableSettings() {
        localStorage.removeItem(this.tableIdentifier + `_table_settings`);
        localStorage.removeItem(this.tableIdentifier + `_list_show-filters`);
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
    applyFilter() {
        let query = {};
        let headers = [];
        this.editableHeaders.forEach(el => {
            if(el.sortable || el.filter) {
                if(el.sortBy || el.filter.values.length > 0){
                    headers.push({name: el.value, isdesc: el.sortBy ? el.sortBy.isdesc : null, values: el.filter.values});
                }
            }
        })
        if(headers.length > 0) {
            query[`${this.tableIdentifier}`] = JSON.stringify(headers);
            this.$router.push({path: this.$route.path, query: query}); 
        }
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

    get FiltersExist() {
        return this.editableHeaders.filter(x => x.filter != null).length > 0;
    }

    @Emit()
    onRowAction(item: IEntity, name: string) {}

    @Emit()
    onBarAction(items: any[], name: string) {}

    firstAction(item: IEntity) {
        if(this.actions) {
            this.onRowAction(item, this.actions[0].name);
        }
    }
}