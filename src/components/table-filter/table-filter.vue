<template>
    <v-layout class="filter" :style="{ width: `${header.width}px`}" v-shortkey.once="{applyFilter: ['enter']}" @shortkey="shortkeyHandler">
        <div style="position: relative">
            <v-btn 
            v-if="applyFilterButton"
            class="table-filter-apply-btn"
            color="blue darken-1" small
            @click="applyFilter">
                Применить
            </v-btn>
        </div>
        
        <template v-if="header.filter.type == filterTypes['InputEq'] || header.filter.type == filterTypes['InputLike']">
            <v-text-field 
            @input="applyFilterButton = header.filter.values[0]" 
            :name="header.filter.name" 
            persistent-hint 
            class="table-filter-input" 
            :mask="getMask()" 
            v-model="header.filter.values[0]" 
            clearable
            :hint="getHint()"></v-text-field>
        </template>
        <template v-else-if="header.filter.type == filterTypes['InputRange']">
            <template v-if="header.type == headerTypes['date']">
                <el-date-picker
                class="date-range"
                v-model="header.filter.values"
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
                    @input="applyFilterButton = header.filter.values[0]" 
                    :name="header.filter.name" 
                    single-line 
                    hint="Начало" 
                    persistent-hint 
                    class="table-filter-input" 
                    return-masked-value 
                    :mask="getMask()" 
                    clearable
                    v-model="header.filter.values[0]"/>
                </v-flex>
                <v-flex xs6>
                    <v-text-field
                    @input="applyFilterButton = filter.values[1]" 
                    :name="header.filter.name" 
                    single-line 
                    hint="Конец" 
                    persistent-hint 
                    class="table-filter-input" 
                    return-masked-value 
                    :mask="getMask()" 
                    v-model="header.filter.values[1]"/>
                </v-flex>
            </template>
        </template>
        <template v-else-if="header.filter.type == filterTypes['SelectSingle']">
            <v-select 
            :name="header.filter.name" 
            :items="selectItems" 
            class="table-filter-select" 
            v-model="header.filter.values[0]" 
            :hint="getHint()" 
            persistent-hint 
            clearable
            dense
            autocomplete
            no-data-text="Нет совпадений"
            @input="reloadSelectItems(); applyFilterButton = header.filter.values[0]"
            @click.native="reloadSelectItems"
            append-icon="mdi-menu-down"
            ></v-select>
        </template>
        <template v-else-if="header.filter.type == filterTypes['SelectMultiple']">
            <v-select 
            :name="header.filter.name" 
            :items="selectItems" 
            multiple 
            class="table-filter-select" 
            v-model="header.filter.values" 
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
    </v-layout>
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
}
</style>