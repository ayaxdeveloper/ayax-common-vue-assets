 <template slot="settings" v-if="options.configurable">
  <v-menu
    bottom
    offset-y
    left
    offset-x
    :close-on-content-click="false"
    content-class="menu-settings main-menu-settings"
  >
    <v-btn
      class="ml-2"
      flat
      style="height: 30px; width: 30px"
      small
      icon
      :title="mainSettingsButtonTitle"
      slot="activator"
    >
      <v-icon>mdi-settings</v-icon>
    </v-btn>
    <v-layout row>
      <v-flex>
        <v-card flat>
          <v-list dense v-for="(item, key) in items" :key="key+item.menuSettingsTitle">
            <a-radio-group-menu-items
              v-if="item.listType === 'radioGroupItems'"
              :options="options"
              :item="item"
              @cancel="cancelRadioGroup"
              @dragItem="onUpdateDraggable"
            ></a-radio-group-menu-items>
            <a-checkbox-menu-items
              v-if="item.listType === 'checkboxItems'"
              :options="options"
              :item="item"
              @listChange="tableHeadersShowCheck"
            ></a-checkbox-menu-items>
            <v-list-tile
              v-if="item.listType === 'simpleItem'"
              @click="clickOnMenuItem(item)"
              class="menu-settings__list-tile"
            >
              <v-list-tile-title
                full-width
                class="menu-settings__item-title"
              >{{item.menuSettingsTitle}}</v-list-tile-title>
            </v-list-tile>

            <v-divider v-if="item.isDivider || false"></v-divider>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-menu>
</template>


<script lang="ts">
import Vue from "vue";
import { Component, Emit, Prop } from "vue-property-decorator";
import RadioGroupMenuItemsComponent from "./RadioGroupMenuItemsComponent.vue";
import CheckboxMenuitemsComponent from "./CheckboxMenuItemsComponent.vue";

@Component({
  name: "a-settings-menu",
  components: {
    "a-radio-group-menu-items": RadioGroupMenuItemsComponent,
    "a-checkbox-menu-items": CheckboxMenuitemsComponent
  }
})
export default class SettingsMenuComponent extends Vue {
  @Prop({ type: String }) mainSettingsButtonTitle; // тайтл при наведении на иконку меню
  //@Prop({ type: Boolean, default: true }) isTableMenuVisible;
  @Prop() items;
  @Prop() options;

  cancelRadioGroup() {
    this.$emit("cancel");
  }

  tableHeadersShowCheck() {
    this.$emit("listChange");
  }

  onUpdateDraggable() {
    this.$emit("dragItem");
  }

  clickOnMenuItem(item) {
    this.$emit("clickOnItem", item);
  }
}
</script>


