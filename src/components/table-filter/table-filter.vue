<template>
    <div class="filter" v-shortkey.once="{applyFilter: ['enter']}" @shortkey="shortkeyHandler">
        <div style="position: relative">
            <v-btn 
            v-if="applyFilterButton"
            class="table-filter-apply-btn"
            color="blue darken-1" small
            @click="applyFilter">
                Применить
            </v-btn>
        </div>
        
        <template v-if="header != null">
            <template v-if="filter.requestType == filterTypes['InputEq'] || filter.requestType == filterTypes['InputLike']">
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
            <template v-else-if="filter.requestType == filterTypes['InputRange']">
                <template v-if="filter.inputType == filterInputTypes['Date']">
                    <el-date-picker
                    class="date-range"
                    v-model="filter.values"
                    type="daterange"
                    format="dd.MM.yyyy"
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
            <template v-else-if="filter.requestType == filterTypes['SelectSingle']">
                <v-select 
                :name="filter.requestName" 
                :items="selectItems" 
                class="table-filter-select" 
                v-model="filter.values[0]" 
                :hint="getHint()" 
                persistent-hint 
                clearable
                dense
                autocomplete
                no-data-text="Нет совпадений"
                @input="reloadSelectItems(); applyFilterButton = filter.values[0]"
                @click.native="reloadSelectItems"
                append-icon="mdi-menu-down"
                ></v-select>
            </template>
            <template v-else-if="filter.requestType == filterTypes['SelectMultiple']">
                <v-select 
                :name="filter.requestName" 
                :items="selectItems" 
                multiple 
                class="table-filter-select" 
                v-model="filter.values" 
                :hint="getHint()" 
                persistent-hint 
                dense
                autocomplete
                no-data-text="Нет совпадений"
                @input="reloadSelectItems(); applyFilterButton = true"
                @click.native="reloadSelectItems"
                append-icon="mdi-menu-down"
                clearable></v-select>
            </template>
        </template>


        <template v-if="header == null">
            <v-flex class="action mt-2" v-if="filter.requestType == filterTypes['InputEq'] || filter.requestType == filterTypes['InputLike']">
                <v-text-field
                :class="['topbar-item', {'ml-3': index > 0}]"
                @input="applyFilterButton = filter.values[0]" 
                :name="filter.requestName" 
                :placeholder="filter.placeholder"
                :prepend-icon="filter.icon"
                v-model="filter.values[0]"
                clearable
                single-line
                >
                </v-text-field>
            </v-flex>
            <template v-else-if="filter.requestType == filterTypes['InputRange']">
            <v-flex class="action mt-2" v-if="filter.inputType == filterInputTypes['Date']">
                <el-date-picker
                :class="['date-range', {'ml-3': index > 0}]"
                style="width: 290px"
                v-model="filter.values"
                type="daterange"
                format="dd.MM.yyyy"
                size="small"
                clearable
                :picker-options="{firstDayOfWeek: 1}"
                align="right"
                start-placeholder="Начало"
                end-placeholder="Конец">
                </el-date-picker>
            </v-flex>
            <template v-else>
                <v-flex class="action mt-2" xs6>
                    <v-text-field 
                    @input="applyFilterButton = filter.values[0]" 
                    :name="filter.requestName" 
                    single-line 
                    placeholder="Начало" 
                    :class="['topbar-item', {'ml-3': index > 0}]"
                    return-masked-value 
                    :mask="getMask()" 
                    clearable
                    v-model="filter.values[0]"/>
                </v-flex>
                <v-flex class="action mt-2" xs6>
                    <v-text-field
                    @input="applyFilterButton = filter.values[1]" 
                    :name="filter.requestName" 
                    single-line 
                    placeholder="Конец" 
                    :class="['topbar-item', {'ml-3': index > 0}]"
                    return-masked-value 
                    :mask="getMask()" 
                    v-model="filter.values[1]"/>
                </v-flex>
            </template>
            </template>
            <v-flex class="action mt-2" v-else-if="filter.requestType == filterTypes['SelectSingle']">
                <v-select 
                :name="filter.requestName" 
                :items="filter.selectItems" 
                :class="['topbar-item', {'ml-3': index > 0}]"
                v-model="filter.values[0]"
                :prepend-icon="filter.icon"
                clearable
                :placeholder="filter.placeholder"
                dense
                single-line
                autocomplete
                no-data-text="Нет совпадений"
                @input="applyFilterButton = filter.values[0]"
                ></v-select>
            </v-flex>
            <v-flex class="action mt-2" v-else-if="filter.requestType == filterTypes['SelectMultiple']">
                <v-select 
                :name="filter.requestName" 
                :items="filter.selectItems" 
                :class="['topbar-item', {'ml-3': index > 0}]"
                v-model="filter.values"
                :prepend-icon="filter.icon"
                clearable
                :placeholder="filter.placeholder"
                dense
                multiple
                single-line
                autocomplete
                no-data-text="Нет совпадений"
                @input="applyFilterButton = filter.values[0]"
                ></v-select>
            </v-flex>
        </template>
    </div>
</template>
<script lang="ts" src='./table-filter.ts'>

</script>

<style scoped>
.filter .input-group {
    padding: 0px;
}
.table-filter-apply-btn {
    position: absolute;
    top: -24px;
    height: 20px !important;
    left: 0;
}
.input-group.input-group--solo {
    background-color: transparent !important;
    box-shadow: none !important;
}

.input-group.input-group--solo .input-group__input {
    max-height: 48px !important;
}

.action__label {
    vertical-align: middle;
    line-height: 48px;
    color: #757575!important;
}
.action {
    display: inherit;
    /* background-color:rgba(119, 119, 119, 0.1) */
}
.action > .input-group__input {
    max-height: 48px !important;
}
.topbar-item {
    width: 230px;
}
</style>