<template>
    <a-list
            :headers="headers"
            entity='testentity'
            title="Test List Component"
            :selecteable="false"
            :pagination="pagination"
            :actions="actions"
            :toggledItemSlot="toggledItemSlot"
            :configure="true"
            :tableFilters="tableFilters">
            <template slot="qq" slot-scope="{item}">
                <div>{{item.activeLead.qq}}</div>
                <template v-if="item.otherLeads.length > 0">
                    <v-flex class="mt-1 mb-1">
                    <div v-if="item.toggleForSlot" v-for="lead in item.otherLeads" :key="lead.name">
                        {{ lead.name }}
                    </div>
                    <div class="tableItemSlot" @click.stop="toggleLead(item)">
                        {{item.toggleForSlot ? 'Скрыть' : `Еще ${item.otherLeads.length} обращений`}}
                    </div>
                </v-flex>
                </template>
            </template>
            <template slot="ww" slot-scope="{item}">
                <div>{{item.activeLead.ww}}</div>
            </template>
    </a-list>
</template>

<script lang="ts">
import { SelectItem } from "ayax-common-types";
import { Component } from "vue-property-decorator";
import { TableFilterComponentItem } from "../../../../src";
import { TableComponentHeader } from "../../../../src/Components/TableComponent/TableHeader";
import { TableFilterComponentItemAppearance } from "../../../../src/Components/TableFilterComponent/TableFilterComponentItemAppearance";
import { TableFilterComponentItemInputType } from "../../../../src/Components/TableFilterComponent/TableFilterComponentItemInputType";
import { TableFilterComponentItemType } from "../../../../src/Components/TableFilterComponent/TableFilterComponentItemType";
import BaseListLayout from "../../BaseLayout/BaseListLayout/BaseListLayout";

@Component
export default class ListTestLayout extends BaseListLayout {
    headers = [
        TableComponentHeader.String({value: "id", text: "Id"}),
        TableComponentHeader.String({value: "code", text: "Код"}),
        TableComponentHeader.String({value: "title", text: "Наименование", sortable: true}),
        TableComponentHeader.Date({value: "created", text: "Дата создания"}),
        TableComponentHeader.String({value: "qq", text: "Статус обращений qq", custom: true}),
        TableComponentHeader.String({value: "ww", text: "Статус обращений ww", custom: true})
    ];

    toggleLead(item) {
        item.toggleForSlot = !item.toggleForSlot;
        this.toggledItemSlot = null;
        this.toggledItemSlot = item;
    }

    toggledItemSlot = null;

    tableFilters: TableFilterComponentItem[] = [
        new TableFilterComponentItem({
            requestName: "titlefilter", 
            appearance: TableFilterComponentItemAppearance.TopbarHeader, 
            name: "title",
            requestType: TableFilterComponentItemType.Like,
            icon: "search",
            placeholder: "Наименование..."
        }),
        new TableFilterComponentItem({
            requestName: "datefilter", 
            appearance: TableFilterComponentItemAppearance.Topbar, 
            requestType: TableFilterComponentItemType.Range,
            icon: "mdi-calendar",
            inputType: TableFilterComponentItemInputType.Date
        }),
        new TableFilterComponentItem({
            requestName: "qqfilter", 
            appearance: TableFilterComponentItemAppearance.Topbar, 
            requestType: TableFilterComponentItemType.Eq,
            selectItems: [
                new SelectItem ({value: 1, text: "Район 1"}),
                new SelectItem ({value: 2, text: "Район 2"}),
                new SelectItem ({value: 3, text: "Район 3"}),
                new SelectItem ({value: 4, text: "Район 4"}),
                new SelectItem ({value: 5, text: "Район 5"}),
            ],
            icon: "mdi-city",
            placeholder: "Выбор района"
        })
    ];
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