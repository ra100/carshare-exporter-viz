module.exports = {
  metricsKeys: {
    lat: 'car4way_car_lat',
    lng: 'car4way_car_lng'
  },
  filter: '{city=~"Praha"}',
  axiosConfig: {
    baseURL: 'https://prometheus.example.com/api/v1',
    auth: {
      username: 'example',
      password: 'examplePassword'
    }
  }
}