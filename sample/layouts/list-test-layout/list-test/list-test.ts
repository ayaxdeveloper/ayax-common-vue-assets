import { Vue, Component, Inject, Watch } from 'vue-property-decorator';
import BaseListLayout from '../../base/base-list/base-list-layout';
import { TableComponentHeader } from '../../../../src/components/table/table-header';
import { INotificationSettings, INotificationProvider, SelectItem } from 'ayax-common-types';
import { TableFilterComponentItem } from '../../../../src';

@Component
export default class ListTestLayout extends BaseListLayout {
    headers = [
        TableComponentHeader.String({value: "id", text: "Id"}),
        TableComponentHeader.String({value: "code", text: "Код"}),
        TableComponentHeader.String({value: "title", text: "Наименование", filter: TableFilterComponentItem.Input("titlefilter"), sortable: true}),
        TableComponentHeader.Date({value: "created", text: "Дата создания"})
    ];
}