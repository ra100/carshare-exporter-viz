import axios from 'axios'
import CarsWorker from './workers/carsWorker.js'
import local from '../../config/local'
const timeframe = (14 * 24 * 60 * 60) // WEEK
const step = 300

const client = axios.create(local.axiosConfig)
const worker = new CarsWorker()

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

export const getData = () => {
  return Promise.all([
    callApi(metricsKeys.lat),
    callApi(metricsKeys.lng),
    callApi(metricsKeys.available)
  ])
    .then(results => new Promise((resolve, reject) => {
      worker.onmessage = ({data}) => {
        return resolve(data)
      }
      worker.onerror = (error) => {
        reject(new Error(error))
      }
      // https://stackoverflow.com/questions/42376464/uncaught-domexception-failed-to-execute-postmessage-on-window-an-object-co
      const action = JSON.parse(JSON.stringify({action: 'processCars', results}))
      worker.postMessage(action)
    }))
    .catch(console.error)
}

export default {
  getData
}
