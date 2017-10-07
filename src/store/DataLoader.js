import axios from 'axios'
import cars from './helper/cars.js'
import local from '../../config/local'
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

export const getData = async ({from, to} = {}) => {
  const now = Date.now() / 1000
  const end = to || now
  const start = from || now - timeframe
  try {
    const results = await Promise.all([
      callApi({query: metricsKeys.lat, start, end}),
      callApi({query: metricsKeys.lng, start, end}),
      callApi({query: metricsKeys.available, start, end})
    ])
    const data = cars.processCars({results})
    return Promise.resolve(data)
  } catch (error) {
    console.error(error)
  }
}

export default {
  getData
}
