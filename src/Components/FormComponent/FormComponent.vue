<template>
    <div v-if="formVisible">
        <v-layout row wrap 
        v-for="(row, rowIndex) in computedRows" :key="rowIndex" 
        :class="{hidden : rowIndex == 0 || row.length == 0}"
        >
            <v-flex v-for="(field, fieldIndex) in row" :key="fieldIndex" class="pa-1">
                <template v-if="field.dense">
                    <a-form-control
                    :field="field" @field-update="fieldUpdate"></a-form-control>
                </template>
                <template v-else>
                    <v-flex xs4 v-if="!field.dense">
                        <v-subheader>{{field.title}}</v-subheader>
                    </v-flex>
                    <v-flex xs12>
                        <a-form-control
                        :field="field"></a-form-control>
                    </v-flex>
                </template>
            </v-flex>
        </v-layout>
    </div>
</template>

<script lang="ts">
import { HtmlElementType } from "ayax-common-types";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { FormComponentItem } from "./FormItem";

@Component({
    name: "a-form"
})
export default class FormComponent extends Vue {
    @Prop() fields: FormComponentItem[];
    @Prop() model: any;
    @Prop({default: 0}) clear: number;
    formVisible = false;   

    @Watch("clear")
    clearValues() {
        this.fields.forEach(element => {
            element.model = null;
        });
    }

    async created() {
        this.clearValues();
        if (this.model) {
            Object.keys(this.model).forEach(key => {
                const field = this.fields.find(x => x.name === key);
                if (field) {
                    field.model = this.model[key];
                }
            });
        }
        const fieldsPromises = this.fields.filter(x => x.itemsFromPromise && !x.items).map(x => {
            return new Promise((resolve) => {
                x.itemsFromPromise
                .then(z => {
                    x.items = z;
                    resolve();
                });
            });
        });

        await Promise.all(fieldsPromises);

        this.$emit("after-loaded");

        this.formVisible = true;
    }

    fieldUpdate(fieldName: string, model: any) {
        this.model[fieldName] = model;
        this.$emit("update:model", this.model);
    }

    get computedRows() {
        const rows: {[rowId: number]: FormComponentItem[]} = {};
        let cnt = 1;
        rows[0] = [];
        this.fields.forEach(x => {
            
            if (x.hidden || x.type === HtmlElementType.hidden) {
                rows[0].push(x);
            } else {
                if (x.row === 0) {
                    if (!rows[cnt]) {
                        rows[cnt] = [];
                    }
                    rows[cnt].push(x);
                    cnt++;
                } else {
                    if (!rows[x.row]) {
                        rows[x.row] = [];
                    }
                    rows[x.row].push(x);
                }
            }
        });
        return rows;
    }
}
</script>

<style scoped>
    .hidden {
        display: none;
    }
</style>