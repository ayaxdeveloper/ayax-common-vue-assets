import { Vue, Component, Inject, Watch } from 'vue-property-decorator';
import BaseListLayout from '../base/base-list/base-list-layout';
import { TableComponentHeader } from '../../../src/components/table/table-header';
import { INotificationSettings, INotificationProvider, SelectItem } from 'ayax-common-types';
import { FormComponentItem } from '../../../src/components/form/form-item';
import { TestModel } from '../../models/test/test-model';
import { TableFilterComponentItem } from '../../../src';
import { ICacheService } from 'ayax-common-cache';

@Component
export default class ListDialogTestLayout extends BaseListLayout {
    @Inject() cacheService: ICacheService;
    headers: TableComponentHeader[] = [];
    defaultModel = new TestModel();
    fields: FormComponentItem[] = [];
    async created() {
        this.headers  = [
            TableComponentHeader.String({value: "id", text: "Id", hiddenable: false}),
            TableComponentHeader.String({value: "code", text: "Код"}),
            TableComponentHeader.String({value: "title", text: "Наименование", filter: TableFilterComponentItem.Input("titlefilter"), sortable: true}),
            TableComponentHeader.Date({value: "created", text: "Дата создания", filter: TableFilterComponentItem.InputRange("createdFilter")}),
            TableComponentHeader.String({value: "dictionaryId", text: "Из справочника", dictionary: 'dictionary'})
        ];
        this.fields = [
            FormComponentItem.Hidden({name: "id"}),
            FormComponentItem.Input({title: "Наименование", name: "title"}),
            FormComponentItem.Input({title: "Код", name: "code"}),
            FormComponentItem.Date({title: "Дата создания", name: "created", row: 3}),
        ];
    }
}