import {sortBy} from 'lodash'

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

const processCars = ({results}) => {
  const cars = {}
  const locations = {}
  const [latResult, lngResult, availableResult] = results
  const lat = sortBy(latResult.data.data.result, car => car.metric.id)
  const lng = sortBy(lngResult.data.data.result, car => car.metric.id)
  const available = sortBy(availableResult.data.data.result, car => car.metric.id)
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
}

self.addEventListener('message', (event) => {
  const {data: {action}} = event
  if (!action || action !== 'processCars') {
    return
  }
  const result = processCars(event.data)
  self.postMessage(result)
})
