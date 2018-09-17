<template>
    <div>
        <v-toolbar flat dense :dark="darkTopbar" :class="topbarColor">
            <v-toolbar-title v-if="title.length > 0">
                {{ title }}
                <v-chip disabled title="Количество записей" label small 
                    v-if="itemsQuantity"
                    class="black--text"
                >
                    {{ itemsQuantity }}
                </v-chip>
            </v-toolbar-title>
            <v-toolbar-items v-if="filters.length > 0">
                <v-layout row>
                    <a-table-filter class="ml-3" 
                        v-for="(topbarFilter, index) in filters.filter(filter => filter.appearance === filterAppearance['Topbar'])" 
                        :key="topbarFilter.name"
                        :style="{width: topbarFilter.inputType == filterInputTypes['Button'] 
                            || topbarFilter.inputType == filterInputTypes['ButtonToggle']  ? 'initial' : '180px'}" 
                        :filter="topbarFilter"
                        :index="index"
                        @emit-filter="applyEmittedFilter"
                        :applied-from-query="appliedFromQuery"
                        :applyFilterButtonVisibility="applyFilterButtonVisibility"
                    >
                    </a-table-filter>
                </v-layout>
            </v-toolbar-items>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <slot name="topbar-items"></slot>
                <v-btn v-if="filters.filter(filter => filter.appearance === filterAppearance['AllFilters']).length > 0" 
                    class="ml-2"
                    small flat
                    @click="showAllFiltersBtn()"
                >
                    Все фильтры
                    <v-icon v-if="!showAllFilters">mdi-menu-down</v-icon>
                    <v-icon v-if="showAllFilters">mdi-menu-up</v-icon>
                </v-btn>
            </v-toolbar-items>
            <v-toolbar-items>
                <slot name="settings"></slot>
            </v-toolbar-items>
        </v-toolbar>
        <transition name="slide">
            <v-card class="pa-2" v-show="showAllFilters" dark flat style="border-radius: 0">
                <v-container fluid grid-list-md>
                    <v-layout row wrap>
                        <v-flex :xs6="filter.largeInput" :xs3="!filter.largeInput" 
                            v-for="(filter, index) in filters.filter(filter => filter.appearance === filterAppearance['AllFilters'])" 
                            :key="filter.name"
                        >
                            <a-table-filter
                                :filter.sync="filter"
                                :index="index"
                                @emit-filter="applyEmittedFilter"
                                :applied-from-query="appliedFromQuery"
                            >
                            </a-table-filter>
                        </v-flex>
                    </v-layout>
                </v-container>
                <v-layout>
                    <v-spacer></v-spacer>
                    <v-btn light @click="clearAllFilters()">
                        Очистить
                    </v-btn>
                    <v-btn color="primary" @click="applyAllFilters()">
                        Применить
                    </v-btn>
                </v-layout>
            </v-card>
        </transition>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Emit, Prop, Watch } from "vue-property-decorator";
import { 
    TableFilterComponentItem, 
    TableFilterComponentItemAppearance, 
    TableFilterComponentItemInputType, 
    TableFilterComponentItemType 
} from "../..";

@Component({
    name: "TableTopbarComponent"
})
export default class TableTopbarComponent extends Vue {
    @Prop({default: ""}) title: string;
    @Prop({default: null}) itemsQuantity: number;
    @Prop({default: "secondary"}) topbarColor: string;
    @Prop({default: true}) darkTopbar: boolean;
    @Prop({default: () => []}) filters: TableFilterComponentItem[];
    showAllFilters = false;
    applyFilterButtonVisibility = true;
    appliedFromQuery = false;

    filterAppearance: {[name: string]: TableFilterComponentItemAppearance} = {};
    filterInputTypes: {[name: string]: TableFilterComponentItemInputType} = {};
    filterTypes: {[name: string]: TableFilterComponentItemType} = {};

    created() {
        Object.keys(TableFilterComponentItemAppearance).forEach(item => {
            this.filterAppearance[item] = TableFilterComponentItemAppearance[item];
        });
        Object.keys(TableFilterComponentItemInputType).forEach(item => {
            this.filterInputTypes[item] = TableFilterComponentItemInputType[item];
        });
        Object.keys(TableFilterComponentItemType).forEach(item => {
            this.filterTypes[item] = TableFilterComponentItemType[item];
        });

        if (JSON.parse(localStorage.getItem(`${this.title}_show-all-filters`))) {
            this.showAllFilters = true;
        }

        if (Object.keys(JSON.parse(JSON.stringify(this.$route.query))).length > 0) {
            let filterCount = 0;
            Object.keys(JSON.parse(JSON.stringify(this.$route.query))).forEach(key => {
                const filter = this.filters.find(x => x.name === key);
                if (filter) {
                    filter.values = JSON.parse(this.$route.query[`${key}`]);
                    filterCount++;
                }
            });
            if (filterCount > 0) {
                this.applyFilter();
            }
        }
    }

    @Watch("$route.query")
    applyQuery() {
        this.appliedFromQuery = true;
        let filterCount = 0;
        this.filters.forEach(filter => {
            const filterInQuery = Object.keys(JSON.parse(JSON.stringify(this.$route.query))).findIndex(key => key === filter.name);
            if (filterInQuery > -1) {
                filter.values = JSON.parse(this.$route.query[`${filter.name}`]);
                filterCount++;
            } else {
                if (filter.values.length > 0) {
                    filter.values = [];
                    filterCount++;
                }
            }
        });
        if (filterCount > 0) {
            this.applyFilter();
        }
        setTimeout(() => this.appliedFromQuery = false, 1000);
    }

    changeQuery(query, filter) {
        if (!filter.values || filter.values.length === 0 ||  
            filter.values.length === 2 && (filter.values[0] === "" && filter.values[1] === "" || filter.values[0] === null
            && filter.values[1] === null || filter.values[0] === undefined && filter.values[1] === undefined)
            || filter.values.length === 1 && (filter.values[0] === "" || filter.values[0] === null || filter.values[0] === undefined)) {
            if (query.hasOwnProperty(`${filter.name}`)) {
                delete query[`${filter.name}`];
            }
        } else {
            if (filter.requestType === this.filterTypes["Range"] && filter.inputType === this.filterInputTypes["Date"]) {
                if (filter.values.length >= 2) {
                    filter.values[1] = filter.values[1].substr(0, 10) + " 23:59:59";
                }
            }
            query[`${filter.name}`] = JSON.stringify(filter.values);
        }
    }

    @Emit()
    applyFilter() {
        // if (this.pagination.page > 1) {
        //     this.pagination.page = 1;
        // }

        this.applyFilterButtonVisibility = false;
    }

    applyEmittedFilter(filterName: string) {
        const filter = this.filters.find(x => x.name === filterName);

        if (filter) {
            if (filter.requestType === this.filterTypes["Range"] && filter.inputType === this.filterInputTypes["Date"]) {
                if (filter.values.length >= 2) {
                    filter.values[1] = filter.values[1].substr(0, 10) + " 23:59:59";
                }
            }
            const query = JSON.parse(JSON.stringify(this.$route.query));
            this.changeQuery(query, filter);
            this.$router.push({ path: this.$route.path, query });
        }
    }

    applyAllFilters() {
        const query = JSON.parse(JSON.stringify(this.$route.query));

        this.filters.forEach(filter => {
            this.changeQuery(query, filter);
        });
        this.$router.push({ path: this.$route.path, query });
    }

    clearAllFilters() {
        this.filters.forEach(filter => {
            filter.values = [];
        });
        this.$router.push({ path: this.$route.path, query: {}});
        this.applyFilter();
    }

    showAllFiltersBtn() {
        this.showAllFilters = !this.showAllFilters;
        localStorage.setItem(`${this.title}_show-all-filters`, JSON.stringify(this.showAllFilters));
    }
}
</script>

<style scoped>
    .slide-enter-active, .slide-leave-active {
        transition: all .3s ease;
    }
    .slide-enter, .slide-leave-to {
        transform: translateY(-5px);
        opacity: 0;
    }
</style>