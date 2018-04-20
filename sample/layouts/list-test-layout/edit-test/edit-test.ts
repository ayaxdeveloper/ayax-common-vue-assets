import { Vue, Component, Inject, Watch } from 'vue-property-decorator';
import BaseListLayout from '../../base/base-list/base-list-layout';
import { FormComponentItem } from '../../../../src/components/form/form-item';
import { TestModel } from '../../../models/test/test-model';

@Component
export default class EditTestLayout extends BaseListLayout {
    defaultModel = new TestModel();
    fields: FormComponentItem[] = [];

    created() {
        this.fields = [
            FormComponentItem.Hidden({name: "id"}),
            FormComponentItem.Input({title: "Наименование", name: "title"}),
            FormComponentItem.Input({title: "Код", name: "code"}),
            FormComponentItem.Date({title: "Дата создания", name: "created"}),
        ]
    }
}