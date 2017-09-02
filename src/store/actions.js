import _ from 'lodash'
import {getData} from './DataLoader'

export const loadData = async (context) => {
  const {cars, locations} = await getData()
  context.commit('setCars', cars)
  context.commit('setLocations', locations)
  context.commit('clearMarkers')
  context.dispatch('refreshLocationMarkers')
  context.dispatch('refreshCarMarkers')
  context.dispatch('refreshTrails')
}

export const refreshLocationMarkers = ({commit, state}) => {
  const {locations} = state
  let max = 0
  const newLocations = _.map(locations, (count, key) => {
    const [lat, lng] = key.split(',')
    max = count > max ? count : max
    return { lat, lng, count }
  })
  newLocations.forEach(location => {
    commit('addLocationsMarker', {
      marker: [location.lat, location.lng],
      radius: Math.max(location.count > 0 ? (location.count / max) * 24 : 6, 6)
    })
  })
}

export const refreshCarMarkers = ({commit, state}) => {
  _.map(state.cars, car => {
    const value = car.values[car.values.length - 1]
    const position = [value.lat, value.lng]
    commit('addMarker', {
      marker: position,
      options: {
        opacity: (value.available === '1' && 1) || 0.5
      },
      tooltip: `<div>${car.metric.name}
        </br>${(value.available === '1' && 'available') || 'not available'}</div>`
    })
  })
}

export const refreshTrails = ({commit, state}) => {
  _.map(state.cars, car => car.visible && commit('addTrail', {car, trail: car.trail}))
}
