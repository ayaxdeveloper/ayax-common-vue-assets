<template>
    <div class="actionbarContainer mb-4" style="position: relative">
        <slot name="table-head">
            <v-toolbar flat dense :dark="topbarIsDark" :class="topbarColor">
            <v-toolbar-title v-if="title">
                {{title}}
                <v-chip title="Количество записей" label small v-if="pagination.totalItems">{{ pagination.totalItems }}</v-chip>
            </v-toolbar-title>
            <v-toolbar-items>
                <v-layout row>
                    <a-table-filter class="ml-3" 
                        :style="{width: topbarFilter.inputType == filterInputTypes['Button'] ? 'initial' : '180px'}" 
                        v-for="(topbarFilter, index) in topbarFilters" :key="topbarFilter.requestName"
                        :applyFilterButtonVisibility="applyFilterButtonVisibility" 
                        :filter="topbarFilter"
                        :index="index" 
                        @apply-filter="applyFilter">
                    </a-table-filter>
                </v-layout>
            </v-toolbar-items>
            <v-spacer></v-spacer>
            <slot name="toolbar-items"></slot>
            <v-toolbar-items>
                <slot name="head-items"></slot>
                <v-btn small v-if="allFilters.length > 0" :class="{'mr-3':configure}" flat @click="showAllFiltersBtn()">
                    Все фильтры
                    <v-icon v-if="!showAllFilters">mdi-menu-down</v-icon>
                    <v-icon v-if="showAllFilters">mdi-menu-up</v-icon>
                </v-btn>
                <v-menu bottom offset-y left offset-x :close-on-content-click="false" :value="isTableMenuVisible" v-if="configure">
                    <v-btn flat style="height: 30px; width: 30px" small icon title="Настройки таблицы" slot="activator" @click="isTableMenuVisible=true">
                        <v-icon>mdi-settings</v-icon>
                    </v-btn>
                    <v-list dense>
                        <v-list-tile v-if="headerFilters.length > 0" @click="toggleFilters">
                            <v-list-tile-title>{{ showFiltersMessage }}</v-list-tile-title>
                        </v-list-tile>
                        <v-divider v-if="headerFilters.length > 0"></v-divider>
                        <draggable :list="editableHeaders" @update="onUpdateDraggable">
                            <v-list-tile v-for="header in editableHeaders" :key="header.value" @click="">
                                <v-list-tile-action>
                                    <v-checkbox v-if="header.hiddenable" v-model="header.isVisible" @change="onChangeVisible(header)"></v-checkbox>
                                    <v-checkbox v-else input-value="true" disabled></v-checkbox>
                                </v-list-tile-action>
                                <v-list-tile-title>{{ header.text }}</v-list-tile-title>
                            </v-list-tile>
                        </draggable>
                        <v-divider></v-divider>
                            <v-list-tile @click="resetTableSettings">
                            <v-list-tile-title>Сбросить настройки таблицы</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-toolbar-items>
        </v-toolbar>
        <transition name="slide">
            <v-card class="pa-2" v-if="showAllFilters" dark flat style="border-radius: 0">
                <v-container fluid grid-list-md>
                    <v-layout row wrap>
                        <v-flex :xs6="filter.largeInput" :xs3="!filter.largeInput"  v-for="(filter, index) in allFilters" :key="filter.requestName">
                            <a-table-filter
                                :applyFilterButtonVisibility="applyFilterButtonVisibility" 
                                :filter="filter"
                                :index="index" 
                                @apply-filter="applyFilter">
                            </a-table-filter>
                        </v-flex>
                    </v-layout>
                </v-container>
                <v-layout>
                    <v-spacer></v-spacer>
                    <v-btn light @click="clearAllFilters()">
                        Очистить
                    </v-btn>
                    <v-btn color="primary" @click="applyFilter()">
                        Применить
                    </v-btn>
                </v-layout>
            </v-card>
        </transition>
        </slot>
        <v-progress-circular v-if="loading" indeterminate fixed class="table-loading" color="primary" size="50"></v-progress-circular>
        <v-data-table
        v-bind:headers="editableHeaders"
        v-bind:items="items"
        :total-items="totalItems"
        :loading="loading"
        select-all
        no-data-text="Нет данных"
        v-model="innerSelected"
        hide-actions
        item-key="id"
        no-results-text="Ничего не найдено"
        class="elevation-1 table-block mainAnchor">
            <template slot="headers" slot-scope="props">
                <tr class="header-row">
                    <th v-if='selectable' class="selectable" :width="configSelectableWidth">
                        <v-checkbox v-if="!selectableSingle" 
                                primary
                                hide-details
                                @click.native="toggleAll"
                                :input-value="props.all"
                                :indeterminate="props.indeterminate"
                                color="primary"
                        ></v-checkbox>
                    </th>
                    <th class="text-xs-center action" v-if="actions && actions.filter(x => x.single && x.active).length > 0" :width="configActionsWidth">
                        ...
                    </th>
                    <th v-for="header in editableHeaders"
                        v-if="header.isVisible" 
                        :key="header.value"
                        :class="[
                            'column', header.sortable ? 'sortable' : '', header.sortBy && header.sortBy.isdesc ? 'desc' : 'asc', 
                            header.sortBy ? 'active' : '',
                            header.align == 'right' ? 'text-xs-right' : 'text-xs-left'
                            ]"
                        :width="header.width"
                        @click="header.sortable && changeSort(header.value)"
                    >
                        <v-icon v-if="header.sortable">mdi-arrow-up</v-icon>
                        <strong>{{ header.text }}</strong>
                    </th>
                </tr>
                <tr v-if="headerFilters.length > 0 && showFilters" class="filter-row">
                    <th v-if='selectable' class="selectable"></th>
                    <th v-if="actions && actions.filter(x=>x.single && x.active).length > 0" class="action">
                    </th>
                    <th v-for="header in editableHeaders"
                        v-if="header.isVisible" 
                        :key="header.value"
                        class="column"
                    >
                        <template v-if="currentHeaderFilter(header.value)">
                            <a-table-filter
                            @apply-filter="applyFilter"
                            :applyFilterButtonVisibility="applyFilterButtonVisibility"
                            :header="header"
                            :filter="currentHeaderFilter(header.value)"
                            ></a-table-filter>
                        </template>
                    </th>
                </tr>
            </template>
            <template slot="items" slot-scope="props">
                <tr :active="props.selected">
                    <td v-if='selectable' class="selectable" @click="selectClick(props)">
                        <v-checkbox
                                primary
                                hide-details
                                :input-value="props.selected"
                                color="primary"
                        ></v-checkbox>
                    </td>
                    <td class="text-xs-right action" v-if="actions && actions.filter(x=>x.single && x.active).length > 0">
                        <div class="text-xs-center">
                            <v-menu :disabled="itemSelected" offset-x>
                                <v-btn 
                                color="primary" 
                                :disabled="itemSelected"
                                dark 
                                flat
                                slot="activator"
                                small
                                icon
                                :ripple="false"
                                >
                                    <v-icon>mdi-dots-horizontal</v-icon>
                                </v-btn>
                                <v-list
                                dark
                                dense>
                                    <v-list-tile 
                                    v-for="action in actions.filter(action => action.single && action.active)" 
                                    :key="action.name"
                                    @click="onRowAction(props.item, action.name)">
                                        <v-list-tile-action
                                        v-if="action.icon">
                                            <v-icon>{{action.icon}}</v-icon>
                                        </v-list-tile-action>
                                        <v-list-tile-title 
                                        v-if="action.title && !action.onlyIcon"
                                        >{{ action.title }}</v-list-tile-title>
                                    </v-list-tile>
                                </v-list>
                            </v-menu>
                        </div>
                    </td>
                    <td
                        v-for="(header, index) in editableHeaders.filter(header => header.isVisible)" :key="index"
                        :class="[
                            header.align == 'right' ? 'text-xs-right' : 'text-xs-left'
                        , 'column']"
                        @click="selectClick(props)"
                        v-on:dblclick="firstAction(props.item)"
                    >
                        <slot :name="header.value" :item="props.item">
                            <template v-for="propertyname in Object.keys(props.item).filter(x => x == editableHeaders[index].value)">
                                <template v-if="editableHeaders[index].items">
                                    {{getFromDictionary(editableHeaders[index], props.item[propertyname])}}
                                </template>
                                <template v-else>
                                    {{applyFormatterIfExists(header, props.item[propertyname])}}
                                </template>
                            </template>
                        </slot>
                    </td>
                </tr>   
            </template>
        </v-data-table>
        <div class="actionbarAnchor">
            <a-actionbar 
            v-if="actions && actions.filter(el => !el.single && el.active).length > 0"
            :actions="actions.filter(action => !action.single && action.active)"
            @on-bar-action="onBarAction"
            :actionbarColor="actionbarColor"
            :actionbarIsDark="actionbarIsDark"
            :itemSelected="itemSelected"
            :innerSelected="innerSelected"> 
            </a-actionbar>
        </div>
        <div class="text-xs-center pt-2">
            <v-pagination v-if="pagination" total-visible="10" v-model="pagination.page" :length="GetTotalPages"></v-pagination>
        </div>
        <div :class="{'loading-fade':loading}"></div>
    </div>
</template>

<script lang="ts">
import { IEntity } from "ayax-common-types";
import { SortableField } from "ayax-common-types";
import { IPagination } from "ayax-common-types";
import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator";
import vuedraggable from "vuedraggable";
import ActionbarComponent from "../ActionbarComponent/ActionbarComponent.vue";
import TableFilterComponent from "../TableFilterComponent/TableFilterComponent.vue";
import { TableFilterComponentItem } from "../TableFilterComponent/TableFilterComponentItem";
import { TableFilterComponentItemAppearance } from "../TableFilterComponent/TableFilterComponentItemAppearance";
import { TableFilterComponentItemInputType } from "../TableFilterComponent/TableFilterComponentItemInputType";
import { TableComponentAction } from "./TableAction";
import { TableComponentHeader } from "./TableHeader";

@Component({
    components: {
        "a-table-filter": TableFilterComponent,
        "a-actionbar": ActionbarComponent,
        "draggable": vuedraggable
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
    @Prop({default: ""}) title: string;
    @Prop({default: ""}) entity: string;
    @Prop({default: "secondary"}) topbarColor: string;
    @Prop({default: "primary"}) actionbarColor: string;
    @Prop({default: true}) topbarIsDark: boolean;
    @Prop({default: true}) actionbarIsDark: boolean;
    @Prop({default: false}) configure: boolean;
    @Prop({default: false}) showHeaderFiltersByDefault: boolean;
    applyFilterButtonVisibility = true;
    innerSelected: any[] = [];
    totalItems = 1;
    isTableMenuVisible = false;
    showFilters = this.showHeaderFiltersByDefault;
    showFiltersMessage = this.showHeaderFiltersByDefault ? "Показать фильтры" : "Скрыть фильтры";
    showAllFilters = false;
    editableHeaders = [];
    headerSettings = [];
    itemSelected = false;
    tableIdentifier = `${this.title}_${this.entity}`.replace(/\s+/g, "_").replace("-", "_");
    headerFilters: TableFilterComponentItem[] = [];
    topbarFilters: TableFilterComponentItem[] = [];
    allFilters: TableFilterComponentItem[] = [];
    lastQuery: string;
    filterInputTypes: {[name: string]: TableFilterComponentItemInputType} = {};
    
    created() {
        Object.keys(TableFilterComponentItemInputType).forEach(item => {
            this.filterInputTypes[item] = TableFilterComponentItemInputType[item];
        });
        this.headers.forEach(el => {
            this.editableHeaders.push(el);
        });
        this.tableFilters.forEach(el => {
            switch (el.appearance) {
                case TableFilterComponentItemAppearance.Header:
                    this.headerFilters.push(el);
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
                default:
                    break;
            }
        });
        if (this.selected) {
            this.innerSelected = this.selected;
        }
        if (localStorage.getItem(`${this.tableIdentifier}_list_show-filters`) !== "true") {
            this.showFilters = false;
        } else {
            this.showFilters = true;
            this.showFiltersMessage = "Скрыть фильтры";
        }
        if (JSON.parse(localStorage.getItem(`${this.tableIdentifier}_list_show-all-filters`))) {
            this.showAllFilters = true;
        }
        if (localStorage.getItem(`${this.tableIdentifier}_table_settings`) != null) {
            const data = JSON.parse(localStorage.getItem(`${this.tableIdentifier}_table_settings`));
            data.forEach(settingsElement => {
                this.editableHeaders.forEach(headerElement => {
                    if (settingsElement.value === headerElement.value) {
                        headerElement.isVisible = settingsElement.isVisible;
                        headerElement.order = settingsElement.order;
                    }
                });
            });
            this.headerSettings = data;
            this.editableHeaders.sort((a, b) => a.order - b.order);
        }else {
            this.editableHeaders.forEach(el => {
                const newItem = {value: "", isVisible: true, order: 0};
                newItem.value = el.value;
                newItem.isVisible = el.isVisible;
                newItem.order = el.order;
                this.headerSettings.push(newItem);
            });
        }
    }

    applyQuery() {
        if (!(Object.keys(this.$route.query).length === 0 && this.$route.query.constructor === Object)) {
            if (this.$route.query[`${this.tableIdentifier}`] !== undefined) {
                this.tableFilters.forEach(filter => {
                    filter.values = [];
                });
                this.editableHeaders.forEach(header => {
                    if (header.sortable && header.sortBy) {
                        header.sortBy = undefined;
                    }
                });
                JSON.parse(this.$route.query[`${this.tableIdentifier}`]).forEach(query => {
                    if (query.isSort) {
                        this.editableHeaders.forEach(header => {
                            if (header.sortable && query.name === header.value) {
                                if (!header.sortBy) {
                                    header.sortBy = new SortableField();
                                }
                                if (query.isdesc === undefined) {
                                    header.sortBy = undefined;
                                }else {
                                    header.sortBy.isdesc = query.isdesc;
                                }
                            }
                        });
                    }
                    if (query.requestName) {
                        this.tableFilters.forEach(filter => {
                            if (filter.requestName === query.requestName && query.values && query.values.length > 0) {
                                filter.values = query.values;
                                this.applyFilterButtonVisibility = false;
                            }
                        });
                    }  
                });
            }
        }
    }

    @Watch("$route.query")
    onQueryChange() {
        if (!(Object.keys(this.$route.query).length === 0 && this.$route.query.constructor === Object)) {
            if (this.lastQuery !== JSON.stringify(this.$route.query)) {
                this.applyQuery();
                this.applyFilter();
            }
        }else {
            this.editableHeaders.forEach(header => {
                if (header.sortable) {
                    if (header.sortBy) {
                        header.sortBy = undefined;
                    }
                }
            });
            this.tableFilters.forEach(el => {
                el.values = [];
            });
            this.applyFilter();
        }   
    }

    @Watch("innerSelected")
    onSelectChanged(newVal, oldVal) {
        if (newVal !== oldVal) {
            this.$emit("onSelect", newVal.map((item) => {
                return item.id;
            }));
        }
        if (this.innerSelected.length > 0) {
            this.itemSelected = true;
        } else {
            this.itemSelected = false;
        }
    }

    toggleFilters() {
        this.isTableMenuVisible = false;
        if (this.showFilters) {
            this.showFilters = false;
            localStorage.setItem(`${this.tableIdentifier}_list_show-filters`, "false");
            this.showFiltersMessage = "Показать фильтры";
        }else {
            this.showFilters = true;
            localStorage.setItem(`${this.tableIdentifier}_list_show-filters`, "true");
            this.showFiltersMessage = "Скрыть фильтры";
        }
    }

    showAllFiltersBtn() {
        this.showAllFilters = !this.showAllFilters;
        localStorage.setItem(`${this.tableIdentifier}_list_show-all-filters`, JSON.stringify(this.showAllFilters));
    }

    onChangeVisible(item) {
        this.headerSettings.forEach(el => {
            if (el.value === item.value) {
                el.isVisible = item.isVisible;
            }
        });
        localStorage.setItem(`${this.tableIdentifier}_table_settings`, JSON.stringify(this.headerSettings));
    }

    onUpdateDraggable() {
        for (let i = 0; i < this.editableHeaders.length; i++) {
            this.editableHeaders[i].order = i;
            this.headerSettings.forEach(el => {
                if (el.value === this.editableHeaders[i].value) {
                    el.order = this.editableHeaders[i].order;
                }
            });
        }
        localStorage.setItem(`${this.tableIdentifier}_table_settings`, JSON.stringify(this.headerSettings));
    }

    resetTableSettings() {
        localStorage.removeItem(`${this.tableIdentifier}_table_settings`);
        localStorage.removeItem(`${this.tableIdentifier}_list_show-filters`);
        this.showFilters = true;
        this.isTableMenuVisible = false;
        this.showFiltersMessage = "Показать фильтры";
        this.editableHeaders = [];
        this.headers.forEach(el => {
            el.isVisible = true;
            this.editableHeaders.push(el);       
        });
    }

    getFromDictionary(header: TableComponentHeader, id: number | number[]) {
        if (!header || !header.items || header.items.length === 0) {
            return "Нет";
        }
        if (Array.isArray(id)) {
            let concat = "";
            id.forEach(element => {
                const val = header.items.find(x => x.id === element);
                if (val) {
                    concat += val.name ? val.name : val.title + ", ";
                }
            });
            if (concat.length > 1) {
                concat = concat.substring(0, concat.length - 2);
            }
            return concat;
        } else {
            const val = header.items.find(x => x.id === id);
            if (val) {
                return val.name ? val.name : val.title;
            }
        }
        
        return "Нет";
    }

    clearAllFilters() {
        this.allFilters.forEach(filter => {
            filter.values = [];
        });
        this.applyFilter();
    }

    @Emit()
    applyFilter() {
        if (this.pagination.page > 1) {
            this.pagination.page = 1;
        }
        const query = {};
        const filters = [];
        this.tableFilters.forEach(filter => {
            if (filter.values && filter.values.length > 0) {
                filters.push({
                    requestName: filter.requestName,
                    name: filter.name ? filter.name : undefined,
                    values: filter.values
                });
            }
        });
        this.editableHeaders.forEach(header => {
            if (header.sortable && header.sortBy) {
                filters.push({
                    isSort: true,
                    name: header.value, 
                    isdesc: header.sortBy ? header.sortBy.isdesc : undefined
                });
            }
        });
        if (filters.length > 0) {
            query[`${this.tableIdentifier}`] = JSON.stringify(filters);
            this.$router.push({path: this.$route.path, query}); 
        }
        this.lastQuery = JSON.stringify(query);
        this.applyFilterButtonVisibility = false;
    }

    applyFormatterIfExists(header: TableComponentHeader, value) {
        if (header.formatter) {
            return header.formatter(value);
        } else {
            return value;
        }
    }

    get GetTotalPages() {
        return this.pagination.rowsPerPage ? Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage) : 1;
    }

    selectClick(props) {
        if (this.selectableSingle) {
            if (props.selected) {
                props.selected = false;
            } else {
                props.selected = true;
                this.innerSelected = [props.item];
            }
        } else {
            props.selected = !props.selected;
        }
    }

    toggleAll () {
        if (this.innerSelected.length) {
            this.innerSelected = [];
        } else {
            this.innerSelected = this.items.slice();
        }
    }

    changeSort (headerValue: string) {
        this.editableHeaders.forEach((item) => {
            if (item.value === headerValue && item.sortable) {
                if (!item.sortBy) {
                    item.sortBy = new SortableField();
                }
                item.sortBy.isdesc = !item.sortBy.isdesc;
            } else {
                item.sortBy = undefined;
            }
        });
        this.applyFilter();
    }

    currentHeaderFilter(headerValue) {
       return this.headerFilters.filter(filter => filter.name === headerValue)[0];
    }

    @Emit()
    onRowAction(item: IEntity, name: string) {}

    @Emit()
    onBarAction(items: any[], name: string) {}

    firstAction(item: IEntity) {
        if (this.actions && this.actions.filter(x => x.single && x.active).length > 0) {
            this.onRowAction(item, this.actions.filter(x => x.single && x.active)[0].name);
        }
    }
}
</script>

<style>
    .filter-row {
        border-bottom: 1px solid rgba(0,0,0,.12) !important;
        height: 32px !important;
    }
    .header-row {
        border-bottom: none !important;
        height: 32px !important;
    }
    
</style>

<style scoped>
    .actionbarAnchor {
        height: 48px;
    }
    .table-block >>> tbody tr {
        line-height: 12px !important;
        height: 32px !important;
    }
    .sort-apply-btn {
        position: absolute;
        top: -24px;
        height: 20px !important;
    }
    .table-block >>> th.column, .table-block >>> td.column {
        padding: 0 8px !important;
        line-height: 12px;
    }
    th.header, td.header {
        padding: 0 8px !important;
    }
    .table-block >>> th.action, td.action {
        padding: 0 !important;
    }
    .table-block >>> td.action > .v-btn {
        height: 16px !important;
        width: 16px !important;
        margin: 4px 8px !important;
    }
    .table-block >>> th.selectable, td.selectable {
        padding: 0 8px !important;
    }
    .table-block >>> tbody td.selectable {
        padding: 0 8px !important;
    }
    .v-datatable thead th.column {
        position: relative;
    }
    .v-datatable thead th.column.sortable i {
        /* font-size: 12px; */
        position: absolute;
        right: 0px;
    }
    .table-block >>> tbody td {
        height: 32px !important;
    }

    .table-block >>> tbody td.column {
        line-height: 20px;
    }

    .table-loading {
        position: absolute;
        left: 50%;
        top: 50%;
    }
    .loading-fade {
        position: absolute;
        top: 0px;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.1);
    }
    .actionbarFixed {
       position: fixed;
       bottom: 0;
    }
    .slide-enter-active, .slide-leave-active {
        transition: all .3s ease;
    }
    .slide-enter, .slide-leave-to {
        transform: translateY(-5px);
        opacity: 0;
    }
</style>