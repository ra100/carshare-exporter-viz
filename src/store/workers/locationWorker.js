const refreshLocationMarkersWorker = ({locations}) => {
  let max = 0
  const keys = Object.keys(locations)
  const newLocations = keys.map(key => {
    const count = locations[key]
    const [lat, lng] = key.split(',')
    max = count > max ? count : max
    return { lat, lng, count }
  })
  return {newLocations, max}
}

self.addEventListener('message', (event) => {
  const {data: {action}} = event
  if (!action || action !== 'locations') {
    return
  }
  const result = refreshLocationMarkersWorker(event.data)
  self.postMessage(result)
})
