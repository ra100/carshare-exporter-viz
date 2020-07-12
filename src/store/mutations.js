import * as maptalks from 'maptalks'
const {Marker} = maptalks

const seriesConfig = {
  type: 'lines',
  polyline: true,
  data: [],
  lineStyle: {
    normal: {
      width: 0,
    },
  },
  effect: {
    constantSpeed: 40,
    show: true,
    trailLength: 0.8,
    symbolSize: 1.5,
  },
  zlevel: 1,
}

export const addGroupLayer = (state, layerName) => {
  state[layerName].addTo(state.map)
  state.visibleLayers.push(layerName)
}

export const removeGroupLayer = (state, layerName) => {
  state[layerName].remove()
  state.visibleLayers = state.visibleLayers.filter((name) => name !== layerName)
}

export const setMap = (state, map) => {
  state.map = map
}

export const addLocationsMarker = (state, {marker, radius}) => {
  state.locationMarkers.push({marker, radius})
  state.layerLocations.addPoint([[marker[1], marker[0], radius]])
}

export const addMarker = (state, {marker, options, tooltip}) => {
  const mMarker = new Marker(marker)
  const mInfo = new maptalks.ui.InfoWindow({
    content: tooltip,
  })
  mInfo.addTo(mMarker)
  mMarker.on('click', () => (mInfo.isVisible() ? mInfo.hide() : mInfo.show()))
  state.markers.push(mMarker)
  state.layerMarkers.addGeometry(mMarker)
}

export const setTrails = (state, trails) => {
  const series = trails.map((trail) => ({
    ...seriesConfig,
    data: [{coords: trail}],
  }))
  state.trails = Object.freeze(series)
  state.layerTrails.setEChartsOption({series})
}

export const clearTrails = (state) => {
  state.trails = []
}

export const setCars = (state, cars) => {
  state.cars = {...cars}
}

export const addCar = (state, {car, key}) => {
  state.cars[key] = {...car}
}

export const setLocations = (state, locations) => {
  state.locations = {...locations}
}

export const clearMarkers = (state) => {
  state.layerMarkers.clear()
}

export const clearLocationMarkers = (state) => {
  state.layerLocations.clear()
}

export const clearTrailMarkers = (state) => {
  state.layerTrails.setEChartsOption({})
}

export const showCar = (state, name) => {
  state.cars[name].visible = true
}

export const hideCar = (state, name) => {
  state.cars[name].visible = false
}
