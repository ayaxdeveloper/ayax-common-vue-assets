
import Vue from "vue";
import Vuetify from "vuetify";
import ActionbarComponent from "./Components/ActionbarComponent/ActionbarComponent.vue";
import BreadcrumbsComponent from "./Components/BreadcrumbsComponent/BreadcrumbsComponent.vue";
import BusyLoadingComponent from "./Components/BusyLoadingComponent/BusyLoadingComponent.vue";
import FormComponent from "./Components/FormComponent/FormComponent.vue";
import FormControlComponent from "./Components/FormComponent/FormControlComponent.vue";
import NotificationComponent from "./Components/NotificationComponent/NotificationComponent.vue";
import SidebarComponent from "./Components/SidebarComponent/SidebarComponent.vue";
import TableComponent from "./Components/TableComponent/TableComponent.vue";
import TableTopbarComponent from "./Components/TableComponent/TableTopbarComponent.vue";
import TableFilterComponent from "./Components/TableFilterComponent/TableFilterComponent.vue";
import UserProfileComponent from "./Components/UserProfileComponent/UserProfileComponent.vue";
Vue.use(Vuetify, {
    iconfont: "mdi"
});

export default {
    // tslint:disable-next-line:variable-name
    install(Vue) {
        Vue.component("a-table", TableComponent);
        Vue.component("a-table-topbar", TableTopbarComponent);
        Vue.component("a-table-filter", TableFilterComponent);
        Vue.component("a-form", FormComponent);
        Vue.component("a-form-control", FormControlComponent);
        Vue.component("a-notification", NotificationComponent);
        Vue.component("a-sidebar", SidebarComponent);
        Vue.component("a-breadcrumbs", BreadcrumbsComponent);
        Vue.component("a-busy-loading", BusyLoadingComponent);
        Vue.component("a-user-profile", UserProfileComponent);
        Vue.component("a-actionbar", ActionbarComponent);
    }
};

export * from "./Helpers/FormComponentHelper";
export * from "./Components/FormComponent/FormItem";
export * from "./Components/TableFilterComponent/TableFilterComponentItem";
export * from "./Components/SidebarComponent/SidebarItem";
export * from "./Components/BreadcrumbsComponent/BreadcrumbItem";
export * from "./Providers/NotificationProvider/NotificationProvider";
export * from "./Components/TableFilterComponent/TableFilterComponentItemAppearance";
export * from "./Components/TableFilterComponent/TableFilterComponentItemInputType";
export * from "./Components/TableFilterComponent/TableFilterComponentItemType";
export * from "./Components/TableFilterComponent/Filter";
export * from "./Components/TableFilterComponent/FilterOperation";
export * from "./Components/TableFilterComponent/FilterValue";
export * from "./Components/TableComponent/TableHeader";
export * from "./Components/TableComponent/TableOptions";
export * from "./Components/ActionbarComponent/ActionItem";

export { 
    TableComponent, 
    TableFilterComponent, 
    FormComponent, 
    NotificationComponent, 
    FormControlComponent, 
    SidebarComponent,
    BreadcrumbsComponent,
    UserProfileComponent,
    ActionbarComponent,
    BusyLoadingComponent
};