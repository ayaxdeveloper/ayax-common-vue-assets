<template>
    <div>
        <a-table :options.sync="options" :slot-toggle="slotToggle">
            <template slot="qq" slot-scope="{item}">
                <div>{{item.activeLead.qq}}</div>
                <template v-if="item.otherLeads.length > 0">
                    <v-flex class="mt-1 mb-1">
                    <template v-if="item.slotToggle">
                        <div v-for="lead in item.otherLeads" :key="lead.name">
                            {{ lead.name }}
                        </div>
                    </template>
                    <div class="tableItemSlot" @click.stop="toggleLead(item)">
                        {{item.slotToggle ? 'Скрыть' : `Еще ${item.otherLeads.length} обращений`}}
                    </div>
                </v-flex>
                </template>
            </template>
            <template slot="ww" slot-scope="{item}">
                <div>{{item.activeLead.ww}}</div>
            </template>
        </a-table>
    </div>
</template>

<script lang="ts">
import { IOperationService, OperationService } from "ayax-common-operation";
import { Pagination, SearchResponse, SelectItem } from "ayax-common-types";
import Vue from "vue";
import Component from "vue-class-component";
import { Inject } from "vue-property-decorator";
import { 
    TableComponentHeader, 
    TableFilterComponentItem, 
    TableFilterComponentItemAppearance, 
    TableFilterComponentItemInputType, 
    TableFilterComponentItemType 
} from "../../src";
import ActionItem from "../../src/Components/ActionbarComponent/ActionItem";
import TableOptions from "../../src/Components/NewTableComponent/TableOptions";

@Component
export default class TableTestLayout extends Vue {
    @Inject() operationService: IOperationService;
    options: TableOptions = new TableOptions({
        title: "Тестовая таблица",
        pagination: new Pagination({page: 1, perPage: 10}),
        getData: (request) => this.operationService.post<SearchResponse<any>>("/testentity/search", request),
        headers: [
            TableComponentHeader.String({value: "id", text: "Id", hiddenable: false}),
            TableComponentHeader.String({value: "code", text: "Код"}),
            TableComponentHeader.String({value: "title", text: "Наименование", sortable: true}),
            TableComponentHeader.String({value: "qq", text: "Статус обращений qq", custom: true}),
            TableComponentHeader.Date({value: "created", text: "Дата создания"}),
            TableComponentHeader.String({value: "ww", text: "Статус обращений ww", custom: true})
        ],
        actions: [
            new ActionItem({
                icon: "mdi-arrow-right", 
                title: "Открыть", 
                name: "show",
                single: true,
                action: (asd) => console.log(asd)
            }),
            new ActionItem({
                icon: "mdi-delete", 
                needSelectedItem: true,
                title: "Удалить", 
                name: "delete",
                action: (asd) => console.log(asd)
            }),
            new ActionItem({
                name: "export", 
                title: "Экспорт", 
                icon: "mdi-upload",
                needSelectedItem: true,
                children: [
                    new ActionItem({
                        name: "Excel", 
                        title: "Экспорт в Excel", 
                        icon: "mdi-upload", 
                        needSelectedItem: true,
                        action: (asd) => console.log(asd)
                    })
                ]
            }),
        ],
        filters: [
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
                label: "Наименование",
                active: true,
            }),
            new TableFilterComponentItem({
                name: "buttomToggleFilter",
                requestName: "buttonToggleFilter", 
                appearance: TableFilterComponentItemAppearance.Topbar, 
                inputType: TableFilterComponentItemInputType.ButtonToggle,
                requestType: TableFilterComponentItemType.In,
                buttonsForToggle: [
                    {text: "Первый", value: "1"},
                    {text: "Второй", value: "2"},
                    {text: "Третий", value: "3"}
                ]
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
                name: "buttomFilter",
                requestName: "buttonFilter", 
                appearance: TableFilterComponentItemAppearance.Topbar, 
                inputType: TableFilterComponentItemInputType.Button,
                buttonText: "Кнопка"
            }),
            new TableFilterComponentItem({
                name: "buttomFilter2",
                requestName: "buttonFilter2", 
                appearance: TableFilterComponentItemAppearance.Topbar, 
                inputType: TableFilterComponentItemInputType.Button,
                buttonText: "Отжата",
                buttonClickedText: "Нажата"
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
            })
        ]
    });

    slotToggle = null;

    toggleLead(item) {
        this.slotToggle = { tableIndex: item.tableIndex, toggleValue: !item.slotToggle }; 
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

