import Vue from 'vue';
import FastFilterComponent from './fast-filter/fast-filter.vue';
import TableComponent from './table/table.vue';
import TableFilterComponent from './table-filter/table-filter.vue';
import FormComponent from './form/form.vue';
import NotificationComponent from './notification/notification.vue';
import FormControlComponent from './form/form-control.vue';
import SidebarComponent from './sidebar/sidebar.vue';
import BreadcrumbsComponent from './breadcrumbs/breadcrumbs.vue';

Vue.component('a-table', TableComponent);
Vue.component('a-table-filter', TableFilterComponent);
Vue.component('a-form', FormComponent);
Vue.component('a-form-control', FormControlComponent);
Vue.component('a-notification', NotificationComponent);
Vue.component('a-fast-filter', FastFilterComponent);
Vue.component('a-sidebar', SidebarComponent);
Vue.component('a-breadcrumbs', BreadcrumbsComponent);