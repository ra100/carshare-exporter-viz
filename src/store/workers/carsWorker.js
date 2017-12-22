import axios from 'axios'
import local from '../../../config/local'
const timeframe = (30 * 24 * 60 * 60) // 30 days
const step = 300

const client = axios.create(local.axiosConfig)
const {metricsKeys, filter} = local

const callApi = ({query, f = filter, start, end} = {}) => {
  return client({
    method: 'GET',
    url: '/query_range',
    params: {
      query: `${query}${f}`,
      start,
      end,
      step,
      _: Date.now()
    }
  })
}

const getTrail = (values) => {
  const start = [[Number(values[0].lng), Number(values[0].lat)]]
  const out = values.reduce((acc, cur, index) => {
    const prev = acc[acc.length - 1]
    if (Number(prev[0]) === Number(cur.lng) &&
      Number(prev[1]) === Number(cur.lat)) {
      return acc
    }
    acc.push([Number(cur.lng), Number(cur.lat)])
    return acc
  }, start)
  if (out.length === 1) {
    out.push(out[0])
  }
  return out
}

const processCars = (results) => {
  const cars = {}
  const locations = {}
  const [latResult, lngResult] = results
  const tmpCars = {}
  latResult.data.data.result.forEach(car => {
    tmpCars[car.metric.id] = {
      lat: car.values,
      lng: [],
      metric: car.metric
    }
  })
  lngResult.data.data.result.forEach(car => {
    tmpCars[car.metric.id].lng = car.values
  })
  Object.keys(tmpCars).forEach((carId) => {
    const car = tmpCars[carId]
    const latValues = car.lat
    const lngValues = car.lng
    const newCar = {metric: car.metric, values: [], trail: [], visible: true}
    newCar.values = latValues.reduce((acc, oneLat, index) => {
      const curr = {
        lat: oneLat[1],
        lng: lngValues[index][1]
      }
      if (index === 0) {
        return [curr]
      }
      const prev = acc[acc.length - 1]
      if (prev.lat === curr.lat && prev.lng === curr.lng) {
        return acc
      }
      const key = `${oneLat[1]},${lngValues[index][1]}`
      ;(locations[key] = (!!locations[key] && locations[key]) || 0)
      locations[key] += 1
      acc.push(curr)
      return acc
    }, [])
    newCar.trail = getTrail(newCar.values)
    cars[car.metric.name] = {
      trail: newCar.trail,
      visible: newCar.visible,
      metric: newCar.metric,
      values: newCar.values
    }
  })
  return {cars, locations}
}

const fetchCars = async ({from, to} = {}) => {
  const now = Date.now() / 1000
  const end = to || now
  const start = from || now - timeframe
  try {
    const results = await Promise.all([
      callApi({query: metricsKeys.lat, start, end}),
      callApi({query: metricsKeys.lng, start, end})
    ])
    return Promise.resolve(processCars(results))
  } catch (error) {
    console.error(error)
  }
}

self.addEventListener('message', (event) => {
  const {data: {action}} = event
  if (!action || action !== 'fetchCars') {
    return
  }
  fetchCars(event.data)
    .then(self.postMessage, self.postMessage)
})
