import L from 'leaflet'

export const addLocationsMarker = (state, {marker, radius}) => {
  const lMarker = L.circleMarker(marker, {radius})
  state.locationMarkers.push(lMarker)
  lMarker.addTo(state.VL.maps.map)
}

export const addMarker = (state, {marker, options, tooltip}) => {
  const lMarker = L.marker(marker, options)
  state.markers.push(lMarker)
  lMarker.addTo(state.VL.maps.map).bindPopup(tooltip)
}

export const addTrail = (state, {car, trail}) => {
  const lTrail = L.polyline(trail, {color: 'rgba(9, 101, 186, 0.5)'})
  state.trails.push({
    carId: car.id,
    polyline: lTrail
  })
  lTrail.addTo(state.VL.maps.map)
}

export const setCars = (state, cars) => {
  state.cars = {...cars}
}

export const setLocations = (state, locations) => {
  state.locations = {...locations}
}

export const clearMarkers = (state) => {
  state.markers.forEach(marker => marker.remove())
  state.locationMarkers.forEach(marker => marker.remove())
  state.trails.forEach(trail => trail.trail.remove())
  state.markers = []
  state.locationMarkers = []
  state.trails = []
}
