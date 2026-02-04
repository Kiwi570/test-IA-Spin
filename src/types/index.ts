// ═══════════════════════════════════════════════════════════════════
// TYPES UTILISATEUR
// ═══════════════════════════════════════════════════════════════════

export type UserIntention = 
  | 'clarity'      // Parler avec plus de clarté
  | 'confidence'   // Gagner en assurance à l'oral
  | 'preparation'  // Préparer une prise de parole concrète

export interface User {
  id: string
  intention: UserIntention | null
  isOnboarded: boolean
  createdAt: Date
  preferences: UserPreferences
}

export interface UserPreferences {
  soundEnabled: boolean
  voiceMode: boolean  // true = vocal, false = texte
  hapticFeedback: boolean
}

// ═══════════════════════════════════════════════════════════════════
// TYPES SESSION
// ═══════════════════════════════════════════════════════════════════

export type SessionState = 
  | 'intro'       // Seb parle, présente l'exercice
  | 'exercise'    // L'utilisateur parle
  | 'debrief'     // Seb donne le feedback
  | 'anchor'      // Phrase d'ancrage + carte
  | 'complete'    // Session terminée

export type SessionCategory = 
  | 'foundation'   // Sessions 1-4 : Fondations
  | 'connection'   // Sessions 5-6 : Connexion
  | 'affirmation'  // Sessions 7-10 : Affirmation
  | 'resistance'   // Sessions 11-14 : Résistance

export interface Session {
  id: string
  number: number
  title: string
  intention: string
  category: SessionCategory
  duration: string  // Ex: "8-10 min"
  axisMain: ProgressAxis
  cardId: string
  isCompleted: boolean
  completedAt?: Date
}

export interface SessionProgress {
  currentSessionId: string | null
  currentStep: SessionState
  audioChunks: Blob[]
  startedAt: Date | null
}

// ═══════════════════════════════════════════════════════════════════
// TYPES AUDIO
// ═══════════════════════════════════════════════════════════════════

export interface AudioAnalysis {
  rhythm: {
    wordsPerMinute: number
    variations: number
    isMonotone: boolean
  }
  silences: {
    count: number
    averageDuration: number
    wellPlaced: number
  }
  energy: {
    level: number  // 0-1
    consistency: number
    peakMoments: number[]
  }
  clarity: {
    articulation: number  // 0-1
    hesitations: string[]
    fillerWords: number
  }
  prosodie: {
    melodicVariation: number
    endOfSentenceDrops: number
  }
}

export interface AudioState {
  isRecording: boolean
  isPaused: boolean
  audioLevel: number  // 0-1, temps réel
  duration: number    // En secondes
  transcription: string
  analysis: AudioAnalysis | null
}

// ═══════════════════════════════════════════════════════════════════
// TYPES PROGRESSION
// ═══════════════════════════════════════════════════════════════════

export type ProgressAxis = 
  | 'presence'     // Présence
  | 'clarity'      // Clarté
  | 'stability'    // Stabilité émotionnelle
  | 'impact'       // Impact
  | 'leadership'   // Leadership verbal

export interface ProgressData {
  presence: number    // 0-100
  clarity: number
  stability: number
  impact: number
  leadership: number
}

export interface ProgressHistory {
  date: Date
  data: ProgressData
  sessionId: string
}

export interface WowMoment {
  id: string
  sessionId: string
  axis: ProgressAxis
  audioUrl: string
  timestamp: number  // Position dans l'audio
  duration: number   // Durée de l'extrait
  feedback: string   // Ce que Seb a dit
  createdAt: Date
}

// ═══════════════════════════════════════════════════════════════════
// TYPES CARTES CONSEIL
// ═══════════════════════════════════════════════════════════════════

export interface AdviceCard {
  id: string
  title: string
  principle: string
  application: string
  anchorPhrase: string
  category: ProgressAxis
  sessionId?: string
  isSaved: boolean
}

// ═══════════════════════════════════════════════════════════════════
// TYPES SEB
// ═══════════════════════════════════════════════════════════════════

export type SebState = 
  | 'idle'       // Au repos, respiration
  | 'listening'  // Écoute l'utilisateur
  | 'speaking'   // Parle
  | 'thinking'   // Traitement

export type SebVariant = 
  | 'calm'       // Coach calme
  | 'demanding'  // Coach exigeant
  | 'preparation' // Préparation scène

export interface SebMessage {
  id: string
  text: string
  variant: 'normal' | 'anchor'
  timestamp: Date
}

// ═══════════════════════════════════════════════════════════════════
// TYPES AMBIANCE / PUBLIC
// ═══════════════════════════════════════════════════════════════════

export type AudienceProfile = 
  | 'neutral'        // Public neutre
  | 'cold_jury'      // Jury froid
  | 'enthusiastic'   // Équipe enthousiaste
  | 'hostile'        // Client hostile
  | 'distracted'     // Public distrait
  | 'friendly'       // Ami bienveillant

export interface AmbianceState {
  isActive: boolean
  profile: AudienceProfile
  attentionLevel: number  // 0-1
  lastReaction: string | null
}

// ═══════════════════════════════════════════════════════════════════
// TYPES NAVIGATION
// ═══════════════════════════════════════════════════════════════════

export type AppScreen = 
  | 'onboarding'
  | 'home'
  | 'session'
  | 'sessions-list'
  | 'cards'
  | 'progress'
  | 'urgency'
  | 'conversation'
