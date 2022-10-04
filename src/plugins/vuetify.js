import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
// import 'vuetify/dist/vuetify.min.css'
import '@/styles/app.scss'
Vue.component('v-style', {
  render: function(createElement) {
    return createElement('style', this.$slots.default)
  }
})

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#0FAFE4',
        secondary: '#9FA2B4',
        info: '#6160dc',
        darken: '#22242c',
        gray: '#8E8EA1',
        purple: '#4A50E2',
        greyticket: '#F5F7F9'
      }
    }
  }
})
