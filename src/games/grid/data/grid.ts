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
    id: 1,
    title: 'Surnoms de Carolingiens',
    items: ['Bref', 'Outremer', 'Pieux', 'Grand'],
  },
  {
    id: 2,
    title: 'Poly_____',
    items: ['Gone', 'Mère', 'Game', 'Glotte'],
  },
  {
    id: 3,
    title: 'Homophone de ville française',
    items: ['Reine', 'Lion', 'Quand', 'L\'Ile'],
  },
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
  },{
    id: 11,
    title: 'Personnage venant d\'oeuvres de Zola',
    items: ['Nana', 'Gervaise', 'Chaval', 'Octave'],
  },
  {
    id: 12,
    title: 'Acronymes',
    items: ['Laser', 'Sida', 'Ovni', 'Pacs'],
  },{
    id: 13,
    title: '\"Chef de/d\' _____\"',
    items: ['Rang', 'Projet', 'Cuisine', 'Œuvre'],
  },{
    id: 14,
    title: 'Dieux celtiques',
    items: ['Lug', 'Epona', 'Cernunnos', 'Toutatis'],
  },{
    id: 15,
    title: '« 1 » se cache à la fin',
    items: ['Bruno', 'Verdun', 'Frein', 'Madone'],
  },{
    id: 18,
    title: 'Type de whisky',
    items: ['Scotch', 'Tennessee', 'Bourbon', 'Irish'],
  },{
    id: 19,
    title: 'Palais parisiens',
    items: ['Luxembourg', 'Royal', 'Grand', 'Glaces'],
  },{
    id: 20,
    title: 'Premiers ministres de la Vème République française',
    items: ['Messmer', 'Cresson', 'Barre', 'Borne'],
  },{
    id: 21,
    title: 'Race de chat',
    items: ['Norvégien', 'Siamois', 'Somali', 'Sphynx'],
  },{
    id: 22,
    title: 'Capitales des Etats d\'Amérique',
    items: ['Providence', 'Montpelier', 'Pierre', 'Baton Rouge'],
  },{
    id: 23,
    title: 'Mots de l\'alphabet phonétique international',
    items: ['Bravo', 'Lima', 'Oscar', 'Echo'],
  },{
    id: 24,
    title: 'L\'ile ___ dans la fiction',
    items: ['Enfants', 'Trésor', 'Mystérieuse', 'Noire'],
  },{
    id: 25,
    title: 'personnages de la Comedia dell\'arte',
    items: ['Pantalon', 'Polichinelle', 'Briguelle', 'Scapin'],
  },{
    id: 26,
    title: 'Os du corps humain',
    items: ['Trapèze', 'Talus', 'Marteau', 'Enclume'],
  },{
    id: 27,
    title: 'Sauces',
    items: ['Barbecue', 'Aïoli', 'Tomate', 'Samuraï'],
  },{
    id: 28,
    title: 'Requin-',
    items: ['Tigre', 'Baleine', 'Marteau', 'Scies'],
  },{
    id: 29,
    title: 'Chiens de bande dessinée',
    items: ['Milou', 'Idéfix', 'Rantanplan', 'Bill'],
  },{
    id: 30,
    title: 'Tribus amérindiennes',
    items: ['Cheyennes', 'Sioux', 'Navajos', 'Inuits'],
  },
]

export const gridSeeds: GridSeed[] = [
  {
    seed: 'JP-0015',
    description: 'Grille de test 15',
    groupIds: [27, 28, 29, 30],
  },{
    seed: 'JP-0016',
    description: 'Grille de test 16',
    groupIds: [5, 4, 10, 11],
  },{
    seed: 'JP-0017',
    description: 'Grille de test 17',
    groupIds: [7, 8, 9, 6],
  },
  {
    seed: 'JP-0018',
    description: 'Grille de test 18',
    groupIds: [12, 13, 18, 19],
  },
  {
    seed: 'JP-0019',
    description: 'Grille de test 19',
    groupIds: [15, 22, 20, 21],
  },
  {
    seed: 'JP-0020',
    description: 'Grille de test 20',
    groupIds: [3, 2, 23, 1],
  },{
    seed: 'JP-0021',
    description: 'Grille de test 21',
    groupIds: [24, 25, 26, 14],
  },
]
