<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { gridSeeds } from './grid/data/grid'
import { readCompletedGridSeeds } from './grid/data/gridProgress'

const router = useRouter()
const completedGridSeeds = ref<string[]>([])
const progressError = ref('')

try {
  completedGridSeeds.value = readCompletedGridSeeds()
} catch {
  progressError.value = 'La progression de la campagne est momentanément indisponible.'
}

const completedGridCount = computed(() => completedGridSeeds.value.length)
</script>

<template>
  <main class="hub-shell">
    <header class="hub-header">
      <p class="eyebrow">Only Connect JP</p>
    </header>

    <section class="hub-intro">
      <h1>Connectez<br /><em>les idées.</em></h1>
      <p class="subtitle">Choisissez une manche et trouvez les liens cachés entre les indices.</p>
    </section>

    <section class="campaign" aria-labelledby="campaign-title">
      <div class="campaign-copy">
        <p class="section-kicker">Le parcours Only Connect JP</p>
        <h2 id="campaign-title">La campagne<br /><em>des grilles</em></h2>
        <p>Enchaînez les grilles préparées et retrouvez votre progression à chaque visite.</p>
        <p class="campaign-progress" aria-live="polite">
          {{ completedGridCount }} / {{ gridSeeds.length }} grille{{ gridSeeds.length === 1 ? '' : 's' }} terminée{{ completedGridCount === 1 ? '' : 's' }}
        </p>
      </div>
      <button class="campaign-button" type="button" @click="router.push('/grid')">
        Parcourir la campagne <span aria-hidden="true">↗</span>
      </button>
      <p v-if="progressError" class="progress-error" role="status">{{ progressError }}</p>
    </section>

    <section class="game-menu" aria-labelledby="games-title">
      <div class="menu-heading">
        <h2 id="games-title">Pour varier</h2>
      </div>

      <button class="game-card active" type="button" @click="router.push('/missing-vowels')">
        <span class="card-number">01</span>
        <span class="card-content">
          <strong>Missing Vowels</strong>
          <span>Retrouvez les voyelles disparues</span>
        </span>
        <span class="card-arrow" aria-hidden="true">↗</span>
      </button>
    </section>

    <footer class="hub-footer">
      <span class="live-dot" aria-hidden="true"></span>
      <span>Une question de logique, de culture et d'intuition</span>
    </footer>
  </main>
</template>

<style scoped>
.hub-shell {
  width: min(100%, 1120px);
  margin: 0 auto;
  padding: 48px 32px 32px;
}

.hub-header,
.menu-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.eyebrow,
.section-kicker {
  color: var(--color-accent);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.edition,
.menu-heading span,
.card-content span,
.hub-footer {
  color: var(--color-muted);
  font-size: 0.78rem;
}

h1,
h2 {
  color: var(--color-ink);
  font-family: Georgia, 'Times New Roman', serif;
  font-weight: 700;
  letter-spacing: -0.05em;
}

.hub-intro {
  margin-top: 104px;
}

.hub-intro h1 {
  margin-top: 10px;
  font-size: clamp(4rem, 10vw, 8rem);
  line-height: 0.88;
}

h1 em {
  color: var(--color-accent);
  font-weight: inherit;
}

.subtitle {
  max-width: 360px;
  margin-top: 28px;
  color: var(--color-muted);
}

.game-menu {
  max-width: 760px;
  margin-top: 64px;
}

.campaign {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
  max-width: 900px;
  margin-top: 64px;
  padding: 32px;
  border: 1px solid var(--color-line);
  background: var(--color-paper);
}

.campaign-copy {
  max-width: 470px;
}

.campaign h2 {
  margin-top: 10px;
  font-size: clamp(2.2rem, 5vw, 3.8rem);
  line-height: 0.95;
}

.campaign h2 em {
  color: var(--color-accent);
  font-weight: inherit;
}

.campaign-copy > p:not(.section-kicker, .campaign-progress) {
  max-width: 380px;
  margin-top: 16px;
  color: var(--color-muted);
  font-size: 0.85rem;
}

.campaign-progress {
  margin-top: 22px;
  color: var(--color-accent);
  font-size: 0.78rem;
  font-weight: 700;
}

.campaign-button {
  flex: 0 0 auto;
  padding: 14px 18px;
  border: 1px solid var(--color-ink);
  color: #fffdf8;
  background: var(--color-ink);
  font: inherit;
  font-size: 0.82rem;
  cursor: pointer;
}

.campaign-button span {
  margin-left: 12px;
  color: var(--color-accent);
}

.progress-error {
  position: absolute;
  right: 32px;
  bottom: 8px;
  color: var(--color-muted);
  font-size: 0.7rem;
}

.menu-heading {
  padding-bottom: 14px;
  border-bottom: 1px solid var(--color-line);
}

h2 {
  font-size: clamp(1.6rem, 3vw, 2.3rem);
}

.game-card {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 104px;
  padding: 22px 18px;
  border: 0;
  border-bottom: 1px solid var(--color-line);
  color: var(--color-ink);
  background: transparent;
  text-align: left;
  font: inherit;
}

.game-card.active {
  cursor: pointer;
  transition: padding 180ms ease, background-color 180ms ease;
}

.game-card.active:hover {
  padding-right: 10px;
  padding-left: 26px;
  background: var(--color-paper);
}

.game-card.disabled {
  opacity: 0.5;
}

.card-number {
  width: 72px;
  color: var(--color-accent);
  font-size: 0.75rem;
  font-weight: 700;
}

.card-content {
  display: grid;
  gap: 4px;
}

.card-content strong {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.55rem;
}

.card-arrow,
.card-lock {
  margin-left: auto;
  color: var(--color-accent);
  font-size: 1.5rem;
}

.hub-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 80px;
}

.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-accent);
}

@media (max-width: 600px) {
  .hub-shell {
    padding: 32px 18px 24px;
  }

  .edition {
    font-size: 0.65rem;
  }

  .hub-intro {
    margin-top: 78px;
  }

  .game-menu {
    margin-top: 72px;
  }

  .campaign {
    align-items: stretch;
    flex-direction: column;
    gap: 24px;
    margin-top: 48px;
    padding: 22px;
  }

  .campaign-button {
    width: 100%;
  }

  .progress-error {
    position: static;
  }
}
</style>
