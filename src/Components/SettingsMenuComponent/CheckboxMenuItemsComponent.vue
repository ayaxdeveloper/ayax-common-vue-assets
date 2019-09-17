  <template>
  <v-menu
    offset-x
    left
    :close-on-content-click="false"
    open-on-click
    nudge-top="4px"
    :content-class="item.contentClass"
    :min-width="item.menuWidth"
    v-if="item.listOfOptions.length > 0"
  >
    <v-list-tile full-width slot="activator" class="menu-settings__list-tile">
      <v-list-tile-title full-width class="menu-settings__item-title">{{item.menuSettingsTitle}}</v-list-tile-title>
    </v-list-tile>
    <v-card flat class="headers-options" v-if="item.isDraggable">
      <v-list dense>
        <draggable
          :list="item.listOfOptions"
          @update="onUpdateDraggable"
          class="headers-options__checkbox-draggable-wrapper"
        >
          <v-list-tile
            v-for="(option, key) in item.listOfOptions"
            :key="key+option.text"
            class="checkbox-wrapper"
            :ripple="true"
            @click.stop
          >
            <v-list-tile-action class="checkbox-wrapper__item-action">
              <v-checkbox
                color="primary"
                v-if="option.hiddenable"
                v-model="option.isVisible"
                @change="tableHeadersShowCheck(option)"
                :label="option.text | sentenceToSmallLetters | firstLetterToUpperCase"
                class="menu-settings-headers__list-item"
                :ripple="false"
              ></v-checkbox>
              <v-checkbox
                v-else
                input-value="true"
                disabled
                :label="option.text | sentenceToSmallLetters | firstLetterToUpperCase"
                class="menu-settings-headers__list-item"
                :ripple="false"
              ></v-checkbox>
            </v-list-tile-action>
          </v-list-tile>
        </draggable>
      </v-list>
    </v-card>
    <v-card flat class="headers-options" v-else>
      <v-list dense>
        <v-list-tile
          v-for="(option, key) in item.listOfOptions"
          :key="key+option.text"
          class="checkbox-wrapper"
          :ripple="true"
          @click.stop
        >
          <v-list-tile-action class="checkbox-wrapper__item-action">
            <v-checkbox
              color="primary"
              v-if="option.hiddenable"
              v-model="option.isVisible"
              @change="tableHeadersShowCheck(option)"
              :label="option.text | sentenceToSmallLetters | firstLetterToUpperCase"
              class="menu-settings-headers__list-item"
              :ripple="false"
            ></v-checkbox>
            <v-checkbox
              v-else
              input-value="true"
              disabled
              :label="option.text | sentenceToSmallLetters | firstLetterToUpperCase"
              class="menu-settings-headers__list-item"
              :ripple="false"
            ></v-checkbox>
          </v-list-tile-action>
        </v-list-tile>
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
  },
  filters: {
    sentenceToSmallLetters(value) {
      return value ? value.toLowerCase() : "";
    },
    firstLetterToUpperCase(value) {
      return value ? value.charAt(0).toUpperCase() + value.substring(1) : "";
    }
  }
})
export default class CheckboxMenuitemsComponent extends Vue {
  @Prop() item: {
    contentClass: "";
    menuWidth;
    isDraggable: true;
    listOfOptions: {
      isVisible;
      text;
      hiddenable;
    }[];
  };

  cancelRadioGroup() {
    this.$emit("cancel");
  }

  onUpdateDraggable() {
    this.$emit("dragItem");
  }

  tableHeadersShowCheck(option) {
    this.$emit("listChange", option);
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

.checkbox-wrapper .checkbox-wrapper__item-action label {
  color: rgba(0, 0, 0, 1);
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
  cursor: pointer;
}

.checkbox-wrapper input {
  width: 44px;
  height: 40px;
}
</style>
