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
              <i v-else class="icon icon-eye-off"></i> {{car.metric.type}} - {{car.metric.license}}
            </at-dropdown-item>
            <at-dropdown-item name="hideAll">
              Hide All
            </at-dropdown-item>
            <at-dropdown-item name="showAll">
              Show All
            </at-dropdown-item>
          </at-dropdown-menu>
      </at-dropdown>
      <at-dropdown @on-dropdown-command="handleType" trigger="click">
        <at-button>Types <i class="icon icon-chevron-down"></i></at-button>
          <at-dropdown-menu slot="menu">
            <at-dropdown-item v-for="type in carTypes" :key="type.name" :name="type.name">
              <i v-if="type.visible" class="icon icon-eye"></i>
              <i v-else class="icon icon-eye-off"></i> {{type}}
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
import values from 'lodash.values'
import {mapActions, mapState} from 'vuex'

const sortByType = (a, b) => {
  if (a.metric.type === b.metric.type) {
    return a.metric.license.localeCompare(b.metric.license)
  }
  return a.metric.type.localeCompare(b.metric.type)
}

export default {
  name: 'toolbar',
  data: () => {
    return {
      carsArray: [],
      carTypes: []
    }
  },
  computed: {
    ...mapState([
      'visibleLayers',
      'cars'
    ])
  },
  watch: {
    cars: function (cars) {
      this.carsArray = values(cars).sort(sortByType)
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
    },
    handleType (type) {
      return ''
    }
  }
}
</script>

<style @scoped>
.at-dropdown-menu {
  max-height: calc(100vh - 50px);
  overflow-y: auto;
}
.row {
  margin: 0;
}
</style>