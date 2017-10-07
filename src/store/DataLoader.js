import axios from 'axios'
import CarsWorker from './workers/carsWorker.js'
import local from '../../config/local'
const timeframe = (30 * 24 * 60 * 60) // 30 days
const step = 300

const client = axios.create(local.axiosConfig)
const worker = new CarsWorker()

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
    return new Promise((resolve, reject) => {
      worker.onmessage = ({data}) => {
        return resolve(data)
      }
      worker.onerror = (error) => {
        reject(new Error(error))
      }
      // https://stackoverflow.com/questions/42376464/uncaught-domexception-failed-to-execute-postmessage-on-window-an-object-co
      worker.postMessage({action: 'processCars', results: JSON.parse(JSON.stringify(results))})
    })
  } catch (error) {
    console.error(error)
  }
}

export default {
  getData
}
