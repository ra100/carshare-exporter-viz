<template>
  <div class="app-container">
    <div class="toolbar-container">
      <toolbar />
    </div>
    <div class="map-container">
      <cs-map />
    </div>
  </div>
</template>

<script>
import CsMap from './Map'
import Toolbar from './Toolbar'

export default {
  name: 'MapLayout',
  components: {
    CsMap,
    Toolbar,
  },
}
</script>

<style @scoped>
.app-container {
  height: 100vh;
}

.toolbar-container {
  height: 32px;
}

.map-container {
  height: calc(100vh - 32px);
}
</style>
