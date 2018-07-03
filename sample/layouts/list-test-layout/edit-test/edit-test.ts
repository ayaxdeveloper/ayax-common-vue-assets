import { Component } from "vue-property-decorator";
import { FormComponentItem } from "../../../../src/components/form/form-item";
import { TestModel } from "../../../models/test/test-model";
import BaseListLayout from "../../base/base-list/base-list-layout";

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
        ];
    }
}