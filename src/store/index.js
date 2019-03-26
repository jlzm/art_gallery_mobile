import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import * as actions from './actions'
import * as mutations from './mutations'
import * as getters from './getters'
import state from './rootState'
Vue.use(Vuex)

export default new Vuex.Store({
  actions,
  mutations,
  getters,
  state,
  plugins: [createPersistedState()]
})
