<template>
    <div v-shortkey.once="{applyFilter: ['enter']}" @shortkey="shortkeyHandler">
        <div v-if="filter.appearance != filterAppearance['AllFilters'] || filter.inputType == filterInputTypes['Button']" style="position: relative">
            <v-btn 
            v-if="applyFilterButton"
            :class="[header == null ? 'table-filter-apply-btn_topbar' : 'table-filter-apply-btn_header']"
            color="blue darken-1" small
            @click="applyFilter">
                Применить
            </v-btn>
        </div>
        
        <template v-if="header != null">
            <template v-if="(filter.requestType == filterTypes['Eq'] || filter.requestType == filterTypes['Like']) && filter.inputType == filterInputTypes['Text']">
                <v-text-field                 
                :name="filter.requestName" 
                persistent-hint 
                class="table-filter-input" 
                :mask="getMask()" 
                v-model="filter.values[0]" 
                clearable
                :hint="getHint()"></v-text-field>
            </template>
            <template v-else-if="filter.requestType == filterTypes['Range']">
                <template v-if="filter.inputType == filterInputTypes['Date']">
                    <el-date-picker
                    class="date-range"
                    v-model="filter.values"
                    type="daterange"
                    format="dd.MM.yyyy"
                    value-format="yyyy.MM.dd"
                    size="small"
                    clearable
                    :picker-options="{firstDayOfWeek: 1}"
                    align="right"
                    start-placeholder="Начало"
                    end-placeholder="Конец">
                    </el-date-picker>
                </template>
                <template v-else>
                    <v-flex xs6>
                        <v-text-field                         
                        :name="filter.requestName" 
                        single-line 
                        hint="Начало" 
                        persistent-hint 
                        class="table-filter-input" 
                        return-masked-value 
                        :mask="getMask()" 
                        clearable
                        v-model="filter.values[0]"/>
                    </v-flex>
                    <v-flex xs6>
                        <v-text-field
                        @input="applyFilterButton = filter.values[1]" 
                        :name="filter.requestName" 
                        single-line 
                        hint="Конец" 
                        persistent-hint 
                        class="table-filter-input" 
                        return-masked-value 
                        :mask="getMask()" 
                        v-model="filter.values[1]"/>
                    </v-flex>
                </template>
            </template>
            <template v-else-if="filter.requestType == filterTypes['Eq'] && filter.inputType == filterInputTypes['Select']">
                <v-autocomplete
                :name="filter.requestName" 
                :items="filter.selectItems" 
                class="table-filter-select" 
                v-model="filter.values[0]" 
                :hint="getHint()" 
                persistent-hint 
                clearable
                dense
                no-data-text="Нет совпадений"
                ></v-autocomplete>
            </template>
            <template v-else-if="filter.requestType == filterTypes['In'] && filter.inputType == filterInputTypes['Select']">
                <v-autocomplete
                :name="filter.requestName" 
                :items="filter.selectItems" 
                multiple 
                class="table-filter-select" 
                v-model="filter.values" 
                :hint="getHint()" 
                persistent-hint 
                dense
                no-data-text="Нет совпадений"
                @input="applyFilterButton = true"
                clearable></v-autocomplete>
            </template>
        </template>


        <template v-if="header == null">
            <v-flex class="filter" 
                v-if="(filter.requestType == filterTypes['Eq'] || filter.requestType == filterTypes['Like']) && filter.inputType == filterInputTypes['Text']">
                <div class="filterLabel">{{ filter.label }}</div>
                <v-text-field
                    class="filterInput"                     
                    :name="filter.requestName" 
                    :placeholder="filter.placeholder"
                    :prepend-icon="filter.icon"
                    v-model="filter.values[0]"
                    clearable
                    single-line>
                </v-text-field>
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
                align="right"
                start-placeholder="Начало"
                end-placeholder="Конец">
                </el-date-picker>
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
                            v-model="filter.values[0]">
                        </v-text-field>
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
                            v-model="filter.values[1]">
                        </v-text-field>
                    </div>
                </v-flex>
            </template>
            </template>
            <v-flex class="filter" v-else-if="filter.requestType == filterTypes['Eq'] && filter.inputType == filterInputTypes['Select']">
                <div class="filterLabel">{{ filter.label }}</div>
                <v-autocomplete
                    class="filterInput selectFilter"
                    :name="filter.requestName" 
                    :items="filter.selectItems"
                    v-model="filter.values[0]"
                    :prepend-icon="filter.icon"
                    clearable
                    :placeholder="filter.placeholder"
                    dense
                    single-line
                    no-data-text="Нет совпадений">
                </v-autocomplete>
            </v-flex>
            <v-flex class="filter" v-else-if="filter.requestType == filterTypes['In'] && filter.inputType == filterInputTypes['Select']">
                <div class="filterLabel">{{ filter.label }}</div>
                <v-autocomplete
                    :name="filter.requestName" 
                    :items="filter.selectItems" 
                    class="filterInput selectFilter selectMultiple"
                    v-model="filter.values"
                    :prepend-icon="filter.icon"
                    clearable
                    :placeholder="filter.placeholder"
                    dense
                    multiple
                    single-line
                    no-data-text="Нет совпадений">
                    <template slot="selection" slot-scope="data">
                        {{ data.item.text }}
                    </template>
                </v-autocomplete>
            </v-flex>
            <v-flex class="pb-2" style="height: 48px; padding-top: 9px" 
                v-else-if="filter.requestType == filterTypes['Eq'] && filter.inputType == filterInputTypes['Button']">
                <v-btn style="height: 30px" small light @click="changeBtnValue()">{{ buttonText }}</v-btn>
            </v-flex>
            <v-flex class="pr-2 pb-2 switcher" style="width: 180px; height: 48px; padding-top: 9px" 
                v-else-if="filter.requestType == filterTypes['Eq'] && filter.inputType == filterInputTypes['Checkbox']">
                <v-switch style="font-size: 14px" :label="filter.label" v-model="filter.values[0]"></v-switch>
            </v-flex>
        </template>
    </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator";
import { TableComponentHeader, TableComponentHeaderType } from "../TableComponent/TableHeader";
import { TableFilterComponentItem } from "./TableFilterComponentItem";
import { TableFilterComponentItemAppearance } from "./TableFilterComponentItemAppearance";
import { TableFilterComponentItemInputType } from "./TableFilterComponentItemInputType";
import { TableFilterComponentItemType } from "./TableFilterComponentItemType";

@Component
export default class TableFilterComponent extends Vue {
    @Prop({default: null}) header: TableComponentHeader;
    @Prop({required: true}) filter: TableFilterComponentItem;
    @Prop() value: any;
    @Prop({default: 0}) index: number;
    @Prop({default: true}) applyFilterButtonVisibility: boolean;
    @Prop({default: "grey lighten-1"}) color: string;
    focus: false;
    filterTypes: {[name: string]: TableFilterComponentItemType} = {};
    headerTypes: {[name: string]: TableComponentHeaderType} = {};
    filterInputTypes: {[name: string]: TableFilterComponentItemInputType} = {};
    filterAppearance: {[name: string]: TableFilterComponentItemAppearance} = {};
    searchInput: Function;
    applyFilterButton = false;
    buttonText = "";

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
        if (this.filter.inputType === this.filterInputTypes["Button"]) {
            this.filter.values[0] = false;
            this.buttonText = this.filter.buttonText;
        }

    }

    changeBtnValue() {
        this.filter.values[0] = !this.filter.values[0];
        if (this.filter.values[0] === true) {
            this.buttonText = this.filter.buttonClickedText;
        } else {
            this.buttonText = this.filter.buttonText;
        }
        this.applyFilter();
    }

    @Watch("filter.values")
    onFilterValuesChange(newVal: any, oldVal: any) {
        if (this.filter.inputType === this.filterInputTypes["Date"]) {
            if (!this.filter.values) {
                this.filter.values = [];
            }
        }
        if (newVal) {
            if (this.applyFilterButtonVisibility === false && (newVal === [null] || newVal === [""] || newVal.length === 0)) {
                this.applyFilterButton = false;
            } else {
                this.applyFilterButton = true;
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

    @Watch("header.dictionary")
    onSelectItemsChange() {
        this.$forceUpdate();
    }

@Emit()
    applyFilter() {
        if (this.filter.requestType === this.filterTypes["Range"] && this.filter.inputType === this.filterInputTypes["Date"]) {
            if (this.filter.values.length >= 2) {
                this.filter.values[1] = this.filter.values[1] + " 23:59:59";
            }
        }
        
        this.applyFilterButton = false;
    }
    // reloadSelectItems() {
    //     const from = this.header.items;
    //     this.$forceUpdate();
    //     // console.log(JSON.stringify(this.header.items));
    //     if(this.header.dictionary && from) {
    //         this.selectItems = from.map(x=> new SelectItem({value: x.id, text: x.name}));
    //     }
        
    // }
}
</script>

<style scoped>
    .filter {
        height: 48px;
        padding-top: 1px;
    }
    .filterLabel {
        height: 12px;
        font-size: 13px;
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
        top: -24px;
        height: 20px !important;
        left: 0;
    }
</style>

<style>
    .filter .v-input {
        font-size: 14px;
        margin-top: 0px;
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
