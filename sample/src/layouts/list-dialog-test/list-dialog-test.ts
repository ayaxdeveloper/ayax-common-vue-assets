import { Vue, Component, Inject, Watch } from 'vue-property-decorator';
import BaseListLayout from '../base/base-list/base-list-layout';
import { TableComponentHeader } from '../../components/table/table-header';
import { Route } from 'vue-router';
import { ISecurityService } from 'ayax-common-auth';

import { IHttpService, IOperationService, INotificationSettings, INotificationProvider, SelectItem } from 'ayax-common-types';
import { FormComponentItem } from '../../components/form/form-item';
import { TestModel } from '../../models/test/test-model';

@Component
export default class ListDialogTestLayout extends BaseListLayout {
    @Inject() securityService: ISecurityService;
    @Inject() operationService: IOperationService;
    @Inject() notificationProvider: INotificationProvider;
    headers = [
        TableComponentHeader.String({value: "id", text: "Id"}),
        TableComponentHeader.String({value: "code", text: "Код"}),
        TableComponentHeader.String({value: "title", text: "Наименование"}),
        TableComponentHeader.Date({value: "created", text: "Дата создания"})
    ];
    defaultModel = new TestModel();
    fields: FormComponentItem[] = [];
    created() {
        this.init();
    }

    async init() {
        this.fields = [
            FormComponentItem.Input({title: "Наименование", name: "title"}),
            FormComponentItem.Input({title: "Код", name: "code"}),
            FormComponentItem.Date({title: "Дата создания", name: "created"}),
            
        ]
    }
}