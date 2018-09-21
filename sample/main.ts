import "@mdi/font/css/materialdesignicons.css";
import "element-ui/lib/theme-chalk/index.css";
import "vuetify/dist/vuetify.min.css";
import "../node_modules/roboto-fontface/css/roboto/roboto-fontface.css";
import "./style.css";

import { DatePicker } from "element-ui";
import locale from "element-ui/lib/locale";
import lang from "element-ui/lib/locale/lang/ru-RU";
import Vue from "vue";
import VueRouter, { RouterOptions } from "vue-router";
import Vuetify from "vuetify";
import AyaxCommonVueAssets from "../src/index";
import App from "./app/app.vue";
import { routes } from "./routes";
locale.use(lang);

Vue.use(Vuetify, {
    iconfont: "mdi"
});
Vue.component(DatePicker.name, DatePicker);
Vue.use(VueRouter);
Vue.use(AyaxCommonVueAssets);
Vue.use(require("vue-shortkey"));

const routerOptions = <RouterOptions> { mode: "history", routes };
// tslint:disable-next-line:no-unused-expression
new Vue({
    el: "#app",
    router: new VueRouter(routerOptions),
    render: h => h(App)
});
