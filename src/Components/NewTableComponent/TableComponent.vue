<template>
    <div>
        <v-data-table
            :headers="options.headers"
            :loading="tableLoading"
            :items="items"
            :total-items="1"
            no-data-text="Нет данных"
            hide-actions
            disable-initial-sort
            item-key="id"
            no-results-text="Ничего не найдено"
            class="elevation-1"
        >
        <template slot="headers" slot-scope="props">
            <tr style="height: 36px">
                <th v-for="header in props.headers.filter(x => x.isVisible)" :key="header.value"
                    :class="[header.align == 'right' ? 'text-xs-right' : 'text-xs-left']"
                >
                    {{ header.text.toUpperCase() }}
                </th>
            </tr>
        </template>
        <template slot="items" slot-scope="props">
            <tr>
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
        <div class="text-xs-center mt-2">
            <v-pagination v-if="options.pagination" total-visible="10" 
                v-model="options.pagination.page" :length="getTotalPages()"
            >
            </v-pagination>
        </div>
    </div>
</template>

<script lang="ts">
import { INotificationProvider } from "ayax-common-types";
import Vue from "vue";
import { Component, Inject, Prop, Watch } from "vue-property-decorator";
import { BusyLoadingComponent, TableComponentHeader } from "../..";
import TableOptions from "./TableOptions";

@Component({
    name: "TableComponent",
    components: {
        "a-busy-loading": BusyLoadingComponent
    }
})
export default class TableComponent extends Vue {
    @Inject() notificationProvider: INotificationProvider;
    @Prop({default: () => new TableOptions()}) options: TableOptions;
    
    items = [];
    loading = false;
    tableLoading = true;

    @Watch("options.pagination.page")
    onPageChange(newVal, oldVal) {
        if (newVal !== oldVal) {
            this.loadData();
        }
    }

    @Watch("options.pagination.rowsPerPage")
    onPerPageChange() {
        this.options.pagination.page = 1;
    }

    async created() {
        await this.loadData();
        console.log(this.items);
        this.tableLoading = false;
    }

    async loadData() {
        try {
            this.tableLoading = true;
            await this.options.getData(this.options.pagination).then(resp => {
                this.items = resp.result.data;
                this.options.pagination.totalItems = resp.result.total;
            });
        } catch (e) {
            this.notificationProvider.Error("Не удалось получить данные");
        } finally {
            this.tableLoading = false;
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

<style scoped>

</style>

