export type WordGroup = {
  id: number
  title: string
  items: string[]
}

export type WordListSeed = {
  seed: string
  description: string
  duration?: number | 'unlimited'
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
    title: 'Fable de la fontaine mais avec les animaux inversés',
    items: ['le renard et le corbeau','la tortue et le lievre','le loup et le cheval','la cigogne et le renard','la fourmi et la cigale'],
  },
  {
    id: 5,
    title: 'Les deux Terminus de stations de métro parisiennes',
    items: ['porte dauphine et nation','la defense et le chateau de vincennes','pont de sevres et mairie de montreuil','porte des lilas et gambetta'],
  },
]

export const wordListSeeds: WordListSeed[] = [
  {
    seed: 'JP-001',
    description: 'Liste de mots de test pour les développeurs',
    groupIds: [4, 2, 3, 1],
  },
]
