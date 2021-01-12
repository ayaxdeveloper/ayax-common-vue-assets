<template>
    <div class="actionbar">
        <v-toolbar :dark="darkActionbar" :class="actionbarColor" dense>
            <template v-for="action in actions">
                <v-toolbar-items :key="action.name">
                    <v-btn
                        v-if="!action.children"
                        :title="action.hint"
                        :disabled="action.needSelectedItem && selectedItems.length === 0 || action.disabled"
                        flat
                        @click="executeAction(action)"
                        :loading="action.loading"
                        :class="hideButtonText ? 'iconButtonMinWidth' : ''"
                    >
                        <v-icon
                            :class="hideButtonText ? 'hiddenButtonText' : ''"
                            left
                            v-if="action.icon"
                        >{{action.icon}}</v-icon>
                        <template v-if="!hideButtonText || !action.icon">{{action.title}}</template>
                    </v-btn>
                    <v-menu
                        top
                        offset-y
                        :disabled="action.needSelectedItem && selectedItems.length === 0 || action.disabled"
                        v-if="action.children"
                    >
                        <v-btn
                            slot="activator"
                            :title="action.hint"
                            :loading="action.loading"
                            :disabled="action.needSelectedItem && selectedItems.length === 0 || action.disabled"
                            flat
                            :class="hideButtonText ? 'iconButtonMinWidth' : ''"
                        >
                            <v-icon
                                :class="hideButtonText ? 'hiddenButtonText' : ''"
                                left
                                v-if="action.icon"
                            >{{action.icon}}</v-icon>
                            <template v-if="!hideButtonText || !action.icon">{{action.title}}</template>
                        </v-btn>
                        <v-list dense>
                           <template v-for="(child, index) in action.children">
                                <v-list-tile
                                    :disabled="child.needSelectedItem && selectedItems.length === 0 || action.disabled"
                                    :title="action.hint" 
                                    :key="child.name"
                                    @click="executeAction(child)"
                                >
                                    <v-list-tile-action v-if="child.icon">
                                        <v-icon>{{child.icon}}</v-icon>
                                    </v-list-tile-action>
                                    <v-list-tile-title v-bind:style="child.style">{{child.title}}</v-list-tile-title>
                                </v-list-tile>
                                <v-divider :key="index" v-if="child.separator"></v-divider>
                            </template>
                        </v-list>
                    </v-menu>
                </v-toolbar-items>
                <v-spacer v-if="action.spaceNext" :key="action.title"></v-spacer>
            </template>
        </v-toolbar>
    </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator";
import { ActionItem } from "./ActionItem";

@Component({
  name: "a-actionbar",
})
export default class ActionbarComponent extends Vue {
  @Prop({ default: "primary" })
  actionbarColor: string;
  @Prop({ default: true })
  darkActionbar: boolean;
  @Prop({ required: true })
  actions: ActionItem[];
  @Prop({ default: () => [] })
  selectedItems: any[];
  @Prop({ default: () => {} })
  filteredRequest: {};
  @Prop({ default: 0 })
  updateActionbar: number;
  actionbarContainer;
  actionbar;
  hideButtonText = false;

  @Watch("updateActionbar")
  onChange() {
    [].forEach.call(this.actionbarContainer, (elem) => {
      this.toggleActionbar(elem);
    });
  }

  @Emit()
  onBarAction(items: any[], name: string) {}

  mounted() {
    this.actionbarContainer = this.$el.parentElement.parentElement;
    this.actionbar = this.$el;
    this.addWindowEvents();
    this.actionbarSize();
    [].forEach.call(this.actionbarContainer, (elem) => {
      this.toggleActionbar(elem);
    });

    this.collapseButtons(this.actionbar);
  }

  updated() {
    this.actionbarSize();
  }

  addWindowEvents() {
    window.onresize = () => {
      this.actionbarSize();
    };
    window.onscroll = () => {
      [].forEach.call(this.actionbarContainer, (elem) => {
        this.toggleActionbar(elem);
      });
    };
  }

  isElementInViewPort(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  isPartOfElementInViewPort(el) {
    let top = el.offsetTop;
    let left = el.offsetLeft;
    const width = el.offsetWidth;
    const height = el.offsetHeight;
    while (el.offsetParent) {
      el = el.offsetParent;
      top += el.offsetTop;
      left += el.offsetLeft;
    }
    return (
      top < window.pageYOffset + window.innerHeight &&
      left < window.pageXOffset + window.innerWidth &&
      top + height > window.pageYOffset &&
      left + width > window.pageXOffset
    );
  }

  actionbarSize() {
    [].forEach.call(this.actionbar, (el: HTMLElement) => {
      el.style.width = this.actionbarContainer.offsetWidth.toString() + "px";
    });
  }

  collapseButtons(actionbar: HTMLElement) {
    if (actionbar.scrollWidth - actionbar.offsetWidth !== 0) {
      this.hideButtonText = true;
    } else {
      if (this.hideButtonText === true) {
        this.hideButtonText = false;
      }
    }
  }

  toggleActionbar(elem) {
    const actionBarElement = elem.querySelector(".actionbar");
    if (!actionBarElement) {
      return;
    }
    if (
      this.isPartOfElementInViewPort(elem.querySelector(".mainAnchor")) &&
      !this.isElementInViewPort(elem.querySelector(".actionbarAnchor"))
    ) {
      actionBarElement.classList.add("actionbarFixed");
    } else {
      actionBarElement.classList.remove("actionbarFixed");
    }
  }

  executeAction(action: ActionItem) {
    if (action.action) {
      if (action.needSelectedItem) {
        action.action(this.selectedItems, this.idFilter());
      } else {
        action.action(this.filteredRequest);
      }
    }
  }

  idFilter() {
    const request = {
      idsFilter: {
        term: "in",
        val: {
          values: [],
        },
      },
    };
    request.idsFilter.val.values = this.selectedItems.map((el) => el.id);
    return request;
  }
}
</script>

<style scoped>
.actionbarFixed {
  position: fixed;
  bottom: 0;
}
.actionbar {
  overflow: hidden;
}
.hiddenButtonText {
  margin-right: 0px;
}
.iconButtonMinWidth {
  min-width: 50px;
}
</style>

<style>
.actionbar .v-toolbar__content {
  padding: 0px;
}
</style>
