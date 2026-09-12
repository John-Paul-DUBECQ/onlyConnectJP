<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { wordListSeeds } from './data/words'

const router = useRouter()
const selectedMode = ref('random')
const playMode = ref<'caster' | 'write'>('write')
const totalTime = ref<number | 'unlimited'>("unlimited")
const hostQuestionTime = ref(8)
const allowMultipleAttempts = ref(true)

function selectedDuration() {
  return wordListSeeds.find((seed) => seed.seed === selectedMode.value)?.duration ?? totalTime.value
}

function startGame() {
  const random = selectedMode.value === 'random'

  router.push({
    path: '/missing-vowels/play',
    query: {
      seed: random ? '' : selectedMode.value,
      mode: random ? 'random' : 'seed',
      play: playMode.value,
      total: String(random ? totalTime.value : selectedDuration()),
      question: String(hostQuestionTime.value),
      attempts: String(allowMultipleAttempts.value),
    },
  })
}
</script>

<template>
  <main class="setup-shell">
    <header class="setup-header">
      <button class="back-button" type="button" @click="router.push('/')">← Accueil</button>
      <p class="eyebrow">Manche 02 · Missing Vowels</p>
    </header>

    <section class="setup-content" aria-labelledby="setup-title">
      <p class="section-kicker">Avant de commencer</p>
      <h1 id="setup-title">Trouvez les<br /><em>voyelles.</em></h1>
      <p class="subtitle">Les voyelles disparaissent. Retrouvez les réponses avant la fin du temps.</p>

      <form class="options-form" @submit.prevent="startGame">
        <fieldset>
          <legend>Mode de jeu</legend>
          <div class="option-list mode-options">
            <label class="option-card mode-card">
              <input v-model="playMode" type="radio" name="play-mode" value="write" />
              <span><strong>Réponses écrites</strong><small>Écrivez chaque réponse pour la valider.</small></span>
            </label>
            <label class="option-card mode-card">
              <input v-model="playMode" type="radio" name="play-mode" value="caster" />
              <span><strong>Mode caster</strong><small>Les réponses sont données à voix haute.</small></span>
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Temps total</legend>
          <div class="option-list time-options">
            <label v-for="option in [30,45, 60, 75, 'unlimited']" :key="option" class="option-card">
              <input v-model="totalTime" type="radio" name="total-time" :value="option" :disabled="selectedMode !== 'random'" />
              <span>{{ option === 'unlimited' ? 'Illimité' : `${option} s` }}</span>
            </label>
          </div>
          <p v-if="selectedMode !== 'random'" class="field-note">La durée est définie par la liste sélectionnée.</p>
        </fieldset>

        <fieldset>
          <legend>Organisation</legend>
          <label class="range-field">
            <span>Temps conseillé par question <strong>{{ hostQuestionTime }} s</strong></span>
            <input v-model.number="hostQuestionTime" type="range" min="4" max="20" step="2" />
          </label>
          <label class="toggle-field">
            <input v-model="allowMultipleAttempts" type="checkbox" />
            <span><strong>Autoriser plusieurs essais</strong><small>Une mauvaise réponse laisse la question ouverte.</small></span>
          </label>
        </fieldset>

        <fieldset>
          <legend>Liste de questions</legend>
          <div class="option-list seed-options">
            <label class="option-card seed-card">
              <input v-model="selectedMode" type="radio" name="seed" value="random" />
              <span><strong>Aléatoire</strong><small>Quatre groupes tirés dans la bibliothèque.</small></span>
            </label>
            <label v-for="seed in wordListSeeds" :key="seed.seed" class="option-card seed-card">
              <input v-model="selectedMode" type="radio" name="seed" :value="seed.seed" />
              <span><strong>{{ seed.seed }}</strong><small>{{ seed.description }}</small></span>
            </label>
          </div>
        </fieldset>

        <button class="start-button" type="submit">Lancer Missing Vowels <span aria-hidden="true">↗</span></button>
      </form>
    </section>
  </main>
</template>

<style scoped>
.setup-shell { width: min(100%, 1120px); margin: 0 auto; padding: 48px 32px 32px; }
.setup-header, .option-card, .toggle-field, .range-field span { display: flex; align-items: center; justify-content: space-between; }
.eyebrow, .section-kicker { color: var(--color-accent); font-size: .68rem; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; }
.back-button { padding: 10px 0; border: 0; border-bottom: 1px solid var(--color-accent); color: var(--color-ink); background: transparent; font: inherit; font-size: .85rem; cursor: pointer; }
.back-button:hover { color: var(--color-accent); }
.setup-content { max-width: 760px; margin-top: 96px; }
h1 { margin-top: 10px; color: var(--color-ink); font-family: Georgia, 'Times New Roman', serif; font-size: clamp(3.5rem, 9vw, 6.5rem); font-weight: 700; letter-spacing: -.05em; line-height: .88; }
h1 em { color: var(--color-accent); font-weight: inherit; }
.subtitle { max-width: 430px; margin-top: 28px; color: var(--color-muted); }
.options-form { display: grid; gap: 34px; margin-top: 64px; }
fieldset { padding: 0; border: 0; }
legend { margin-bottom: 14px; color: var(--color-ink); font-family: Georgia, 'Times New Roman', serif; font-size: 1.45rem; font-weight: 700; }
.option-list { display: grid; gap: 10px; }
.time-options { grid-template-columns: repeat(3, 1fr); }
.option-card { justify-content: flex-start; gap: 12px; min-height: 56px; padding: 12px 16px; border: 1px solid var(--color-line); color: var(--color-ink); background: var(--color-paper); cursor: pointer; transition: border-color 180ms ease, background-color 180ms ease; }
.option-card:has(input:checked) { border-color: var(--color-accent); background: var(--color-wash); }
.option-card input, .toggle-field input { accent-color: var(--color-accent); }
.option-card span, .toggle-field span { display: grid; gap: 2px; }
.option-card small, .toggle-field small, .field-note { color: var(--color-muted); font-size: .72rem; }
.mode-options { grid-template-columns: repeat(2, 1fr); }
.mode-card { min-height: 78px; }
.field-note { margin-top: 10px; }
.range-field { display: grid; gap: 12px; color: var(--color-ink); font-size: .82rem; }
.range-field strong { color: var(--color-accent); }
.range-field input { width: 100%; accent-color: var(--color-accent); }
.toggle-field { justify-content: flex-start; gap: 12px; margin-top: 18px; }
.start-button { justify-self: start; padding: 14px 18px; border: 1px solid var(--color-ink); color: #fffdf8; background: var(--color-ink); font: inherit; font-size: .82rem; cursor: pointer; }
.start-button span { margin-left: 12px; color: var(--color-accent); }
@media (max-width: 600px) { .setup-shell { padding: 32px 18px 24px; } .setup-header { align-items: flex-start; gap: 18px; } .setup-content { margin-top: 72px; } .time-options, .mode-options { grid-template-columns: 1fr; } .start-button { width: 100%; } }
</style>
