<template>
  <div :id="options.tableName" class="actionbarContainer" style="position: relative">
    <a-table-topbar
      v-if="!loading"
      :title="options.title"
      :tableName="options.tableName"
      :topbarColor="options.topbarColor"
      :darkTopbar="options.darkTopbar"
      :itemsQuantity="options.pagination.totalItems"
      :filters.sync="options.filters"
      :filterGroups="options.filterGroups"
      :showQuickFilters="options.quickFilters"
      :quickFilterPromise="options.quickFilterPromise"
      @apply-filter="applyFilter"
      @relocate-actionbar="updateActionbar++"
    >
      <template slot="topbar-items">
        <slot name="topbar-items"></slot>
      </template>
      <template slot="settings" v-if="options.configurable">
        <v-menu
          bottom
          offset-y
          left
          offset-x
          :close-on-content-click="false"
          :value="isTableMenuVisible"
        >
          <v-btn
            class="ml-2"
            flat
            style="height: 30px; width: 30px"
            small
            icon
            title="Настройки таблицы"
            slot="activator"
            @click="isTableMenuVisible=true"
          >
            <v-icon>mdi-settings</v-icon>
          </v-btn>
          <v-layout row>
            <v-flex v-if="options.autoRefreshEnable">
              <v-card flat class="autorefresh-options">
                <v-card-title class="pb-0">
                  Автообновление
                </v-card-title>
                <v-card-text>
                  <v-divider></v-divider>
                  <v-switch v-model="autoRefreshEnableInner" :label="options.autoRefresh ? 'Выключить' : 'Включить'"></v-switch>
                  <v-radio-group v-model="options.autoRefresh" v-if="options.autoRefresh" class="mt-0">
                    <v-radio v-for="option in options.autoRefreshOptions" :key="option"  :label="`${option} сек`" :value=option></v-radio>
                  </v-radio-group>
                </v-card-text>
              </v-card>
            </v-flex>

            <v-flex>
              <v-card flat>
                <v-list dense>
                  <draggable :list="options.headers" @update="onUpdateDraggable">
                    <v-list-tile v-for="header in options.headers" :key="header.value" @click.stop>
                      <v-list-tile-action>
                        <v-checkbox
                          color="primary"
                          v-if="header.hiddenable"
                          v-model="header.isVisible"
                        ></v-checkbox>
                        <v-checkbox v-else input-value="true" disabled></v-checkbox>
                      </v-list-tile-action>
                      <v-list-tile-title>{{ header.text }}</v-list-tile-title>
                    </v-list-tile>
                  </draggable>
                  <v-divider></v-divider>
                  <v-list-tile @click="resetTableSettings()">
                    <v-list-tile-title>Сбросить настройки таблицы</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-card>
            </v-flex>
          </v-layout>
        </v-menu>
      </template>
    </a-table-topbar>
    <v-progress-linear :active="loading" height="2" style="margin: 0px" :indeterminate="true"></v-progress-linear>
    <v-data-table
      v-show="!loading"
      :headers="options.headers"
      :items="items"
      :total-items="1"
      no-data-text="Нет данных"
      hide-actions
      disable-initial-sort
      item-key="id"
      no-results-text="Ничего не найдено"
      :class="[
                'elevation-1', 
                'a-table-component', 
                'mainAnchor', 
                'scrollableTable', 
                options.maxHeight ? 'scrollableTableOverflow' : ''
            ]"
      :style="options.maxHeight ? `--maxHeight: ${options.maxHeight}px` : ''"
      v-resize="onTableResize"
    >
      <template slot="headers" slot-scope="props">
        <tr class="fixedTableHeader">
          <th v-if="options.selectable" class="select-checkbox">
            <v-checkbox
              v-if="!options.selectableSingle"
              primary
              class="pb-1"
              :input-value="selectedItemsOnPage.length === items.length && items.length > 0 ? true : false"
              color="primary"
              :indeterminate="selectedItemsOnPage.length > 0 && selectedItemsOnPage.length !== items.length"
              hide-details
              @click.stop="toggleAllItems()"
            ></v-checkbox>
          </th>
          <th
            class="text-xs-center line-action"
            v-if="options.actions && options.actions.filter(x => x.single && x.active).length > 0"
          >
            <v-icon>mdi-dots-horizontal</v-icon>
          </th>
          <th
            v-for="header in props.headers.filter(x => x.isVisible)"
            :key="header.value"
            :style="{textAlign: header.align}"
          >
            {{ header.text.toUpperCase() }}
            <v-icon
              v-if="header.sortable"
              small
              @click="changeSort(header.value)"
              :class="[(header.sortBy && header.sortBy.isdesc !== undefined) ? 'black--text' : '']"
            >{{ (header.sortBy && header.sortBy.isdesc) ? 'mdi-arrow-down' : 'mdi-arrow-up' }}</v-icon>
          </th>
          <v-progress-linear
            :active="tableLoading"
            height="2"
            style="margin: 0px"
            :indeterminate="true"
          ></v-progress-linear>
        </tr>
        <tr :id="options.tableName + '-static-header'" style="height: 36px">
          <th v-if="options.selectable" class="select-checkbox">
            <v-checkbox v-if="!options.selectableSingle" primary class="pb-1" hide-details></v-checkbox>
          </th>
          <th
            class="text-xs-center line-action"
            v-if="options.actions && options.actions.filter(x => x.single && x.active).length > 0"
          >
            <v-icon>mdi-dots-horizontal</v-icon>
          </th>
          <th
            v-for="header in props.headers.filter(x => x.isVisible)"
            :key="header.value"
            :style="{color: '#fff !important', backgroundColor: '#fff !important', textAlign: header.align}"
          >
            {{ header.text.toUpperCase() }}
            <v-icon
              v-if="header.sortable"
              small
              :class="[(header.sortBy && header.sortBy.isdesc !== undefined) ? 'black--text' : '']"
            >{{ (header.sortBy && header.sortBy.isdesc) ? 'mdi-arrow-down' : 'mdi-arrow-up' }}</v-icon>
          </th>
        </tr>
      </template>
      <template slot="items" slot-scope="props">
        <tr
          @click.middle.prevent="clickMiddle(props.item)"
          @click.ctrl.prevent="clickMiddle(props.item)"
          :style="{ backgroundColor: options.rowColor(props.item), verticalAlign: 'top'}"
        >
          <td
            v-if="options.selectable || options.selectableSingle"
            style="width: 48px; padding: 0 0 4px 16px !important; vertical-align: top"
          >
            <v-checkbox
              @click.stop="selectItem(props.item)"
              :input-value="props.item.selected ? true : false"
              primary
              class="pt-2"
              hide-details
              color="primary"
            ></v-checkbox>
          </td>
          <td
            class="text-xs-right line-action"
            v-if="options.actions && options.actions.filter(x => x.single && x.active).length > 0"
          >
            <div class="text-xs-center">
              <v-menu :disabled="selectedItems.length > 0" offset-x offset-y>
                <v-btn
                  :disabled="selectedItems.length > 0"
                  color="primary"
                  dark
                  flat
                  slot="activator"
                  small
                  icon
                >
                  <v-icon>mdi-dots-horizontal</v-icon>
                </v-btn>
                <v-list dark dense>
                  <v-list-tile
                    v-for="action in options.actions.filter(action => action.single && action.active 
                                            && (action.condition === undefined || action.condition(props.item) === true))"
                    :key="action.name"
                    @click="executeSingleAction(action.name, props.item)"
                  >
                    <v-list-tile-action v-if="action.icon">
                      <v-icon>{{action.icon}}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title v-if="action.title && !action.onlyIcon">{{ action.title }}</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </div>
          </td>
          <td
            v-for="(header, index) in visibleHeaders"
            :key="index"
            :style="{paddingTop: '10px', textAlign: header.align, whiteSpace: header.wrap ? '' : 'nowrap'}"
            @dblclick="firstSingleAction(props.item)"
          >
            <slot :name="header.value" :item="props.item">
              <template
                v-for="propertyname in Object.keys(props.item).filter(x => x === visibleHeaders[index].value)"
              >
                <template
                  v-if="visibleHeaders[index].items"
                >{{getFromDictionary(visibleHeaders[index], props.item[propertyname])}}</template>
                <template v-else>{{applyFormatterIfExists(header, props.item[propertyname])}}</template>
              </template>
            </slot>
          </td>
        </tr>
      </template>
    </v-data-table>
    <div class="actionbarAnchor" v-show="!loading">
      <a-actionbar
        v-if="options.actions && options.actions.filter(el => !el.single && el.active).length > 0"
        :actions="options.actions.filter(action => !action.single && action.active)"
        :selectedItems="selectedItems"
        :actionbarColor="options.actionbarColor"
        :darkActionbar="options.darkActionbar"
        :filteredRequest="lastFilteredRequest"
        :updateActionbar="updateActionbar"
      ></a-actionbar>
    </div>
    <v-layout v-show="!loading" class="text-xs-center mt-1">
      <v-flex xs6>
        <v-layout justify-start>
          <v-card
            v-if="selectedItems.length > 0"
            style="height: 36px; min-width: 120px"
            class="pa-2 mt-1"
          >
            <v-layout>
              <v-flex>Выбрано</v-flex>
              <v-flex>
                <div
                  style="border-radius: 4px"
                  class="px-2 ml-2 d-inline-block cyan darken-1 white--text"
                >{{ selectedItems.length }}</div>
              </v-flex>
              <v-flex>
                <v-icon @click="onClearSelected()" class="ml-2" small>mdi-close</v-icon>
              </v-flex>
            </v-layout>
          </v-card>
        </v-layout>
      </v-flex>
      <v-flex>
        <v-pagination
          :class="{ 'pagination_dense' : options.densePagination}"
          v-if="options.pagination"
          total-visible="10"
          v-model="options.pagination.page"
          :length="getTotalPages()"
        ></v-pagination>
      </v-flex>
      <v-flex xs6>
        <v-layout justify-end>
          <div class="pt-2 pr-3 d-inline-block">На странице:</div>
          <v-select
            v-model="options.pagination.perPage"
            style="margin-top: 4px; max-width: 54px; padding-top: 0px"
            dense
            hide-details
            :items="customPagination"
          ></v-select>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { INotificationProvider, SortableField } from "ayax-common-types";
import Vue from "vue";
import { Component, Emit, Inject, Prop, Watch } from "vue-property-decorator";
import resize from "vue-resize-directive";
import vuedraggable from "vuedraggable";
import {
  ActionbarComponent,
  TableComponentHeader,
  TableFilterComponentItemInputType,
  TableFilterComponentItem
} from "../..";
import { TableOptions } from "./TableOptions";
import TableTopbarComponent from "./TableTopbarComponent.vue";
import { ICacheService } from "ayax-common-cache";
import * as moment from "moment";

@Component({
  name: "TableComponent",
  components: {
    "a-table-topbar": TableTopbarComponent,
    "a-actionbar": ActionbarComponent,
    draggable: vuedraggable
  },
  directives: {
    resize
  }
})
export default class TableComponent extends Vue {
  @Inject() notificationProvider: INotificationProvider;
  @Inject() cacheService: ICacheService;
  @Prop({ default: () => new TableOptions() }) options: TableOptions;
  @Prop({ default: () => ({ tableIndex: null, toggleValue: false }) })
  slotToggle;

  items = [];
  loading = true;
  tableLoading = true;
  fixedTableHeader: HTMLElement;
  customPagination = [10, 20, 30, 50, 100];
  sortArrowDirection = "";
  isTableMenuVisible = false;
  originalHeaders: TableComponentHeader[] = [];
  selectedItems = [];
  lastFilteredRequest = {};
  updateActionbar = 0;
  isPerPageFromStorage = false;
  filterInputTypes: {
    [name: string]: TableFilterComponentItemInputType;
  } = {};

  get visibleHeaders() {
    return this.options.headers.filter(
      header => header.isVisible
    ) as TableComponentHeader[];
  }

  get selectedItemsOnPage() {
    const selectedOnPage = [];
    this.selectedItems.forEach(selectedItem => {
      if (this.items.find(item => item.id === selectedItem.id)) {
        selectedOnPage.push(selectedItem);
      }
    });
    return selectedOnPage;
  }

  async created() {
    if (localStorage.getItem(`${this.options.title}_auto_refresh`))
    {
      this.options.autoRefresh = JSON.parse(
        localStorage.getItem(`${this.options.title}_auto_refresh`)
      );
    }   
    Object.keys(TableFilterComponentItemInputType).forEach(item => {
      this.filterInputTypes[item] = TableFilterComponentItemInputType[item];
    });
    const perPage = localStorage.getItem(`${this.options.tableName}_perPage`);
    if (perPage) {
      this.isPerPageFromStorage = true;
      this.options.pagination.perPage = parseInt(perPage);
    }
    await this.loadHeaders();    
  }

  async applyFilter(initial = false) {
    if (initial) {
      let query = JSON.parse(JSON.stringify(this.$route.query));
      if (
        query[`${this.options.tableName}_page`] &&
        +query[`${this.options.tableName}_page`] !== 1
      ) {
        this.options.pagination.page = +query[`${this.options.tableName}_page`];
      }
    }
    await this.loadData();
  }

  async loadHeaders() {
    this.loading = true;
    const headerPromises = this.options.headers
      .filter(x => (x.dictionary || x.dictionaryPromise) && !x.items)
      .map(x => {
        return new Promise(resolve => {
          if (x.dictionary) {
            this.cacheService.List(x.dictionary).then(z => {
              x.items = z;
              resolve();
            });
          } else if (x.dictionaryPromise) {
            x.dictionaryPromise.then(z => {
              x.items = z;
              resolve();
            });
          }
        });
      });

    const filterPromises = this.options.filters
      .filter(
        x =>
          !x.selectItems &&
          (x.selectItemsFromDictionary || x.selectItemsFromPromise)
      )
      .map(x => {
        return new Promise(resolve => {
          if (x.selectItemsFromDictionary) {
            this.cacheService
              .ListAsSelectItems(x.selectItemsFromDictionary)
              .then(z => {
                x.selectItems = z;
                resolve();
              });
          } else if (x.selectItemsFromPromise) {
            x.selectItemsFromPromise.then(z => {
              x.selectItems = z;
              resolve();
            });
          }
        });
      });

    await Promise.all([
      Promise.all(headerPromises),
      Promise.all(filterPromises)
    ]);

    this.originalHeaders = JSON.parse(JSON.stringify(this.options.headers));
    for (let i = 0; i < this.originalHeaders.length; i++) {
      this.originalHeaders[i].order = i;
    }

    if (localStorage.getItem(`${this.options.title}_header_settings`)) {
      const data = JSON.parse(
        localStorage.getItem(`${this.options.title}_header_settings`)
      );
      data.forEach(item => {
        this.options.headers.forEach(header => {
          if (item.value === header.value) {
            header.isVisible = item.isVisible;
            header.order = item.order;
          }
        });
      });
      this.options.headers.sort((a, b) => a.order - b.order);
    }
    this.loading = false;
  }

  mounted() {
    this.fixedTableHeader = document.querySelector(
      `#${this.options.tableName} .fixedTableHeader`
    ) as HTMLElement;
    const tableScroll = document.querySelector(
      `#${this.options.tableName} .v-table__overflow`
    ) as HTMLElement;
    tableScroll.addEventListener("scroll", () =>
      this.onTableScroll(tableScroll.scrollTop)
    );    
  }

  @Watch("options.pagination.page")
  onPageChange(newVal, oldVal) {
    if (newVal !== oldVal) {
      // this.loadData();
      const query = JSON.parse(JSON.stringify(this.$route.query));
      query[`${this.options.tableName}_page`] = newVal;
      this.$router.push({ path: this.$route.path, query });
    }
  }

  @Watch("$route.query")
  onQueryChange(val) {
    let page = val[`${this.options.tableName}_page`];
    if (page) {
      this.options.pagination.page = +page;
    }
  }

  @Watch("options.pagination.perPage")
  onPerPageChange() {
    if (this.options.pagination.page === 1) {
      if (!this.isPerPageFromStorage) {
        this.loadData();
      }
    } else {
      this.options.pagination.page = 1;
    }
    localStorage.setItem(
      `${this.options.tableName}_perPage`,
      this.options.pagination.perPage.toString()
    );
    this.isPerPageFromStorage = false;
  }

  @Watch("slotToggle")
  onToggle(val) {
    if (val.tableIndex !== null) {
      this.items[val.tableIndex].slotToggle = val.toggleValue;
    }
  }

  @Watch("visibleHeaders.length")
  onChangeVisible() {
    setTimeout(() => this.resizeFixedHeader(), 500);
  }

  @Watch("options.clearSelected")
  onClearSelected() {
    this.selectedItems = [];
    this.items.forEach(item => {
      item.selected = false;
    });
  }

  @Watch("options.reloadData")
  onReload() {
    this.loadData();
  }

  @Watch("options.resizeHeader")
  onResize() {
    this.resizeFixedHeader();
  }

  @Watch("items.length")
  onEmpty() {
    if (this.items.length === 0) {
      const headersCount = document.querySelectorAll(
        `#${this.options.tableName + "-static-header"} th`
      ).length;
      const firstTd = document.querySelector(
        `#${this.options.tableName} tbody tr td`
      ) as any;
      if (firstTd) {
        firstTd.colSpan = `${headersCount}`;
      }
    }
  }

  @Watch("selectedItems")
  onChange(val: any[]) {
    this.options.actions
      .filter(x => !x.single && x.condition !== undefined)
      .forEach(action => {
        if (val.find(x => action.condition(x) === false)) {
          action.disabled = true;
        } else {
          action.disabled = false;
        }
      });
  }

  @Emit()
  loadingIsReady() {}

  executeSingleAction(actionName: string, item: any) {
    if (actionName) {
      const singleAction = this.options.actions.find(
        action => action.name === actionName
      );

      if (singleAction) {
        singleAction.action(item);
      }
    }
  }

  firstSingleAction(item) {
    const firstAction = this.options.actions.filter(action => action.single)[0];

    if (firstAction && firstAction.action) {
      firstAction.action(item);
    }
  }

  resizeFixedHeader() {
    const staticHeader = document.querySelector(
      `#${this.options.tableName} #${this.options.tableName + "-static-header"}`
    );

    const header = document.querySelectorAll(
      `#${this.options.tableName} .fixedTableHeader th`
    ) as HTMLCollectionOf<HTMLElement>;

    if (staticHeader) {
      const staticHeaderTh = staticHeader.querySelectorAll("th");

      for (let i = 0; i < staticHeaderTh.length; i++) {
        header[i].style.width = `${staticHeaderTh[i].offsetWidth}px`;
        header[i].style.minWidth = `${staticHeaderTh[i].offsetWidth}px`;
      }
    }
  }

  onTableScroll(scrollTop) {
    this.fixedTableHeader.style.top = `${scrollTop}px`;
  }

  onTableResize() {
    this.resizeFixedHeader();
  }

  get autoRefreshEnableInner() {
    return this.options.autoRefresh > 0;
  }

  set autoRefreshEnableInner(value: boolean) {
    if(!value) {
      this.options.autoRefresh = 0;
      if (this.timerAutoRefreshId) {
        clearInterval(this.timerAutoRefreshId);
      }
    } else {
      if (this.options.autoRefresh === 0)
        {
          this.options.autoRefresh = 30;
        }
      this.runLoadDataAgain();

      localStorage.setItem(
        `${this.options.title}_auto_refresh`,
        JSON.stringify(this.options.autoRefresh)
      );
    }
  }

  private timerAutoRefreshId: number =  null;

  @Watch('options.autoRefresh')
  onChangeAutoRefresh(): void {
    if (this.options.autoRefresh>0) {
      this.runLoadDataAgain()
    }
    localStorage.setItem(
    `${this.options.title}_auto_refresh`,
      JSON.stringify(this.options.autoRefresh)
    );
  }

  private runLoadDataAgain(): void {
    if (this.options.autoRefresh>0) {
      if (this.timerAutoRefreshId) {
          clearInterval(this.timerAutoRefreshId);
      }
      this.timerAutoRefreshId = setInterval(() => {this.loadDataMethod();},
      this.options.autoRefresh * 1000);
    }  
  }

  async loadData(): Promise<void> {
    await this.loadDataMethod();
    this.runLoadDataAgain();
  }

  async loadDataMethod(): Promise<void> {
    try {
      this.tableLoading = true;
      const filteredRequest = this.AddFilter();
      const request = this.options.searchData
        ? await this.options.searchData(filteredRequest)
        : await this.options.rawData(filteredRequest).then(x => {
            return {
              data: x,
              total: x.length
            };
          });
      for (let i = 0; i < request.data.length; i++) {
        request.data[i].tableIndex = i;
        request.data[i].slotToggle = false;
        if (
          this.selectedItems.findIndex(
            selectedItem => selectedItem.id === request.data[i].id
          ) > -1
        ) {
          request.data[i].selected = true;
        } else {
          request.data[i].selected = false;
        }
      }
      this.items = request.data;
      this.options.pagination.totalItems = request.total;

      delete filteredRequest.page;
      delete filteredRequest.perPage;
      this.lastFilteredRequest = filteredRequest;

      if (this.options.pagination.page > this.getTotalPages()) {
        this.options.pagination.page = 1;
      }
    } catch (e) {
      this.notificationProvider.Error("Ошибка получения данных");
      console.error(e);
    } finally {
      this.tableLoading = false;
      this.loading = false;
      setTimeout(() => this.resizeFixedHeader(), 500);
      this.onEmpty();
      this.loadingIsReady();
    }
  }

  clickMiddle(item) {
    const tabAction = this.options.actions.find(
      x => x.single && x.name.toLocaleLowerCase() === "tab"
    );
    if (tabAction) {
      tabAction.action(item);
    }
  }

  AddFilter() {
    const filteredRequest = {
      ...{
        page: this.options.pagination.page,
        perPage: this.options.pagination.perPage
      }
    };
    const filtersCopy: TableFilterComponentItem[] = [];

    this.options.filters.forEach(el => {
      filtersCopy.push(
        new TableFilterComponentItem(JSON.parse(JSON.stringify(el)))
      );
    });

    filtersCopy
      .filter(x => x.values.length > 0)
      .forEach(filter => {
        const filters = filter.FormRequestFilters();
        if (filters) {
          filteredRequest[filter.requestName] = filters;
        }
      });
    this.options.headers
      .filter(x => x.sortBy)
      .forEach(header => {
        filteredRequest[`${header.value}sort`] = header.sortBy;
      });

    if (this.options.hiddenFilters.length > 0) {
      this.options.hiddenFilters.forEach(filter => {
        filteredRequest[filter.requestName] = filter.FormRequestFilters();
      });
    }
    return filteredRequest;
  }

  @Emit()
  onSelectItem(item) {}

  selectItem(item) {
    if (this.options.selectableSingle) {
      if (
        this.selectedItems.length > 0 &&
        this.selectedItems[0].id &&
        this.selectedItems[0].id === item.id
      ) {
        this.selectedItems = [];
        item.selected = false;
      } else {
        this.items.forEach(item => (item.selected = false));
        item.selected = true;
        this.selectedItems = [item];
      }
      this.onSelectItem(item);
      return;
    }
    const itemIndex = this.selectedItems.findIndex(
      selectedItem => selectedItem.id === item.id
    );
    if (itemIndex > -1) {
      this.selectedItems.splice(itemIndex, 1);
      item.selected = false;
    } else {
      item.selected = true;
      this.selectedItems.push(item);
    }
  }

  toggleAllItems() {
    if (this.selectedItemsOnPage.length === 0) {
      this.items.forEach(item => {
        item.selected = true;
        this.selectedItems.push(item);
      });
    } else {
      this.items.forEach(item => {
        const itemIndex = this.selectedItems.findIndex(
          selectedItem => selectedItem.id === item.id
        );
        if (itemIndex > -1) {
          this.selectedItems.splice(itemIndex, 1);
          item.selected = false;
        }
      });
    }
  }

  applyFormatterIfExists(header: TableComponentHeader, value) {
    if (header.formatter) {
      return header.formatter(value);
    } else {
      return value;
    }
  }

  getFromDictionary(header: TableComponentHeader, id: number | number[]) {
    if (!header || !header.items || header.items.length === 0) {
      return "Нет";
    }
    if (Array.isArray(id)) {
      let concat = "";
      id.forEach(element => {
        const val = header.items.find(x => x.id === element);
        if (val) {
          concat += val.name ? val.name : val.title + ", ";
        }
      });
      if (concat.length > 1) {
        concat = concat.substring(0, concat.length - 2);
      }
      return concat;
    } else {
      const val = header.items.find(x => x.id === id);
      if (val) {
        return val.name ? val.name : val.title;
      }
    }

    return "Нет";
  }

  getTotalPages() {
    return this.options.pagination.perPage && this.options.pagination.totalItems
      ? Math.ceil(
          this.options.pagination.totalItems / this.options.pagination.perPage
        )
      : 1;
  }

  changeSort(headerValue: string) {
    this.options.headers
      .filter(el => el.sortable)
      .forEach(header => {
        if (header.value === headerValue) {
          if (!header.sortBy) {
            header.sortBy = new SortableField();
            header.sortBy.isdesc = false;
          }
          header.sortBy.isdesc = !header.sortBy.isdesc;
        } else {
          header.sortBy = undefined;
        }
      });
    this.loadData();
  }

  onUpdateDraggable() {
    for (let i = 0; i < this.options.headers.length; i++) {
      this.options.headers[i].order = i;
    }
    localStorage.setItem(
      `${this.options.title}_header_settings`,
      JSON.stringify(this.options.headers)
    );
  }

  resetTableSettings() {
    localStorage.removeItem(`${this.options.title}_header_settings`);
    this.options.autoRefresh = 0;
    localStorage.removeItem(`${this.options.title}_auto_refresh`);
    this.options.headers.forEach(header => {
      this.originalHeaders.forEach(originalHeader => {
        if (header.value === originalHeader.value) {
          header.isVisible = originalHeader.isVisible;
          header.order = originalHeader.order;
        }
      });
    });
    this.options.headers.sort((a, b) => a.order - b.order);
    this.isTableMenuVisible = false;
  }
}
</script>

<style>
.scrollableTable .v-table__overflow {
  max-height: var(--maxHeight);
  position: relative;
}

.scrollableTableOverflow .v-table__overflow {
  overflow-y: scroll;
}

.a-table-component table.v-table tbody tr td,
.a-table-component table.v-table thead tr th {
  padding: 0 8px;
}

.a-table-component table.v-table tbody td {
  height: 41px;
}
</style>


<style scoped>
.line-action {
  width: 48px !important;
  padding: 0 !important;
}
.select-checkbox {
  width: 48px !important;
  padding: 0 !important;
  padding-left: 16px !important;
}
.fixedTableHeader {
  height: 36px;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
  position: absolute;
  left: 0;
  z-index: 1;
}
.fixedTableHeader th {
  height: 36px;
}
.actionbarAnchor {
  height: 48px;
}
.bottom-bar__block {
}

.autorefresh-options {
  height: 100%;
  width: 165px;
}
</style>

