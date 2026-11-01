import { gridSeeds } from './grid'

const progressCookieName = 'onlyConnectJP.grid.completedSeeds'

export function readCompletedGridSeeds(): string[] {
  const cookie = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${progressCookieName}=`))

  if (!cookie) {
    return []
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(decodeURIComponent(cookie.slice(progressCookieName.length + 1)))
  } catch {
    throw new Error('Le cookie de progression est illisible.')
  }

  if (!Array.isArray(parsed) || parsed.some((seed) => typeof seed !== 'string')) {
    throw new Error('Le cookie de progression a un format invalide.')
  }

  const knownSeeds = new Set(gridSeeds.map((puzzle) => puzzle.seed))
  return [...new Set(parsed.filter((seed: string) => knownSeeds.has(seed)))]
}

export function completeGridSeed(seed: string): string[] {
  const completedSeeds = new Set(readCompletedGridSeeds())
  completedSeeds.add(seed)

  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${progressCookieName}=${encodeURIComponent(JSON.stringify([...completedSeeds]))}; Max-Age=31536000; Path=/; SameSite=Lax${secure}`

  const savedSeeds = readCompletedGridSeeds()
  if (!savedSeeds.includes(seed)) {
    throw new Error('La progression n’a pas pu être enregistrée dans le cookie.')
  }

  return savedSeeds
}
