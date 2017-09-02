module.exports = {
  metricsKeys: {
    lat: 'example_car_lat',
    lng: 'example_car_lng',
    available: 'example_car_available'
  },
  filter: '{id=~"1|2|3"}',
  axiosConfig: {
    baseURL: 'https://prometheus.example.com/api/v1',
    auth: {
      username: 'example',
      password: 'examplePassword'
    }
  }
}