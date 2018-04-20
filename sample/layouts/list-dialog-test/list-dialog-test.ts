import { Vue, Component, Inject, Watch } from 'vue-property-decorator';
import BaseListLayout from '../base/base-list/base-list-layout';
import { TableComponentHeader } from '../../../src/components/table/table-header';
import { INotificationSettings, INotificationProvider, SelectItem } from 'ayax-common-types';
import { FormComponentItem } from '../../../src/components/form/form-item';
import { TestModel } from '../../models/test/test-model';
import { TableFilterComponentItem } from '../../../src';

@Component
export default class ListDialogTestLayout extends BaseListLayout {
    headers = [
        TableComponentHeader.String({value: "id", text: "Id"}),
        TableComponentHeader.String({value: "code", text: "Код"}),
        TableComponentHeader.String({value: "title", text: "Наименование", filter: TableFilterComponentItem.Input("titlefilter"), sortable: true}),
        TableComponentHeader.Date({value: "created", text: "Дата создания"})
    ];
    defaultModel = new TestModel();
    fields: FormComponentItem[] = [];
    created() {
        this.init();
    }

    async init() {
        this.fields = [
            FormComponentItem.Hidden({name: "id"}),
            FormComponentItem.Input({title: "Наименование", name: "title"}),
            FormComponentItem.Input({title: "Код", name: "code"}),
            FormComponentItem.Date({title: "Дата создания", name: "created"}),
            
        ]
    }
}