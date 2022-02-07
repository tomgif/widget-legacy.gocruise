import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import {defaults} from 'lodash'

Vue.config.productionTip = false

let defaultSettings = {
  theme: 'light',
  currencies: [],
  showResults: false
}

let cesSettings = window.cesSettings || {}
if (cesSettings.email) {
  cesSettings.email = cesSettings.email.replace('[dog]', '@')
}
defaults(cesSettings, defaultSettings)

const root = new Vue({
  render: h => h(App),
  router,
  store,
  created() {
    store.commit('settings/SET_THEME', cesSettings.theme)
    store.commit('settings/SET_EMAIL', cesSettings.email)
    store.commit('settings/SET_CURRENCIES', cesSettings.currencies)
    store.commit('settings/SET_SHOW_RESULTS', cesSettings.showResults)
  }
})

if (!document.getElementById('ces')) {
  document.write(`<div id="ces"></div>`)
}

document.addEventListener('DOMContentLoaded', () => {
  root.$mount('#ces')
})
