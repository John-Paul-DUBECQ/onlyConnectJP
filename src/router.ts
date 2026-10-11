import { createRouter, createWebHistory } from 'vue-router'
import HomeHub from './games/HomeHub.vue'
import GridGame from './games/grid/GridGame.vue'
import GridSetup from './games/grid/GridSetup.vue'
import WordGuessGame from './games/wordGuess/WordGuessGame.vue'
import WordGuessSetup from './games/wordGuess/WordGuessSetup.vue'

const siteOrigin = 'https://connectjp.netlify.app'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: HomeHub,
      meta: {
        title: "Only Connect JP – Jeux de logique et d'association",
        description:
          'Trouvez les liens cachés et testez votre logique avec la Grille et Missing Vowels, deux jeux inspirés de Only Connect.',
      },
    },
    {
      path: '/grid',
      component: GridSetup,
      meta: {
        title: 'La Grille : jeu d’associations | Only Connect JP',
        description:
          'Trouvez quatre groupes de quatre éléments liés dans la Grille. Choisissez une partie et reliez les indices avec logique et intuition.',
      },
    },
    {
      path: '/grid/play',
      component: GridGame,
      meta: {
        title: 'Partie en cours | Only Connect JP',
        description: 'Jouez à la Grille et trouvez les groupes cachés.',
        robots: 'noindex, follow',
      },
    },
    {
      path: '/missing-vowels',
      component: WordGuessSetup,
      meta: {
        title: 'Missing Vowels : jeu de lettres | Only Connect JP',
        description:
          'Retrouvez les voyelles disparues dans Missing Vowels. Choisissez votre mode de jeu et testez votre vocabulaire contre la montre.',
      },
    },
    {
      path: '/missing-vowels/play',
      component: WordGuessGame,
      meta: {
        title: 'Partie en cours | Only Connect JP',
        description: 'Retrouvez les voyelles manquantes dans cette partie.',
        robots: 'noindex, follow',
      },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    description: string
    robots?: string
  }
}

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.append(element)
  }

  element.content = content
}

router.afterEach((to) => {
  const { title, description, robots } = to.meta
  const canonicalUrl = new URL(to.path, siteOrigin).href

  document.documentElement.lang = 'fr'
  document.title = title
  setMeta('name', 'description', description)
  setMeta('name', 'robots', robots ?? 'index, follow')
  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', description)
  setMeta('property', 'og:url', canonicalUrl)

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')

  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.append(canonical)
  }

  canonical.href = canonicalUrl
})
