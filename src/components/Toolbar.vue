<template>
  <div class="row at-row no-gutter flex-between flex-middle">
    <div class="col-md-12">
      <at-button type="primary" @click="loadData"> <i class="icon icon-refresh-ccw" /> Reload </at-button>
      <at-dropdown trigger="click" @on-dropdown-command="handleLayer">
        <at-button>Layers <i class="icon icon-chevron-down" /></at-button>
        <at-dropdown-menu slot="menu">
          <at-dropdown-item name="layerLocations">
            <i v-if="visibleLayers.includes('layerLocations')" class="icon icon-eye" />
            <i v-else class="icon icon-eye-off" /> Locations
          </at-dropdown-item>
          <at-dropdown-item name="layerMarkers">
            <i v-if="visibleLayers.includes('layerMarkers')" class="icon icon-eye" />
            <i v-else class="icon icon-eye-off" /> Current location
          </at-dropdown-item>
          <at-dropdown-item name="layerTrails">
            <i v-if="visibleLayers.includes('layerTrails')" class="icon icon-eye" />
            <i v-else class="icon icon-eye-off" /> Trails
          </at-dropdown-item>
        </at-dropdown-menu>
      </at-dropdown>
      <at-dropdown trigger="click" @on-dropdown-command="handleCar">
        <at-button>Cars <i class="icon icon-chevron-down" /></at-button>
        <at-dropdown-menu slot="menu">
          <at-dropdown-item v-for="car in carsArray" :key="car.metric.id" :name="car.metric.name">
            <i v-if="car.visible" class="icon icon-eye" />
            <i v-else class="icon icon-eye-off" /> {{ car.metric.type }} - {{ car.metric.license }}
          </at-dropdown-item>
          <at-dropdown-item name="hideAll">
            Hide All
          </at-dropdown-item>
          <at-dropdown-item name="showAll">
            Show All
          </at-dropdown-item>
        </at-dropdown-menu>
      </at-dropdown>
      <at-dropdown trigger="click" @on-dropdown-command="handleType">
        <at-button>Types <i class="icon icon-chevron-down" /></at-button>
        <at-dropdown-menu slot="menu">
          <at-dropdown-item v-for="type in carTypes" :key="type.name" :name="type.name">
            <i v-if="type.visible" class="icon icon-eye" />
            <i v-else class="icon icon-eye-off" /> {{ type.name }}
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
  name: 'Toolbar',
  data: () => {
    return {
      carsArray: [],
      carTypes: [],
    }
  },
  computed: {
    ...mapState(['visibleLayers', 'cars']),
  },
  watch: {
    cars: function (cars) {
      this.carsArray = values(cars).sort(sortByType)

      const carTypesSet = Object.entries(cars).reduce((acc, [key, curr]) => {
        if (curr?.metric?.type) {
          acc.add(curr.metric.type)
        }
        return acc
      }, new Set())

      this.carTypes = Array.from(carTypesSet).map((type) => ({visible: true, name: type}))
    },
  },
  methods: {
    ...mapActions(['loadData', 'toggleLayer', 'toggleCar', 'toggleType', 'hideAll', 'showAll']),
    handleLayer(name) {
      this.toggleLayer(name)
    },
    handleCar(name) {
      if (['hideAll', 'showAll'].includes(name)) {
        return this[name]()
      }
      return this.toggleCar(name)
    },
    handleType(typeName) {
      if (typeName === 'hideAll') {
        this.carTypes = this.carTypes.map((type) => ({...type, visible: false}))
        return this.hideAll()
      }
      if (typeName === 'showAll') {
        this.carTypes = this.carTypes.map((type) => ({...type, visible: true}))
        return this.showAll()
      }
      this.carTypes = this.carTypes.map((type) => {
        if (type.name === typeName) {
          return {...type, visible: !type.visible}
        }
        return type
      })
      const currentState = this.carTypes.find(({name}) => name === typeName)
      console.log(currentState.visible)
      return this.toggleType({name: typeName, visible: currentState.visible})
    },
  },
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
