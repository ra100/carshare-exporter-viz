import forEach from 'lodash.foreach'
import {getData} from './DataLoader'
import LocationWorker from './workers/locationWorker.js'

const locationWorker = new LocationWorker()

export const bindLayers = ({commit}) => {
  commit('addGroupLayer', 'layerLocations')
  commit('addGroupLayer', 'layerTrails')
  commit('addGroupLayer', 'layerMarkers')
}

export const loadData = ({commit, dispatch}) => {
  getData()
    .then(({cars, locations}) => {
      const frozenCars = {}
      Object.keys(cars).forEach((key) => {
        frozenCars[key] = {
          ...cars[key],
          metrics: Object.freeze(cars[key].metrics),
          trail: Object.freeze(cars[key].trail),
          values: Object.freeze(cars[key].values),
        }
      })
      commit('setCars', cars)
      commit('setLocations', locations)
      dispatch('refreshLocationMarkers')
      dispatch('refreshTrails')
      dispatch('refreshCarMarkers')
    })
    .catch(console.error)
}

export const refreshLocationMarkers = ({commit, state}) => {
  commit('clearLocationMarkers')
  locationWorker.onmessage = ({data: {newLocations, max}}) => {
    newLocations.forEach((location) => {
      commit('addLocationsMarker', {
        marker: [location.lat, location.lng],
        radius: Math.max(location.count > 0 ? (location.count / max) * 24 : 6, 6),
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
  forEach(state.cars, (car) => {
    if (!car.visible) {
      return
    }
    const value = car.values[car.values.length - 1]
    const position = [value.lng, value.lat]
    return commit('addMarker', {
      marker: position,
      options: {
        opacity: (car.available && 1) || 0.5,
      },
      tooltip: `<div>${car.metric.type} - ${car.metric.license}</div>`,
    })
  })
}

export const refreshTrails = ({commit, state}) => {
  commit('clearTrailMarkers')
  commit('clearTrails')
  const trails = []
  forEach(state.cars, (car) => {
    if (car.visible) {
      trails.push(car.trail)
    }
  })
  commit('setTrails', trails)
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

export const toggleType = ({commit, dispatch, state}, {name, visible}) => {
  Object.entries(state.cars).forEach(([key, value]) => {
    if (value.metric.type === name) {
      commit(visible ? 'showCar' : 'hideCar', key)
    }
  })

  dispatch('refreshCarMarkers')
  dispatch('refreshTrails')
}

export const hideAll = ({commit, dispatch, state}) => {
  forEach(state.cars, (car) => {
    commit('hideCar', car.metric.name)
  })
  dispatch('refreshCarMarkers')
  dispatch('refreshTrails')
}

export const showAll = ({commit, dispatch, state}) => {
  forEach(state.cars, (car) => {
    commit('showCar', car.metric.name)
  })
  dispatch('refreshCarMarkers')
  dispatch('refreshTrails')
}
