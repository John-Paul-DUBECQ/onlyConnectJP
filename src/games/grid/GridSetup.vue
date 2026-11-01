<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { gridGroups, gridSeeds, type GridGroup, type GridSeed } from './data/grid'
import { readCompletedGridSeeds } from './data/gridProgress'

const router = useRouter()
const selectedMode = ref('random')
const duration = ref<number | 'unlimited'>("unlimited")
const customGroupIds = ref('1,2,3,4')
const customJson = ref(JSON.stringify(gridGroups.slice(0, 4), null, 2))
const formError = ref('')
const completedSeeds = ref<string[]>([])
const progressError = ref('')

try {
  completedSeeds.value = readCompletedGridSeeds()
} catch {
  progressError.value = 'La progression de la campagne est momentanément indisponible.'
}

function isSeedCompleted(seed: string) {
  return completedSeeds.value.includes(seed)
}

function startCampaignGrid(puzzle: GridSeed) {
  router.push({
    path: '/grid/play',
    query: {
      seed: puzzle.seed,
      mode: 'seed',
      time: String(puzzle.duration ?? 'unlimited'),
    },
  })
}

function startGame() {
  formError.value = ''

  if (selectedMode.value === 'custom-ids') {
    const ids = customGroupIds.value
      .split(',')
      .map((value) => Number(value.trim()))
      .filter((id) => Number.isInteger(id))

    if (ids.length !== 4 || new Set(ids).size !== 4 || ids.some((id) => !gridGroups.some((group) => group.id === id))) {
      formError.value = 'Entrez exactement quatre IDs de groupes existants, par exemple : 1,2,3,4.'
      return
    }

    router.push({
      path: '/grid/play',
      query: { mode: 'custom-ids', groups: ids.join(','), time: String(duration.value) },
    })
    return
  }

  if (selectedMode.value === 'custom-json') {
    try {
      const parsed = JSON.parse(customJson.value) as GridGroup[] | { groups: GridGroup[] }
      const groups = Array.isArray(parsed) ? parsed : parsed.groups

      if (!Array.isArray(groups) || groups.length !== 4 || groups.some((group) =>
        !Number.isInteger(group.id) || typeof group.title !== 'string' || !group.title.trim() ||
        !Array.isArray(group.items) || group.items.length !== 4 || group.items.some((item) => typeof item !== 'string' || !item.trim()),
      )) {
        throw new Error('invalid groups')
      }

      router.push({
        path: '/grid/play',
        query: { mode: 'custom-json', json: JSON.stringify(groups), time: String(duration.value) },
      })
    } catch {
      formError.value = 'Le JSON doit contenir exactement quatre groupes avec un id, un titre et quatre éléments.'
    }
    return
  }

  router.push({
    path: '/grid/play',
    query: {
      mode: 'random',
      time: String(duration.value),
    },
  })
}
</script>

<template>
  <main class="setup-shell">
    <header class="setup-header">
      <button class="back-button" type="button" @click="router.push('/')">← Accueil</button>
      <p class="eyebrow">Configuration</p>
    </header>

    <section class="setup-content" aria-labelledby="setup-title">
      <p class="section-kicker">Avant de commencer</p>
      <h1 id="setup-title">La campagne<br /><em>des grilles.</em></h1>
      <p class="subtitle">Parcourez les grilles une à une. Votre progression est conservée sur cet appareil.</p>

      <section class="campaign-section" aria-labelledby="campaign-title">
        <div class="campaign-heading">
          <div>
            <p class="section-kicker">Votre parcours</p>
            <h2 id="campaign-title">La campagne</h2>
          </div>
          <p class="campaign-count">{{ completedSeeds.length }} / {{ gridSeeds.length }} terminée{{ completedSeeds.length === 1 ? '' : 's' }}</p>
        </div>

        <p v-if="progressError" class="progress-error" role="status">{{ progressError }}</p>

        <ol class="campaign-list">
          <li v-for="(puzzle, index) in gridSeeds" :key="puzzle.seed" class="campaign-step">
            <button
              class="campaign-node"
              :class="{ completed: isSeedCompleted(puzzle.seed) }"
              type="button"
              :aria-label="`Grille ${index + 1}${isSeedCompleted(puzzle.seed) ? ', réussie' : ''}`"
              @click="startCampaignGrid(puzzle)"
            >
              <span aria-hidden="true">{{ isSeedCompleted(puzzle.seed) ? '✓' : index + 1 }}</span>
            </button>
            <span v-if="index < gridSeeds.length - 1" class="campaign-connector" aria-hidden="true"></span>
          </li>
        </ol>
      </section>

      <form class="options-form" @submit.prevent="startGame">
        <fieldset>
          <legend>Autres façons de jouer</legend>
          <p class="subtitle options-intro">Lancez une grille aléatoire ou composez la vôtre.</p>
          <div class="option-list seed-options">
            <label class="option-card seed-card">
              <input v-model="selectedMode" type="radio" name="mode" value="random" />
              <span>
                <strong>Aléatoire</strong>
                <small>Quatre groupes tirés dans la bibliothèque</small>
              </span>
            </label>
            <label class="option-card seed-card">
              <input v-model="selectedMode" type="radio" name="mode" value="custom-ids" />
              <span>
                <strong>IDs personnalisés</strong>
                <small>Choisissez quatre groupes de la bibliothèque</small>
              </span>
            </label>
            <label class="option-card seed-card">
              <input v-model="selectedMode" type="radio" name="mode" value="custom-json" />
              <span>
                <strong>Grille JSON</strong>
                <small>Créez vos quatre groupes directement</small>
              </span>
            </label>
          </div>
          <div v-if="selectedMode === 'custom-ids'" class="custom-input">
            <label for="custom-group-ids">IDs des groupes</label>
            <input id="custom-group-ids" v-model="customGroupIds" type="text" placeholder="1,2,3,4" />
            <small>Les IDs disponibles vont de 1 à {{ gridGroups.length }}.</small>
          </div>
          <div v-if="selectedMode === 'custom-json'" class="custom-input">
            <label for="custom-grid-json">Groupes au format JSON</label>
            <textarea id="custom-grid-json" v-model="customJson" rows="12" spellcheck="false" />
            <small>Remplacez les valeurs de l’exemple en conservant quatre groupes et quatre éléments par groupe.</small>
          </div>
          <p v-if="formError" class="form-error" role="alert">{{ formError }}</p>
        </fieldset>

        <fieldset>
          <legend>Temps de jeu</legend>
          <div class="option-list time-options">
            <label v-for="option in [60, 90, 120, 150, 180, 300, 'unlimited']" :key="option" class="option-card">
              <input v-model="duration" type="radio" name="duration" :value="option" />
              <span>{{ option === 'unlimited' ? 'Temps illimité' : `${option} s` }}</span>
            </label>
          </div>
          <p class="field-note">Les grilles de la campagne gardent leur durée prévue.</p>
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

h2 {
  margin-top: 6px;
  color: var(--color-ink);
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(1.7rem, 3vw, 2.3rem);
  letter-spacing: -0.04em;
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
  margin-top: 72px;
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
  display: flex;
  flex-wrap: wrap;
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

.campaign-section {
  margin-top: 64px;
}

.campaign-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--color-line);
}

.campaign-count {
  color: var(--color-accent);
  font-size: 0.78rem;
  font-weight: 700;
}

.campaign-list {
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  gap: 20px 0;
  padding: 0;
  padding-top: 20px;
  padding-bottom: 4px;
  list-style: none;
}

.campaign-step {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.campaign-node {
  display: grid;
  width: 58px;
  height: 58px;
  place-items: center;
  border: 2px solid var(--color-line);
  border-radius: 50%;
  color: var(--color-ink);
  background: var(--color-paper);
  font: inherit;
  font-size: 1.15rem;
  font-weight: 700;
  cursor: pointer;
  transition: border-color 180ms ease, color 180ms ease, background-color 180ms ease, transform 180ms ease;
}

.campaign-node:hover {
  transform: translateY(-3px);
  border-color: var(--color-accent);
}

.campaign-node.completed {
  border-color: var(--color-accent);
  color: #fffdf8;
  background: var(--color-accent);
}

.campaign-connector {
  position: absolute;
  z-index: 0;
  top: 50%;
  left: calc(50% + 29px);
  width: calc(100% - 58px);
  height: 2px;
  background: var(--color-line);
}

.campaign-step:nth-child(8n) .campaign-connector,
.campaign-step:last-child .campaign-connector {
  display: none;
}

.campaign-node {
  position: relative;
  z-index: 1;
}

.progress-error {
  margin-top: 12px;
  color: var(--color-muted);
  font-size: 0.75rem;
}

.options-intro {
  margin: -4px 0 14px;
  font-size: 0.82rem;
}

.seed-card {
  flex: 1;
  min-width: 190px;
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

.custom-input {
  display: grid;
  gap: 8px;
  margin-top: 14px;
}

.custom-input label {
  color: var(--color-ink);
  font-size: 0.78rem;
}

.custom-input input,
.custom-input textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--color-line);
  color: var(--color-ink);
  background: var(--color-paper);
  font: inherit;
  font-size: 0.82rem;
}

.custom-input textarea {
  resize: vertical;
  font-family: 'Courier New', monospace;
  line-height: 1.45;
}

.custom-input input:focus,
.custom-input textarea:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.custom-input small,
.form-error {
  color: var(--color-muted);
  font-size: 0.72rem;
}

.form-error {
  margin-top: 10px;
  color: var(--color-accent);
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

  .campaign-section {
    margin-top: 48px;
  }

  .campaign-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .campaign-node {
    width: 52px;
    height: 52px;
  }

  .campaign-list {
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 16px 0;
  }

  .campaign-connector {
    left: calc(50% + 26px);
    width: calc(100% - 52px);
  }

  .campaign-step:nth-child(8n) .campaign-connector {
    display: block;
  }

  .campaign-step:nth-child(6n) .campaign-connector,
  .campaign-step:last-child .campaign-connector {
    display: none;
  }

  .time-options {
    grid-template-columns: 1fr;
  }

  .start-button {
    width: 100%;
  }
}
</style>
