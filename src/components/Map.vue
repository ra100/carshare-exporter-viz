<template lang="html">
  <div class="full">
    <div id="map" />
  </div>
</template>

<script>
import {Map, TileLayer} from 'maptalks'

export default {
  data() {
    return {
      zoom: 13,
      center: [14.42385, 50.083143],
      url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
      subdomains: ['a', 'b', 'c', 'd'],
    }
  },
  mounted() {
    const map = new Map('map', {
      center: this.center,
      zoom: this.zoom,
      baseLayer: new TileLayer('base', {
        urlTemplate: this.url,
        subdomains: this.subdomains,
      }),
    })
    this.$store.commit('setMap', map)
    this.$store.dispatch('bindLayers')
    this.$store.dispatch('loadData')
  },
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
