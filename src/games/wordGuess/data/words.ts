export type WordGroup = {
  id: number
  title: string
  items: string[]
}

export type WordListSeed = {
  seed: string
  description: string
  duration: number | 'unlimited'
  groupIds: number[]
}

export const wordGroups: WordGroup[] = [
  {
    id: 1,
    title: 'Films Disney',
    items: ['Le livre de la jungle', 'Le bossu de notre dame', 'La reine des neiges', 'Alice au pays des merveilles', 'La Belle au bois dormant', 'La Belle et le Clochard'],
  },
  {
    id: 2,
    title: 'Oeuvres de Roald Dahl',
    items: ['Charlie et la Chocolaterie', 'Fantastique Maître Renard', 'James et la Grosse Pêche', 'Le Bon Gros Géant', 'Charlie et le Grand Ascenseur de verre'],
  },
  {
    id: 3,
    title: 'Des acteurs et leur pays de naissance',
    items: ['Leonardo DiCaprio et Etats-Unis', "Joaquin Phoenix et Porto Rico", "Jean Reno et France", "Jackie Chan et Hong Kong"],
  },
  {
    id: 4,
    title: 'Des acteurs et leur pays de naissance',
    items: ['Leonardo DiCaprio et Etats-Unis', "Joaquin Phoenix et Porto Rico", "Jean Reno et France", "Jackie Chan et Hong Kong"],
  },

]

export const wordListSeeds: WordListSeed[] = [
  {
    seed: 'JP-001',
    description: 'Liste de mots de test pour les développeurs',
    duration: 'unlimited',
    groupIds: [1, 2, 3, 4],
  },
]
