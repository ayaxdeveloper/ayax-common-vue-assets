import { Vue, Component, Inject, Watch } from 'vue-property-decorator';
import BaseListLayout from '../../base/base-list/base-list-layout';
import { TableComponentHeader } from '../../../../src/components/table/table-header';
import { INotificationSettings, INotificationProvider, SelectItem } from 'ayax-common-types';
import { TableFilterComponentItem, TableFilterComponentItemAppearance, TableFilterComponentItemType, TableFilterComponentItemInputType } from '../../../../src';

@Component
export default class ListTestLayout extends BaseListLayout {
    headers = [
        TableComponentHeader.String({value: "id", text: "Id"}),
        TableComponentHeader.String({value: "code", text: "Код"}),
        TableComponentHeader.String({value: "title", text: "Наименование", sortable: true}),
        TableComponentHeader.Date({value: "created", text: "Дата создания"}),
        TableComponentHeader.String({value: 'qq', text: "Статус обращений qq", custom: true}),
        TableComponentHeader.String({value: 'ww', text: "Статус обращений ww", custom: true})
    ];

    toggleLead(item) {
        item.toggleForSlot = !item.toggleForSlot;
        this.toggledItemSlot = null;
        this.toggledItemSlot = item;
    }

    toggledItemSlot = null;

    tableFilters: TableFilterComponentItem[] = [
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
            icon: 'mdi-city',
            placeholder: 'Выбор района'
        })
    ];
}