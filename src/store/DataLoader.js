import CarsWorker from './workers/carsWorker.js'

const worker = new CarsWorker()

export const getData = async ({from, to} = {}) =>
  new Promise((resolve, reject) => {
    worker.onmessage = ({data}) => {
      return resolve(data)
    }
    worker.onerror = (error) => {
      reject(new Error(error))
    }
    worker.postMessage({action: 'fetchCars', from, to})
  })

export default {
  getData,
}
