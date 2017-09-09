<template>
  <div class="row at-row no-gutter flex-between flex-middle">
    <div class="col-md-12">
      <at-button type="primary" @click="loadData"><i class="icon icon-refresh-ccw"></i> Reload</at-button>
      <at-dropdown @on-dropdown-command="handleLayer" trigger="click">
        <at-button>Layers <i class="icon icon-chevron-down"></i></at-button>
        <at-dropdown-menu slot="menu">
          <at-dropdown-item name="layerLocations">
            <i v-if="visibleLayers.includes('layerLocations')" class="icon icon-eye"></i>
            <i v-else class="icon icon-eye-off"></i> Locations</at-dropdown-item>
          <at-dropdown-item name="layerMarkers">
            <i v-if="visibleLayers.includes('layerMarkers')" class="icon icon-eye"></i>
            <i v-else class="icon icon-eye-off"></i> Current location</at-dropdown-item>
          <at-dropdown-item name="layerTrails">
            <i v-if="visibleLayers.includes('layerTrails')" class="icon icon-eye"></i>
            <i v-else class="icon icon-eye-off"></i> Trails</at-dropdown-item>
        </at-dropdown-menu>
      </at-dropdown>
      <at-dropdown @on-dropdown-command="handleCar" trigger="click">
        <at-button>Cars <i class="icon icon-chevron-down"></i></at-button>
          <at-dropdown-menu slot="menu">
            <at-dropdown-item v-for="car in carsArray" :key="car.metric.id" :name="car.metric.name">
              <i v-if="car.visible" class="icon icon-eye"></i>
              <i v-else class="icon icon-eye-off"></i> {{car.metric.name}}
            </at-dropdown-item>
            <at-dropdown-item name="hideAll">
              Hide All
            </at-dropdown-item>
            <at-dropdown-item name="showAll">
              Show All
            </at-dropdown-item>
          </at-dropdown-menu>
      </at-dropdown>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import {mapActions, mapState} from 'vuex'
export default {
  name: 'toolbar',
  computed: {
    ...mapState([
      'visibleLayers',
      'cars'
    ]),
    carsArray: function () {
      return _.values(this.cars)
    }
  },
  methods: {
    ...mapActions([
      'loadData',
      'toggleLayer',
      'toggleCar',
      'hideAll',
      'showAll'
    ]),
    handleLayer (name) {
      this.toggleLayer(name)
    },
    handleCar (name) {
      if (['hideAll', 'showAll'].includes(name)) {
        return this[name]()
      }
      return this.toggleCar(name)
    }
  }
}
</script>

<style @scoped>
.at-dropdown-menu {
  max-height: 100%;
}
</style>