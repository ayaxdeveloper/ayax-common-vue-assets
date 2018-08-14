<template>
    <div>
        <a-list-dialog
        entity="testentity"
        title="Test List-Dialog Component"
        :headers="headers"
        :pagination="pagination"
        :actions="actions"
        :default-model="defaultModel"
        :fields="fields"
        :configure="true"
        :tableFilters="tableFilters"
        :showHeaderFiltersByDefault="true">
        <template slot="toolbar-items">
            <v-btn icon>
                <v-icon>mdi-account-plus</v-icon>
            </v-btn>
        </template>
        </a-list-dialog>
    </div>
</template>

<script lang="ts">
import { ICacheService } from "ayax-common-cache";
import { SelectItem } from "ayax-common-types";
import { Component, Inject } from "vue-property-decorator";
import { TableFilterComponentItem } from "../../../src";
import { FormComponentItem } from "../../../src/Components/FormComponent/FormItem";
import { TableComponentHeader } from "../../../src/Components/TableComponent/TableHeader";
import { TableFilterComponentItemAppearance } from "../../../src/Components/TableFilterComponent/TableFilterComponentItemAppearance";
import { TableFilterComponentItemInputType } from "../../../src/Components/TableFilterComponent/TableFilterComponentItemInputType";
import { TableFilterComponentItemType } from "../../../src/Components/TableFilterComponent/TableFilterComponentItemType";
import { TestModel } from "../../Models/Test/TestModel";
import BaseListLayout from "../BaseLayout/BaseListLayout/BaseListLayout";

@Component
export default class ListDialogTestLayout extends BaseListLayout {
    @Inject() cacheService: ICacheService;
    defaultModel = new TestModel();
    headers  = [
        TableComponentHeader.String({value: "id", text: "Id", hiddenable: false}),
        TableComponentHeader.String({value: "code", text: "Код"}),
        TableComponentHeader.String({value: "title", text: "Наименование", sortable: true}),
        TableComponentHeader.Date({value: "created", text: "Дата создания" }),
        TableComponentHeader.String({value: "dictionaryId", text: "Из справочника", dictionaryPromise: this.cacheService.List("dictionary")})
    ];
    fields = [
        FormComponentItem.Hidden({
            name: "id"
        }),
        FormComponentItem.Input({
            title: "Наименование", 
            name: "title"
        }),
        FormComponentItem.Input({
            title: "Код", 
            name: "code"
        }),
        FormComponentItem.Date({
            title: "Дата создания", 
            name: "created"
        }),
        FormComponentItem.Select({
            title: "Из справочника",
            name: "dictionaryId",
            itemsFromPromise: this.cacheService.ListAsSelectItems("dictionary")
        })
    ];
    tableFilters: TableFilterComponentItem[] = this.tableFilters = [
        new TableFilterComponentItem({
            requestName: "streetfilter", 
            appearance: TableFilterComponentItemAppearance.AllFilters, 
            name: "streetFilter",
            requestType: TableFilterComponentItemType.Like,
            placeholder: "Введите",
            label: "Название улицы",
            largeInput: true
        }),
        new TableFilterComponentItem({
            requestName: "titlefilter",
            appearance: TableFilterComponentItemAppearance.Topbar, 
            name: "titleFilter",
            requestType: TableFilterComponentItemType.Like,
            placeholder: "Введите",
            label: "Наименование"
        }),
        new TableFilterComponentItem({
            requestName: "datefilter",
            name: "createdDateFilter",
            appearance: TableFilterComponentItemAppearance.Topbar, 
            requestType: TableFilterComponentItemType.Range,
            inputType: TableFilterComponentItemInputType.Date,
            label: "Дата создания"
        }),
        new TableFilterComponentItem({
            requestName: "date", 
            name: "dateFilter",
            appearance: TableFilterComponentItemAppearance.AllFilters, 
            requestType: TableFilterComponentItemType.Range,
            inputType: TableFilterComponentItemInputType.Date,
            label: "Дата создания"

        }),
       
        new TableFilterComponentItem({
            requestName: "qqfilter", 
            name: "qqFilter",
            appearance: TableFilterComponentItemAppearance.Topbar, 
            requestType: TableFilterComponentItemType.Eq,
            inputType: TableFilterComponentItemInputType.Select,
            selectItems: [
                new SelectItem ({value: 1, text: "Район 1"}),
                new SelectItem ({value: 2, text: "Район 2"}),
                new SelectItem ({value: 3, text: "Район 3"}),
                new SelectItem ({value: 4, text: "Район 4"}),
                new SelectItem ({value: 5, text: "Район 5"}),
            ],
            label: "Выбор района",
            placeholder: "Выберите"
        }),
        new TableFilterComponentItem({
            requestName: "wwfilter",
            name: "wwFilter",
            appearance: TableFilterComponentItemAppearance.AllFilters, 
            requestType: TableFilterComponentItemType.In,
            inputType: TableFilterComponentItemInputType.Select,
            selectItems: [
                new SelectItem ({value: 1, text: "Район 1"}),
                new SelectItem ({value: 2, text: "Район 2"}),
                new SelectItem ({value: 3, text: "Район 3"}),
                new SelectItem ({value: 4, text: "Район 4"}),
                new SelectItem ({value: 5, text: "Район 5"}),
                new SelectItem ({value: 6, text: "Район 6"}),
                new SelectItem ({value: 7, text: "Район 7"}),
                new SelectItem ({value: 8, text: "Район 8"}),
                new SelectItem ({value: 9, text: "Район 9"}),
                new SelectItem ({value: 10, text: "Район 10"}),
                new SelectItem ({value: 11, text: "Район 11"}),
                new SelectItem ({value: 12, text: "Район 12"}),
                new SelectItem ({value: 13, text: "Район 13"}),
                new SelectItem ({value: 14, text: "Район 14"}),
                new SelectItem ({value: 15, text: "Район 15"}),
                new SelectItem ({value: 16, text: "Район 16"}),
                new SelectItem ({value: 17, text: "Район 17"}),
                new SelectItem ({value: 18, text: "Район 18"}),
                new SelectItem ({value: 19, text: "Район 19"}),
                new SelectItem ({value: 20, text: "Район 20"}),
            ],
            label: "Выбор районов",
            placeholder: "Выберите"
        }),
        new TableFilterComponentItem({
            requestName: "roomFilter", 
            name: "roomFilter",
            appearance: TableFilterComponentItemAppearance.AllFilters, 
            requestType: TableFilterComponentItemType.Range,
            label: "Комнат в доме"
        }),
    ];

    created() {
        
        

        
    }
}
</script>

<style>

</style>