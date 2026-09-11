import { createRouter, createWebHistory } from 'vue-router'
import HomeHub from './games/HomeHub.vue'
import GridGame from './games/grid/GridGame.vue'
import GridSetup from './games/grid/GridSetup.vue'
import WordGuessGame from './games/wordGuess/WordGuessGame.vue'
import WordGuessSetup from './games/wordGuess/WordGuessSetup.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeHub },
    { path: '/grid', component: GridSetup },
    { path: '/grid/play', component: GridGame },
    { path: '/missing-vowels', component: WordGuessSetup },
    { path: '/missing-vowels/play', component: WordGuessGame },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})
