import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

Vue.use(Vuex)

const state = {
  markers: [],
  cars: {},
  locations: {},
  locationMarkers: [],
  trails: []
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})
