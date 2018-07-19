<template>
    <a-edit
    title="Редактирование"
    entity="testentity"
    :fields="fields"
    :default-model="defaultModel"
    ></a-edit>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { FormComponentItem } from "../../../../src/Components/FormComponent/FormItem";
import { TestModel } from "../../../Models/Test/TestModel";
import BaseListLayout from "../../BaseLayout/BaseListLayout/BaseListLayout";

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
</script>