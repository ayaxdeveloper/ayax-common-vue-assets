<template>
    <div>
        <a-table :options.sync="options">
            <template slot="qq" slot-scope="{item}">
                <slot name="qq" :item="item">
                    <div>{{item.activeLead.qq}}</div>
                    <template v-if="item.otherLeads.length > 0">
                        <v-flex class="mt-1 mb-1">
                        <template v-if="item.toggleForSlot">
                            <div v-for="lead in item.otherLeads" :key="lead.name">
                                {{ lead.name }}
                            </div>
                        </template>
                        <div class="tableItemSlot" @click.stop="toggleLead(item)">
                            {{item.toggleForSlot ? 'Скрыть' : `Еще ${item.otherLeads.length} обращений`}}
                        </div>
                    </v-flex>
                    </template>
                </slot>
            </template>
            <template slot="ww" slot-scope="{item}">
                <div>{{item.activeLead.ww}}</div>
            </template>
        </a-table>
    </div>
</template>

<script lang="ts">
import { IOperationService, OperationService } from "ayax-common-operation";
import { Pagination, SearchResponse } from "ayax-common-types";
import Vue from "vue";
import Component from "vue-class-component";
import { Inject } from "vue-property-decorator";
import { TableComponentHeader } from "../../src";
import TableOptions from "../../src/Components/NewTableComponent/TableOptions";

@Component
export default class TableTestLayout extends Vue {
    @Inject() operationService: IOperationService;
    options: TableOptions = new TableOptions({
        pagination: new Pagination({page: 1, rowsPerPage: 5}),
        getData: (pagination: Pagination) => this.operationService.post<SearchResponse<any>>("/testentity/search", pagination),
        headers: [
            TableComponentHeader.String({value: "id", text: "Id"}),
            TableComponentHeader.String({value: "code", text: "Код"}),
            TableComponentHeader.String({value: "title", text: "Наименование", sortable: true}),
            TableComponentHeader.Date({value: "created", text: "Дата создания"}),
            TableComponentHeader.String({value: "qq", text: "Статус обращений qq", custom: true}),
            TableComponentHeader.String({value: "ww", text: "Статус обращений ww", custom: true})
        ]
    });

    toggledItemSlot = null;

    toggleLead(item) {
        item.toggleForSlot = !item.toggleForSlot;
        this.toggledItemSlot = null;
        this.toggledItemSlot = item;
    }
}
</script>

<style scoped>
    .tableItemSlot {
        display: inline;
        font-size: 12px;
        text-decoration: underline;
    }
    .tableItemSlot:hover {
        cursor: pointer;
    }
</style>

