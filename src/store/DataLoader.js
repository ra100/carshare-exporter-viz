import axios from 'axios'
import _ from 'lodash'
import local from '../../config/local'
const timeframe = (14 * 24 * 60 * 60) // WEEK
const step = 360

const client = axios.create(local.axiosConfig)

const {metricsKeys, filter} = local

const callApi = (query) => {
  const now = Date.now() / 1000
  return client({
    method: 'GET',
    url: '/query_range',
    params: {
      query: `${query}${filter}`,
      start: now - timeframe,
      end: now,
      step,
      _: Date.now()
    }
  })
}

const getTrail = (values) =>
  values.reduce((acc, cur) => {
    const prev = (acc.length > 0 && acc[acc.length - 1]) || []
    if (cur.available !== '1' ||
      (prev.lat === cur.lat &&
      prev.lng === cur.lng)) {
      return acc
    }
    acc.push([cur.lat, cur.lng])
    return acc
  }, [])

export const getData = () => {
  const cars = {}
  const locations = {}
  return Promise.all([callApi(metricsKeys.lat), callApi(metricsKeys.lng), callApi(metricsKeys.available)])
    .then(results => {
      const [latResult, lngResult, availableResult] = results
      const lat = _.sortBy(latResult.data.data.result, car => car.metric.id)
      const lng = _.sortBy(lngResult.data.data.result, car => car.metric.id)
      const available = _.sortBy(availableResult.data.data.result, car => car.metric.id)
      lat.forEach((car, carIndex) => {
        const latValues = car.values
        const newCar = {metric: car.metric, values: [], trail: [], visible: true}
        latValues.forEach((oneLat, index) => {
          const val = {
            lat: oneLat[1],
            lng: lng[carIndex].values[index][1],
            available: available[carIndex].values[index][1]
          }
          newCar.values.push(val)
        })
        newCar.values.forEach(location => {
          const key = `${location.lat},${location.lng}`
          ;(locations[key] = (!!locations[key] && locations[key]) || 0)
          ;locations[key] += Number(location.available)
        })
        newCar.trail = getTrail(newCar.values)
        cars[car.metric.name] = newCar
      })
      return {cars, locations}
    })
    .catch(console.error)
}

export default {
  getData
}
