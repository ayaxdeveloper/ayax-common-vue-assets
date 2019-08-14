<template>
  <div>
    <v-toolbar class="table-topbar" flat dense :dark="darkTopbar" :class="topbarColor">
      <v-toolbar-title v-if="title.length > 0">
        {{ title }}
        <v-chip
          disabled
          title="Количество записей"
          label
          small
          color="white"
          v-if="itemsQuantity"
          class="black--text"
        >{{ itemsQuantity }}</v-chip>
      </v-toolbar-title>
      <v-toolbar-items v-if="filters.length > 0">
        <v-layout row>
          <v-flex v-if="quickFilters.length > 0" style="padding-left: 12px">
            <div style="font-size: 13px; height: 12px; margin-top: 1px">Быстрый поиск</div>
            <v-menu bottom offset-y>
              <v-btn
                style="height: 22px; margin-top: 7px"
                slot="activator"
                color="white"
                light
                class="quick-filter"
              >
                <span class="quick-filter-text">{{ quickFilterText }}</span>
                <v-icon right>mdi-chevron-down</v-icon>
              </v-btn>
              <v-list dense>
                <v-list-tile @click="clearAllFilters(); quickFilterText = 'Все'">
                  <v-list-tile-title>Все</v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                  @click="applyQuickFilter(quickfilter)"
                  v-for="(quickfilter) in quickFilters.filter(el => !el.custom)"
                  :key="quickfilter.id"
                >
                  <v-list-tile-title>{{quickfilter.name}}</v-list-tile-title>
                </v-list-tile>
                <v-divider v-if="quickFilters.filter(el => el.custom).length > 0"></v-divider>
                <v-list-tile
                  @click="applyQuickFilter(quickfilter)"
                  v-for="(quickfilter) in quickFilters.filter(el => el.custom)"
                  :key="quickfilter.id"
                >
                  <v-list-tile-content>
                    <v-list-tile-title>{{quickfilter.name}}</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-btn
                      @click.stop="quickFilterForRemove = quickfilter; 
                                                quickFilterForRemove['text'] = quickfilter.name;
                                                quickFilterRemoveDialog = true"
                      icon
                      ripple
                    >
                      <v-icon color="grey darken-1">mdi-delete</v-icon>
                    </v-btn>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-flex>
          <a-table-filter
            v-for="(topbarFilter, index) in filters.filter(filter => filter.appearance === filterAppearance['Topbar'])"
            :key="topbarFilter.name"
            :style="{width: topbarFilter.inputType == filterInputTypes['Button'] 
                            || topbarFilter.inputType == filterInputTypes['ButtonToggle'] 
                            || topbarFilter.inputType == filterInputTypes['ButtonDropdown'] ? 'initial' : `${topbarFilter.width}px`, 
                            paddingLeft: '12px'}"
            :filter="topbarFilter"
            :index="index"
            @emit-filter="applyEmittedFilter"
          ></a-table-filter>
          <template
            v-if="!showAllFilters && filters.filter(filter => filter.appearance === filterAppearance['Topbar']).length > 0"
          >
            <v-btn
              class="topbar-button ml-3"
              style="min-width: 70px; height: 28px"
              light
              @click="clearAllFilters()"
            >Очистить</v-btn>
            <v-btn
              class="topbar-button ml-1"
              style="min-width: 80px; height: 28px"
              color="primary"
              @click="applyAllFilters()"
            >Применить</v-btn>
          </template>
        </v-layout>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <slot name="topbar-items"></slot>
        <v-btn
          v-if="filters.filter(filter => filter.appearance === filterAppearance['AllFilters']).length > 0"
          class="ml-2"
          style="font-size: 12px"
          small
          flat
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
        <v-container fluid grid-list-md class="pa-1">
          <v-layout class="all-filters-wrapper" row wrap>
            <v-flex v-if="filterGroups.length > 0" class="filter-group-with-title">
              <template v-for="(group, groupIndex) in filterGroups">
                <div :key="groupIndex">
                  <v-layout
                    :class="['filter-group-title', 'filter-group-title__group-'+groupIndex]"
                  >
                    <v-flex xs12 class="filter-group-name">{{ group }}</v-flex>
                  </v-layout>

                  <v-layout
                    :class="['filter-wrapper__group', 'filter-wrapper__titled-group', 'filter-wrapper__group-'+groupIndex]"
                  >
                    <v-flex
                      v-for="(filter, index) in filters.filter(filter => filter.appearance === filterAppearance['AllFilters'] && filter.groupName === group)"
                      :key="filter.name+index"
                      :class="['filter-item', 'filter-item__titled-group', 'filter-item__group-'+groupIndex, filter.itemClassName]"
                    >
                      <a-table-filter
                        :filter.sync="filter"
                        :index="index"
                        @emit-filter="applyEmittedFilter"
                      ></a-table-filter>
                    </v-flex>
                  </v-layout>
                </div>

                <v-layout
                  :key="'divider-'+groupIndex"
                  :class="['filter-divider', 'filter-divider-group-'+groupIndex]"
                >
                  <v-flex v-if="filterGroups.length > 0" xs12 style="margin-top: 16px"></v-flex>
                </v-layout>
                <v-layout
                  :class="['filter-wrapper__group', 'filter-wrapper__no-titled-group', 'filter-wrapper__group-'+groupIndex]"
                  :key="'no-title-group-'+groupIndex"
                >
                  <v-flex
                    v-for="(filter, index) in filters.filter(filter => filter.appearance === filterAppearance['AllFilters'] && !filter.groupName)"
                    :key="filter.name"
                    :class="['filter-item', 'filter-item__no-titled-group', 'filter-item__group-'+groupIndex, filter.itemClassName]"
                  >
                    <a-table-filter
                      :filter.sync="filter"
                      :index="index"
                      @emit-filter="applyEmittedFilter"
                    ></a-table-filter>
                  </v-flex>
                </v-layout>
              </template>
            </v-flex>
            <v-flex v-else>
              <v-layout :class="['filter-wrapper__group', 'filter-wrapper__no-group']">
                <v-flex
                  v-for="(filter, index) in filters.filter(filter => filter.appearance === filterAppearance['AllFilters'])"
                  :key="filter.name"
                  :class="['filter-item', 'filter-item__no-group', filter.itemClassName]"
                >
                  <a-table-filter
                    :filter.sync="filter"
                    :index="index"
                    @emit-filter="applyEmittedFilter"
                  ></a-table-filter>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-container>
        <v-layout>
          <v-spacer></v-spacer>
          <v-btn
            v-if="showSaveFilterButton"
            color="success"
            class="mx-1 my-0"
            small
            @click="quickFilterSaveDialog = true"
          >Сохранить фильтр</v-btn>
          <v-btn light small class="mx-1 my-0" @click="clearAllFilters()">Очистить</v-btn>
          <v-btn
            small
            color="primary"
            class="mx-1 my-0"
            @click="applyAllFilters(); showAllFiltersBtn()"
          >Применить</v-btn>
        </v-layout>
      </v-card>
    </transition>
    <v-dialog v-model="quickFilterSaveDialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">Сохранить быстрый фильтр</v-card-title>
        <v-card-text>
          <v-text-field maxlength="50" label="Название фильтра" v-model="newQuickFilter.name"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saveQuickFilter()">Сохранить</v-btn>
          <v-btn color="lighten-2" @click="quickFilterSaveDialog = false">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="quickFilterRemoveDialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">Удаление быстрого фильтра</v-card-title>
        <v-card-text>Удалить фильтр "{{quickFilterForRemove.text}}"?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="removeQuickFilter()">Удалить</v-btn>
          <v-btn color="lighten-2" @click="quickFilterRemoveDialog = false">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Emit, Prop, Watch, Inject } from "vue-property-decorator";
import {
  TableFilterComponentItem,
  TableFilterComponentItemAppearance,
  TableFilterComponentItemInputType,
  TableFilterComponentItemType
} from "../..";
import { INotificationProvider, SearchResponse } from "ayax-common-types";
import { IOperationService } from "ayax-common-operation";
import { QuickFilterItem } from "./QuickFilterItem";

@Component({
  name: "TableTopbarComponent"
})
export default class TableTopbarComponent extends Vue {
  @Inject() notificationProvider: INotificationProvider;
  @Inject() operationService: IOperationService;

  @Prop({ default: "" }) title: string;
  @Prop({ default: null }) itemsQuantity: number;
  @Prop({ default: "secondary" }) topbarColor: string;
  @Prop({ default: true }) darkTopbar: boolean;
  @Prop() tableName: string;
  @Prop({ default: () => [] }) filters: TableFilterComponentItem[];
  @Prop({ default: () => [] }) filterGroups: string[];
  @Prop() showQuickFilters: boolean;
  @Prop({ default: null }) quickFilterPromise: (
    request
  ) => Promise<any[]> | null;

  showAllFilters = false;

  filterAppearance: {
    [name: string]: TableFilterComponentItemAppearance;
  } = {};
  filterInputTypes: {
    [name: string]: TableFilterComponentItemInputType;
  } = {};
  filterTypes: { [name: string]: TableFilterComponentItemType } = {};

  quickFilterText = "Все";
  quickFilters: QuickFilterItem[] = [];
  quickFilterSaveDialog = false;
  quickFilterRemoveDialog = false;

  newQuickFilter = {
    name: "",
    filters: []
  };

  quickFilterForRemove = {
    id: 0,
    name: ""
  };

  get showSaveFilterButton() {
    if (this.filters.find(x => x.values && (x.values[0] || x.values[1]))) {
      return true;
    }
    return false;
  }

  async created() {
    try {
      if (this.showQuickFilters) {
        await this.getQuickFilters();
      }
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

      if (
        Object.keys(JSON.parse(JSON.stringify(this.$route.query))).length > 0
      ) {
        let filterCount = 0;
        Object.keys(JSON.parse(JSON.stringify(this.$route.query))).forEach(
          key => {
            const filter = this.filters.find(x => x.name === key);
            if (filter) {
              if (
                filter.requestType === this.filterTypes["Range"] &&
                filter.inputType === this.filterInputTypes["Date"]
              ) {
                const quickDate = filter.quickDates.find(
                  x => x[2] === JSON.parse(this.$route.query[`${key}`])[0]
                );
                if (quickDate) {
                  filter.values = quickDate;
                  filterCount++;
                  return;
                }
              }
              filter.values = JSON.parse(this.$route.query[`${key}`]);
              filterCount++;
            }
          }
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.applyFilter(true);
      this.checkQuickFilter();
    }
  }

  @Watch("$route.query")
  applyQuery() {
    let filterCount = 0;
    this.filters.forEach(filter => {
      const filterInQuery = Object.keys(
        JSON.parse(JSON.stringify(this.$route.query))
      ).findIndex(key => key === filter.name);
      if (filterInQuery > -1) {
        let quickDate;
        if (
          filter.requestType === this.filterTypes["Range"] &&
          filter.inputType === this.filterInputTypes["Date"]
        ) {
          quickDate = filter.quickDates.find(
            x => x[2] === JSON.parse(this.$route.query[`${filter.name}`])[0]
          );
        }
        if (quickDate) {
          filter.values = quickDate;
        } else {
          filter.values = JSON.parse(this.$route.query[`${filter.name}`]);
        }
        filterCount++;
      } else {
        if (filter.values && filter.values.length > 0) {
          filter.values = [];
          filterCount++;
        }
      }
    });
    if (this.showQuickFilters) {
      this.checkQuickFilter();
    }
    this.applyFilter();
  }

  changeQuery(query, filter) {
    if (
      !filter.values ||
      filter.values.length === 0 ||
      (filter.values.length === 2 &&
        ((filter.values[0] === "" && filter.values[1] === "") ||
          (filter.values[0] === null && filter.values[1] === null) ||
          (filter.values[0] === undefined &&
            filter.values[1] === undefined))) ||
      (filter.values.length === 1 &&
        (filter.values[0] === "" ||
          filter.values[0] === null ||
          filter.values[0] === undefined))
    ) {
      if (query.hasOwnProperty(`${filter.name}`)) {
        delete query[`${filter.name}`];
      }
    } else {
      if (
        filter.requestType === this.filterTypes["Range"] &&
        filter.inputType === this.filterInputTypes["Date"]
      ) {
        if (filter.values.length === 2) {
          filter.values[1] = filter.values[1].substr(0, 10) + " 23:59:59";
        }
        if (filter.values.length === 3) {
          query[`${filter.name}`] = JSON.stringify([filter.values[2]]);
          return;
        }
      }
      query[`${filter.name}`] = JSON.stringify(filter.values);
    }
  }

  @Emit()
  applyFilter(initial = false) {}

  @Emit()
  relocateActionbar() {}

  applyEmittedFilter(filterName: string) {
    const filter = this.filters.find(x => x.name === filterName);

    if (filter) {
      if (
        filter.requestType === this.filterTypes["Range"] &&
        filter.inputType === this.filterInputTypes["Date"]
      ) {
        if (filter.values && filter.values.length === 2) {
          filter.values[1] = filter.values[1].substr(0, 10) + " 23:59:59";
        }
      }
      const query = JSON.parse(JSON.stringify(this.$route.query));
      this.changeQuery(query, filter);
      // if (query.hasOwnProperty("quickFilterId")) {
      //   delete query["quickFilterId"];
      // }
      this.$router.push({ path: this.$route.path, query });
    }
  }

  applyAllFilters() {
    const query = JSON.parse(JSON.stringify(this.$route.query));

    this.filters.forEach(filter => {
      this.changeQuery(query, filter);
    });
    // if (query.hasOwnProperty("quickFilterId")) {
    //   delete query["quickFilterId"];
    // }
    this.$router.push({ path: this.$route.path, query });
  }

  clearAllFilters() {
    this.$router.push({ path: this.$route.path });
  }

  showAllFiltersBtn() {
    this.showAllFilters = !this.showAllFilters;
    localStorage.setItem(
      `${this.title}_show-all-filters`,
      JSON.stringify(this.showAllFilters)
    );
    setTimeout(() => this.relocateActionbar(), 500);
  }

  applyQuickFilter(quickFilter) {
    let newQuery = {};
    quickFilter.filter.forEach(el => {
      newQuery[el.filterName] = JSON.stringify(el.filterValue);
    });
    newQuery["quickFilterId"] = quickFilter.id;
    this.quickFilterText = quickFilter.name;
    this.$router.push({ path: this.$route.path, query: newQuery });
  }

  async saveQuickFilter() {
    try {
      if (this.newQuickFilter.name.length === 0) {
        this.notificationProvider.Error("Введите название фильтра");
        return;
      }
      this.filters
        .filter(x => x.values.length > 0)
        .forEach(filter => {
          this.newQuickFilter.filters.push({
            filterName: filter.name,
            filterValue: filter.values
          });
        });

      await this.operationService
        .post("/quickfilter/add", {
          name: this.newQuickFilter.name,
          filter: JSON.stringify(this.newQuickFilter.filters),
          table: this.tableName
        })
        .then(x => x.ensureSuccess());

      this.quickFilterSaveDialog = false;
      this.notificationProvider.Success("Фильтр сохранен");

      await this.getQuickFilters();
      this.newQuickFilter = { name: "", filters: [] };
    } catch (error) {
      this.notificationProvider.Error(error);
    }
  }

  async getQuickFilters() {
    try {
      const filters = this.quickFilterPromise
        ? await this.quickFilterPromise({ table: this.tableName })
        : await this.operationService
            .search<any[]>("/quickfilter/search", { table: this.tableName })
            .then(x => x.ensureSuccess().data);

      if (filters) {
        filters.forEach(el => {
          el.filter = JSON.parse(el.filter);
        });
        this.quickFilters = filters;
      }
    } catch (error) {
      this.notificationProvider.Error(error);
    }
  }

  async removeQuickFilter() {
    try {
      await this.operationService
        .delete(`/quickfilter/delete/${this.quickFilterForRemove.id}`)
        .then(x => x.ensureSuccess());
      await this.getQuickFilters();
      this.notificationProvider.Success("Фильтр удален");
      if (this.quickFilterForRemove.name === this.quickFilterText) {
        this.clearAllFilters();
      }
      this.quickFilterForRemove = { id: 0, name: "" };
    } catch (error) {
      this.notificationProvider.Error(error);
    } finally {
      this.quickFilterRemoveDialog = false;
    }
  }

  checkQuickFilter() {
    const query = JSON.parse(JSON.stringify(this.$route.query));

    if (query.hasOwnProperty("quickFilterId")) {
      const quickFilter = this.quickFilters.find(
        x => x.id == query.quickFilterId
      );

      if (quickFilter) {
        this.quickFilterText = quickFilter.name;
        return;
      }
    }

    this.quickFilterText = "Все";
  }
}
</script>

<style scoped>
.topbar-button {
  margin: 10px 0;
  padding: 1px 0 0 0;
  font-size: 11px;
}
.filter-group-name {
  border-bottom: 2px solid #ccc;
  margin: 0 8px 6px;
  padding: 0 0 4px 0 !important;
  font-size: 16px;
  font-weight: 100;
}
.filter-group-name:not(:first-child) {
  margin-top: 12px;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter,
.slide-leave-to {
  transform: translateY(-5px);
  opacity: 0;
}

/*styles for filters layout*/
.filter-wrapper__group {
  display: grid;
  grid-template-columns:
    minmax(25%, auto)
    minmax(25%, auto)
    minmax(25%, auto)
    minmax(25%, auto);
}
</style>

<style>
.quick-filter {
  width: 150px;
}
.quick-filter .v-btn__content {
  display: flex;
  justify-content: space-between;
}
.quick-filter-text {
  max-width: 148;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin-left: 8px;
  font-size: 13px;
}
.table-topbar .v-toolbar__content {
  padding: 16px;
}
</style>




