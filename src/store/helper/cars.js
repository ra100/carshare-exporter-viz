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

export const processCars = ({results}) => {
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
    newCar.values = latValues.reduce((acc, oneLat, index) => {
      const curr = {
        lat: oneLat[1],
        lng: lngValues[index][1],
        available: availableValues[index][1]
      }
      if (index === 0) {
        return [curr]
      }
      const prev = acc[acc.length - 1]
      if (prev.lat === curr.lat && prev.lng === curr.lng && prev.available === curr.available) {
        return acc
      }
      const key = `${oneLat[1]},${lngValues[index][1]}`
      ;(locations[key] = (!!locations[key] && locations[key]) || 0)
      ;locations[key] += Number(availableValues[index][1])
      acc.push(curr)
      return acc
    }, [])
    newCar.trail = getTrail(newCar.values)
    cars[car.metric.name] = {
      trail: Object.freeze(newCar.trail),
      visible: newCar.visible,
      metric: Object.freeze(newCar.metric),
      values: Object.freeze(newCar.values)
    }
  })
  return {cars, locations}
}

export default {
  processCars
}

// self.addEventListener('message', (event) => {
//   const {data: {action}} = event
//   if (!action || action !== 'processCars') {
//     return
//   }
//   const result = processCars(event.data)
//   self.postMessage(result)
// })
