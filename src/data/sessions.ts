import { Session, SessionCategory, ProgressAxis } from '@/types'

// ═══════════════════════════════════════════════════════════════════
// DONNÉES DES SESSIONS — Les 14 sessions du parcours
// ═══════════════════════════════════════════════════════════════════

export const sessions: Session[] = [
  // ─────────────────────────────────────────────────────────────────
  // ARC FONDATIONS (Sessions 1-4)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'session-1',
    number: 1,
    title: 'Installer la présence',
    intention: 'Ralentir = prendre sa place',
    category: 'foundation',
    duration: '6-8 min',
    axisMain: 'presence',
    cardId: 'card-1',
    isCompleted: false,
  },
  {
    id: 'session-2',
    number: 2,
    title: 'Clarifier avant de parler',
    intention: 'La clarté mentale précède la fluidité',
    category: 'foundation',
    duration: '7-9 min',
    axisMain: 'clarity',
    cardId: 'card-2',
    isCompleted: false,
  },
  {
    id: 'session-3',
    number: 3,
    title: 'Habiter le silence',
    intention: 'Le silence comme allié',
    category: 'foundation',
    duration: '6-8 min',
    axisMain: 'presence',
    cardId: 'card-3',
    isCompleted: false,
  },
  {
    id: 'session-4',
    number: 4,
    title: 'La stabilité du corps',
    intention: "L'autorité vient de l'ancrage",
    category: 'foundation',
    duration: '7-9 min',
    axisMain: 'presence',
    cardId: 'card-4',
    isCompleted: false,
  },

  // ─────────────────────────────────────────────────────────────────
  // ARC CONNEXION (Sessions 5-6)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'session-5',
    number: 5,
    title: 'Première simulation publique',
    intention: 'Introduction douce au public virtuel',
    category: 'connection',
    duration: '8-10 min',
    axisMain: 'impact',
    cardId: 'card-5',
    isCompleted: false,
  },
  {
    id: 'session-6',
    number: 6,
    title: 'Le charisme calme',
    intention: 'La présence par la retenue',
    category: 'connection',
    duration: '7-9 min',
    axisMain: 'presence',
    cardId: 'card-6',
    isCompleted: false,
  },

  // ─────────────────────────────────────────────────────────────────
  // ARC AFFIRMATION (Sessions 7-10)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'session-7',
    number: 7,
    title: 'Parler pour cadrer',
    intention: 'Poser une direction claire',
    category: 'affirmation',
    duration: '8-10 min',
    axisMain: 'leadership',
    cardId: 'card-7',
    isCompleted: false,
  },
  {
    id: 'session-8',
    number: 8,
    title: 'Assumer ses mots',
    intention: "La crédibilité vient de l'alignement",
    category: 'affirmation',
    duration: '7-9 min',
    axisMain: 'leadership',
    cardId: 'card-8',
    isCompleted: false,
  },
  {
    id: 'session-9',
    number: 9,
    title: "Tenir l'attention jusqu'au bout",
    intention: 'Éviter la chute énergétique',
    category: 'affirmation',
    duration: '8-10 min',
    axisMain: 'impact',
    cardId: 'card-9',
    isCompleted: false,
  },
  {
    id: 'session-10',
    number: 10,
    title: 'Conclure naturellement',
    intention: 'Finir sans forcer',
    category: 'affirmation',
    duration: '7-9 min',
    axisMain: 'impact',
    cardId: 'card-10',
    isCompleted: false,
  },

  // ─────────────────────────────────────────────────────────────────
  // ARC RÉSISTANCE (Sessions 11-14)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'session-11',
    number: 11,
    title: 'Face au public hostile',
    intention: 'Stabilité face à la résistance',
    category: 'resistance',
    duration: '9-11 min',
    axisMain: 'stability',
    cardId: 'card-11',
    isCompleted: false,
  },
  {
    id: 'session-12',
    number: 12,
    title: 'Leadership en tension',
    intention: 'Annoncer des décisions difficiles',
    category: 'resistance',
    duration: '9-11 min',
    axisMain: 'leadership',
    cardId: 'card-12',
    isCompleted: false,
  },
  {
    id: 'session-13',
    number: 13,
    title: 'Interruption et attaque verbale',
    intention: 'Reprendre le contrôle',
    category: 'resistance',
    duration: '10-12 min',
    axisMain: 'impact',
    cardId: 'card-13',
    isCompleted: false,
  },
  {
    id: 'session-14',
    number: 14,
    title: 'Désaccord frontal',
    intention: 'Exister dans le désaccord sans conflit',
    category: 'resistance',
    duration: '9-11 min',
    axisMain: 'leadership',
    cardId: 'card-14',
    isCompleted: false,
  },
]

// ═══════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════

export function getSessionById(id: string): Session | undefined {
  return sessions.find(s => s.id === id)
}

export function getSessionByNumber(num: number): Session | undefined {
  return sessions.find(s => s.number === num)
}

export function getSessionsByCategory(category: SessionCategory): Session[] {
  return sessions.filter(s => s.category === category)
}

export const categoryLabels: Record<SessionCategory, string> = {
  foundation: 'Fondations',
  connection: 'Connexion',
  affirmation: 'Affirmation',
  resistance: 'Résistance',
}

export const categoryDescriptions: Record<SessionCategory, string> = {
  foundation: 'Poser les bases de ta présence',
  connection: 'Créer le lien avec ton public',
  affirmation: "S'affirmer avec clarté",
  resistance: 'Tenir face à la pression',
}
