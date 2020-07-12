module.exports = {
  metricsKeys: {
    lat: 'vehicles_car_lat',
    lng: 'vehicles_car_lng',
  },
  filter: '{provider="revolt"}',
  axiosConfig: {
    baseURL: 'https://prometheus.example.com/api/v1',
    auth: {
      username: 'example',
      password: 'examplePassword',
    },
  },
}
