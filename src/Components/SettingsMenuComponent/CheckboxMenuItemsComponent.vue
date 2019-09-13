  <template>
  <v-menu
    offset-x
    left
    :close-on-content-click="false"
    open-on-click
    :nudge-top="item.menuNudgeTop"
    :content-class="item.contentClass"
    :min-width="item.menuWidth"
  >
    <v-list-tile full-width slot="activator" class="menu-settings__list-tile">
      <v-list-tile-title full-width class="menu-settings__item-title">{{item.menuSettingsTitle}}</v-list-tile-title>
    </v-list-tile>
    <v-card flat class="headers-options">
      <v-list dense>
        <draggable
          :list="item.listOfOptions"
          @update="onUpdateDraggable"
          class="headers-options__checkbox-draggable-wrapper"
        >
          <v-list-tile
            v-for="(item, key) in item.listOfOptions"
            :key="key+item.text"
            class="checkbox-wrapper"
            :ripple="true"
            @click.stop
          >
            <v-list-tile-action class="checkbox-wrapper__item-action">
              <v-checkbox
                color="primary"
                v-if="item.hiddenable"
                v-model="item.isVisible"
                @change="tableHeadersShowCheck"
                :label="item.text"
                class="menu-settings-headers__list-item"
                :ripple="false"
              ></v-checkbox>
              <v-checkbox
                v-else
                input-value="true"
                disabled
                :label="item.text"
                class="menu-settings-headers__list-item"
                :ripple="false"
              ></v-checkbox>
            </v-list-tile-action>
          </v-list-tile>
        </draggable>
      </v-list>
    </v-card>
  </v-menu>
</template>



<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Vuedraggable from "vuedraggable";

@Component({
  name: "a-checkbox-menu-items",
  components: {
    draggable: Vuedraggable
  }
})
export default class CheckboxMenuitemsComponent extends Vue {
  @Prop() options;
  @Prop() item;

  cancelRadioGroup() {
    this.$emit("cancel");
  }

  onUpdateDraggable() {
    this.$emit("dragItem");
  }

  tableHeadersShowCheck() {
    this.$emit("listChange");
  }
}
</script>