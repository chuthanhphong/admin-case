import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store'
import router from './router'
import i18n from './i18n'
import VueInteractJs from 'vue-interactjs'
Vue.use(VueInteractJs)

import VueCryptojs from 'vue-cryptojs'
Vue.use(VueCryptojs)

import './plugins/base'
import './plugins/apexchart'
import './plugins/signature-pad'
import './plugins/vee-validate'
import './plugins/feather'
import './plugins/vue-smooth-dnd'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
new Vue({
  vuetify,
  store,
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
