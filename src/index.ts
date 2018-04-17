import Vue from 'vue';
import Vuetify from 'vuetify';
import VueRouter from "vue-router";
import FastFilterComponent from './components/fast-filter/fast-filter.vue';
import TableComponent from './components/table/table.vue';
import TableFilterComponent from './components/table-filter/table-filter.vue';
import FormComponent from './components/form/form.vue';
import NotificationComponent from './components/notification/notification.vue';
import FormControlComponent from './components/form/form-control.vue';
import SidebarComponent from './components/sidebar/sidebar.vue';
import ListDialogComponent from './components/list-dialog/list-dialog.vue'
import BreadcrumbsComponent from './components/breadcrumbs/breadcrumbs.vue'
import { DatePicker } from 'element-ui';
import lang from 'element-ui/lib/locale/lang/ru-RU';
import locale from 'element-ui/lib/locale';
locale.use(lang);
Vue.use(Vuetify);

export default {
    install(Vue) {
        Vue.component(DatePicker.name, DatePicker)
        Vue.component('a-table', TableComponent);
        Vue.component('a-table-filter', TableFilterComponent);
        Vue.component('a-form', FormComponent);
        Vue.component('a-form-control', FormControlComponent);
        Vue.component('a-notification', NotificationComponent);
        Vue.component('a-fast-filter', FastFilterComponent);
        Vue.component('a-sidebar', SidebarComponent);
        Vue.component('a-list-dialog', ListDialogComponent);
        Vue.component('a-breadcrumbs', BreadcrumbsComponent);
    }
}

export * from "./helpers/form-component-helper";
export * from "./components/fast-filter/fast-filter-item";
export * from "./components/form/form-item";
export * from "./components/table/table-action";
export * from "./components/table/table-header";
export * from "./components/table-filter/table-filter-item";
export * from "./components/sidebar/sidebar-item";
export * from "./components/breadcrumbs/breadcrumb-item"
export * from "./providers/notification/notification-provider"

export { 
    FastFilterComponent, 
    TableComponent, 
    TableFilterComponent, 
    FormComponent, 
    NotificationComponent, 
    FormControlComponent, 
    SidebarComponent, 
    ListDialogComponent,
    BreadcrumbsComponent
};