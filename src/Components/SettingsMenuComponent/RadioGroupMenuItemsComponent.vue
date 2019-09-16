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
    <v-card flat class="autorefresh-options" outlined tile>
      <v-radio-group v-model="options.autoRefresh" class="mt-0 mb-0">
        <v-radio
          v-for="option in options.autoRefreshOptions.filter(item => item >0)"
          :key="option"
          :label="`${option} сек`"
          :value="option"
        ></v-radio>
      </v-radio-group>
      <v-divider></v-divider>
      <v-list-tile
        full-width
        flat
        block
        text
        :disabled="options.autoRefresh == 0 ? true : false"
        class="text-transform-none btn-cancel"
        @click="radioGroupCancel"
      >
        <v-list-tile-action>
          <v-icon>mdi-close</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title full-width>Отключить</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-card>
  </v-menu>
</template>



<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({
  name: "a-radio-group-menu-items"
})
export default class RadioGroupMenuItemsComponent extends Vue {
  @Prop() options;
  @Prop() item;

  radioGroupCancel(item) {
    this.$emit("radioGroupCancel", item);
  }
}
</script>

<style>
.autorefresh-options .btn-cancel {
  font-size: 14px;
  background: none;
}

.autorefresh-options .btn-cancel[disabled] * {
  color: #999999;
}

.autorefresh-options .btn-cancel:hover {
  background: rgba(0, 0, 0, 0.04);
}

.autorefresh-options .v-label {
  color: rgba(0, 0, 0, 0.87);
}

.autorefresh-options .v-input__slot {
  margin-bottom: 0px;
}

.autorefresh-options
  .v-input--selection-controls:not(.v-input--hide-details)
  .v-input__slot {
  margin-bottom: 0px;
}

.autorefresh-options .v-input--selection-controls .v-input__control {
  flex-grow: 1;
}

.autorefresh-options .v-radio {
  padding-left: 16px;
  margin: 0px;
  padding-right: 16px;
  height: 40px;
  padding-bottom: 0px;
}

.autorefresh-options
  .v-input--radio-group--column
  .v-radio:not(:last-child):not(:only-child) {
  margin-bottom: 0px;
}

.autorefresh-options .v-input--radio-group {
  padding-bottom: 0px;
}
.autorefresh-options .v-input--selection-controls__ripple {
  margin: 0px;
}
.autorefresh-options {
  padding-bottom: 4px;
}

.autorefresh-options .btn-cancel {
  display: flex;
}

.autorefresh-options .btn-cancel a div:first-child {
  min-width: 33px;
}

.autorefresh-options .btn-cancel a div:last-child div {
  padding-right: 29px;
  font-size: 14px;
}

.autorefresh-options .v-messages {
  display: none;
}

.autorefresh-options .btn-cancel a > div {
  display: flex;
  align-content: center;
}

.autorefresh-options > .v-card__text {
  padding-bottom: 1px;
}
</style>

