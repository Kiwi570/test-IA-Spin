// ═══════════════════════════════════════════════════════════════════
// DEBRIEF ENGINE - Phase 2
// Transforme les métriques en feedback narratif et conseil
// ═══════════════════════════════════════════════════════════════════

import { AudioAnalysis, ProgressAxis, AdviceCard } from '@/types'
import { adviceCards } from '@/data/cards'

// ═══════════════════════════════════════════════════════════════════
// TYPES DEBRIEF
// ═══════════════════════════════════════════════════════════════════

export interface SessionMetrics {
  duration: number                  // Durée totale en secondes
  analysis: AudioAnalysis | null
  transcription: string
  audienceAttentionAvg: number      // 0-1 moyenne attention public
  peakMoments: PeakMoment[]         // Moments forts détectés
}

export interface PeakMoment {
  timestamp: number      // Position en secondes
  type: 'energy' | 'silence' | 'clarity' | 'impact'
  score: number         // 0-1 qualité du moment
  description: string
}

export interface DebriefResult {
  // Feedback narratif principal
  mainFeedback: string
  
  // Points forts (1-2 max)
  strengths: string[]
  
  // Axe de progression suggéré
  suggestedAxis: ProgressAxis
  
  // Conseil du jour (carte)
  adviceCard: AdviceCard
  
  // Moment wow (si détecté)
  wowMoment: PeakMoment | null
  
  // Score global (non affiché directement, pour progression)
  internalScore: number
  
  // Phrase d'ancrage personnalisée
  anchorPhrase: string
}

// ═══════════════════════════════════════════════════════════════════
// TEMPLATES DE FEEDBACK NARRATIF (VOIX DE SEB)
// ═══════════════════════════════════════════════════════════════════

const FEEDBACK_TEMPLATES = {
  // Patterns positifs
  excellent: [
    "Il y a eu quelque chose de différent dans ta voix aujourd'hui. Une présence. C'est ça qu'on cherche.",
    "Ce moment où tu as ralenti... Le silence qui a suivi... C'était puissant. Tu l'as senti ?",
    "Je n'ai rien à ajouter. C'était juste. Continue comme ça.",
    "Là, tu viens de toucher quelque chose. Cette clarté, cette assurance... garde-la.",
  ],
  
  good: [
    "Du mieux. Vraiment. Ta respiration était plus posée, ça s'entend.",
    "J'ai noté des moments où tu as osé prendre ton temps. C'est là que tu es le meilleur.",
    "Ta voix porte plus qu'avant. L'énergie est là. Maintenant, il faut la canaliser.",
    "Il y a de la matière. On continue à sculpter.",
  ],
  
  progress: [
    "C'est un entraînement, pas un examen. Ce qui compte, c'est que tu t'es exposé.",
    "J'ai entendu des moments d'hésitation. Normal. L'important c'est ce que tu en fais ensuite.",
    "La prochaine fois, concentre-toi sur une seule chose : les silences. Juste ça.",
    "Rome ne s'est pas faite en un jour. Chaque passage devant le micro compte.",
  ],
  
  // Feedback sur aspects spécifiques
  rhythm: {
    tooFast: "Tu as tendance à accélérer quand tu te sens observé. C'est naturel. Mais ton message se perd dans la vitesse.",
    tooSlow: "Ton rythme était posé, c'est bien. Veille juste à ne pas perdre le fil de ton énergie.",
    varied: "J'ai aimé la variation de ton rythme. Ça crée du relief, de l'intérêt.",
    monotone: "Le débit était régulier, peut-être trop. La prochaine fois, ose les contrastes."
  },
  
  silences: {
    wellUsed: "Tes silences étaient habités. C'est rare. C'est là que tu es le plus convaincant.",
    lacking: "Tu remplis chaque seconde de mots. Laisse respirer. Le silence est ton allié.",
    tooLong: "Certains silences étaient un peu longs. L'important est qu'ils restent intentionnels.",
    natural: "Les pauses étaient naturelles. Ton public a le temps de digérer ce que tu dis."
  },
  
  energy: {
    high: "L'énergie était là, vraiment. Veille juste à ne pas t'épuiser dès les premières phrases.",
    low: "J'aurais aimé sentir plus de conviction. Comme si tu parlais de quelque chose qui te passionne.",
    consistent: "Énergie stable du début à la fin. C'est rassurant pour celui qui t'écoute.",
    peaked: "J'ai senti un vrai pic d'intensité. Ce moment-là, c'était toi. Authentique."
  },
  
  clarity: {
    excellent: "Chaque mot était distinct, clair. On te comprend parfaitement.",
    fillerWords: "J'ai compté quelques 'euh' et 'donc'. Pas grave, mais ça dilue ton message.",
    hesitations: "Les hésitations montrent que tu réfléchis. Maintenant, fais-le en silence.",
    articulated: "Bonne articulation. Ton message passe sans filtre."
  }
}

// ═══════════════════════════════════════════════════════════════════
// GÉNÉRATEUR DE DEBRIEF
// ═══════════════════════════════════════════════════════════════════

export function generateDebrief(
  metrics: SessionMetrics,
  sessionCardId?: string
): DebriefResult {
  const { analysis, audienceAttentionAvg, peakMoments, transcription } = metrics
  
  // Score global calculé
  const internalScore = calculateInternalScore(metrics)
  
  // Déterminer le niveau de feedback
  const feedbackLevel = internalScore > 0.75 ? 'excellent' 
                       : internalScore > 0.55 ? 'good' 
                       : 'progress'
  
  // Générer le feedback principal
  const mainFeedback = generateMainFeedback(feedbackLevel, analysis)
  
  // Identifier les points forts
  const strengths = identifyStrengths(analysis, audienceAttentionAvg)
  
  // Axe de progression suggéré
  const suggestedAxis = determineSuggestedAxis(analysis)
  
  // Sélectionner la carte conseil
  const adviceCard = selectAdviceCard(suggestedAxis, sessionCardId)
  
  // Moment wow (si score > 0.8 sur un peak moment)
  const wowMoment = peakMoments.find(m => m.score > 0.8) || null
  
  // Générer phrase d'ancrage personnalisée
  const anchorPhrase = generateAnchorPhrase(suggestedAxis, analysis)
  
  return {
    mainFeedback,
    strengths,
    suggestedAxis,
    adviceCard,
    wowMoment,
    internalScore,
    anchorPhrase
  }
}

// ═══════════════════════════════════════════════════════════════════
// FONCTIONS UTILITAIRES
// ═══════════════════════════════════════════════════════════════════

function calculateInternalScore(metrics: SessionMetrics): number {
  const { analysis, audienceAttentionAvg, peakMoments } = metrics
  
  if (!analysis) return 0.5  // Score neutre par défaut
  
  let score = 0
  let factors = 0
  
  // Facteur rythme (optimal: 120-150 WPM)
  const wpm = analysis.rhythm.wordsPerMinute
  if (wpm >= 120 && wpm <= 150) {
    score += 0.8
  } else if (wpm >= 100 && wpm <= 170) {
    score += 0.6
  } else {
    score += 0.3
  }
  factors++
  
  // Facteur silences bien placés
  const silenceRatio = analysis.silences.wellPlaced / Math.max(1, analysis.silences.count)
  score += silenceRatio * 0.9
  factors++
  
  // Facteur énergie
  score += analysis.energy.level * 0.8
  factors++
  
  // Facteur clarté
  score += analysis.clarity.articulation * 0.9
  factors++
  
  // Facteur prosodie (variation mélodique)
  score += analysis.prosodie.melodicVariation * 0.7
  factors++
  
  // Bonus attention public
  score += audienceAttentionAvg * 0.5
  factors += 0.5
  
  // Bonus moments forts
  if (peakMoments.length > 0) {
    const avgPeakScore = peakMoments.reduce((sum, m) => sum + m.score, 0) / peakMoments.length
    score += avgPeakScore * 0.3
    factors += 0.3
  }
  
  // Malus mots de remplissage
  const fillerPenalty = Math.min(0.2, analysis.clarity.fillerWords * 0.02)
  score -= fillerPenalty
  
  return Math.max(0, Math.min(1, score / factors))
}

function generateMainFeedback(level: 'excellent' | 'good' | 'progress', analysis: AudioAnalysis | null): string {
  const templates = FEEDBACK_TEMPLATES[level]
  const mainTemplate = templates[Math.floor(Math.random() * templates.length)]
  
  // Ajouter un détail spécifique si l'analyse est disponible
  if (analysis) {
    const details: string[] = []
    
    // Commentaire sur le rythme
    if (analysis.rhythm.wordsPerMinute > 160) {
      details.push(FEEDBACK_TEMPLATES.rhythm.tooFast)
    } else if (analysis.rhythm.variations > 0.3) {
      details.push(FEEDBACK_TEMPLATES.rhythm.varied)
    }
    
    // Commentaire sur les silences
    if (analysis.silences.wellPlaced >= 3) {
      details.push(FEEDBACK_TEMPLATES.silences.wellUsed)
    } else if (analysis.silences.count < 2) {
      details.push(FEEDBACK_TEMPLATES.silences.lacking)
    }
    
    // Ajouter un détail au hasard
    if (details.length > 0) {
      const detail = details[Math.floor(Math.random() * details.length)]
      return `${mainTemplate}\n\n${detail}`
    }
  }
  
  return mainTemplate
}

function identifyStrengths(analysis: AudioAnalysis | null, attention: number): string[] {
  const strengths: string[] = []
  
  if (!analysis) {
    if (attention > 0.6) {
      strengths.push("Tu as su maintenir l'attention du public")
    }
    return strengths
  }
  
  // Identifier les forces
  if (analysis.energy.consistency > 0.7) {
    strengths.push("Énergie constante et engageante")
  }
  
  if (analysis.silences.wellPlaced >= 2) {
    strengths.push("Silences bien placés qui donnent du poids")
  }
  
  if (analysis.clarity.articulation > 0.8) {
    strengths.push("Articulation claire et précise")
  }
  
  if (analysis.prosodie.melodicVariation > 0.4) {
    strengths.push("Voix vivante et variée")
  }
  
  if (analysis.rhythm.variations > 0.3 && !analysis.rhythm.isMonotone) {
    strengths.push("Rythme maîtrisé avec du relief")
  }
  
  if (attention > 0.7) {
    strengths.push("Présence qui capte l'attention")
  }
  
  // Retourner 1-2 forces maximum
  return strengths.slice(0, 2)
}

function determineSuggestedAxis(analysis: AudioAnalysis | null): ProgressAxis {
  if (!analysis) return 'presence'
  
  // Trouver le point le plus faible
  const scores: Record<ProgressAxis, number> = {
    presence: analysis.energy.level,
    clarity: analysis.clarity.articulation,
    stability: analysis.energy.consistency,
    impact: analysis.prosodie.melodicVariation,
    leadership: (analysis.silences.wellPlaced / Math.max(1, analysis.silences.count))
  }
  
  let minAxis: ProgressAxis = 'presence'
  let minScore = 1
  
  for (const [axis, score] of Object.entries(scores)) {
    if (score < minScore) {
      minScore = score
      minAxis = axis as ProgressAxis
    }
  }
  
  return minAxis
}

function selectAdviceCard(axis: ProgressAxis, sessionCardId?: string): AdviceCard {
  // Si une carte est liée à la session, la retourner
  if (sessionCardId) {
    const sessionCard = adviceCards.find(c => c.id === sessionCardId)
    if (sessionCard) return sessionCard
  }
  
  // Sinon, sélectionner une carte pertinente pour l'axe
  const relevantCards = adviceCards.filter(c => c.category === axis)
  
  if (relevantCards.length === 0) {
    // Fallback sur n'importe quelle carte
    return adviceCards[Math.floor(Math.random() * adviceCards.length)]
  }
  
  return relevantCards[Math.floor(Math.random() * relevantCards.length)]
}

function generateAnchorPhrase(axis: ProgressAxis, analysis: AudioAnalysis | null): string {
  const phrases: Record<ProgressAxis, string[]> = {
    presence: [
      "Je suis là. Pleinement.",
      "Chaque mot compte.",
      "Ma présence suffit.",
      "Ici et maintenant."
    ],
    clarity: [
      "Une idée. Une phrase. Un impact.",
      "Je dis ce que je pense. Simplement.",
      "Clarté d'abord, détails ensuite.",
      "Mon message est clair."
    ],
    stability: [
      "Je reste ancré, quoi qu'il arrive.",
      "Le stress ne me définit pas.",
      "Je respire. Je continue.",
      "Stable comme un roc."
    ],
    impact: [
      "Ma voix porte. Ma voix compte.",
      "Chaque silence est une arme.",
      "L'impact vient de l'intention.",
      "Quand je parle, on écoute."
    ],
    leadership: [
      "Je guide. Je mène. J'inspire.",
      "Ma voix ouvre des chemins.",
      "Leadership se vit, pas se dit.",
      "Je prends ma place. Toute ma place."
    ]
  }
  
  const axisPhrase = phrases[axis]
  return axisPhrase[Math.floor(Math.random() * axisPhrase.length)]
}

// ═══════════════════════════════════════════════════════════════════
// DÉTECTION DES MOMENTS FORTS
// ═══════════════════════════════════════════════════════════════════

export function detectPeakMoments(
  analysis: AudioAnalysis | null,
  transcription: string,
  duration: number
): PeakMoment[] {
  if (!analysis) return []
  
  const moments: PeakMoment[] = []
  
  // Pic d'énergie détecté
  if (analysis.energy.peakMoments.length > 0) {
    analysis.energy.peakMoments.forEach(timestamp => {
      moments.push({
        timestamp,
        type: 'energy',
        score: 0.7 + Math.random() * 0.3,
        description: "Pic d'énergie remarquable"
      })
    })
  }
  
  // Bons silences détectés
  if (analysis.silences.wellPlaced >= 2) {
    moments.push({
      timestamp: duration / 2,  // Position approximative
      type: 'silence',
      score: 0.6 + (analysis.silences.wellPlaced * 0.1),
      description: "Silence puissant et maîtrisé"
    })
  }
  
  // Clarté exceptionnelle
  if (analysis.clarity.articulation > 0.85) {
    moments.push({
      timestamp: duration * 0.7,
      type: 'clarity',
      score: analysis.clarity.articulation,
      description: "Clarté cristalline"
    })
  }
  
  // Variation mélodique forte = impact
  if (analysis.prosodie.melodicVariation > 0.5) {
    moments.push({
      timestamp: duration * 0.6,
      type: 'impact',
      score: analysis.prosodie.melodicVariation + 0.3,
      description: "Moment d'impact émotionnel"
    })
  }
  
  // Trier par score et garder les 3 meilleurs
  return moments
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}
