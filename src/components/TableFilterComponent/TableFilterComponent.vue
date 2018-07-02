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
                @input="applyFilterButton = filter.values[0]" 
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
                        @input="applyFilterButton = filter.values[0]" 
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
                <v-select 
                :name="filter.requestName" 
                :items="filter.selectItems" 
                class="table-filter-select" 
                v-model="filter.values[0]" 
                :hint="getHint()" 
                persistent-hint 
                clearable
                dense
                autocomplete
                no-data-text="Нет совпадений"
                @input="applyFilterButton = filter.values[0]"
                append-icon="arrow_drop_down"
                ></v-select>
            </template>
            <template v-else-if="filter.requestType == filterTypes['In'] && filter.inputType == filterInputTypes['Select']">
                <v-select 
                :name="filter.requestName" 
                :items="filter.selectItems" 
                multiple 
                class="table-filter-select" 
                v-model="filter.values" 
                :hint="getHint()" 
                persistent-hint 
                dense
                autocomplete
                no-data-text="Нет совпадений"
                @input="applyFilterButton = true"
                append-icon="arrow_drop_down"
                clearable></v-select>
            </template>
        </template>


        <template v-if="header == null">
            <v-flex class="filter" 
                v-if="(filter.requestType == filterTypes['Eq'] || filter.requestType == filterTypes['Like']) && filter.inputType == filterInputTypes['Text']">
                <div class="filterLabel">{{ filter.label }}</div>
                <v-text-field
                    class="filterInput"
                    @input="applyFilterButton = filter.values[0]" 
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
                            @input="applyFilterButton = filter.values[0]" 
                            :name="filter.requestName" 
                            single-line 
                            placeholder="От"
                            return-masked-value
                            :mask="getMask()"
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
                            v-model="filter.values[1]">
                        </v-text-field>
                    </div>
                </v-flex>
            </template>
            </template>
            <v-flex class="filter" v-else-if="filter.requestType == filterTypes['Eq'] && filter.inputType == filterInputTypes['Select']">
                <div class="filterLabel">{{ filter.label }}</div>
                <v-select 
                    class="filterInput"
                    :name="filter.requestName" 
                    :items="filter.selectItems"
                    v-model="filter.values[0]"
                    :prepend-icon="filter.icon"
                    clearable
                    :placeholder="filter.placeholder"
                    dense
                    single-line
                    autocomplete
                    no-data-text="Нет совпадений"
                    @input="applyFilterButton = filter.values[0]">
                </v-select>
            </v-flex>
            <v-flex class="filter" v-else-if="filter.requestType == filterTypes['In'] && filter.inputType == filterInputTypes['Select']">
                <div class="filterLabel">{{ filter.label }}</div>
                <v-select 
                    :name="filter.requestName" 
                    :items="filter.selectItems" 
                    class="filterInput"
                    v-model="filter.values"
                    :prepend-icon="filter.icon"
                    clearable
                    :placeholder="filter.placeholder"
                    dense
                    multiple
                    single-line
                    autocomplete
                    no-data-text="Нет совпадений"
                    @input="applyFilterButton = filter.values[0]">
                </v-select>
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
<script lang="ts" src='./TableFilterComponent.ts'>

</script>

<style scoped>
    .filter {
        height: 48px;
        padding-top: 2px;
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
    .filter .input-group {
        padding-top: 0px;
        margin-top: 5px;
    }
    .filter .input-group--text-field input {
        height: 22px;
        font-size: 14px;
    }
    .filter .input-group__input {
        min-height: 0px;
        height: 22px;
        
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
    .filter .input-group--select .input-group__selections__comma {
        font-size: 14px;
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
    .switcher .input-group label {
        font-size: 13px;
    }
</style>
