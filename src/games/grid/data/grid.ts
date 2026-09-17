export type GridGroup = {
  id: number
  title: string
  items: string[]
}

export type GridSeed = {
  seed: string
  description: string
  duration?: number | 'unlimited' 
  groupIds: number[]
}

export const gridGroups: GridGroup[] = [
  {
    id: 4,
    title: 'Mots associés à la mer',
    items: ['Vague', 'Marée', 'Écume', 'Plage'],
  },
  {
    id: 5,
    title: 'Mots commençant par une couleur',
    items: ['Blanc-bec', 'Vertige', 'Roseau', 'Rougeole'],
  },
  {
    id: 6,
    title: 'Fruits',
    items: ['Grenade', 'Avocat', 'Orange', 'Marron'],
  },
  {
    id: 7,
    title: 'Cartes de tarot',
    items: ['Empereur', 'Papesse', 'Chariot', 'Justice'],
  },
  {
    id: 8,
    title: 'bleu ___',
    items: ['Roi', 'Pétrole', 'Canard', 'Horizon'],
  },
  {
    id: 9,
    title: 'Oiseaux',
    items: ['Milan', 'Grue', 'Corbeau', 'Moineau'],
  },
  {
    id: 10,
    title: 'Fleurs',
    items: ['Capucine', 'Souci', 'Lys', 'Rose'],
  },
  {
    id: 11,
    title: 'Personnage venant d\'oeuvres de Zola',
    items: ['Nana', 'Gervaise', 'Chaval', 'Octave'],
  },
  {
    id: 12,
    title: 'Acronymes',
    items: ['Laser', 'Sida', 'Ovni', 'Pacs'],
  },
  {
    id: 13,
    title: '\"Chef de/d\' _____\"',
    items: ['Rang', 'Projet', 'Cuisine', 'Œuvre'],
  },
  {
    id: 14,
    title: 'Villes belges',
    items: ['La panne', 'Namur', 'Malines', 'Saint-Nicolas'],
  },
  {
    id: 15,
    title: '« 1 » se cache à la fin',
    items: ['Bruno', 'Verdun', 'Frein', 'Madone'],
  },
  {
    id: 16,
    title: '« Coup de _____ »',
    items: ['Foudre', 'Main', 'Grâce', 'Vieux'],
  },
  {
    id: 17,
    title: 'Peuvent être précédés de « contre- »',
    items: ['Attaque', 'Poids', 'Temps', 'Jour'],
  },
  {
    id: 18,
    title: 'Type de whisky',
    items: ['Scotch', 'Tennessee', 'Bourbon', 'Irish'],
  },
  {
    id: 19,
    title: 'Palais parisiens',
    items: ['Luxembourg', 'Royal', 'Grand', 'Glaces'],
  },
  {
    id: 20,
    title: 'Premiers ministres de la Vème République française',
    items: ['Messmer', 'Cresson', 'Barre', 'Borne'],
  },
  {
    id: 21,
    title: 'Race de chat',
    items: ['Norvégien', 'Siamois', 'Somali', 'Sphynx'],
  },
  {
    id: 22,
    title: 'Capitales des Etats d\'Amérique',
    items: ['Providence', 'Montpelier', 'Pierre', 'Baton Rouge'],
  },
]

export const gridSeeds: GridSeed[] = [
  {
    seed: 'JP-001',
    description: 'Grille de test',
    groupIds: [5, 4, 10, 11],
  },{
    seed: 'JP-002',
    description: 'Grille de test 2',
    duration: 300,
    groupIds: [7, 8, 9, 6],
  },
  {
    seed: 'JP-003',
    description: 'Grille de test 3',
    groupIds: [12, 13, 18, 19],
  },
  {
    seed: 'JP-004',
    description: 'Grille de test 4',
    groupIds: [15, 22, 20, 21],
  },

]
