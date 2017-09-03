import _ from 'lodash'
import {getData} from './DataLoader'

export const bindLayers = ({commit}) => {
  commit('addGroupLayer', 'layerMarkers')
  commit('addGroupLayer', 'layerLocations')
  commit('addGroupLayer', 'layerTrails')
}

export const loadData = ({commit, dispatch}) => {
  getData().then(({cars, locations}) => {
    commit('setCars', cars)
    commit('setLocations', locations)
    dispatch('refreshLocationMarkers')
    dispatch('refreshCarMarkers')
    dispatch('refreshTrails')
  })
}

export const refreshLocationMarkers = ({commit, state}) => {
  commit('clearLocationMarkers')
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
  commit('clearMarkers')
  _.forEach(state.cars, car => {
    if (!car.visible) {
      return
    }
    const value = car.values[car.values.length - 1]
    const position = [value.lat, value.lng]
    return commit('addMarker', {
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
  commit('clearTrailMarkers')
  _.forEach(state.cars, car => {
    if (car.visible) {
      commit('addTrail', {car, trail: car.trail})
    }
  })
}

export const toggleLayer = ({commit, state}, layerName) => {
  if (state.visibleLayers.includes(layerName)) {
    return commit('removeGroupLayer', layerName)
  }
  return commit('addGroupLayer', layerName)
}

export const toggleCar = ({commit, dispatch, state}, name) => {
  if (state.cars[name].visible) {
    commit('hideCar', name)
  } else {
    commit('showCar', name)
  }
  dispatch('refreshCarMarkers')
  dispatch('refreshTrails')
}

export const hideAll = ({commit, dispatch, state}) => {
  _.forEach(state.cars, car => {
    commit('hideCar', car.metric.name)
  })
  dispatch('refreshCarMarkers')
  dispatch('refreshTrails')
}

export const showAll = ({commit, dispatch, state}) => {
  _.forEach(state.cars, car => {
    commit('showCar', car.metric.name)
  })
  dispatch('refreshCarMarkers')
  dispatch('refreshTrails')
}
