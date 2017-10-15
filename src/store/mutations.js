import * as maptalks from 'maptalks'
const {Marker} = maptalks

export const addGroupLayer = (state, layerName) => {
  state[layerName].addTo(state.map)
  state.visibleLayers.push(layerName)
}

export const removeGroupLayer = (state, layerName) => {
  state[layerName].remove()
  state.visibleLayers = state.visibleLayers.filter(name => name !== layerName)
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
    content: tooltip
  })
  mInfo.addTo(mMarker)
  mMarker.on('click', () => mInfo.isVisible() ? mInfo.hide() : mInfo.show())
  state.markers.push(mMarker)
  state.layerMarkers.addGeometry(mMarker)
}

export const setTrails = (state, trails) => {
  const newTrails = []
  trails.forEach(trail => {
    trail.forEach(points => newTrails.push({
      coordinates: [points[0].reverse(), points[1].reverse()]
    }))
  })
  state.trails = newTrails
  state.layerTrails.setData(state.trails)
  window.od = state.layerTrails
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
  state.layerTrails.setData([])
}

export const showCar = (state, name) => {
  state.cars[name].visible = true
}

export const hideCar = (state, name) => {
  state.cars[name].visible = false
}
