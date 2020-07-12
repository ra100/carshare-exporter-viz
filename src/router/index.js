import Vue from 'vue'
import Router from 'vue-router'
import MapLayout from '@/components/MapLayout'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Map',
      component: MapLayout,
    },
  ],
})
