<template>
    <div
        v-shortkey.once="{applyFilter: ['enter']}"
        @shortkey="shortkeyHandler"
        v-if="filter.active"
    >
        <div
            v-if="filter.appearance != filterAppearance['AllFilters'] || filter.inputType == filterInputTypes['Button']"
            style="position: relative"
        >
            <v-btn
                v-if="applyFilterButton"
                class="table-filter-apply-btn_topbar"
                color="blue darken-1"
                small
                @click="applyFilter"
            >Применить</v-btn>
        </div>
        <template>
            <v-flex
                class="filter"
                v-if="(filter.requestType == filterTypes['Eq'] || filter.requestType == filterTypes['Like']) && filter.inputType == filterInputTypes['Text']"
            >
                <div class="filterLabel">{{ filter.label }}</div>
                <v-text-field
                    class="filterInput"
                    :name="filter.requestName"
                    :placeholder="filter.placeholder"
                    :prepend-icon="filter.icon"
                    v-model="filter.values[0]"
                    clearable
                    single-line
                ></v-text-field>
            </v-flex>
            <template v-else-if="filter.requestType == filterTypes['Range']">
                <v-flex class="filter" v-if="filter.inputType == filterInputTypes['Date']">
                    <div class="filterLabel">{{ filter.label }}</div>
                    <el-date-picker
                        :class="['date-range']"
                        style="margin-top: 1px"
                        v-model="filter.values"
                        type="daterange"
                        format="dd.MM.yyyy"
                        value-format="yyyy.MM.dd"
                        size="small"
                        clearable
                        unlink-panels
                        :picker-options="{firstDayOfWeek: 1}"
                        align="center"
                        start-placeholder="Начало"
                        end-placeholder="Конец"
                    ></el-date-picker>
                </v-flex>
                <template v-else>
                    <v-flex class="filter">
                        <div class="filterLabel">{{ filter.label }}</div>
                        <div style="display: flex; flex-direction: row">
                            <v-text-field
                                class="filterInput filterInputRange"
                                :name="filter.requestName"
                                single-line
                                placeholder="От"
                                return-masked-value
                                :mask="getMask()"
                                clearable
                                v-model="filter.values[0]"
                            ></v-text-field>
                            <div class="pa-2">-</div>
                            <v-text-field
                                class="filterInput filterInputRange"
                                @input="applyFilterButton = filter.values[1]"
                                :name="filter.requestName"
                                single-line
                                placeholder="До"
                                return-masked-value
                                :mask="getMask()"
                                clearable
                                v-model="filter.values[1]"
                            ></v-text-field>
                        </div>
                    </v-flex>
                </template>
            </template>
            <v-flex
                class="filter"
                v-else-if="filter.requestType == filterTypes['Eq'] && filter.inputType == filterInputTypes['Select']"
            >
                <div class="filterLabel">{{ filter.label }}</div>
                <v-autocomplete
                    :id="filter.requestName"
                    class="filterInput selectFilter"
                    :name="filter.requestName"
                    :items="filter.selectItems"
                    v-model="filter.values[0]"
                    :prepend-icon="filter.icon"
                    clearable
                    :placeholder="filter.placeholder"
                    dense
                    single-line
                    no-data-text="Нет совпадений"
                ></v-autocomplete>
            </v-flex>
            <v-flex
                class="filter"
                v-else-if="filter.requestType == filterTypes['In'] && filter.inputType == filterInputTypes['Select']"
            >
                <div class="filterLabel">{{ filter.label }}</div>
                <v-autocomplete
                    :id="filter.requestName"
                    :name="filter.requestName"
                    :items="filter.selectItems"
                    class="filterInput selectFilter"
                    v-model="filter.values"
                    :prepend-icon="filter.icon"
                    clearable
                    :placeholder="filter.placeholder"
                    dense
                    multiple
                    single-line
                    no-data-text="Нет совпадений"
                >
                    <template slot="selection" slot-scope="data">
                        <span class="selectionValue pt-2">
                            Выбрано
                            <span class="selectionChip">{{ filter.values.length }}</span>
                        </span>
                    </template>
                    <template slot="item" slot-scope="data">
                        <template>
                            <v-list-tile-action
                                :class="[`${filter.requestName}`]"
                                style="margin-left: -16px; padding-left: 16px"
                            >
                                <v-icon
                                    :class="[data.item.selected ? 'selectPrimary' : 'selectGray']"
                                >{{ data.item.selected === true ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content
                                style="margin-right: -16px; padding-right: 16px"
                                :class="[data.item.selected ? 'selectPrimary' : 'selectBlack']"
                                v-text="data.item.text"
                            ></v-list-tile-content>
                        </template>
                    </template>
                </v-autocomplete>
            </v-flex>
            <v-flex
                class="pb-2 filter"
                style="height: 48px"
                v-else-if="filter.requestType == filterTypes['Eq'] && filter.inputType == filterInputTypes['Button']"
            >
                <template v-if="filter.label">
                    <v-layout row class="filterLabel">{{filter.label}}</v-layout>
                    <v-layout row style="margin-top:5px">
                        <v-btn
                            style="height: 24px"
                            small
                            light
                            @click="changeBtnValue()"
                            :class="['filterBtn', filter.values[0] == true || filter.buttonClickedText ? 'clicked' : 'released']"
                        >{{ filter.buttonClickedText && filter.values[0] == true ? filter.buttonClickedText : filter.buttonText }}</v-btn>
                    </v-layout>
                </template>
                <template v-else>
                    <v-btn
                        style="height: 36px; margin-top:5px"
                        small
                        light
                        @click="changeBtnValue()"
                        :class="['filterBtn', filter.values[0] == true || filter.buttonClickedText ? 'clicked' : 'released']"
                    >{{ filter.buttonClickedText && filter.values[0] == true ? filter.buttonClickedText : filter.buttonText }}</v-btn>
                </template>
            </v-flex>
            <v-flex
                class="pb-2 filter"
                style="height: 48px"
                v-else-if="(filter.requestType == filterTypes['In'] || filter.requestType == filterTypes['Eq']) && filter.inputType == filterInputTypes['ButtonToggle']"
            >
                <template v-if="filter.label">
                    <v-layout row class="filterLabel">{{filter.label}}</v-layout>
                    <v-layout row style="margin-top:5px">
                        <v-btn-toggle
                            v-model="filter.values"
                            light
                            :multiple="filter.requestType == filterTypes['In']"
                            class="filterBtnToggle"
                        >
                            <v-btn
                                style="height: 24px"
                                small
                                flat
                                v-for="(btn, index) in filter.selectItems"
                                :key="`${filter.name}${index}`"
                                :value="btn.value"
                                class="filterBtn"
                            >{{btn.text}}</v-btn>
                        </v-btn-toggle>
                    </v-layout>
                </template>
                <template v-else>
                    <v-btn-toggle
                        v-model="filter.values"
                        light
                        :multiple="filter.requestType == filterTypes['In']"
                        class="filterBtnToggle"
                        style="margin-top:5px"
                    >
                        <v-btn
                            style="height: 36px"
                            small
                            flat
                            v-for="(btn, index) in filter.selectItems"
                            :key="`${filter.name}${index}`"
                            :value="btn.value"
                            class="filterBtn"
                        >{{btn.text}}</v-btn>
                    </v-btn-toggle>
                </template>
            </v-flex>
            <v-flex
                class="pb-2 filter"
                style="height: 46px"
                v-else-if="filter.requestType == filterTypes['Eq'] && filter.inputType == filterInputTypes['ButtonDropdown']"
            >
                <template v-if="filter.label">
                    <v-layout row class="filterLabel">{{filter.label}}</v-layout>
                    <v-layout row style="margin-top:5px">
                        <v-menu offset-y light>
                            <v-btn style="height: 24px" slot="activator" light color="default">
                                {{ButtonDropdownText}}
                                <v-icon style="margin-left:8px;">mdi-chevron-down</v-icon>
                            </v-btn>
                            <v-list dense>
                                <v-list-tile @click="clickDropdown(null)">
                                    <v-list-tile-title>Не выбрано</v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile
                                    v-for="(btn, index) in filter.selectItems"
                                    :key="`${filter.name}${index}`"
                                    @click="clickDropdown(btn.value)"
                                >
                                    <v-list-tile-title>{{ btn.text }}</v-list-tile-title>
                                </v-list-tile>
                            </v-list>
                        </v-menu>
                    </v-layout>
                </template>
                <template v-else>
                    <v-menu offset-y light>
                        <v-btn style="height: 36px" slot="activator" light color="default">
                            {{ButtonDropdownText}}
                            <v-icon style="margin-left:8px;">mdi-chevron-down</v-icon>
                        </v-btn>
                        <v-list dense>
                            <v-list-tile
                                v-for="(btn, index) in filter.selectItems"
                                :key="`${filter.name}${index}`"
                                @click="clickDropdown(btn.value)"
                            >
                                <v-list-tile-title>{{ btn.text }}</v-list-tile-title>
                            </v-list-tile>
                        </v-list>
                    </v-menu>
                </template>
            </v-flex>
            <v-flex
                class="pr-2 pb-2 switcher"
                style="width: 180px; height: 48px; padding-top: 9px"
                v-else-if="filter.requestType == filterTypes['Eq'] && filter.inputType == filterInputTypes['Checkbox']"
            >
                <v-checkbox
                    style="margin-top: 0px"
                    :label="filter.label"
                    v-model="filter.values[0]"
                ></v-checkbox>
            </v-flex>
        </template>
    </div>
</template>

<script lang="ts">
import { SelectItem } from "ayax-common-types";
import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator";
import { TableComponentHeader, TableComponentHeaderType } from "../TableComponent/TableHeader";
import { TableFilterComponentItem } from "./TableFilterComponentItem";
import { TableFilterComponentItemAppearance } from "./TableFilterComponentItemAppearance";
import { TableFilterComponentItemInputType } from "./TableFilterComponentItemInputType";
import { TableFilterComponentItemType } from "./TableFilterComponentItemType";

@Component({
    name: "a-table-filter"
})
export default class TableFilterComponent extends Vue {
    @Prop({required: true}) filter: TableFilterComponentItem;
    @Prop() value: any;
    @Prop({default: 0}) index: number;
    @Prop({default: true}) applyFilterButtonVisibility: boolean;
    @Prop({default: "grey lighten-1"}) color: string;
    @Prop({default: false}) appliedFromQuery: boolean;
    focus: false;
    filterTypes: {[name: string]: TableFilterComponentItemType} = {};
    headerTypes: {[name: string]: TableComponentHeaderType} = {};
    filterInputTypes: {[name: string]: TableFilterComponentItemInputType} = {};
    filterAppearance: {[name: string]: TableFilterComponentItemAppearance} = {};
    searchInput: Function;
    applyFilterButton = false;
    buttonText = "";
    initialSelectItems: SelectItem[] = [];

    created() {
        Object.keys(TableFilterComponentItemType).forEach(item => {
            this.filterTypes[item] = TableFilterComponentItemType[item];
        });
        Object.keys(TableComponentHeaderType).forEach(item => {
            this.headerTypes[item] = TableComponentHeaderType[item];
        });
        Object.keys(TableFilterComponentItemInputType).forEach(item => {
            this.filterInputTypes[item] = TableFilterComponentItemInputType[item];
        });
        Object.keys(TableFilterComponentItemAppearance).forEach(item => {
            this.filterAppearance[item] = TableFilterComponentItemAppearance[item];
        });
        if (this.filter.selectItems) {
            this.initialSelectItems = JSON.parse(JSON.stringify(this.filter.selectItems));
        }
    }

    changeBtnValue() {
        this.filter.values[0] = !this.filter.values[0];
        if (this.filter.buttonClickedText) {
            if (this.filter.values[0] === true) {
                this.buttonText = this.filter.buttonClickedText;
            } else {
                this.buttonText = this.filter.buttonText;
            }
        }
        this.applyFilter();
    }
    get ButtonDropdownText() {
        const search = this.filter.selectItems.find(x => x.value == this.filter.values[0]);
        return search ? search.text : "Выберите";
    }

    clickDropdown(value: any) {
        this.filter.values = [];
        this.filter.values.push(value);
    }

    @Watch("filter.values")
    onFilterValuesChange(newVal: any, oldVal: any) {
        if (this.filter.requestType === this.filterTypes["In"] && this.filter.inputType === this.filterInputTypes["Select"]) {
            this.filter.selectItems.forEach(selectItem => {
                const selectedValue = this.filter.values.find(x => x === selectItem.value);
                if (selectedValue) {
                    selectItem.selected = true;
                } else {
                    selectItem.selected = false;
                }
            });
        }
        if (this.filter.inputType === this.filterInputTypes["Date"]) {
            if (!this.filter.values) {
                this.filter.values = [undefined];
            }
        }
        if (newVal) {
            if (this.applyFilterButtonVisibility === false && newVal[0] === "") {
                this.applyFilterButton = false;
            } else {
                if (!this.appliedFromQuery) {
                    this.applyFilterButton = true;
                }
            }
        } else {
            this.applyFilterButton = false;
        }
    }

    @Watch("applyFilterButtonVisibility")
    onApplyButtonChange(value) {
       if (!value) {
           this.applyFilterButton = false;
       }
    }

    getMask() {

    }

    getHint() {
        switch (this.filter.requestType) {
            case TableFilterComponentItemType.Eq:
            return "Точное совпадение";
            case TableFilterComponentItemType.Like:
            return "Содержит";
            case TableFilterComponentItemType.In:
            return "Выбор нескольких"; 
            default:
            return null;
        }
    }

    shortkeyHandler(key : any) {
        if (!key || !key.srcKey) {
            return;
        }
        switch (key.srcKey) {
            case "applyFilter":
                this.applyFilter();
            break;
            default:
            break;
        }
    }

    @Emit()
    emitFilter(filterName: string) {}

    applyFilter() {  
        this.emitFilter(this.filter.name);
        this.applyFilterButton = false;
    }

}
</script>

<style scoped>
.selectionValue:not(:first-child) {
    display: none;
}
.selectBlack {
    color: #000 !important;
}
.selectPrimary {
    color: #1976d2 !important;
}
.selectGray {
    color: #757575 !important;
}
.selectionChip {
    background-color: #fff;
    padding: 0 4px 0 4px;
    border-radius: 4px;
    color: #000;
    font-weight: bold;
    font-size: 13px;
    text-align: center;
    height: 16px;
    margin-left: 6px;
    margin-right: 10px;
}
.filter {
    height: 48px;
    padding-top: 1px;
}
.filterLabel {
    height: 12px;
    font-size: 13px;
    color: #fff;
}
.filterInput {
    width: 100%;
}
.filterInputRange {
    width: 82px;
}
.table-filter-apply-btn_header {
    position: absolute;
    top: -24px;
    height: 20px !important;
    left: 0;
}
.table-filter-apply-btn_topbar {
    position: absolute;
    top: -16px;
    height: 20px !important;
    left: 0;
}
</style>

<style>
.filterBtnToggle {
}

.filterBtn.released {
    color: rgba(0, 0, 0, 0.4) !important;
}

.filterBtn.clicked {
    color: rgba(0, 0, 0, 0.87) !important;
    background-color: rgb(221, 221, 221) !important;
}

.closeFilterMenuBtn {
    padding: 2px 4px 4px;
    text-align: right;
    font-size: 13px;
    z-index: 1;
    background-color: #fff;
}
.closeFilterMenuBtnText:hover {
    cursor: pointer;
    color: #1976d2;
}
.filter .v-input {
    font-size: 14px;
    margin-top: 0px;
}
.filter .v-text-field {
    padding-top: 0px;
}
.filter .v-text-field input {
    padding: 0px;
    padding-top: 8px;
}
.filter .selectFilter .v-input__slot {
    height: 28px;
    text-overflow: clip;
    white-space: nowrap;
    max-height: 28px;
}
.filter .selectFilter .v-input__control {
    overflow: hidden;
}
.switcher .v-input__slot label {
    font-size: 13px;
}

.filter .el-input__inner {
    background-color: inherit;
    border-radius: 0px;
    height: 28px;
    border: none;
    border-bottom: 1px solid #c5c5c5;
    color: white;
    padding: 0px;
    width: 100%;
}
.filter .el-date-editor .el-range__icon {
    display: none;
}
.filter .el-date-editor .el-range-input {
    color: inherit;
    font-size: 14px;
    padding-top: 6px;
}
.filter .el-date-editor .el-range-input:first-of-type {
    text-align: left;
}
.filter .el-date-editor .el-range-input:last-of-type {
    text-align: right;
}
.filter .el-date-editor .el-range-separator {
    color: inherit;
    padding: 0px;
}
.filter .el-date-editor .el-range__close-icon {
    width: 20px;
    padding-top: 4px;
}
</style>
