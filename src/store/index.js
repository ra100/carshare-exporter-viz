import Vue from 'vue'
import Vuex from 'vuex'
import L from 'leaflet'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

Vue.use(Vuex)

const state = {
  markers: [],
  cars: {},
  locations: {},
  locationMarkers: [],
  trails: [],
  layerMarkers: L.layerGroup([]),
  layerLocations: L.layerGroup([]),
  layerTrails: L.layerGroup([]),
  visibleLayers: []
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})
