<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { WordGroup } from './data/words'
import { wordGroups, wordListSeeds } from './data/words'

type PlayMode = 'caster' | 'write'
type Question = { groupTitle: string; answer: string }

const route = useRoute()
const router = useRouter()
const playMode = (String(route.query.play ?? 'write') === 'caster' ? 'caster' : 'write') as PlayMode
const allowMultipleAttempts = String(route.query.attempts ?? 'true') === 'true'
const selectedMode = String(route.query.mode ?? 'random')
const selectedSeed = String(route.query.seed ?? '')
const selectedPuzzle = wordListSeeds.find((seed) => seed.seed === selectedSeed)
const randomGroups = [...wordGroups].sort(() => Math.random() - 0.5).slice(0, 4)
const activeGroups = computed<WordGroup[]>(() =>
  selectedMode === 'random'
    ? randomGroups
    : selectedPuzzle?.groupIds
        .map((id) => wordGroups.find((group) => group.id === id))
        .filter((group): group is WordGroup => group !== undefined) ?? [],
)
const questions = computed<Question[]>(() =>
  activeGroups.value.flatMap((group) =>
    group.items.map((answer) => ({ groupTitle: group.title, answer })),
  ),
)

const selectedTotal = selectedPuzzle?.duration ?? String(route.query.total ?? '60')
const totalDuration = selectedTotal === 'unlimited' ? 'unlimited' : Number(selectedTotal)
const isUnlimited = totalDuration === 'unlimited'
const remainingSeconds = ref(isUnlimited ? 0 : Number.isFinite(totalDuration) ? totalDuration : 300)
const questionDuration = Math.max(10, Number(route.query.question ?? 30))
const questionRemaining = ref(questionDuration)
const questionIndex = ref(0)
const answerInput = ref('')
const answerChecked = ref(false)
const answerRevealed = ref(false)
const ended = ref(false)
const message = ref('Retrouvez la réponse en ajoutant les voyelles manquantes.')
let timer: ReturnType<typeof setInterval> | undefined
let revealTimer: ReturnType<typeof setTimeout> | undefined

const currentQuestion = computed(() => questions.value[questionIndex.value])
const displayedAnswer = computed(() =>
  currentQuestion.value
    ? answerRevealed.value
      ? currentQuestion.value.answer.toUpperCase()
      : missingVowels(currentQuestion.value.answer)
    : '',
)
const progressLabel = computed(() => `${Math.min(questionIndex.value + 1, questions.value.length)} / ${questions.value.length}`)
const completedCount = computed(() => Math.min(questionIndex.value, questions.value.length))
const formattedTotal = computed(() =>
  isUnlimited ? 'Illimité' : `${Math.floor(remainingSeconds.value / 60)}:${String(remainingSeconds.value % 60).padStart(2, '0')}`,
)

function canonical(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
}

function missingVowels(value: string) {
  const consonants = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[AEIOUY]/g, '')
    .replace(/[^A-Z]/g, '')
  const chunks: string[] = []
  let position = 0

  while (position < consonants.length) {
    const size = Math.random() < 0.5 ? 2 : 3
    chunks.push(consonants.slice(position, position + size))
    position += size
  }

  return chunks.join(' ')
}

function nextQuestion() {
  if (questionIndex.value >= questions.value.length - 1) {
    ended.value = true
    message.value = 'La manche est terminée. Toutes les réponses ont été parcourues.'
    return
  }

  questionIndex.value += 1
  answerInput.value = ''
  answerChecked.value = false
  answerRevealed.value = false
  questionRemaining.value = questionDuration
  message.value = 'Nouvelle question : retrouvez les voyelles manquantes.'
}

function submitAnswer() {
  if (ended.value || !currentQuestion.value || answerChecked.value) return
  if (!answerInput.value.trim()) {
    message.value = 'Écrivez une réponse avant de valider.'
    return
  }

  if (canonical(answerInput.value) === canonical(currentQuestion.value.answer)) {
    message.value = 'Bonne réponse.'
    nextQuestion()
    return
  }

  if (!allowMultipleAttempts) {
    revealAnswer()
    return
  }

  message.value = 'Ce n’est pas la bonne réponse. Essayez encore.'
}

function revealAnswer() {
  if (!currentQuestion.value || ended.value) return
  answerRevealed.value = true
  answerChecked.value = true
  message.value = `Réponse : ${currentQuestion.value.answer}`
  if (revealTimer) clearTimeout(revealTimer)
  revealTimer = setTimeout(() => {
    nextQuestion()
  }, 2000)
}

function finishOnTimeout() {
  ended.value = true
  answerInput.value = ''
  message.value = 'Le temps total est écoulé. La manche est terminée.'
}

function resetGame() {
  questionIndex.value = 0
  answerInput.value = ''
  answerChecked.value = false
  answerRevealed.value = false
  ended.value = false
  questionRemaining.value = questionDuration
  remainingSeconds.value = isUnlimited ? 0 : Number(totalDuration)
  message.value = 'Retrouvez la réponse en ajoutant les voyelles manquantes.'
}

onMounted(() => {
  timer = setInterval(() => {
    if (!isUnlimited) {
      if (remainingSeconds.value <= 1) {
        remainingSeconds.value = 0
        finishOnTimeout()
        if (timer) clearInterval(timer)
        return
      }
      remainingSeconds.value -= 1
    }

    if (playMode === 'caster' && questionRemaining.value > 0 && !ended.value) {
      questionRemaining.value -= 1
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (revealTimer) clearTimeout(revealTimer)
})
</script>

<template>
  <main class="game-shell">
    <header class="game-header">
      <button class="back-button" type="button" @click="router.push('/missing-vowels')">← Options</button>
      <div class="game-title">
        <p class="eyebrow">Manche 02 · Missing Vowels</p>
        <h1>Les voyelles</h1>
      </div>
      <div class="header-meta">
        <span class="timer" :class="{ unlimited: isUnlimited, expired: !isUnlimited && remainingSeconds === 0 }">{{ formattedTotal }}</span>
        <span class="progress">{{ progressLabel }}</span>
      </div>
    </header>

    <section class="game-area" aria-labelledby="question-title">
      <div class="round-heading">
        <div>
          <p class="section-kicker">{{ playMode === 'caster' ? 'À vous de jouer' : 'À vous d’écrire' }}</p>
          <h2 id="question-title">Retrouvez les voyelles</h2>
        </div>
        <button class="reset-button" type="button" @click="resetGame">Recommencer</button>
      </div>

      <div v-if="currentQuestion && !ended" class="question-panel" >
        <div class="question-meta">
          <span>{{ currentQuestion.groupTitle }}</span>
        </div>
        <p class="missing-answer" :class="{ revealed: answerRevealed, expired: playMode === 'caster' && questionRemaining === 0 }" aria-label="Réponse">{{ displayedAnswer }}</p>
        <p class="hint">Les espaces séparent des groupes de deux ou trois lettres.</p>

        <form v-if="playMode === 'write'" class="answer-form" @submit.prevent="submitAnswer">
          <label for="answer">Votre réponse</label>
          <div class="answer-row">
            <input id="answer" v-model="answerInput" type="text" autocomplete="off" :disabled="answerChecked" placeholder="Écrivez la réponse complète" />
            <button class="check-button" type="submit" :disabled="answerChecked">Valider</button>
            <button class="secondary-button" type="button" :disabled="answerChecked" @click="revealAnswer">Skip</button>
          </div>
        </form>

        <div v-else class="caster-controls">
          <p class="host-note">Répondez à voix haute, puis révélez la réponse ou passez à la suivante.</p>
          <div class="control-row">
            <button class="secondary-button" type="button" @click="revealAnswer">Révéler la réponse</button>
          </div>
        </div>
      </div>

      <div v-else class="finished-panel">
        <p class="section-kicker">Manche terminée</p>
        <h2>{{ completedCount }} question{{ completedCount > 1 ? 's' : '' }} parcourue{{ completedCount > 1 ? 's' : '' }}</h2>
        <p>{{ message }}</p>
        <button class="check-button" type="button" @click="resetGame">Rejouer</button>
      </div>

      <div class="game-footer">
        <p class="game-message" :class="{ success: message === 'Bonne réponse.' }">{{ message }}</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.game-shell { width: min(100%, 1120px); margin: 0 auto; padding: 48px 32px 32px; }
.game-header, .round-heading, .question-meta, .game-footer, .control-row, .answer-row { display: flex; align-items: center; justify-content: space-between; }
.eyebrow, .section-kicker, .question-meta span { color: var(--color-accent); font-size: .68rem; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; }
h1, h2 { color: var(--color-ink); font-family: Georgia, 'Times New Roman', serif; font-weight: 700; letter-spacing: -.05em; }
.game-title { margin-right: auto; margin-left: 40px; }
.game-title h1 { margin-top: 4px; font-size: 2.5rem; line-height: 1; }
.back-button, .reset-button { padding: 10px 0; border: 0; border-bottom: 1px solid var(--color-accent); color: var(--color-ink); background: transparent; font: inherit; font-size: .85rem; cursor: pointer; }
.back-button:hover, .reset-button:hover { color: var(--color-accent); }
.header-meta { display: flex; align-items: center; gap: 22px; }
.timer { color: var(--color-accent); font-variant-numeric: tabular-nums; }
.timer.expired { color: var(--color-ink); }
.progress { padding-left: 22px; border-left: 1px solid var(--color-line); color: var(--color-muted); font-size: .8rem; }
.game-area { margin-top: 78px; }
.round-heading { margin-bottom: 28px; }
h2 { margin-top: 5px; font-size: clamp(1.7rem, 3vw, 2.5rem); }
.question-panel, .finished-panel { padding: clamp(24px, 5vw, 54px); background: var(--color-paper); transition: background-color 500ms ease; }
.question-panel.expired { background: #f4ded7; }
.question-meta { align-items: flex-start; gap: 18px; }
.question-meta strong { color: var(--color-muted); font-size: .75rem; font-weight: 400; }
.missing-answer { margin-top: 58px; color: var(--color-ink); font-family: Georgia, 'Times New Roman', serif; font-size: clamp(2rem, 6vw, 5rem); font-weight: 700; letter-spacing: .12em; line-height: 1.25; overflow-wrap: anywhere; }
.missing-answer.revealed { color: var(--color-accent); letter-spacing: 0; }
.missing-answer.expired { color: var(--color-accent); transition: color 500ms ease; }
.hint, .host-note, .finished-panel p { margin-top: 18px; color: var(--color-muted); font-size: .8rem; }
.answer-form { max-width: 680px; margin-top: 46px; }
.answer-form label { display: block; margin-bottom: 9px; color: var(--color-ink); font-size: .78rem; }
.answer-row { gap: 10px; }
.answer-row input { min-width: 0; flex: 1; padding: 14px; border: 1px solid var(--color-line); color: var(--color-ink); background: var(--color-background); font: inherit; }
.answer-row input:focus { outline: 2px solid var(--color-accent); outline-offset: 2px; }
.caster-controls { margin-top: 46px; }
.control-row { justify-content: flex-start; gap: 12px; margin-top: 24px; }
.check-button, .secondary-button { padding: 13px 16px; border: 1px solid var(--color-ink); font: inherit; font-size: .8rem; cursor: pointer; }
.check-button { color: #fffdf8; background: var(--color-ink); }
.secondary-button { color: var(--color-ink); background: transparent; }
.check-button:disabled { opacity: .4; cursor: not-allowed; }
.check-button span { margin-left: 10px; color: var(--color-accent); }
.revealed-answer { color: var(--color-accent); font-family: Georgia, 'Times New Roman', serif; font-size: 1.5rem; }
.finished-panel h2 { margin-top: 8px; }
.finished-panel .check-button { margin-top: 30px; }
.game-footer { align-items: flex-end; gap: 20px; margin-top: 22px; }
.game-message { max-width: 650px; color: var(--color-muted); font-size: .8rem; }
.game-message.success { color: var(--color-accent); }
@media (max-width: 600px) { .game-shell { padding: 32px 18px 24px; } .game-header { align-items: flex-start; flex-wrap: wrap; gap: 20px; } .game-title { order: 3; width: 100%; margin: 0; } .header-meta { margin-left: auto; } .game-area { margin-top: 50px; } .round-heading { align-items: flex-end; gap: 18px; } .question-panel, .finished-panel { padding: 24px 18px; } .missing-answer { margin-top: 40px; letter-spacing: .08em; } .answer-row, .control-row { align-items: stretch; flex-direction: column; } .answer-row .check-button, .control-row .check-button, .control-row .secondary-button { width: 100%; } .game-footer { align-items: stretch; flex-direction: column; } }
</style>
