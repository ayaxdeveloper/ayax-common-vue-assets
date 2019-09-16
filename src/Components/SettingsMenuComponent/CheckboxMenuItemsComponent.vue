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

<style>
.checkbox-wrapper .v-messages {
  display: none;
}

.checkbox-wrapper label {
  width: 100%;
  height: 100% !important;
  padding-left: 26px;
  padding-right: 16px;
}

.headers-options__checkbox-draggable-wrapper .v-list__tile__action,
.headers-options__checkbox-draggable-wrapper .v-input__control,
.checkbox-wrapper .v-list__tile__action,
.checkbox-wrapper .v-input__control {
  width: 100%;
}

.checkbox-wrapper div {
  height: 100%;
}

.checkbox-wrapper a {
  padding: 0;
}

.checkbox-wrapper input,
.checkbox-wrapper i {
  padding-left: 20px;
}

.checkbox-wrapper input {
  width: 44px;
  transform: translateY(3px) scaleY(1.25);
}
</style>
