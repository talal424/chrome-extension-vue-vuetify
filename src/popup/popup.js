import Vue from 'vue'
import App from './App'
import vuetify from '@/plugins/vuetify'
import mdi from '@/plugins/Mdi'

Vue.use(mdi)

new Vue({
  el: '#app',
  vuetify,
  render: (h) => h(App)
})
