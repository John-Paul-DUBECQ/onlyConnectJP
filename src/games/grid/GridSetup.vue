<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { gridSeeds } from './data/grid'

const router = useRouter()
const selectedMode = ref('random')
const duration = ref<number | 'unlimited'>(90)

function getSelectedSeedDuration() {
  return gridSeeds.find((puzzle) => puzzle.seed === selectedMode.value)?.duration ?? duration.value
}

function startGame() {
  const isRandomMode = selectedMode.value === 'random'

  router.push({
    path: '/grid/play',
    query: {
      seed: isRandomMode ? '' : selectedMode.value,
      mode: isRandomMode ? 'random' : 'seed',
      time: String(isRandomMode ? duration.value : getSelectedSeedDuration()),
    },
  })
}
</script>

<template>
  <main class="setup-shell">
    <header class="setup-header">
      <button class="back-button" type="button" @click="router.push('/')">← Accueil</button>
      <p class="eyebrow">Manche 01 · Configuration</p>
    </header>

    <section class="setup-content" aria-labelledby="setup-title">
      <p class="section-kicker">Avant de commencer</p>
      <h1 id="setup-title">Préparez<br /><em>la grille.</em></h1>
      <p class="subtitle">Choisissez le temps de réflexion et la manière de composer les quatre groupes.</p>

      <form class="options-form" @submit.prevent="startGame">
        <fieldset>
          <legend>Temps de jeu</legend>
          <div class="option-list time-options">
            <label v-for="option in [60, 90, 120, 150, 180, 300, 'unlimited']" :key="option" class="option-card">
              <input v-model="duration" type="radio" name="duration" :value="option" :disabled="selectedMode !== 'random'" />
              <span>{{ option === 'unlimited' ? 'Temps illimité' : `${option} s` }}</span>
            </label>
          </div>
          <p v-if="selectedMode !== 'random'" class="field-note">La durée est définie par la seed sélectionnée.</p>
        </fieldset>

        <fieldset>
          <legend>Composition de la grille</legend>
          <div class="option-list seed-options">
            <label class="option-card seed-card">
              <input v-model="selectedMode" type="radio" name="mode" value="random" />
              <span>
                <strong>Aléatoire</strong>
                <small>Quatre groupes tirés dans la bibliothèque</small>
              </span>
            </label>
            <label v-for="puzzle in gridSeeds" :key="puzzle.seed" class="option-card seed-card">
              <input v-model="selectedMode" type="radio" name="mode" :value="puzzle.seed" />
              <span>
                <strong>{{ puzzle.seed }}</strong>
                <small>{{ puzzle.description }}</small>
              </span>
            </label>
          </div>
        </fieldset>

        <button class="start-button" type="submit">
          Commencer la grille <span aria-hidden="true">↗</span>
        </button>
      </form>
    </section>
  </main>
</template>

<style scoped>
.setup-shell {
  width: min(100%, 1120px);
  margin: 0 auto;
  padding: 48px 32px 32px;
}

.setup-header {
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

.back-button {
  padding: 10px 0;
  border: 0;
  border-bottom: 1px solid var(--color-accent);
  color: var(--color-ink);
  background: transparent;
  font: inherit;
  font-size: 0.85rem;
  cursor: pointer;
}

.back-button:hover {
  color: var(--color-accent);
}

.setup-content {
  max-width: 760px;
  margin-top: 96px;
}

h1 {
  margin-top: 10px;
  color: var(--color-ink);
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(4rem, 10vw, 7rem);
  font-weight: 700;
  letter-spacing: -0.05em;
  line-height: 0.88;
}

h1 em {
  color: var(--color-accent);
  font-weight: inherit;
}

.subtitle {
  max-width: 410px;
  margin-top: 28px;
  color: var(--color-muted);
}

.options-form {
  display: grid;
  gap: 38px;
  margin-top: 64px;
}

fieldset {
  padding: 0;
  border: 0;
}

legend {
  margin-bottom: 14px;
  color: var(--color-ink);
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.45rem;
  font-weight: 700;
}

.option-list {
  display: grid;
  gap: 10px;
}

.time-options {
  grid-template-columns: repeat(3, 1fr);
}

.option-card {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 56px;
  padding: 12px 16px;
  border: 1px solid var(--color-line);
  color: var(--color-ink);
  background: var(--color-paper);
  cursor: pointer;
  transition: border-color 180ms ease, background-color 180ms ease;
}

.option-card:has(input:checked) {
  border-color: var(--color-accent);
  background: var(--color-wash);
}

.option-card input {
  accent-color: var(--color-accent);
}

.option-card input:disabled {
  cursor: not-allowed;
}

.option-card span {
  display: grid;
  gap: 2px;
}

.seed-card small {
  color: var(--color-muted);
  font-size: 0.72rem;
}

.field-note {
  margin-top: 10px;
  color: var(--color-muted);
  font-size: 0.75rem;
}

.start-button {
  justify-self: start;
  padding: 14px 18px;
  border: 1px solid var(--color-ink);
  color: #fffdf8;
  background: var(--color-ink);
  font: inherit;
  font-size: 0.82rem;
  cursor: pointer;
}

.start-button span {
  margin-left: 12px;
  color: var(--color-accent);
}

@media (max-width: 600px) {
  .setup-shell {
    padding: 32px 18px 24px;
  }

  .setup-header {
    align-items: flex-start;
    gap: 18px;
  }

  .setup-content {
    margin-top: 72px;
  }

  .time-options {
    grid-template-columns: 1fr;
  }

  .start-button {
    width: 100%;
  }
}
</style>
