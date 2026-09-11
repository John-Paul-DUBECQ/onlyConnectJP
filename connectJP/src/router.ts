import { createRouter, createWebHistory } from 'vue-router'
import HomeHub from './games/HomeHub.vue'
import GridGame from './games/grid/GridGame.vue'
import GridSetup from './games/grid/GridSetup.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeHub },
    { path: '/grid', component: GridSetup },
    { path: '/grid/play', component: GridGame },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})
