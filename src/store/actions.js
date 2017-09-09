import forEach from 'lodash.foreach'
import {getData} from './DataLoader'
import LocationWorker from './workers/locationWorker.js'

const locationWorker = new LocationWorker()

export const bindLayers = ({commit}) => {
  commit('addGroupLayer', 'layerMarkers')
  commit('addGroupLayer', 'layerLocations')
  commit('addGroupLayer', 'layerTrails')
}

export const loadData = ({commit, dispatch}) => {
  getData().then(({cars, locations}) => {
    commit('setCars', {})
    Object.keys(cars).forEach(key => {
      commit('addCar', {key, car: cars[key]})
    })
    commit('setLocations', locations)
    dispatch('refreshLocationMarkers')
    dispatch('refreshCarMarkers')
    dispatch('refreshTrails')
  })
}

export const refreshLocationMarkers = ({commit, state}) => {
  commit('clearLocationMarkers')
  locationWorker.onmessage = ({data: {newLocations, max}}) => {
    newLocations.forEach(location => {
      commit('addLocationsMarker', {
        marker: [location.lat, location.lng],
        radius: Math.max(location.count > 0 ? (location.count / max) * 24 : 6, 6)
      })
    })
  }
  locationWorker.onerror = (error) => {
    console.error(new Error(error))
  }
  locationWorker.postMessage({action: 'locations', locations: state.locations})
}

export const refreshCarMarkers = ({commit, state}) => {
  commit('clearMarkers')
  forEach(state.cars, car => {
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
  commit('clearTrails')
  forEach(state.cars, car => {
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
  forEach(state.cars, car => {
    commit('hideCar', car.metric.name)
  })
  dispatch('refreshCarMarkers')
  dispatch('refreshTrails')
}

export const showAll = ({commit, dispatch, state}) => {
  forEach(state.cars, car => {
    commit('showCar', car.metric.name)
  })
  dispatch('refreshCarMarkers')
  dispatch('refreshTrails')
}
