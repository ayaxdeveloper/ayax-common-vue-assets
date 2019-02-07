<template>
  <div id="app">
    <v-app>
      <a-sidebar v-model="sidebarMiniProp" :searchbar="true" :items="sidebarItems">
        <v-divider></v-divider>
        <v-list dense>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>slot in sidebar</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </a-sidebar>
      <v-content>
        <a-notification :notificationProvider="notificationProvider"></a-notification>
        <v-toolbar dense fixed app>
          <v-toolbar-side-icon>
            <v-icon
              x-large
              @click="sidebarMiniProp = !sidebarMiniProp"
            >{{ sidebarMiniProp ? 'mdi-chevron-right' : 'mdi-chevron-left'}}</v-icon>
          </v-toolbar-side-icon>
          <a-breadcrumbs :breadcrumbsNames="breadcrumbsNames"></a-breadcrumbs>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn small color="success" @click="castNotification('success')">notification</v-btn>
            <v-btn small color="error" @click="castNotification('error')">notification</v-btn>
            <v-btn small color="info" @click="castNotification('info')">notification</v-btn>
            <v-btn small color="warning" @click="castNotification('warning')">notification</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container fluid class="px-3 py-4">
          <router-view></router-view>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { SidebarComponentItem } from "../../src/Components/SidebarComponent/SidebarItem";
import { VueInjection } from "../Injection";

@Component
export default class App extends VueInjection {
  sidebarMiniProp = false;

  breadcrumbsNames = {
    "": { name: "Главная", route: "home" },
    switcher: { name: "Вертушка", route: "switcher-list" },
    route: { name: "Маршруты", route: "route" },
    contacttype: { name: "Типы контактов", route: "contacttype-list" },
    config: { name: "Настройки" },
    help: { name: "Помощь", route: "help" },
    dictionary: { name: "Справочники" },
    list: { name: "Список" },
    board: { name: "Доска" },
    edit: { name: "Редактирование" },
    card: { name: "Карточка" }
  };

  sidebarItems: SidebarComponentItem[] = [
    new SidebarComponentItem({
      title: "Главная",
      icon: "mdi-book-open-variant",
      href: "/",
      isSystem: true
    }),
    new SidebarComponentItem({
      title: "TABLE",
      icon: "mdi-format-list-checkbox",
      route: "/table-test"
    }),
    new SidebarComponentItem({
      title: "НАСТРОЙКИ",
      icon: "mdi-wrench",
      subItems: [
        new SidebarComponentItem({
          title: "Вертушка",
          route: "/switcher/list"
        }),
        new SidebarComponentItem({ title: "Маршруты", route: "/route" }),
        new SidebarComponentItem({ title: "Источники", route: "/infosource" }),
        new SidebarComponentItem({
          title: "Темы обращений",
          route: "/leadtype"
        }),
        new SidebarComponentItem({
          title: "Типы объектов",
          route: "/objecttype"
        }),
        new SidebarComponentItem({
          title: "Номера операторов",
          route: "/operatornumber/list"
        }),
        new SidebarComponentItem({
          title: "Номера подразделений",
          route: "/divisionredirect"
        }),
        new SidebarComponentItem({ title: "Параметры", route: "/preference" })
      ]
    })
  ];

  castNotification(type: string) {
    switch (type) {
      case "success":
        {
          this.notificationProvider.Success("Успешно сохранено");
        }
        break;
      case "error":
        {
          this.notificationProvider.Error();
        }
        break;
      case "info":
        {
          this.notificationProvider.Info();
        }
        break;
      case "warning":
        {
          this.notificationProvider.Warning();
        }
        break;
      default:
        break;
    }
  }

  created() {
    // Проставим текущего пользователя
    const currentUserObject = {
      accessRules: [],
      accessRulesNames: [],
      birthdate: "1988-02-27T00:00:00",
      id: 0,
      identity: null,
      login: "ajax\\as_testuser",
      name: "Тестовый пользователь",
      profilePictureUrl: null,
      subdivisionIds: [11, 14],
      uid: "00000000-0000-0000-0000-000000000000"
    };
    localStorage.setItem("currentUser", JSON.stringify(currentUserObject));
  }
}
</script>                            

<style>
</style>
