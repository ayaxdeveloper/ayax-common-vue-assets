<template>
    <v-autocomplete
        :value="true"
        v-model="value"
        :multiple="multiple"
        :items="items"
        v-bind="$attrs"
    >
        <!-- <template slot="item" slot-scope="data">
            <template>
                <v-list-tile-action
                    v-if="multiple"
                    @click.stop="clickHandler(data.item)"
                    style="margin-left: -16px; padding-left: 16px;"
                >
                    <v-icon
                        @click.stop="clickHandler(data.item)"
                        :color="data.item.selected ?'primary' : ''"
                    >{{ checkboxState(data.item) }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content
                    @click.stop="clickHandler(data.item)"
                    style="margin-right: -16px"
                    v-text="data.item.text"
                ></v-list-tile-content>
            </template>
        </template>-->
    </v-autocomplete>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component, Emit } from "vue-property-decorator";
import { SelectItem } from "ayax-common-types";

@Component({
    name: "a-group-select"
})
export default class GroupSelectComponent extends Vue {
    @Prop() value;
    @Prop({ default: () => [] }) items: SelectItem[];
    @Prop({ default: false }) multiple: boolean;

    asd = true;

    clickHandler(item: SelectItem) {
        this.asd = false;
        if (this.multiple) {
            item.selected = !item.selected;
            if (item.selected) {
                this.value.push(item.value);
            } else {
                let indexForRemove = this.value.findIndex(
                    x => x === item.value
                );

                if (indexForRemove > -1) {
                    this.value.splice(indexForRemove, 1);
                }
            }
        } else {
            this.emitValue(item.value);
        }
    }

    checkboxState(item: SelectItem): string {
        if (item.selected) {
            return "mdi-checkbox-marked";
        }
        return "mdi-checkbox-blank-outline";
    }

    clear() {
        if (this.multiple) {
            this.items.forEach(item => {
                item.selected = false;
            });
            this.emitValue([]);
        } else {
            this.emitValue(null);
        }
    }

    @Emit("input")
    emitValue(value) {}
}
</script>

<style scoped>
</style>
