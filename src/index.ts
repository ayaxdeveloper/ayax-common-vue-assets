import "@mdi/font/css/materialdesignicons.css";
import { DatePicker } from "element-ui";
import Vue from "vue";
import Vuetify from "vuetify";
import ActionbarComponent from "./components/actionbar/actionbar.vue";
import BreadcrumbsComponent from "./components/breadcrumbs/breadcrumbs.vue";
import EditComponent from "./components/edit/edit.vue";
import FormControlComponent from "./components/form/form-control.vue";
import FormComponent from "./components/form/form.vue";
import ListDialogComponent from "./components/list-dialog/list-dialog.vue";
import ListComponent from "./components/list/list.vue";
import NotificationComponent from "./components/notification/notification.vue";
import SidebarComponent from "./components/sidebar/sidebar.vue";
import TableComponent from "./components/table/table.vue";
import TableFilterComponent from "./components/TableFilterComponent/TableFilterComponent.vue";
import UserProfileComponent from "./components/user-profile/user-profile.vue";
Vue.use(Vuetify, {
    iconfont: "mdi"
});

export default {
    // tslint:disable-next-line:variable-name
    install(Vue) {
        Vue.component(DatePicker.name, DatePicker);
        Vue.component("a-table", TableComponent);
        Vue.component("a-table-filter", TableFilterComponent);
        Vue.component("a-form", FormComponent);
        Vue.component("a-form-control", FormControlComponent);
        Vue.component("a-notification", NotificationComponent);
        Vue.component("a-sidebar", SidebarComponent);
        Vue.component("a-list-dialog", ListDialogComponent);
        Vue.component("a-breadcrumbs", BreadcrumbsComponent);
        Vue.component("a-list", ListComponent);
        Vue.component("a-edit", EditComponent);
        Vue.component("a-user-profile", UserProfileComponent);
        Vue.component("a-actionbar", ActionbarComponent);
    }
};

export * from "./helpers/form-component-helper";
export * from "./components/form/form-item";
export * from "./components/table/table-action";
export * from "./components/table/table-header";
export * from "./components/TableFilterComponent/TableFilterComponentItem";
export * from "./components/sidebar/sidebar-item";
export * from "./components/breadcrumbs/breadcrumb-item";
export * from "./providers/notification/notification-provider";
export * from "./components/TableFilterComponent/TableFilterComponentItemAppearance";
export * from "./components/TableFilterComponent/TableFilterComponentItemInputType";
export * from "./components/TableFilterComponent/TableFilterComponentItemType";
export * from "./components/TableFilterComponent/Filter";
export * from "./components/TableFilterComponent/FilterOperation";
export * from "./components/TableFilterComponent/FilterValue";

export { 
    TableComponent, 
    TableFilterComponent, 
    FormComponent, 
    NotificationComponent, 
    FormControlComponent, 
    SidebarComponent, 
    ListComponent,
    EditComponent,
    ListDialogComponent,
    BreadcrumbsComponent,
    UserProfileComponent,
    ActionbarComponent
};