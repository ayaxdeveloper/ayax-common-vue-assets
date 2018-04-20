import 'vuetify/dist/vuetify.min.css'
import 'element-ui/lib/theme-chalk/index.css';
import '../node_modules/mdi/css/materialdesignicons.css';

import Vue from 'vue';
import VueRouter from 'vue-router'
import Vuetify from 'vuetify';
import App from './app/app.vue'
import { routes } from './routes';
import AyaxCommonVueAssets from '../src/index';

Vue.use(Vuetify);
Vue.use(VueRouter);
Vue.use(AyaxCommonVueAssets);
Vue.use(require('vue-shortkey'));

new Vue({
    el: '#app',
    router: new VueRouter({ mode: 'history', routes: routes }),
    render: h => h(App),
    created: function () {
          
    }
})
