<template lang="html" src="./Map.html">
</template>

<script>
// import _ from 'lodash'
import '../../node_modules/leaflet/dist/leaflet.css'
import {fixIcon} from './MarkerIcon'

export default {
  data () {
    return {
      zoom: 13,
      center: [50.083143, 14.423850],
      marker: [50.083143, 14.423850],
      minZoom: 2,
      maxZoom: 18,
      url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      title: 'vue-leaflet',
      opacity: 1,
      draggable: true,
      attributionControl: false,
      attribution: 'vue-leaflet',
      cars: {},
      locations: []
    }
  },
  mounted () {
    fixIcon()
  }
}
</script>

<style lang="css">
.full {
  width: 100%;
  height: 100%;
}
#map {
  height: 100%;
}
</style>