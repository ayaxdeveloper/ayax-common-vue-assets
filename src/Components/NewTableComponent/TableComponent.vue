<template>
    <div :id="options.tableName" class="actionbarContainer" style="position: relative">
        <a-table-topbar
            :title="options.title"
            :topbarColor="options.topbarColor"
            :darkTopbar="options.darkTopbar"
            :itemsQuantity="options.pagination.totalItems"
            :filters.sync="options.filters"
            @apply-filter="loadData"
        >
        </a-table-topbar>
        <v-data-table
            :headers="options.headers"
            :items="items"
            :total-items="1"
            no-data-text="Нет данных"
            hide-actions
            disable-initial-sort
            item-key="id"
            no-results-text="Ничего не найдено"
            :class="[
                'elevation-1', 
                'a-table-component', 
                'mainAnchor', 
                'scrollableTable', 
                items.length > 10 ? 'scrollableTableOverflow' : ''
            ]"
            :style="items.length > 10 ? `--maxHeight: ${options.maxHeight}px` : ''"
            v-resize="onTableResize"
        >
        <template slot="headers" slot-scope="props">
            <tr class="fixedTableHeader">
                <th v-if="options.selectable" class="line-action">
                    <v-checkbox v-if="!options.selectableSingle"
                        primary
                        class="pb-1"
                        :input-value="selectedItems.length === items.length && items.length > 0 ? true : false"
                        color="primary"
                        :indeterminate="selectedItems.length > 0 && selectedItems.length !== items.length"
                        hide-details
                        @click.stop="toggleAll()"
                    ></v-checkbox>
                </th>
                <th class="text-xs-center line-action" 
                    v-if="options.actions && options.actions.filter(x => x.single && x.active).length > 0"
                >
                    <v-icon>mdi-dots-horizontal</v-icon>
                </th>
                <th v-for="header in props.headers.filter(x => x.isVisible)" :key="header.value"
                    :class="[header.align == 'right' ? 'text-xs-right' : 'text-xs-left', 'black--text']"
                >
                    {{ header.text.toUpperCase() }}
                </th>
                <v-progress-linear :active="tableLoading" height="2" style="margin: 0px" :indeterminate="true">
                </v-progress-linear>
            </tr>
            <tr :id="options.tableName + '-static-header'" style="height: 36px">
                <th v-if="options.selectable" class="line-action">
                    <v-checkbox v-if="!options.selectableSingle"
                        primary
                        class="pb-1"
                        hide-details
                    ></v-checkbox>
                </th>
                <th class="text-xs-center line-action" 
                    v-if="options.actions && options.actions.filter(x => x.single && x.active).length > 0"
                >
                    <v-icon>mdi-dots-horizontal</v-icon>
                </th>
                <th v-for="header in props.headers.filter(x => x.isVisible)" :key="header.value"
                    :class="[header.align == 'right' ? 'text-xs-right' : 'text-xs-left', 'black--text']"
                    style="color: #fff !important; background-color: #fff !important"
                >
                    {{ header.text.toUpperCase() }}
                </th>
            </tr>
        </template>
        <template slot="items" slot-scope="props">
            <tr :style="{ backgroundColor: options.rowColor(props.item), verticalAlign: 'baseline' }">
                <td v-if="options.selectable" 
                    style="width: 48px; padding: 0 0 0 16px !important; vertical-align: top"
                >
                    <v-checkbox
                        v-model="props.item.selected"
                        primary
                        class="pt-2"
                        hide-details
                        color="primary"
                    ></v-checkbox>
                </td>
                <td class="text-xs-right line-action" 
                    v-if="options.actions && options.actions.filter(x => x.single && x.active).length > 0">
                    <div class="text-xs-center">
                        <v-menu :disabled="selectedItems.length > 0" offset-x offset-y>
                            <v-btn 
                            :disabled="selectedItems.length > 0"
                            color="primary"
                            dark 
                            flat
                            slot="activator"
                            small
                            icon
                            >
                                <v-icon>mdi-dots-horizontal</v-icon>
                            </v-btn>
                            <v-list dark dense>
                                <v-list-tile 
                                    v-for="action in options.actions.filter(action => action.single && action.active)" 
                                    :key="action.name"
                                    @click="executeSingleAction(action.name, props.item)"
                                >
                                    <v-list-tile-action v-if="action.icon">
                                        <v-icon>{{action.icon}}</v-icon>
                                    </v-list-tile-action>
                                    <v-list-tile-title v-if="action.title && !action.onlyIcon">
                                        {{ action.title }}
                                    </v-list-tile-title>
                                </v-list-tile>
                            </v-list>
                        </v-menu>
                    </div>
                </td>
                <td v-for="(header, index) in options.headers.filter(x => x.isVisible)" :key="index"
                    :class="[header.align == 'right' ? 'text-xs-right' : 'text-xs-left']"
                >
                    <slot :name="header.value" :item="props.item">
                        <template 
                            v-for="propertyname in Object.keys(props.item).filter(x => x === options.headers[index].value)"
                        >
                            <template v-if="options.headers[index].items">
                                {{getFromDictionary(options.headers[index], props.item[propertyname])}}
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
                v-if="options.actions && options.actions.filter(el => !el.single && el.active).length > 0"
                :actions="options.actions.filter(action => !action.single && action.active)"
                :selectedItems="selectedItems"
                :actionbarColor="options.actionbarColor"
                :darkActionbar="options.darkActionbar"
            >
            </a-actionbar>
        </div>
        <div style="position: relative" class="text-xs-center mt-2">
            <v-pagination v-if="options.pagination" total-visible="10" 
                v-model="options.pagination.page" :length="getTotalPages()"
            >
            </v-pagination>
            <v-layout class="custom-pagination">
                <div class="pt-2 pr-3">Cтрок на странице: </div>
                <v-select v-model="options.pagination.rowsPerPage" 
                    style="margin-top: 4px; width: 50px" dense :items="customPagination"
                >
                </v-select>
            </v-layout>
        </div>
    </div>
</template>

<script lang="ts">
import { INotificationProvider } from "ayax-common-types";
import Vue from "vue";
import { Component, Inject, Prop, Watch } from "vue-property-decorator";
import resize from "vue-resize-directive";
import { ActionbarComponent, BusyLoadingComponent, TableComponentHeader } from "../..";
import TableOptions from "./TableOptions";
import TableTopbarComponent from "./TableTopbarComponent.vue";

@Component({
    name: "TableComponent",
    components: {
        "a-table-topbar": TableTopbarComponent,
        "a-actionbar": ActionbarComponent,
        "a-busy-loading": BusyLoadingComponent
    },
    directives: {
        resize
    }
})
export default class TableComponent extends Vue {
    @Inject() notificationProvider: INotificationProvider;
    @Prop({default: () => new TableOptions()}) options: TableOptions;
    @Prop({default: () => ({ tableIndex: null, toggleValue: false })}) slotToggle;
    
    items = [];
    loading = false;
    tableLoading = true;
    fixedTableHeader: HTMLElement;
    customPagination = [10, 20, 30, 50, 100];

    get selectedItems() {
        return this.items.filter(item => item.selected);
    }

    @Watch("options.pagination.page")
    onPageChange(newVal, oldVal) {
        if (newVal !== oldVal) {
            this.loadData();
        }
    }

    @Watch("options.pagination.rowsPerPage")
    onPerPageChange() {
        if (this.options.pagination.page === 1) {
            this.loadData();
        } else {
            this.options.pagination.page = 1;
        }
    }

    @Watch("slotToggle")
    onToggle(val) {
        if (val.tableIndex !== null) {
            this.items[val.tableIndex].slotToggle = val.toggleValue;
        }
    }

    async created() {
        await this.loadData();
    }

    mounted() {
        this.fixedTableHeader = document.querySelector(`#${this.options.tableName} .fixedTableHeader`) as HTMLElement;
        const tableScroll = document.querySelector(`#${this.options.tableName} .v-table__overflow`) as HTMLElement;

        tableScroll.addEventListener("scroll", () => this.onTableScroll(tableScroll.scrollTop));
    }

    executeSingleAction(actionName: string, item: any) {
        if (actionName) {
            const singleAction = this.options.actions.find(action => action.name === actionName);
            
            if (singleAction) {
                singleAction.action(item);
            }
        }
    }

    resizeFixedHeader() {
        const staticHeader = document
            .querySelector(`#${this.options.tableName} #${this.options.tableName + "-static-header"}`)
            .querySelectorAll("th");

        const header = document
            .querySelectorAll(`#${this.options.tableName} .fixedTableHeader th`) as HTMLCollectionOf<HTMLElement>;
        
        for (let i = 0; i < staticHeader.length; i++) {
            header[i].style.width = `${staticHeader[i].offsetWidth}px`;
            header[i].style.minWidth = `${staticHeader[i].offsetWidth}px`;
        }
    }

    onTableScroll(scrollTop) {
        this.fixedTableHeader.style.top = `${scrollTop}px`;
    }

    onTableResize() {
        this.resizeFixedHeader();
    }

    async loadData() {
        try {
            this.tableLoading = true;
            await this.options.getData(this.options.pagination).then(resp => {
                for (let i = 0; i < resp.result.data.length; i++) {
                    resp.result.data[i].tableIndex = i;
                    resp.result.data[i].slotToggle = false;
                    resp.result.data[i].selected = false;
                }
                this.items = resp.result.data;
                this.options.pagination.totalItems = resp.result.total;
            });
        } catch (e) {
            this.notificationProvider.Error("Ошибка получения данных");
            console.error(e);
        } finally {
            this.tableLoading = false;
        }
    }

    // AddFilter(request) {
    //     const filteredRequest = {...request};
    //     this.tableFilters.filter(x => x.values.length > 0)
    //     .forEach((filter) => {           
    //         const filters = filter.FormRequestFilters();
    //         if (filters) {
    //             filteredRequest[filter.requestName] = filters;
    //         }
    //     });
    //     this.headers.filter(x => x.sortBy).forEach((header) => {
    //         filteredRequest[`${header.value}sort`] = header.sortBy;
    //     });
    //     return filteredRequest; 
    // }

    toggleAll() {
        if (this.selectedItems.length === 0) {
            this.items.forEach(item => item.selected = true);
        } else {
            this.items.forEach(item => item.selected = false);
        }
    }

    applyFormatterIfExists(header: TableComponentHeader, value) {
        if (header.formatter) {
            return header.formatter(value);
        } else {
            return value;
        }
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

    getTotalPages() {
        return this.options.pagination.rowsPerPage && this.options.pagination.totalItems ? 
            Math.ceil(this.options.pagination.totalItems / this.options.pagination.rowsPerPage) : 1;
    }
}
</script>

<style>
    .scrollableTable .v-table__overflow {
        max-height: var(--maxHeight);
        position: relative;
    }
    .scrollableTableOverflow .v-table__overflow {
        overflow-y: scroll;
    }
    .a-table-component table.v-table tbody td:first-child, 
    .a-table-component table.v-table tbody td:not(:first-child), 
    .a-table-component table.v-table tbody th:first-child, 
    .a-table-component table.v-table tbody th:not(:first-child), 
    .a-table-component table.v-table thead td:first-child, 
    .a-table-component table.v-table thead td:not(:first-child), 
    .a-table-component table.v-table thead th:first-child, 
    .a-table-component table.v-table thead th:not(:first-child) {
        padding: 0 8px;
    }
</style>


<style scoped>
    .a-table-component td {
        height: auto;
    }
    .line-action {
        width: 48px;
        padding: 0 !important;
        padding-left: 16px !important; 
    }
    .fixedTableHeader {
        height: 36px;
        background-color: #fff;
        border-bottom: 1px solid #ccc;
        position: absolute;
        left: 0;
        z-index: 1;
    }
    .fixedTableHeader th {
        height: 36px;
    }
    .custom-pagination {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
    }
    .actionbarAnchor {
        height: 48px;
    }
</style>

