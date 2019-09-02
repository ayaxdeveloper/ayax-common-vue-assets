<template>
  <div v-shortkey.once="{applyFilter: ['enter']}" @shortkey="shortkeyHandler" v-if="filter.active">
    <!-- <div
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
    </div>-->
    <template>
      <v-flex
        class="filter"
        v-if="(filter.requestType == filterTypes['Eq'] || filter.requestType == filterTypes['Like']) && filter.inputType == filterInputTypes['Text']"
      >
        <div class="filterLabel">{{ filter.label }}</div>
        <v-text-field
          :class="[filter.appearance === filterAppearance['Topbar'] ? 'topbar-filter' : 'filterInput']"
          :solo="filter.appearance === filterAppearance['Topbar']"
          :light="filter.appearance === filterAppearance['Topbar']"
          :name="filter.requestName"
          :placeholder="filter.placeholder"
          :prepend-icon="filter.icon"
          v-model="filter.values[0]"
          :mask="filter.mask"
          clearable
          single-line
        ></v-text-field>
      </v-flex>
      <v-flex
        class="filter"
        v-if="(filter.requestType == filterTypes['Eq'] || filter.requestType == filterTypes['Like']) && filter.inputType == filterInputTypes['Number']"
      >
        <div class="filterLabel">{{ filter.label }}</div>
        <!--   <a-number-input
          :class="[filter.appearance === filterAppearance['Topbar'] ? 'topbar-filter' : 'filterInput']"
          :solo="filter.appearance === filterAppearance['Topbar']"
          :light="filter.appearance === filterAppearance['Topbar']"
          :name="filter.requestName"
          :placeholder="filter.placeholder"
          :prepend-icon="filter.icon"
          v-model="filter.values[0]"         
          :numbersAfterComma="filter.numbersAfterComma"
          clearable
          single-line
        ></a-number-input>-->
        <v-text-field
          :class="[filter.appearance === filterAppearance['Topbar'] ? 'topbar-filter' : 'filterInput']"
          :solo="filter.appearance === filterAppearance['Topbar']"
          :light="filter.appearance === filterAppearance['Topbar']"
          :name="filter.requestName"
          :placeholder="filter.placeholder"
          :prepend-icon="filter.icon"
          v-model="filter.values[0]"
          v-digital-mask="{numbersAfterComma:filter.numbersAfterComma | 0}"
          clearable
          single-line
        ></v-text-field>
      </v-flex>
      <v-flex
        class="filter"
        v-if="(filter.requestType == filterTypes['Eq'] || filter.requestType == filterTypes['Like']) && filter.inputType == filterInputTypes['Phone']"
      >
        <div class="filterLabel">{{ filter.label }}</div>
        <v-text-field
          :class="[filter.appearance === filterAppearance['Topbar'] ? 'topbar-filter' : 'filterInput']"
          :solo="filter.appearance === filterAppearance['Topbar']"
          :light="filter.appearance === filterAppearance['Topbar']"
          :name="filter.requestName"
          :placeholder="filter.placeholder"
          :prepend-icon="filter.icon"
          v-model="filter.values[0]"
          :numbersAfterComma="filter.numbersAfterComma"
          v-phone-mask
          clearable
          single-line
        ></v-text-field>
      </v-flex>
      <template v-else-if="filter.requestType == filterTypes['Range']">
        <v-flex
          style="position: relative"
          class="filter"
          v-if="filter.inputType == filterInputTypes['Date']"
        >
          <div style="position: absolute; z-index: 1" class="filterLabel">{{ filter.label }}</div>
          <el-date-picker
            :class="['date-range', filter.appearance === filterAppearance['Topbar'] ? 'topbar-date-filter' : '']"
            style="margin-top: 13px"
            v-model="filter.values"
            type="daterange"
            format="dd.MM.yyyy"
            value-format="yyyy.MM.dd"
            size="small"
            clearable
            unlink-panels
            v-date-mask
            :picker-options="dateFilterPickerOptions"
            align="center"
            start-placeholder="дд.мм.гггг"
            end-placeholder="дд.мм.гггг"
            @blur="onDateFocusOut"
          ></el-date-picker>

          <div
            :style="{position: 'absolute', 
                        top: filter.appearance == filterAppearance['Topbar'] ? '13px' : '16px', 
                        left: 0, 
                        right: 0,
                        bottom: 0, 
                        padding: filter.appearance == filterAppearance['Topbar'] ? '0' : '0 4px',
                        pointerEvents: 'none'}"
            class="secondary"
            v-if="filter.values[2]"
          >
            <v-text-field
              :class="[filter.appearance === filterAppearance['Topbar'] ? 'topbar-filter' : 'filterInput']"
              :solo="filter.appearance === filterAppearance['Topbar']"
              :light="filter.appearance === filterAppearance['Topbar']"
              :name="filter.requestName"
              v-model="filter.values[2]"
              append-icon="mdi-close"
              @click:append.stop="() => filter.values = []"
              single-line
              readonly
            ></v-text-field>
          </div>
        </v-flex>
        <template v-else-if="filter.inputType == filterInputTypes['Text']">
          <v-flex class="filter">
            <div class="filterLabel">{{ filter.label }}</div>
            <div style="display: flex; flex-direction: row">
              <v-text-field
                :class="[filter.appearance === filterAppearance['Topbar'] ? 'topbar-filter' : 'filterInput', 'filterInputRange']"
                :solo="filter.appearance === filterAppearance['Topbar']"
                :light="filter.appearance === filterAppearance['Topbar']"
                :name="filter.requestName"
                single-line
                placeholder="от"
                return-masked-value
                :mask="filter.mask"
                clearable
                v-digital-mask="{numbersAfterComma:filter.numbersAfterComma | 0}"
                v-model="filter.values[0]"
              >
                <div>any value</div>
              </v-text-field>
              <div class="pa-2">-</div>
              <v-text-field
                :class="[filter.appearance === filterAppearance['Topbar'] ? 'topbar-filter' : 'filterInput', 'filterInputRange']"
                :solo="filter.appearance === filterAppearance['Topbar']"
                :light="filter.appearance === filterAppearance['Topbar']"
                @input="applyFilterButton = filter.values[1]"
                :name="filter.requestName"
                single-line
                placeholder="до"
                return-masked-value
                :mask="filter.mask"
                v-digital-mask="{numbersAfterComma:filter.numbersAfterComma | 0}"
                clearable
                v-model="filter.values[1]"
              ></v-text-field>
            </div>
            <div style="display: flex; flex-direction: row">
              <v-text-field
                :class="[filter.appearance === filterAppearance['Topbar'] ? 'topbar-filter' : 'filterInput', 'filterInputRange']"
                :solo="filter.appearance === filterAppearance['Topbar']"
                :light="filter.appearance === filterAppearance['Topbar']"
                :name="filter.requestName"
                :numbersAfterComma="filter.numbersAfterComma"
                single-line
                v-digital-mask="{numbersAfterComma:filter.numbersAfterComma | 0}"
                placeholder="от"
                clearable
                v-model="filter.values[0]"
              ></v-text-field>
              <div class="pa-2">-</div>
              <v-text-field
                :class="[filter.appearance === filterAppearance['Topbar'] ? 'topbar-filter' : 'filterInput', 'filterInputRange']"
                :solo="filter.appearance === filterAppearance['Topbar']"
                :light="filter.appearance === filterAppearance['Topbar']"
                @input="applyFilterButton = filter.values[1]"
                :name="filter.requestName"
                :numbersAfterComma="filter.numbersAfterComma"
                single-line
                placeholder="до"
                v-digital-mask="{numbersAfterComma:filter.numbersAfterComma | 0}"
                clearable
                v-model="filter.values[1]"
              ></v-text-field>
            </div>
          </v-flex>
        </template>
        <template v-else-if="filter.inputType == filterInputTypes['Number']">
          <v-flex class="filter">
            <div class="filterLabel">{{ filter.label }}</div>
            <div style="display: flex; flex-direction: row">
              <v-text-field
                :class="[filter.appearance === filterAppearance['Topbar'] ? 'topbar-filter' : 'filterInput', 'filterInputRange']"
                :solo="filter.appearance === filterAppearance['Topbar']"
                :light="filter.appearance === filterAppearance['Topbar']"
                :name="filter.requestName"
                :numbersAfterComma="filter.numbersAfterComma"
                single-line
                v-digital-mask="{numbersAfterComma:filter.numbersAfterComma | 0}"
                placeholder="от"
                clearable
                v-model="filter.values[0]"
              ></v-text-field>
              <div class="pa-2">-</div>
              <v-text-field
                :class="[filter.appearance === filterAppearance['Topbar'] ? 'topbar-filter' : 'filterInput', 'filterInputRange']"
                :solo="filter.appearance === filterAppearance['Topbar']"
                :light="filter.appearance === filterAppearance['Topbar']"
                @input="applyFilterButton = filter.values[1]"
                :name="filter.requestName"
                :numbersAfterComma="filter.numbersAfterComma"
                single-line
                v-digital-mask="{numbersAfterComma:filter.numbersAfterComma | 0}"
                placeholder="до"
                clearable
                v-model="filter.values[1]"
              ></v-text-field>
            </div>
          </v-flex>
        </template>
      </template>
      <v-flex
        class="filter"
        v-else-if="filter.requestType == filterTypes['Eq'] && filter.inputType == filterInputTypes['GroupSelect']"
      >
        <div class="filterLabel">{{ filter.label }}</div>
        <a-group-select
          :id="filter.requestName"
          :class="[filter.appearance === filterAppearance['Topbar'] ? 'topbar-filter' : 'filterInput', 'selectFilter']"
          :solo="filter.appearance === filterAppearance['Topbar']"
          :light="filter.appearance === filterAppearance['Topbar']"
          :name="filter.requestName"
          :items="filter.selectItems"
          v-model="filter.values[0]"
          :prepend-icon="filter.icon"
          :multiple="false"
          clearable
          :placeholder="filter.placeholder"
          dense
          single-line
          no-data-text="Нет совпадений"
        ></a-group-select>
      </v-flex>
      <v-flex
        class="filter"
        v-else-if="filter.requestType == filterTypes['In'] && filter.inputType == filterInputTypes['GroupSelect']"
      >
        <div class="filterLabel">{{ filter.label }}</div>
        <a-group-select
          :id="filter.requestName"
          :class="[filter.appearance === filterAppearance['Topbar'] ? 'topbar-filter' : 'filterInput', 'selectFilter']"
          :solo="filter.appearance === filterAppearance['Topbar']"
          :light="filter.appearance === filterAppearance['Topbar']"
          :name="filter.requestName"
          :items="filter.selectItems"
          v-model="filter.values"
          :prepend-icon="filter.icon"
          :multiple="true"
          :use-selection-slot="true"
          clearable
          :placeholder="filter.placeholder"
          dense
          single-line
          no-data-text="Нет совпадений"
        >
          <template slot="selection" slot-scope="data">
            <span
              :class="['selectionValue', filter.appearance === filterAppearance['Topbar'] ? 'topbar-selection-value' : 'pt-2']"
            >
              Выбрано
              <span
                class="selectionChip"
                :style="{backgroundColor: filter.appearance === filterAppearance['Topbar'] ? '#ccc' : '#fff'}"
              >{{ filter.values.length }}</span>
            </span>
          </template>
        </a-group-select>
      </v-flex>
      <v-flex
        class="filter"
        v-else-if="filter.requestType == filterTypes['Eq'] && filter.inputType == filterInputTypes['Select']"
      >
        <div class="filterLabel">{{ filter.label }}</div>
        <v-autocomplete
          :id="filter.requestName"
          :class="[filter.appearance === filterAppearance['Topbar'] ? 'topbar-filter' : 'filterInput', 'selectFilter']"
          :solo="filter.appearance === filterAppearance['Topbar']"
          :light="filter.appearance === filterAppearance['Topbar']"
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
          :class="[filter.appearance === filterAppearance['Topbar'] ? 'topbar-filter' : 'filterInput', 'selectFilter']"
          :solo="filter.appearance === filterAppearance['Topbar']"
          :light="filter.appearance === filterAppearance['Topbar']"
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
            <span
              :class="['selectionValue', filter.appearance === filterAppearance['Topbar'] ? 'topbar-selection-value' : 'pt-2']"
            >
              Выбрано
              <span
                class="selectionChip"
                :style="{backgroundColor: filter.appearance === filterAppearance['Topbar'] ? '#ccc' : '#fff'}"
              >{{ filter.values.length }}</span>
            </span>
          </template>
          <template slot="item" slot-scope="data">
            <template>
              <v-layout raw fill-height :class="data.item.className">
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
              </v-layout>
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
        <v-checkbox style="margin-top: 0px" :label="filter.label" v-model="filter.values[0]"></v-checkbox>
      </v-flex>
      <v-layout
        class="flex-treeselect"
        v-else-if="filter.inputType == filterInputTypes['TreeSelect']"
      >
        <v-flex class="filter">
          <a-tree-select
            v-model="filter.values"
            :multiple="true"
            :matchKeys="['id', 'label', 'number']"
            :instanceId="filter.requestName"
            :class="[filter.appearance === filterAppearance['Topbar'] ? 'topbar-filter' : 'filterInput', 'selectFilter']"
            :name="filter.requestName"
            :options="filter.anyItems"
            :placeholder="filter.placeholder"
            class="my-treeselect"
            :limit="0"
            :showCount="true"
            valueConsistsOf="LEAF_PRIORITY"
            :data-label-attr="filter.label"
          ></a-tree-select>
        </v-flex>
      </v-layout>
    </template>
  </div>
</template>

<script lang="ts">
import { SelectItem } from "ayax-common-types";
import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator";
import {
  TableComponentHeader,
  TableComponentHeaderType
} from "../TableComponent/TableHeader";
import { TableFilterComponentItem } from "./TableFilterComponentItem";
import { TableFilterComponentItemAppearance } from "./TableFilterComponentItemAppearance";
import { TableFilterComponentItemInputType } from "./TableFilterComponentItemInputType";
import { TableFilterComponentItemType } from "./TableFilterComponentItemType";
import ATreeSelect from "a-vue-treeselect";
import Inputmask from "inputmask";
import "a-vue-treeselect/dist/vue-treeselect.css";

@Component({
  name: "a-table-filter",
  components: {
    "a-tree-select": ATreeSelect
  },
  directives: {
    "date-mask": {
      inserted: function(el) {
        const arrOfInputEl = el.querySelectorAll("input");
        const parentOfInput = el.querySelector(".el-range-editor");
        arrOfInputEl.forEach(inputEl => {
          inputEl.setAttribute("maxlength", "10");

          const input = inputEl;

          const dateInputMask = function dateInputMask(elm) {
            elm.addEventListener("keypress", function(e) {
              const len = elm.value.length;
              if (e.keyCode < 47 || e.keyCode > 57) {
                el.classList.add("wrong-input");
                e.preventDefault();
              } else {
                el.classList.remove("wrong-input");
              }

              if (len !== 1 || len !== 3) {
                if (e.keyCode == 47) {
                  e.preventDefault();
                }
              }

              if (len === 2) {
                elm.value += ".";
              }

              if (len === 5) {
                elm.value += ".";
              }
            });
          };
          dateInputMask(input);
        });
      }
    },
    "digital-mask": {
      inserted: function(element, binding) {
        const inputEl = element.querySelector("input") as HTMLElement;
        let im = new Inputmask("decimal", {
          radixPoint: ".",
          groupSeparator: " ",
          groupSize: 3,
          autoGroup: true,
          positionCaretOnClick: `radixFocus`,
          clearMaskOnLostFocus: true,
          showMaskOnHover: false,
          autoUnmask: true,
          rightAlign: false,
          digitsOptional: true,
          digits: binding.value.numbersAfterComma
        });
        im.mask(inputEl);
      }
    },
    "phone-mask": {
      inserted: function(element, binding) {
        const inputEl = element.querySelector("input") as HTMLElement;

        let im = new Inputmask("tel", {
          mask: "[8]-(999)-999-99-99",
          clearMaskOnLostFocus: true,
          placeholder: "#",
          showMaskOnFocus: true,
          greedy: true,
          autoUnmask: true,
          positionCaretOnClick: `select`,
          clearIncomplete: true,
          onUnMask: function(
            maskedValue: string,
            unmaskedValue: string
          ): string {
            if (unmaskedValue.length === 10) {
              return "8" + unmaskedValue;
            } else if (unmaskedValue.length === 11) {
              return unmaskedValue;
            }
            return "";
          }
        });
        im.mask(inputEl);
      }
    }
  }
})
export default class TableFilterComponent extends Vue {
  @Prop({ required: true }) filter: TableFilterComponentItem;
  @Prop() value: any;
  @Prop({ default: 0 }) index: number;
  @Prop({ default: true }) applyFilterButtonVisibility: boolean;
  @Prop({ default: "grey lighten-1" }) color: string;
  @Prop({ default: false }) appliedFromQuery: boolean;

  focus: false;
  filterTypes: { [name: string]: TableFilterComponentItemType } = {};
  headerTypes: { [name: string]: TableComponentHeaderType } = {};
  filterInputTypes: {
    [name: string]: TableFilterComponentItemInputType;
  } = {};
  filterAppearance: {
    [name: string]: TableFilterComponentItemAppearance;
  } = {};
  searchInput: Function;
  applyFilterButton = false;
  buttonText = "";
  initialSelectItems: SelectItem[] = [];

  dateFilterPickerOptions = {
    firstDayOfWeek: 1,
    shortcuts: []
  };

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
      this.initialSelectItems = JSON.parse(
        JSON.stringify(this.filter.selectItems)
      );
    }
    if (
      this.filter.inputType === this.filterInputTypes["Date"] &&
      this.filter.requestType === this.filterTypes["Range"]
    ) {
      this.dateFilterPickerOptions.shortcuts = this.filter.quickDates.map(
        x => ({
          text: x[2],
          onClick(picker) {
            picker.$emit("pick", [x[0], x[1], x[2]]);
          }
        })
      );
    }
    if (
      this.filter.requestType == this.filterTypes["In"] &&
      this.filter.inputType == this.filterInputTypes["Select"]
    ) {
      if (this.filter.values.length > 0) {
        this.filter.selectItems.forEach(item =>
          this.filter.values.find(x => x === item.value)
            ? (item.selected = true)
            : (item.selected = false)
        );
      }
    }
  }

  onDateFocusOut(element) {
    if (element.userInput !== null && element.value.length === 0) {
      element.userInput = [...[]];
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
    const search = this.filter.selectItems.find(
      x => x.value == this.filter.values[0]
    );
    return search ? search.text : "Выберите";
  }

  clickDropdown(value: any) {
    this.filter.values = [];
    this.filter.values.push(value);
  }

  @Watch("filter.values")
  onFilterValuesChange(newVal: any, oldVal: any) {
    if (
      this.filter.requestType === this.filterTypes["In"] &&
      this.filter.inputType === this.filterInputTypes["Select"]
    ) {
      this.filter.selectItems.forEach(selectItem => {
        const selectedValue = this.filter.values.find(
          x => x === selectItem.value
        );
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

  getMask() {}

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

  shortkeyHandler(key: any) {
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
.topbar-selection-value {
  padding-top: 1px !important;
  color: #202020;
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

.flex-treeselect {
  margin-top: 7px;
}

.vue-treeselect__control:hover {
  border-color: #1976d2;
}

.flex-treeselect {
  margin-left: 0px !important;
  margin-right: 0px !important;
}
</style>

<style>
.topbar-filter .v-input__control {
  margin-top: 7px;
  height: 30px;
  min-height: inherit !important;
}

.topbar-filter input {
  padding-top: 1px !important;
}

.topbar-filter .v-input__slot {
  height: 22px !important;
  padding: 0 6px !important;
}

.topbar-date-filter {
  padding: 0 0 0 6px !important;
  margin-top: 19px !important;
  border-radius: 2px !important;
  background-color: #fff !important;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  border-bottom: none !important;
  height: 22px !important;
}

.topbar-date-filter .el-range-input {
  color: #202020 !important;
  font-size: 14px !important;
  padding-top: 1px !important;
}

.topbar-date-filter .el-range-input::placeholder {
  color: #c5c5c5 !important;
}

.topbar-date-filter .el-range-separator {
  color: #202020 !important;
}

.topbar-date-filter .el-range__close-icon {
  width: 20px;
  padding-top: 0px !important;
  padding-right: 6px !important;
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

.deleted-item {
  opacity: 0.5;
}

/*Styles for a-vue-treeselect */

.my-treeselect {
  margin-top: 12px;
}

/* Class for wrong input*/
.wrong-input {
  border-bottom: 1px solid red !important;
}

.filter input:-webkit-autofill,
.filter input:-webkit-autofill:hover,
.filter input:-webkit-autofill:focus,
.filter input:-webkit-autofill:active {
  transition: background-color 5000s ease-in-out 0s;
  -webkit-text-fill-color: #ffff !important;
}
</style>
