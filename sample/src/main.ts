import 'vuetify/dist/vuetify.min.css'
import 'element-ui/lib/theme-chalk/index.css';
import '../node_modules/mdi/css/materialdesignicons.css';

import Vue from 'vue';
import VueRouter from 'vue-router'
import Vuetify from 'vuetify';
import App from './app/app.vue'

Vue.use(Vuetify);
Vue.use(VueRouter);

require('./components/component-registration');

new Vue({
  el: '#app',
  render: h => h(App),
  created: function () {
        
  }
})
