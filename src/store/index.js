import Vue from 'vue'
import Vuex from 'vuex'
import {VectorLayer} from 'maptalks'
import {HeatLayer} from 'maptalks.heatmap'
import {ODLineLayer} from 'maptalks.odline'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

Vue.use(Vuex)

const heatLayer = new HeatLayer('heat', [])
heatLayer.config({
  gradient: {0: 'rgba(103, 200, 116, 0.5)', 1: 'rgb(24, 159, 59)'}
})

const state = {
  map: null,
  markers: [],
  cars: {},
  locations: {},
  locationMarkers: [],
  trails: [],
  layerMarkers: new VectorLayer('markers', []),
  layerLocations: heatLayer,
  layerTrails: new ODLineLayer('trails', []),
  visibleLayers: []
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})
