<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { GridGroup } from './data/grid'
import { gridGroups, gridSeeds } from './data/grid'

const route = useRoute()
const router = useRouter()
const selectedMode = String(route.query.mode ?? 'random')
const selectedSeed = String(route.query.seed ?? '')
const selectedPuzzle = gridSeeds.find((puzzle) => puzzle.seed === selectedSeed)

function shuffleGroups(groups: GridGroup[]) {
  return [...groups].sort(() => Math.random() - 0.5)
}

function getRandomGroups(groups: GridGroup[], groupCount: number) {
  function findCombination(
    remainingGroups: GridGroup[],
    selectedGroups: GridGroup[],
    usedItems: Set<string>,
  ): GridGroup[] | null {
    if (selectedGroups.length === groupCount) {
      return selectedGroups
    }

    for (const group of shuffleGroups(remainingGroups)) {
      const groupItems = group.items.map((item) => item.trim().toLocaleLowerCase('fr-FR'))

      if (groupItems.some((item) => usedItems.has(item))) {
        continue
      }

      const nextGroups = remainingGroups.filter((candidate) => candidate.id !== group.id)
      const nextItems = new Set(usedItems)
      groupItems.forEach((item) => nextItems.add(item))
      const result: GridGroup[] | null = findCombination(nextGroups, [...selectedGroups, group], nextItems)

      if (result) {
        return result
      }
    }

    return null
  }

  return findCombination(groups, [], new Set()) ?? []
}

const randomGroups = ref(getRandomGroups(gridGroups, 4))
const customGroups = (() => {
  if (selectedMode === 'custom-json') {
    try {
      const parsed = JSON.parse(String(route.query.json ?? '')) as GridGroup[]
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  if (selectedMode === 'custom-ids') {
    return String(route.query.groups ?? '')
      .split(',')
      .map((value) => Number(value.trim()))
      .map((id) => gridGroups.find((group) => group.id === id))
      .filter((group): group is GridGroup => group !== undefined)
  }

  return []
})()
const activeGroups = computed<GridGroup[]>(() =>
  selectedMode === 'random'
    ? randomGroups.value
    : selectedMode === 'custom-json' || selectedMode === 'custom-ids'
      ? customGroups
      : gridSeeds
        .find((puzzle) => puzzle.seed === selectedSeed)
        ?.groupIds.map((id) => gridGroups.find((group) => group.id === id))
        .filter((group): group is GridGroup => group !== undefined) ?? [],
)
const selectedDuration =
  selectedMode === 'seed'
    ? String(selectedPuzzle?.duration ?? route.query.time ?? '90')
    : String(route.query.time ?? '90')
const isUnlimited = selectedDuration === 'unlimited'
const duration = Number(selectedDuration)
const initialRemainingSeconds = Number.isFinite(duration) ? duration : 90
const remainingSeconds = ref(initialRemainingSeconds)
let timer: ReturnType<typeof setInterval> | undefined

const selectedItems = ref<string[]>([])
const solvedGroups = ref<number[]>([])
const revealedGroups = ref<number[]>([])
const wrongAttempts = ref(0)
const hasEnded = ref(false)
const message = ref('Sélectionnez quatre éléments qui partagent un lien.')

const boardItems = computed(() => {
  const items = activeGroups.value
    .filter(
      (_, index) =>
        !solvedGroups.value.includes(index) && !revealedGroups.value.includes(index),
    )
    .flatMap((group) => group.items)

  return [...items].sort((left, right) => left.localeCompare(right, 'fr'))
})

const solvedCount = computed(() => solvedGroups.value.length)
const isFinalPair = computed(() => solvedCount.value === 2)
const attemptsRemaining = computed(() => Math.max(0, 3 - wrongAttempts.value))
const displayedGroups = computed(() => [
  ...solvedGroups.value.map((index) => ({ index, found: true })),
  ...revealedGroups.value.map((index) => ({ index, found: false })),
])

function getGroupTitle(groupIndex: number) {
  return activeGroups.value[groupIndex]?.title ?? ''
}

function toggleItem(item: string) {
  if (selectedItems.value.includes(item)) {
    selectedItems.value = selectedItems.value.filter((selected) => selected !== item)
    return
  }

  if (selectedItems.value.length < 4) {
    selectedItems.value = [...selectedItems.value, item]
  }
}

function solveGroup(groupIndex: number) {
  solvedGroups.value = [...solvedGroups.value, groupIndex]
  selectedItems.value = []
}

function revealRemainingGroups() {
  const remainingGroupIndexes = activeGroups.value
    .map((_, index) => index)
    .filter(
      (index) => !solvedGroups.value.includes(index) && !revealedGroups.value.includes(index),
    )

  if (!remainingGroupIndexes.length) {
    return
  }

  revealedGroups.value = [...revealedGroups.value, ...remainingGroupIndexes]
  selectedItems.value = []
}

function finishGame(messageText: string) {
  hasEnded.value = true
  revealRemainingGroups()
  message.value = messageText
  if (timer) clearInterval(timer)
}

function skipGame() {
  finishGame('Manche passée. Les groupes restants sont révélés, mais ne comptent pas comme trouvés.')
}

function checkSelection() {
  if (hasEnded.value || (!isUnlimited && remainingSeconds.value === 0)) {
    return
  }

  if (selectedItems.value.length !== 4) {
    message.value = 'Il faut sélectionner quatre éléments.'
    return
  }

  const groupIndex = activeGroups.value.findIndex(
    (group, index) =>
      !solvedGroups.value.includes(index) &&
      group.items.every((item) => selectedItems.value.includes(item)),
  )

  if (groupIndex === -1) {
    if (isFinalPair.value) {
      wrongAttempts.value += 1
      selectedItems.value = []
      message.value = `Ce groupe ne semble pas correct. Il vous reste ${attemptsRemaining.value} essai${attemptsRemaining.value > 1 ? 's' : ''}.`

      if (wrongAttempts.value >= 3) {
        finishGame('Les trois essais sont utilisés. Les groupes restants sont révélés, mais ne comptent pas comme trouvés.')
      }
      return
    }

    selectedItems.value = []
    message.value = 'Ce groupe ne semble pas correct. Essayez encore.'
    return
  }

  solveGroup(groupIndex)
  message.value = `Bien vu : ${getGroupTitle(groupIndex)}.`

  if (solvedGroups.value.length === 3) {
    const lastGroupIndex = activeGroups.value.findIndex((_, index) => !solvedGroups.value.includes(index))
    if (lastGroupIndex !== -1) {
      solveGroup(lastGroupIndex)
      message.value = `Dernier groupe trouvé : ${getGroupTitle(lastGroupIndex)}.`
    }
  }
}

function finishOnTimeout() {
  remainingSeconds.value = 0
  finishGame('Le temps est écoulé. Les groupes restants sont révélés, mais ne comptent pas comme trouvés.')
}

function refreshRandomGroups() {
  const previousIds = randomGroups.value.map((group) => group.id).sort().join(',')
  let nextGroups = getRandomGroups(gridGroups, 4)
  let attempts = 0

  while (nextGroups.map((group) => group.id).sort().join(',') === previousIds && attempts < 10) {
    nextGroups = getRandomGroups(gridGroups, 4)
    attempts += 1
  }

  randomGroups.value = nextGroups
}

function startTimer() {
  if (isUnlimited) {
    return
  }

  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    if (remainingSeconds.value <= 1) {
      finishOnTimeout()
      return
    }

    remainingSeconds.value -= 1
  }, 1000)
}

onMounted(startTimer)

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

function resetGrid() {
  if (selectedMode === 'random') {
    refreshRandomGroups()
  }

  selectedItems.value = []
  solvedGroups.value = []
  revealedGroups.value = []
  wrongAttempts.value = 0
  hasEnded.value = false
  remainingSeconds.value = initialRemainingSeconds
  message.value = 'Sélectionnez quatre éléments qui partagent un lien.'
  startTimer()
}
</script>

<template>
  <main class="game-shell">
    <header class="game-header">
      <button class="back-button" type="button" @click="router.push('/grid')">← Options</button>
      <div class="game-title">
        <p class="eyebrow">Manche 01</p>
        <h1>La grille</h1>
      </div>
      <span v-if="isUnlimited" class="timer unlimited">Temps illimité</span>
      <small v-else class="timer" :class="{ expired: remainingSeconds === 0 }">
        {{ Math.floor(remainingSeconds / 60) }}:{{ String(remainingSeconds % 60).padStart(2, '0') }}
      </small>
      <div class="round-status" aria-label="Progression de la grille">
        <span class="status-label">Groupes trouvés</span>
        <strong>{{ solvedCount }}<span>/4</span></strong>
      </div>
    </header>

    <section class="board-area" aria-labelledby="board-title">
      <div class="board-heading">
        <div>
          <p class="section-kicker">Trouvez les connexions</p>
          <h2 id="board-title">Quatre groupes de quatre</h2>
        </div>
        <button class="reset-button" type="button" @click="resetGrid">Recommencer</button>
      </div>

      <div v-if="displayedGroups.length" class="solved-groups" aria-label="Descriptions des groupes">
        <div v-for="group in displayedGroups" :key="group.index" class="solved-group" :class="{ revealed: !group.found }">
          <div class="group-description">
            <span>{{ group.found ? 'Groupe trouvé' : 'Groupe révélé' }}</span>
            <strong>{{ getGroupTitle(group.index) }}</strong>
          </div>
          <ul class="group-items">
            <li v-for="item in activeGroups[group.index]?.items ?? []" :key="item">{{ item }}</li>
          </ul>
        </div>
      </div>

      <div v-if="isFinalPair" class="attempts" :class="{ exhausted: attemptsRemaining === 0 }">
        <span>Derniers groupes</span>
        <strong class="hearts" :aria-label="`${attemptsRemaining} cœur${attemptsRemaining > 1 ? 's' : ''} restant${attemptsRemaining > 1 ? 's' : ''}`">
          <span v-for="heart in 3" :key="heart" :class="{ empty: heart > attemptsRemaining }" aria-hidden="true">♥</span>
        </strong>
      </div>

      <div class="board" role="grid" aria-label="Grille de 16 éléments">
        <button
          v-for="item in boardItems"
          :key="item"
          class="tile"
          :class="{ selected: selectedItems.includes(item) }"
          type="button"
          role="gridcell"
          :aria-pressed="selectedItems.includes(item)"
          :disabled="hasEnded || attemptsRemaining === 0 || (!isUnlimited && remainingSeconds === 0)"
          @click="toggleItem(item)"
        >
          {{ item }}
        </button>
      </div>

      <div class="game-controls">
        <p class="game-message" :class="{ success: message.startsWith('Bien vu') }">{{ message }}</p>
        <div class="control-buttons">
          <button class="skip-button" type="button" :disabled="hasEnded || solvedCount === 4" @click="skipGame">
            Passer <span aria-hidden="true">↗</span>
          </button>
          <button class="check-button" type="button" :disabled="hasEnded || selectedItems.length !== 4 || attemptsRemaining === 0 || (!isUnlimited && remainingSeconds === 0)" @click="checkSelection">
            Valider le groupe <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.game-shell {
  width: min(100%, 1120px);
  margin: 0 auto;
  padding: 48px 32px 32px;
}

.game-header,
.board-heading,
.game-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.eyebrow,
.section-kicker,
.status-label,
.attempts span {
  color: var(--color-accent);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

h1,
h2 {
  color: var(--color-ink);
  font-family: Georgia, 'Times New Roman', serif;
  font-weight: 700;
  letter-spacing: -0.05em;
}

.game-title {
  margin-right: auto;
  margin-left: 40px;
}

.game-title h1 {
  margin-top: 4px;
  font-size: 2.5rem;
  line-height: 1;
}

.back-button,
.reset-button {
  padding: 10px 0;
  border: 0;
  border-bottom: 1px solid var(--color-accent);
  color: var(--color-ink);
  background: transparent;
  font: inherit;
  font-size: 0.85rem;
  cursor: pointer;
}

.back-button:hover,
.reset-button:hover {
  color: var(--color-accent);
}

.round-status {
  min-width: 150px;
  padding-left: 24px;
  border-left: 1px solid var(--color-line);
}

.round-status strong {
  display: block;
  margin-top: 7px;
  font-size: 2rem;
  line-height: 1;
}

.round-status strong span {
  color: var(--color-muted);
  font-size: 1rem;
  font-weight: 400;
}

.timer {
  display: block;
  margin-top: 10px;
  color: var(--color-accent);
  font-variant-numeric: tabular-nums;
  font-size: 1rem;
  padding-right: 24px;
}

.timer.expired {
  color: var(--color-ink);
}

.board-area {
  margin-top: 72px;
}

.board-heading {
  margin-bottom: 20px;
}

h2 {
  margin-top: 5px;
  font-size: clamp(1.6rem, 3vw, 2.3rem);
}

.solved-groups {
  display: grid;
  gap: 8px;
  margin-bottom: 12px;
}

.solved-group,
.attempts {
  display: flex;
  gap: 14px;
  align-items: baseline;
  padding: 10px 14px;
  color: var(--color-ink);
  background: var(--color-wash);
  font-size: 0.8rem;
}

.group-description {
  display: grid;
  flex: 0 0 38%;
  gap: 3px;
}

.group-items {
  display: flex;
  flex-wrap: wrap;
  gap: 5px 16px;
  padding: 0;
  color: var(--color-muted);
  list-style: none;
}

.group-items li:not(:last-child)::after {
  content: '·';
  margin-left: 16px;
  color: var(--color-accent);
}

.solved-group span {
  color: var(--color-accent);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.solved-group.revealed {
  background: var(--color-paper);
}

.solved-group.revealed span {
  color: var(--color-muted);
}

.attempts {
  justify-content: space-between;
  margin-bottom: 12px;
  border-left: 3px solid var(--color-accent);
}

.attempts strong {
  font-size: 0.8rem;
}

.hearts {
  display: flex;
  gap: 5px;
  color: var(--color-accent);
  font-size: 1.15rem !important;
  line-height: 1;
}

.hearts .empty {
  color: var(--color-line);
}

.attempts.exhausted {
  border-color: var(--color-ink);
}

.attempts.exhausted span {
  color: var(--color-ink);
}

.board {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.tile {
  min-height: 92px;
  padding: 16px;
  border: 1px solid var(--color-line);
  color: var(--color-ink);
  background: var(--color-paper);
  font: inherit;
  font-size: clamp(0.85rem, 2vw, 1.05rem);
  text-align: center;
  cursor: pointer;
  transition: transform 180ms ease, background-color 180ms ease, color 180ms ease;
}

.tile.selected {
  transform: translateY(-3px);
  color: #fffdf8;
  background: var(--color-ink);
}

@media (hover: hover) and (pointer: fine) {
  .tile:hover:not(:disabled) {
    transform: translateY(-3px);
    /* color: #fffdf8;
    background: var(--color-ink); */
  }
}

.tile:disabled {
  cursor: not-allowed;
}

.game-controls {
  align-items: flex-end;
  gap: 20px;
  margin-top: 28px;
}

.control-buttons {
  display: flex;
  gap: 10px;
}

.game-message {
  max-width: 460px;
  color: var(--color-muted);
  font-size: 0.78rem;
}

.game-message.success {
  color: var(--color-accent);
}

.check-button {
  padding: 13px 16px;
  border: 1px solid var(--color-ink);
  color: #fffdf8;
  background: var(--color-ink);
  font: inherit;
  font-size: 0.8rem;
  cursor: pointer;
}

.skip-button {
  padding: 13px 16px;
  border: 1px solid var(--color-line);
  color: var(--color-ink);
  background: var(--color-paper);
  font: inherit;
  font-size: 0.8rem;
  cursor: pointer;
}

.check-button:disabled,
.skip-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.check-button span {
  margin-left: 10px;
  color: var(--color-accent);
}

@media (max-width: 600px) {
  .game-shell {
    padding: 32px 18px 24px;
  }

  .game-header {
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 20px;
  }

  .game-title {
    order: 3;
    width: 100%;
    margin: 0;
  }

  .round-status {
    min-width: 84px;
    padding-left: 14px;
    margin-left: auto;
  }

  .status-label {
    font-size: 0.57rem;
    letter-spacing: 0.1em;
  }

  .round-status strong {
    font-size: 1.55rem;
  }

  .board-area {
    margin-top: 48px;
  }

  .board-heading {
    align-items: flex-end;
    gap: 18px;
  }

  .board {
    gap: 8px;
  }

  .solved-group {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .group-description {
    flex-basis: auto;
  }

  .tile {
    min-height: 76px;
    padding: 8px;
  }

  .game-controls {
    align-items: stretch;
    flex-direction: column;
  }

  .control-buttons {
    flex-direction: column-reverse;
  }

  .check-button,
  .skip-button {
    width: 100%;
  }
}
</style>
