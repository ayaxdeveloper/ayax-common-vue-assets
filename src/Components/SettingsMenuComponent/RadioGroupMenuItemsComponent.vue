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
        @click="cancelRadioGroup"
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

  cancelRadioGroup() {
    this.$emit("cancel");
  }
}
</script>