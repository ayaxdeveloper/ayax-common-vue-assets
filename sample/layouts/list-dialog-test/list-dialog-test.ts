import { Vue, Component, Inject, Watch } from 'vue-property-decorator';
import BaseListLayout from '../base/base-list/base-list-layout';
import { TableComponentHeader } from '../../../src/components/table/table-header';
import { INotificationSettings, INotificationProvider, SelectItem } from 'ayax-common-types';
import { FormComponentItem } from '../../../src/components/form/form-item';
import { TestModel } from '../../models/test/test-model';
import { TableFilterComponentItem, TableFilterComponentItemAppearance, TableFilterComponentItemType, TableFilterComponentItemInputType } from '../../../src';
import { ICacheService } from 'ayax-common-cache';

@Component
export default class ListDialogTestLayout extends BaseListLayout {
    @Inject() cacheService: ICacheService;
    headers: TableComponentHeader[] = [];
    defaultModel = new TestModel();
    fields: FormComponentItem[] = [];
    tableFilters: TableFilterComponentItem[] = this.tableFilters = [
        new TableFilterComponentItem({
            requestName: 'titlefilter', 
            appearance: TableFilterComponentItemAppearance.TopbarHeader, 
            name:'title',
            requestType: TableFilterComponentItemType.InputLike,
            icon: 'search',
            placeholder: 'Наименование...'
        }),
        new TableFilterComponentItem({
            requestName: 'datefilter', 
            appearance: TableFilterComponentItemAppearance.Topbar, 
            requestType: TableFilterComponentItemType.InputRange,
            icon: 'mdi-calendar',
            inputType: TableFilterComponentItemInputType.Date
        }),
        new TableFilterComponentItem({
            requestName: 'dictionaryfilter', 
            appearance: TableFilterComponentItemAppearance.Header, 
            name: 'dictionaryId',
            requestType: TableFilterComponentItemType.SelectMultiple,
            placeholder: 'Справочник',
            selectItemsFromPromise: this.cacheService.ListAsSelectItems("dictionary")
            // selectItemsFromDictionary: "dictionary"
            // selectItems: dictionary
        }),
        new TableFilterComponentItem({
            requestName: 'qqfilter', 
            appearance: TableFilterComponentItemAppearance.Topbar, 
            requestType: TableFilterComponentItemType.SelectSingle,
            selectItems: [
                new SelectItem ({value: 1, text: 'Район 1'}),
                new SelectItem ({value: 2, text: 'Район 2'}),
                new SelectItem ({value: 3, text: 'Район 3'}),
                new SelectItem ({value: 4, text: 'Район 4'}),
                new SelectItem ({value: 5, text: 'Район 5'}),
            ],
            placeholder: 'Выбор района'
        }),
        new TableFilterComponentItem({
            requestName: 'wwfilter', 
            appearance: TableFilterComponentItemAppearance.AllFilters, 
            requestType: TableFilterComponentItemType.SelectMultiple,
            selectItems: [
                new SelectItem ({value: 1, text: 'Район 1'}),
                new SelectItem ({value: 2, text: 'Район 2'}),
                new SelectItem ({value: 3, text: 'Район 3'}),
                new SelectItem ({value: 4, text: 'Район 4'}),
                new SelectItem ({value: 5, text: 'Район 5'}),
            ],
            placeholder: 'Выбор районов'
        })
    ];

    created() {
        
        this.headers  = [
            TableComponentHeader.String({value: "id", text: "Id", hiddenable: false}),
            TableComponentHeader.String({value: "code", text: "Код"}),
            TableComponentHeader.String({value: "title", text: "Наименование", sortable: true}),
            TableComponentHeader.Date({value: "created", text: "Дата создания" }),
            TableComponentHeader.String({value: "dictionaryId", text: "Из справочника", dictionaryPromise: this.cacheService.List("dictionary")})
        ];
        this.fields = [
            FormComponentItem.Hidden({name: "id"}),
            FormComponentItem.Input({title: "Наименование", name: "title"}),
            FormComponentItem.Input({title: "Код", name: "code"}),
            FormComponentItem.Date({title: "Дата создания", name: "created", row: 3}),
        ];

        
    }
}