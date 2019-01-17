<template>
    <v-autocomplete v-model="innerValue" :multiple="multiple" :items="groupedItems" v-bind="$attrs">
        <template slot="item" slot-scope="data">
            <template>
                <template v-if="data.item.isGroupItem">
                    <v-list-tile-action
                        v-if="multiple"
                        @click.stop="clickHandlerGroup(data.item)"
                        style="margin-left: -16px; padding-left: 16px; min-width: 48px"
                    >
                        <v-icon
                            :color="checkboxStateGroup(data.item) === 'mdi-checkbox-marked' ? 'primary' : ''"
                        >{{ checkboxStateGroup(data.item) }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content
                        @click.stop="multiple && clickHandlerGroup(data.item)"
                        style="margin-right: -16px; font-weight: 500;"
                        v-text="data.item.text"
                    ></v-list-tile-content>
                </template>
                <template v-else>
                    <v-list-tile-action
                        v-if="multiple"
                        @click="clickHandler(data.item)"
                        :style="{marginLeft: '-16px', paddingLeft: data.item.group ? '46px' : '16px', 
                            minWidth: data.item.group ? '56px' : '48px'}"
                    >
                        <v-icon
                            :color="data.item.selected ?'primary' : ''"
                        >{{ checkboxState(data.item) }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content
                        @click="clickHandler(data.item)"
                        :style="{marginRight: '-16px', 
                            paddingLeft: multiple ? data.item.group ? '8px' : '0px' : data.item.group ? '16px' : '0px'}"
                        v-text="data.item.text"
                    ></v-list-tile-content>
                </template>
            </template>
        </template>
    </v-autocomplete>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component, Emit, Watch } from "vue-property-decorator";
import { SelectItem } from "ayax-common-types";

@Component({
    name: "a-group-select"
})
export default class GroupSelectComponent extends Vue {
    @Prop() value;
    @Prop({ default: () => [] }) items: SelectItem[];
    @Prop({ default: true }) multiple: boolean;

    innerValue = this.multiple ? [] : "";
    groups: Set<string> = new Set();
    groupedItems = [];

    @Watch("innerValue")
    onChange() {
        if (this.multiple) {
            if (this.innerValue.length === 0) {
                this.groupedItems.forEach(item => {
                    item.selected = false;
                });
            }
        }
        this.emitValue(this.innerValue);
    }

    @Emit("input")
    emitValue(value) {}

    created() {
        this.items
            .filter(item => item.group)
            .forEach(item => {
                this.groups.add(item.group);
            });
        if (this.groups.size > 0) {
            this.groups.forEach(group => {
                if (this.multiple) {
                    this.groupedItems.push({ text: group, isGroupItem: true });
                } else {
                    this.groupedItems.push({
                        header: group,
                        isGroupItem: true
                    });
                }
                this.groupedItems = this.groupedItems.concat(
                    this.items.filter(
                        item => item.group && item.group === group
                    )
                );
            });
            this.groupedItems = this.groupedItems.concat(
                this.items.filter(item => !item.group)
            );
        } else {
            this.groupedItems = this.items;
        }
    }

    clickHandler(item: SelectItem) {
        if (this.multiple) {
            item.selected = !item.selected;
        }
    }

    checkboxState(item: SelectItem): string {
        if (item.selected) {
            return "mdi-checkbox-marked";
        }
        return "mdi-checkbox-blank-outline";
    }

    clickHandlerGroup(item) {
        let innerValue = this.innerValue as Array<any>;
        let items = this.groupedItems.filter(el => el.group === item.text);
        let selectedItems = items.filter(el => el.selected);
        if (selectedItems.length <= items.length && selectedItems.length > 0) {
            items.forEach(el => {
                el.selected = false;
                let indexForRemove = innerValue.findIndex(x => x === el.value);
                if (indexForRemove > -1) {
                    innerValue.splice(indexForRemove, 1);
                }
            });
        } else if (selectedItems.length === 0) {
            items.forEach(el => {
                el.selected = true;
                innerValue.push(el.value);
            });
        }
    }

    checkboxStateGroup(item) {
        let items = this.groupedItems.filter(el => el.group === item.text);
        let selectedItems = items.filter(el => el.selected);

        if (selectedItems.length === 0) {
            return "mdi-checkbox-blank-outline";
        } else if (selectedItems.length < items.length) {
            return "mdi-minus-box";
        } else if (selectedItems.length === items.length) {
            return "mdi-checkbox-marked";
        }
        return "";
    }
}
</script>

<style>
.theme--light.v-subheader {
    color: #000;
}
</style>
