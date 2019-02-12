<template>
  <v-navigation-drawer
    class="sidebarComponent"
    app
    :dark="darkTheme"
    :mini-variant.sync="mini"
    mini-variant-width="60"
    permanent
    fixed
    :width="width"
  >
    <v-layout justify-center>
      <div v-show="!mini" class="userPhotoContainer mt-3">
        <v-card flat>
          <img
            class="userPhoto mx-auto"
            :src="currentUser.profilePictureUrl ? currentUser.profilePictureUrl : noAvatarImage"
            alt="avatar"
          >
        </v-card>
        <div
          class="mt-2"
          style="text-align: center; color: #fff; font-size: 13px"
        >{{currentUser && currentUser.name}}</div>
      </div>
    </v-layout>
    <v-layout>
      <v-flex class="sidebar-content">
        <v-list dense>
          <v-list-group
            v-for="item in items.filter(x=>x.isSystem && x.visible)"
            :key="item.title"
            :prepend-icon="item.icon"
            append-icon
            :value="item.expanded"
            @click="click($event, item)"
            @click.middle="clickMiddle($event, item)"
          >
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title :title="item.title">{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action v-if="item.subItems.length > 0">
                <v-btn icon @click.stop="toogleList(item)">
                  <v-icon>{{ item.arrowDirection }}</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
            <v-list-tile
              v-for="subItem in item.subItems.filter(subItem => subItem.visible)"
              :key="subItem.title"
              @click="click($event, subItem)"
            >
              <v-list-tile-action @click.middle="clickMiddle($event, subItem)">
                <v-icon>{{ subItem.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content @click.middle="clickMiddle($event, subItem)">
                <v-list-tile-title :title="subItem.title">{{ subItem.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </v-list>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <v-text-field
      v-if="searchbar && !mini"
      class="mx-3 my-2"
      style="padding-top: 0"
      v-model="searchQuery"
      :placeholder="searchbarPlaceholder"
      hide-details
      append-icon="mdi-magnify"
      single-line
      clearable
      @click:clear="clearSearch"
    ></v-text-field>
    <v-list dense expand>
      <v-list-group
        v-for="item in items.filter(item => !item.isSystem && item.visible && searchResult(item))"
        :key="item.title"
        :prepend-icon="item.icon"
        append-icon
        :title="item.title"
        v-model="item.expanded"
        :class="[item.selected ? 'selected' : '']"
        @click="click($event, item)"
        @click.middle="clickMiddle($event, item)"
      >
        <v-list-tile slot="activator">
          <v-list-tile-content>
            <v-list-tile-title :title="item.title">{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action v-if="item.subItems.length > 0">
            <v-btn icon @click.stop="toogleList(item)">
              <v-icon>{{ item.arrowDirection }}</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
        <v-list-tile
          v-for="subItem in item.subItems.filter(x => x.visible && searchResult(x))"
          :key="subItem.title"
          :class="[subItem.selected ? 'selected' : '']"
          @click="click($event, subItem)"
        >
          <v-list-tile-action @click.middle="clickMiddle($event, subItem)">
            <v-icon>{{ subItem.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content @click.middle="clickMiddle($event, subItem)">
            <v-list-tile-title :title="subItem.title">{{ subItem.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list-group>
    </v-list>
    <slot></slot>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { AuthUser, IAuthService } from "ayax-common-auth";
import { mixins } from "vue-class-component";
import { Component, Inject, Prop, Vue, Watch } from "vue-property-decorator";
import { OpenInNewWindowMixin } from "../../Mixins/OpenInNewWindow/OpenInNewWindowMixin";
import { SidebarComponentItem } from "./SidebarItem";

@Component({
  name: "a-sidebar"
})
export default class SidebarComponent extends Vue {
  @Inject() authService: IAuthService;
  @Prop({ default: () => [] }) modules: string[];
  @Prop() items: SidebarComponentItem[];
  @Prop({ default: true }) darkTheme: boolean;
  @Prop({ default: 256 }) width: number;
  @Prop({ default: false }) searchbar: boolean;
  @Prop({ default: "Поиск раздела..." }) searchbarPlaceholder: string;
  @Prop({ default: false }) value: boolean;
  mini = this.value;
  currentUser: AuthUser = new AuthUser();
  noAvatarImage = require("../../assets/image/no_avatar_image.png");

  searchQuery = "";

  @Watch("searchQuery")
  onSearch(val: string, oldVal: string) {
    if (val.length === 0 && oldVal.length > 0) {
      this.items.forEach(item => {
        item.expanded = false;
        item.arrowDirection = "mdi-chevron-down";
      });
    }
  }

  searchResult(item: SidebarComponentItem) {
    if (this.searchQuery.length > 0) {
      if (item.subItems.length > 0) {
        if (
          item.subItems.filter(x =>
            x.title
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase().trim())
          ).length > 0
        ) {
          item.expanded = true;
          item.arrowDirection = "mdi-chevron-up";
          return true;
        } else {
          return false;
        }
      } else if (
        item.title.toLowerCase().includes(this.searchQuery.toLowerCase().trim())
      ) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }

  async created() {
    this.currentUser = await this.authService.GetCurrentUser();
    this.$router.afterEach((to, from) => {
      this.FillActiveItemFromRoute(to.path);
    });
  }

  mounted() {
    this.FillActiveItemFromRoute(this.$router.currentRoute.path);
  }

  clearSearch() {
    this.$nextTick(() => {
      this.searchQuery = "";
    });
  }

  FillActiveItemFromRoute(routePath: string) {
    this.items.forEach(element => {
      element.selected = false;
      element.subItems.forEach(subElement => {
        subElement.selected = false;
      });
    });
    this.items
      .filter(x => !x.isSystem)
      .some(item => {
        if (
          (item.path && item.path === routePath) ||
          (!item.path && item.route === routePath)
        ) {
          item.selected = true;
          return true;
        } else if (item.subItems && item.subItems.length > 0) {
          if (
            item.subItems.some(
              subItem =>
                (subItem.selected =
                  (subItem.path && subItem.path === routePath) ||
                  (!subItem.path && subItem.route === routePath))
            )
          ) {
            item.expanded = true;
            return true;
          } else {
            return false;
          }
        }
        return false;
      });
  }

  @Watch("value")
  onChange() {
    this.mini = this.value;
  }

  @Watch("mini")
  onStateChanged(val: boolean, oldVal: boolean) {
    this.$emit("input", this.mini);
    if (val === true) {
      this.items.forEach(element => {
        element.expanded = false;
        element.arrowDirection = "mdi-chevron-down";
      });
    }
  }

  toogleList(item: SidebarComponentItem) {
    this.items.forEach(element => {
      if (element !== item) {
        element.expanded = false;
        element.arrowDirection = "mdi-chevron-down";
      }
    });

    item.expanded = !item.expanded;
    item.arrowDirection === "mdi-chevron-down"
      ? (item.arrowDirection = "mdi-chevron-up")
      : (item.arrowDirection = "mdi-chevron-down");
  }

  click(e, item: SidebarComponentItem) {
    e = e || window.event;
    if (item.route == null && item.href == null) {
      this.toogleList(item);
      this.mini = false;
    } else if (item.route != null) {
      if (item.newTab || e.ctrlKey || e.which === 2 || e.button === 4) {
        window.open(item.route);
      } else {
        this.$router.push({ path: item.route });
      }
    } else if (item.href != null) {
      if (item.newTab || e.ctrlKey || e.which === 2 || e.button === 4) {
        window.open(item.href);
      } else {
        location.href = item.href;
      }
    }
  }

  clickMiddle(e, item: SidebarComponentItem) {
    e.preventDefault();
    if (item.route != null) {
      window.open(item.route);
      return;
    } else if (item.href != null) {
      window.open(item.route);
      return;
    }
    this.click(e, item);
  }

  moveToNewWindow(item: SidebarComponentItem) {
    if (item.route == null && item.href == null) {
      this.toogleList(item);
      this.mini = false;
    } else if (item.route != null) {
      window.open(item.route);
    } else if (item.href != null) {
      window.open(item.href);
    }
  }
}
</script>

<style scoped>
.sidebarComponent::-webkit-scrollbar {
  width: 8px;
}

.sidebarComponent::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 8px;
  border: 2px solid #464646;
}

.sidebar-switcher {
  max-width: 60px;
}

.list__tile__action {
  min-width: 32px !important;
}

.list__tile__title {
  color: #ffffff;
}
.collapseBtn {
  margin-left: 12px;
}

.userPhoto {
  display: block;
  max-width: 100%;
  height: auto;
  width: auto;
  max-height: 144px;
  border: 1px solid #fff;
}

.userPhotoContainer {
  width: 224px;
}

.v-list__group.selected {
  background-color: rgb(250, 250, 250);
  color: rgba(0, 0, 0, 0.87);
}

.v-list__group.selected >>> .v-icon {
  color: rgba(0, 0, 0, 0.87);
}

.selected {
  background-color: rgb(250, 250, 250);
  color: rgba(0, 0, 0, 0.87);
}

.selected >>> .v-icon {
  color: rgba(0, 0, 0, 0.87);
}
</style>