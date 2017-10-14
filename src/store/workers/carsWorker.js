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

const getTrail = (values) =>
  values.reduce((acc, cur, index) => {
    if (index === 0) {
      return [[cur.lat, cur.lng]]
    }
    const prev = acc[acc.length - 1]
    if (Number.parseInt(cur.available) !== 1 ||
      (prev[0] === cur.lat &&
      prev[1] === cur.lng)) {
      return acc
    }
    acc.push([cur.lat, cur.lng])
    return acc
  }, [])

const processCars = (results) => {
  const cars = {}
  const locations = {}
  const [latResult, lngResult, availableResult] = results
  const tmpCars = {}
  latResult.data.data.result.forEach(car => {
    tmpCars[car.metric.id] = {
      lat: car.values,
      lng: [],
      available: [],
      metric: car.metric
    }
  })
  lngResult.data.data.result.forEach(car => {
    tmpCars[car.metric.id].lng = car.values
  })
  availableResult.data.data.result.forEach(car => {
    tmpCars[car.metric.id].available = car.values
  })
  Object.keys(tmpCars).forEach((carId) => {
    const car = tmpCars[carId]
    const latValues = car.lat
    const lngValues = car.lng
    const availableValues = car.available
    const newCar = {metric: car.metric, values: [], trail: [], visible: true}
    newCar.values = latValues.map((acc, index) => {
      const curr = {
        lat: acc[1],
        lng: lngValues[index][1],
        available: availableValues[index][1]
      }
      const key = `${acc[1]},${lngValues[index][1]}`
      ;(locations[key] = (!!locations[key] && locations[key]) || 0)
      ;locations[key] += Number(availableValues[index][1])
      return curr
    })
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
      callApi({query: metricsKeys.lng, start, end}),
      callApi({query: metricsKeys.available, start, end})
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
