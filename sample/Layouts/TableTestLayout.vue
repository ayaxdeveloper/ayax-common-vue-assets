<template>
  <div>
    <a-table :options.sync="options" :slot-toggle="slotToggle">
      <template slot="topbar-items">
        <v-btn
          style="height: 30px; width: 30px"
          class="ml-2 mt-2"
          small
          flat
          icon
          to="/employee/master"
        >
          <v-icon>mdi-account-plus</v-icon>
        </v-btn>
      </template>
      <template slot="qq" slot-scope="{item}">
        <div>{{item.activeLead.qq}}</div>
        <template v-if="item.otherLeads.length > 0">
          <v-flex class="mt-1 mb-1">
            <template v-if="item.slotToggle">
              <div v-for="lead in item.otherLeads" :key="lead.name">{{ lead.name }}</div>
            </template>
            <div
              class="tableItemSlot"
              @click.stop="toggleLead(item)"
            >{{item.slotToggle ? 'Скрыть' : `Еще ${item.otherLeads.length} обращений`}}</div>
          </v-flex>
        </template>
      </template>
      <template slot="ww" slot-scope="{item}">
        <div>{{item.activeLead.ww}}</div>
      </template>
    </a-table>
    <v-dialog v-model="editDialog" max-width="600px">
      <v-card>
        <v-card-text>
          <a-form :fields="fields" :model.sync="currentModel" v-if="editDialog"></a-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="lighten-2" flat @click.native="editOk">ОК</v-btn>
          <v-btn color="lighten-2" flat @click.native.stop="editCancel">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <a-group-select :items="selectItems" v-model="selectedValues"></a-group-select>
    <a-phone-input v-model="phoneInputValue"></a-phone-input>
  </div>
</template>

<script lang="ts">
import { IOperationService, OperationService } from "ayax-common-operation";
import {
  Pagination,
  SearchResponse,
  SelectItem,
  IEntity
} from "ayax-common-types";
import Vue from "vue";
import Component from "vue-class-component";
import { Inject, Watch } from "vue-property-decorator";
import {
  TableComponentHeader,
  TableFilterComponentItem,
  TableFilterComponentItemAppearance,
  TableFilterComponentItemInputType,
  TableFilterComponentItemType
} from "../../src";
import { ActionItem } from "../../src/Components/ActionbarComponent/ActionItem";
import { TableOptions } from "../../src/Components/TableComponent/TableOptions";
import { FormComponentItem } from "../../src/Components/FormComponent/FormItem";
import { ICacheService, CacheItem } from "ayax-common-cache/dist";
import TestDataService from "../Services/TestDataService/TestDataService";

@Component
export default class TableTestLayout extends Vue {
  @Inject() operationService: IOperationService;
  @Inject() cacheService: ICacheService;

  testDataService = new TestDataService();
  selectItems: SelectItem[] = [];
  editDialog = false;
  selectedValues = [];
  phoneInputValue = "88005550000";

  options: TableOptions = new TableOptions({
    title: "Тестовая таблица",
    pagination: new Pagination({ page: 1, perPage: 10 }),
    searchData: request =>
      this.operationService
        .search<any>("/testentity/search", request)
        .then(x => x.ensureSuccess()),
    headers: [
      TableComponentHeader.String({
        value: "id",
        text: "Id",
        hiddenable: false
      }),
      TableComponentHeader.String({ value: "code", text: "Код" }),
      TableComponentHeader.String({
        value: "title",
        text: "Наименование",
        sortable: true
      }),
      TableComponentHeader.String({
        value: "dictionaryId",
        text: "Справочник",
        dictionaryPromise: new Promise<CacheItem[]>(resolve =>
          setTimeout(
            () =>
              resolve(
                this.testDataService.getDictionary().map(x => new CacheItem(x))
              ),
            2000
          )
        )
      }),
      TableComponentHeader.String({
        value: "qq",
        text: "Статус обращений qq",
        custom: true
      }),
      TableComponentHeader.Date({
        value: "created",
        text: "Дата создания"
      }),
      TableComponentHeader.String({
        value: "ww",
        text: "Статус обращений ww",
        custom: true
      })
    ],
    actions: [
      new ActionItem({
        icon: "mdi-arrow-right",
        title: "Открыть",
        name: "show",
        single: true,
        action: asd => this.showDialog(asd, "edit")
      }),
      new ActionItem({
        icon: "mdi-plus",
        title: "Добавить",
        name: "add",
        action: asd => this.showDialog(asd, "add")
      }),
      new ActionItem({
        icon: "mdi-delete",
        needSelectedItem: true,
        title: "Удалить",
        name: "delete",
        condition: item => (item.id % 2 === 0 ? false : true),
        action: asd => console.log(asd)
      }),
      new ActionItem({
        icon: "mdi-delete",
        title: "Удалить",
        name: "deleteSingle",
        single: true,
        condition: item => (item.id % 2 === 0 ? false : true),
        action: asd => console.log(asd)
      }),
      new ActionItem({
        name: "tab",
        single: true,
        active: false,
        action: asd => console.log(asd)
      }),
      new ActionItem({
        name: "export",
        title: "Экспорт",
        icon: "mdi-upload",
        children: [
          new ActionItem({
            name: "Excel",
            title: "Экспорт выбранного в Excel",
            icon: "mdi-upload",
            needSelectedItem: true,
            action: (asd, qq) => console.log(qq)
          }),
          new ActionItem({
            name: "ExcelAll",
            title: "Экспорт всего в Excel",
            icon: "mdi-upload",
            action: asd => console.log(asd)
          })
        ]
      })
    ],
    filterGroups: ["Обращение", "Запрос клиента"],
    filters: [
      new TableFilterComponentItem({
        requestName: "streetfilter",
        appearance: TableFilterComponentItemAppearance.AllFilters,
        name: "streetFilter",
        requestType: TableFilterComponentItemType.Like,
        placeholder: "Введите",
        label: "Название улицы",
        largeInput: true,
        groupName: "Запрос клиента"
      }),
      // new TableFilterComponentItem({
      //     requestName: "titlefilter",
      //     appearance: TableFilterComponentItemAppearance.Topbar,
      //     name: "titleFilter",
      //     requestType: TableFilterComponentItemType.Like,
      //     placeholder: "Введите",
      //     label: "Наименование",
      //     active: true,
      // }),
      // new TableFilterComponentItem({
      //     name: "buttomToggleFilter",
      //     requestName: "buttonToggleFilter",
      //     label: "ButtonToggle",
      //     appearance: TableFilterComponentItemAppearance.Topbar,
      //     inputType: TableFilterComponentItemInputType.ButtonToggle,
      //     requestType: TableFilterComponentItemType.In,
      //     selectItems: [
      //         new SelectItem ({text: "Первый", value: "1"}),
      //         new SelectItem ({text: "Второй", value: "2"}),
      //         new SelectItem ({text: "Третий", value: "3"})
      //     ],
      // }),
      // new TableFilterComponentItem({
      //     name: "buttomToggleFilter1",
      //     requestName: "buttonToggleFilter1",
      //     appearance: TableFilterComponentItemAppearance.Topbar,
      //     inputType: TableFilterComponentItemInputType.ButtonToggle,
      //     requestType: TableFilterComponentItemType.In,
      //     selectItems: [
      //         new SelectItem ({text: "Первый", value: "1"}),
      //         new SelectItem ({text: "Второй", value: "2"}),
      //         new SelectItem ({text: "Третий", value: "3"})
      //     ],
      // }),
      // new TableFilterComponentItem({
      //     name: "buttomToggleFilter2",
      //     requestName: "buttonToggleFilter2",
      //     appearance: TableFilterComponentItemAppearance.Topbar,
      //     inputType: TableFilterComponentItemInputType.ButtonDropdown,
      //     requestType: TableFilterComponentItemType.Eq,
      //     label: "Dropdown",
      //     selectItems: [
      //         new SelectItem ({text: "Первый", value: "1"}),
      //         new SelectItem ({text: "Второй", value: "2"}),
      //         new SelectItem ({text: "Третий", value: "3"})
      //     ],
      // }),
      new TableFilterComponentItem({
        requestName: "date",
        name: "dateFilter",
        appearance: TableFilterComponentItemAppearance.AllFilters,
        requestType: TableFilterComponentItemType.Range,
        inputType: TableFilterComponentItemInputType.Date,
        label: "Дата создания"
      }),
      // new TableFilterComponentItem({
      //     name: "buttomFilter",
      //     requestName: "buttonFilter",
      //     appearance: TableFilterComponentItemAppearance.Topbar,
      //     inputType: TableFilterComponentItemInputType.Button,
      //     buttonText: "Кнопка",
      //     label: "Кнопка"
      // }),
      // new TableFilterComponentItem({
      //     name: "buttomFilter2",
      //     requestName: "buttonFilter2",
      //     appearance: TableFilterComponentItemAppearance.Topbar,
      //     inputType: TableFilterComponentItemInputType.Button,
      //     buttonText: "Отжата",
      //     buttonClickedText: "Нажата"
      // }),
      new TableFilterComponentItem({
        requestName: "qqfilter",
        name: "qqFilter",
        appearance: TableFilterComponentItemAppearance.Topbar,
        requestType: TableFilterComponentItemType.Eq,
        inputType: TableFilterComponentItemInputType.Select,
        selectItems: [
          new SelectItem({ value: 1, text: "Район 1" }),
          new SelectItem({ value: 2, text: "Район 2" }),
          new SelectItem({ value: 3, text: "Район 3" }),
          new SelectItem({ value: 4, text: "Район 4" }),
          new SelectItem({ value: 5, text: "Район 5" })
        ],
        label: "Выбор района",
        placeholder: "Выберите"
      }),
      new TableFilterComponentItem({
        requestName: "wwfilter",
        name: "wwFilter",
        appearance: TableFilterComponentItemAppearance.AllFilters,
        requestType: TableFilterComponentItemType.In,
        inputType: TableFilterComponentItemInputType.Select,
        groupName: "Обращение",
        selectItems: [
          new SelectItem({ value: 1, text: "Район 1" }),
          new SelectItem({ value: 2, text: "Район 2" }),
          new SelectItem({ value: 3, text: "Район 3" }),
          new SelectItem({ value: 4, text: "Район 4" }),
          new SelectItem({ value: 5, text: "Район 5" }),
          new SelectItem({ value: 6, text: "Район 6" }),
          new SelectItem({ value: 7, text: "Район 7" }),
          new SelectItem({ value: 8, text: "Район 8" }),
          new SelectItem({ value: 9, text: "Район 9" }),
          new SelectItem({ value: 10, text: "Район 10" }),
          new SelectItem({ value: 11, text: "Район 11" }),
          new SelectItem({ value: 12, text: "Район 12" }),
          new SelectItem({ value: 13, text: "Район 13" }),
          new SelectItem({ value: 14, text: "Район 14" }),
          new SelectItem({ value: 15, text: "Район 15" }),
          new SelectItem({ value: 16, text: "Район 16" }),
          new SelectItem({ value: 17, text: "Район 17" }),
          new SelectItem({ value: 18, text: "Район 18" }),
          new SelectItem({ value: 19, text: "Район 19" }),
          new SelectItem({ value: 20, text: "Район 20" })
        ],
        label: "Выбор районов",
        placeholder: "Выберите"
      }),
      new TableFilterComponentItem({
        requestName: "roomFilter",
        name: "roomFilter",
        appearance: TableFilterComponentItemAppearance.AllFilters,
        requestType: TableFilterComponentItemType.Range,
        label: "Комнат в доме",
        groupName: "Запрос клиента"
      })
    ]
  });

  created() {
    this.selectItems = this.testDataService.getDictionary().map(
      x =>
        new SelectItem({
          text: x.title,
          value: x.id,
          group: "group"
        })
    );
  }

  currentModel = {};

  fields = [
    FormComponentItem.Hidden({ title: "Id", name: "id" }),
    FormComponentItem.Input({ title: "Имя", name: "title" })
  ] as FormComponentItem[];

  slotToggle = null;

  toggleLead(item) {
    this.slotToggle = {
      tableIndex: item.tableIndex,
      toggleValue: !item.slotToggle
    };
  }

  async showDialog(item: IEntity, action) {
    try {
      switch (action) {
        case "edit":
          this.currentModel = await this.operationService
            .get(`/testentity/get/${item.id}`)
            .then(x => x.ensureSuccess());
          this.editDialog = true;
          break;
        case "add":
          this.currentModel = {};
          this.editDialog = true;
          break;
      }
    } catch (e) {
      console.error(e);
    }
  }

  async editOk() {
    try {
      if (+this.currentModel["id"] > 0) {
        await this.operationService
          .put(
            `/testentity/update/${+this.currentModel["id"]}`,
            this.currentModel
          )
          .then(x => x.ensureSuccess());
      } else {
        await this.operationService
          .post(`/testentity/add`, this.currentModel)
          .then(x => x.ensureSuccess());
      }
      this.options.reloadData++;
    } catch (e) {
      console.error(e);
    }
    this.editDialog = false;
  }

  editCancel() {
    this.editDialog = false;
  }
}
</script>

<style scoped>
.tableItemSlot {
  display: inline;
  font-size: 12px;
  text-decoration: underline;
}
.tableItemSlot:hover {
  cursor: pointer;
}
</style>

