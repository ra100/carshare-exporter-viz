import L from 'leaflet'

export const addGroupLayer = (state, layerName) => {
  state[layerName].addTo(state.VL.maps.map)
  state.visibleLayers.push(layerName)
}

export const removeGroupLayer = (state, layerName) => {
  state[layerName].remove()
  state.visibleLayers = state.visibleLayers.filter(name => name !== layerName)
}

export const addLocationsMarker = (state, {marker, radius}) => {
  const lMarker = L.circleMarker(marker, {radius})
  state.locationMarkers.push(lMarker)
  state.layerLocations.addLayer(lMarker)
}

export const addMarker = (state, {marker, options, tooltip}) => {
  const lMarker = L.marker(marker, options)
  state.markers.push(lMarker)
  lMarker.bindPopup(tooltip)
  state.layerMarkers.addLayer(lMarker)
}

export const addTrail = (state, {car, trail}) => {
  const lTrail = L.polyline(trail, {color: 'rgba(9, 101, 186, 0.5)'})
  state.trails.push({
    carId: car.metric.id,
    polyline: lTrail
  })
  state.layerTrails.addLayer(lTrail)
}

export const setCars = (state, cars) => {
  state.cars = {...cars}
}

export const addCar = (state, {car, key}) => {
  state.cars[key] = car
}

export const setLocations = (state, locations) => {
  state.locations = {...locations}
}

export const clearMarkers = (state) => {
  state.layerMarkers.clearLayers()
}

export const clearLocationMarkers = (state) => {
  state.layerLocations.clearLayers()
}

export const clearTrailMarkers = (state) => {
  state.layerTrails.clearLayers()
}

export const showCar = (state, id) => {
  state.cars[id].visible = true
}

export const hideCar = (state, id) => {
  state.cars[id].visible = false
}
