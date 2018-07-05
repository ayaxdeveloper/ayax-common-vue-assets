import { ICacheService } from "ayax-common-cache";
import { SelectItem } from "ayax-common-types";
import { Component, Inject } from "vue-property-decorator";
import { TableFilterComponentItem } from "../../../src";
import { FormComponentItem } from "../../../src/components/form/form-item";
import { TableComponentHeader } from "../../../src/components/table/table-header";
import { TableFilterComponentItemAppearance } from "../../../src/components/TableFilterComponent/TableFilterComponentItemAppearance";
import { TableFilterComponentItemInputType } from "../../../src/components/TableFilterComponent/TableFilterComponentItemInputType";
import { TableFilterComponentItemType } from "../../../src/components/TableFilterComponent/TableFilterComponentItemType";
import { TestModel } from "../../models/test/test-model";
import BaseListLayout from "../base/base-list/base-list-layout";

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
            requestName: "titlefilter", 
            appearance: TableFilterComponentItemAppearance.AllFilters, 
            name: "title",
            requestType: TableFilterComponentItemType.Like,
            placeholder: "Введите",
            label: "Название улицы",
            largeInput: true
        }),
        new TableFilterComponentItem({
            requestName: "titlefilter", 
            appearance: TableFilterComponentItemAppearance.Topbar, 
            name: "title",
            requestType: TableFilterComponentItemType.Like,
            placeholder: "Введите",
            label: "Наименование"
        }),
        new TableFilterComponentItem({
            requestName: "datefilter", 
            appearance: TableFilterComponentItemAppearance.Topbar, 
            requestType: TableFilterComponentItemType.Range,
            inputType: TableFilterComponentItemInputType.Date,
            label: "Дата создания"

        }),
        new TableFilterComponentItem({
            requestName: "", 
            appearance: TableFilterComponentItemAppearance.AllFilters, 
            requestType: TableFilterComponentItemType.Range,
            inputType: TableFilterComponentItemInputType.Date,
            label: "Дата создания"

        }),
       
        new TableFilterComponentItem({
            requestName: "qqfilter", 
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
            appearance: TableFilterComponentItemAppearance.AllFilters, 
            requestType: TableFilterComponentItemType.In,
            inputType: TableFilterComponentItemInputType.Select,
            selectItems: [
                new SelectItem ({value: 1, text: "Район 1"}),
                new SelectItem ({value: 2, text: "Район 2"}),
                new SelectItem ({value: 3, text: "Район 3"}),
                new SelectItem ({value: 4, text: "Район 4"}),
                new SelectItem ({value: 5, text: "Район 5"}),
            ],
            label: "Выбор районов",
            placeholder: "Выберите"
        }),
        new TableFilterComponentItem({
            requestName: "", 
            appearance: TableFilterComponentItemAppearance.AllFilters, 
            requestType: TableFilterComponentItemType.Range,
            label: "Комнат в доме"
        }),
    ];

    created() {
        
        

        
    }
}