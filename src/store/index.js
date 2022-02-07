import Vue from 'vue'
import Vuex from 'vuex'

import main from './main'
import form from './form'
import options from './options'
import cruises from './cruises'
import settings from './settings'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {main, form, options, cruises, settings}
})

export default store