// ═══════════════════════════════════════════════════════════════════
// AMBIANCE ENGINE - Phase 2
// Moteur de réaction audio du public virtuel
// ═══════════════════════════════════════════════════════════════════

import { AudienceProfile, AudioAnalysis } from '@/types'

// ═══════════════════════════════════════════════════════════════════
// TYPES AMBIANCE ENGINE
// ═══════════════════════════════════════════════════════════════════

export type AmbianceSound = 
  | 'silence_attentif'      // Silence dense, attention maximale
  | 'souffle_calme'         // Respiration collective légère
  | 'murmure_leger'         // Murmures discrets
  | 'agitation'             // Chaises, mouvements
  | 'decrochage'            // Bruits de distraction
  | 'micro_approbation'     // Léger "hmm" approbateur
  | 'tension'               // Silence tendu
  | 'applaudissement_leger' // Applaudissements discrets
  | 'applaudissement_fort'  // Applaudissements chaleureux

export type ReactionTrigger = 
  | 'user_slowing'          // L'utilisateur ralentit, se pose
  | 'user_rushing'          // L'utilisateur accélère, stress
  | 'good_silence'          // Silence bien placé
  | 'hesitations'           // Hésitations répétées
  | 'strong_phrase'         // Phrase forte, impactante
  | 'filler_words'          // Mots de remplissage
  | 'energy_peak'           // Pic d'énergie
  | 'energy_drop'           // Chute d'énergie
  | 'monotone'              // Ton monotone détecté
  | 'session_start'         // Début de session
  | 'session_end'           // Fin de session

export interface AmbianceReaction {
  sound: AmbianceSound
  intensity: number      // 0-1
  duration: number       // ms
  delay: number         // ms avant déclenchement
  fadeIn: number        // ms
  fadeOut: number       // ms
}

export interface AudienceProfileConfig {
  name: string
  description: string
  baseAttention: number           // 0-1 niveau attention de base
  attentionDecayRate: number      // Vitesse de perte d'attention
  attentionRecoveryRate: number   // Vitesse de récupération
  reactivityLevel: number         // 0-1 réactivité aux signaux
  reactions: Record<ReactionTrigger, AmbianceReaction | null>
}

// ═══════════════════════════════════════════════════════════════════
// PROFILS DE PUBLIC
// ═══════════════════════════════════════════════════════════════════

export const AUDIENCE_PROFILES: Record<AudienceProfile, AudienceProfileConfig> = {
  neutral: {
    name: 'Public neutre',
    description: 'Un public standard, ni trop chaud ni trop froid',
    baseAttention: 0.6,
    attentionDecayRate: 0.02,
    attentionRecoveryRate: 0.05,
    reactivityLevel: 0.5,
    reactions: {
      user_slowing: {
        sound: 'silence_attentif',
        intensity: 0.6,
        duration: 3000,
        delay: 500,
        fadeIn: 800,
        fadeOut: 1200
      },
      user_rushing: {
        sound: 'agitation',
        intensity: 0.3,
        duration: 2000,
        delay: 1000,
        fadeIn: 600,
        fadeOut: 800
      },
      good_silence: {
        sound: 'silence_attentif',
        intensity: 0.8,
        duration: 2500,
        delay: 200,
        fadeIn: 400,
        fadeOut: 600
      },
      hesitations: {
        sound: 'murmure_leger',
        intensity: 0.2,
        duration: 1500,
        delay: 800,
        fadeIn: 500,
        fadeOut: 700
      },
      strong_phrase: {
        sound: 'micro_approbation',
        intensity: 0.5,
        duration: 1200,
        delay: 300,
        fadeIn: 200,
        fadeOut: 500
      },
      filler_words: null,
      energy_peak: {
        sound: 'silence_attentif',
        intensity: 0.7,
        duration: 2000,
        delay: 400,
        fadeIn: 300,
        fadeOut: 800
      },
      energy_drop: {
        sound: 'souffle_calme',
        intensity: 0.3,
        duration: 2500,
        delay: 600,
        fadeIn: 800,
        fadeOut: 1000
      },
      monotone: {
        sound: 'agitation',
        intensity: 0.2,
        duration: 1800,
        delay: 2000,
        fadeIn: 700,
        fadeOut: 900
      },
      session_start: {
        sound: 'souffle_calme',
        intensity: 0.4,
        duration: 4000,
        delay: 0,
        fadeIn: 1500,
        fadeOut: 2000
      },
      session_end: {
        sound: 'applaudissement_leger',
        intensity: 0.6,
        duration: 3500,
        delay: 500,
        fadeIn: 400,
        fadeOut: 1500
      }
    }
  },

  cold_jury: {
    name: 'Jury froid',
    description: 'Des évaluateurs exigeants et peu expressifs',
    baseAttention: 0.8,
    attentionDecayRate: 0.04,
    attentionRecoveryRate: 0.02,
    reactivityLevel: 0.3,
    reactions: {
      user_slowing: {
        sound: 'tension',
        intensity: 0.5,
        duration: 2500,
        delay: 300,
        fadeIn: 600,
        fadeOut: 800
      },
      user_rushing: {
        sound: 'tension',
        intensity: 0.6,
        duration: 2000,
        delay: 500,
        fadeIn: 400,
        fadeOut: 600
      },
      good_silence: {
        sound: 'silence_attentif',
        intensity: 0.9,
        duration: 3000,
        delay: 100,
        fadeIn: 200,
        fadeOut: 400
      },
      hesitations: {
        sound: 'agitation',
        intensity: 0.4,
        duration: 1800,
        delay: 500,
        fadeIn: 400,
        fadeOut: 600
      },
      strong_phrase: {
        sound: 'silence_attentif',
        intensity: 0.7,
        duration: 1500,
        delay: 200,
        fadeIn: 150,
        fadeOut: 400
      },
      filler_words: {
        sound: 'tension',
        intensity: 0.3,
        duration: 1200,
        delay: 600,
        fadeIn: 300,
        fadeOut: 500
      },
      energy_peak: {
        sound: 'silence_attentif',
        intensity: 0.8,
        duration: 2200,
        delay: 300,
        fadeIn: 200,
        fadeOut: 600
      },
      energy_drop: {
        sound: 'agitation',
        intensity: 0.3,
        duration: 2000,
        delay: 800,
        fadeIn: 600,
        fadeOut: 800
      },
      monotone: {
        sound: 'decrochage',
        intensity: 0.5,
        duration: 2500,
        delay: 1500,
        fadeIn: 800,
        fadeOut: 1000
      },
      session_start: {
        sound: 'tension',
        intensity: 0.4,
        duration: 3000,
        delay: 0,
        fadeIn: 1000,
        fadeOut: 1500
      },
      session_end: null  // Pas d'applaudissements automatiques
    }
  },

  enthusiastic: {
    name: 'Équipe enthousiaste',
    description: 'Des collègues bienveillants et réactifs',
    baseAttention: 0.7,
    attentionDecayRate: 0.01,
    attentionRecoveryRate: 0.08,
    reactivityLevel: 0.8,
    reactions: {
      user_slowing: {
        sound: 'silence_attentif',
        intensity: 0.7,
        duration: 2500,
        delay: 300,
        fadeIn: 500,
        fadeOut: 800
      },
      user_rushing: {
        sound: 'souffle_calme',
        intensity: 0.3,
        duration: 1500,
        delay: 600,
        fadeIn: 400,
        fadeOut: 600
      },
      good_silence: {
        sound: 'silence_attentif',
        intensity: 0.85,
        duration: 2800,
        delay: 150,
        fadeIn: 300,
        fadeOut: 500
      },
      hesitations: null,  // Équipe tolérante
      strong_phrase: {
        sound: 'micro_approbation',
        intensity: 0.7,
        duration: 1500,
        delay: 200,
        fadeIn: 150,
        fadeOut: 600
      },
      filler_words: null,
      energy_peak: {
        sound: 'micro_approbation',
        intensity: 0.8,
        duration: 1800,
        delay: 250,
        fadeIn: 200,
        fadeOut: 700
      },
      energy_drop: {
        sound: 'souffle_calme',
        intensity: 0.2,
        duration: 2000,
        delay: 500,
        fadeIn: 600,
        fadeOut: 800
      },
      monotone: {
        sound: 'souffle_calme',
        intensity: 0.25,
        duration: 2200,
        delay: 3000,
        fadeIn: 900,
        fadeOut: 1100
      },
      session_start: {
        sound: 'souffle_calme',
        intensity: 0.5,
        duration: 3500,
        delay: 0,
        fadeIn: 1200,
        fadeOut: 1800
      },
      session_end: {
        sound: 'applaudissement_fort',
        intensity: 0.8,
        duration: 4500,
        delay: 300,
        fadeIn: 300,
        fadeOut: 2000
      }
    }
  },

  hostile: {
    name: 'Client hostile',
    description: 'Un interlocuteur sceptique et impatient',
    baseAttention: 0.4,
    attentionDecayRate: 0.06,
    attentionRecoveryRate: 0.03,
    reactivityLevel: 0.7,
    reactions: {
      user_slowing: {
        sound: 'tension',
        intensity: 0.6,
        duration: 2000,
        delay: 400,
        fadeIn: 500,
        fadeOut: 700
      },
      user_rushing: {
        sound: 'agitation',
        intensity: 0.5,
        duration: 2200,
        delay: 600,
        fadeIn: 400,
        fadeOut: 800
      },
      good_silence: {
        sound: 'tension',
        intensity: 0.5,
        duration: 1800,
        delay: 300,
        fadeIn: 300,
        fadeOut: 500
      },
      hesitations: {
        sound: 'agitation',
        intensity: 0.6,
        duration: 2000,
        delay: 400,
        fadeIn: 350,
        fadeOut: 650
      },
      strong_phrase: {
        sound: 'silence_attentif',
        intensity: 0.6,
        duration: 1800,
        delay: 350,
        fadeIn: 250,
        fadeOut: 550
      },
      filler_words: {
        sound: 'agitation',
        intensity: 0.4,
        duration: 1500,
        delay: 500,
        fadeIn: 300,
        fadeOut: 500
      },
      energy_peak: {
        sound: 'silence_attentif',
        intensity: 0.65,
        duration: 2000,
        delay: 400,
        fadeIn: 300,
        fadeOut: 700
      },
      energy_drop: {
        sound: 'decrochage',
        intensity: 0.5,
        duration: 2500,
        delay: 700,
        fadeIn: 600,
        fadeOut: 900
      },
      monotone: {
        sound: 'decrochage',
        intensity: 0.7,
        duration: 3000,
        delay: 1000,
        fadeIn: 700,
        fadeOut: 1200
      },
      session_start: {
        sound: 'tension',
        intensity: 0.5,
        duration: 2500,
        delay: 0,
        fadeIn: 800,
        fadeOut: 1200
      },
      session_end: null
    }
  },

  distracted: {
    name: 'Public distrait',
    description: 'Une audience qui décroche facilement',
    baseAttention: 0.35,
    attentionDecayRate: 0.08,
    attentionRecoveryRate: 0.04,
    reactivityLevel: 0.6,
    reactions: {
      user_slowing: {
        sound: 'decrochage',
        intensity: 0.3,
        duration: 2000,
        delay: 1500,
        fadeIn: 800,
        fadeOut: 1000
      },
      user_rushing: {
        sound: 'agitation',
        intensity: 0.4,
        duration: 2200,
        delay: 800,
        fadeIn: 600,
        fadeOut: 900
      },
      good_silence: {
        sound: 'silence_attentif',
        intensity: 0.5,
        duration: 1500,
        delay: 500,
        fadeIn: 400,
        fadeOut: 600
      },
      hesitations: {
        sound: 'decrochage',
        intensity: 0.5,
        duration: 2500,
        delay: 600,
        fadeIn: 600,
        fadeOut: 900
      },
      strong_phrase: {
        sound: 'silence_attentif',
        intensity: 0.7,
        duration: 2000,
        delay: 300,
        fadeIn: 300,
        fadeOut: 700
      },
      filler_words: {
        sound: 'decrochage',
        intensity: 0.35,
        duration: 1800,
        delay: 700,
        fadeIn: 500,
        fadeOut: 700
      },
      energy_peak: {
        sound: 'silence_attentif',
        intensity: 0.75,
        duration: 2200,
        delay: 350,
        fadeIn: 250,
        fadeOut: 800
      },
      energy_drop: {
        sound: 'decrochage',
        intensity: 0.6,
        duration: 3000,
        delay: 500,
        fadeIn: 700,
        fadeOut: 1100
      },
      monotone: {
        sound: 'decrochage',
        intensity: 0.8,
        duration: 3500,
        delay: 800,
        fadeIn: 800,
        fadeOut: 1400
      },
      session_start: {
        sound: 'murmure_leger',
        intensity: 0.4,
        duration: 3000,
        delay: 0,
        fadeIn: 1000,
        fadeOut: 1500
      },
      session_end: {
        sound: 'applaudissement_leger',
        intensity: 0.4,
        duration: 2500,
        delay: 800,
        fadeIn: 400,
        fadeOut: 1200
      }
    }
  },

  friendly: {
    name: 'Ami bienveillant',
    description: 'Un proche qui vous soutient inconditionnellement',
    baseAttention: 0.9,
    attentionDecayRate: 0.005,
    attentionRecoveryRate: 0.1,
    reactivityLevel: 0.7,
    reactions: {
      user_slowing: {
        sound: 'silence_attentif',
        intensity: 0.8,
        duration: 3000,
        delay: 200,
        fadeIn: 600,
        fadeOut: 1000
      },
      user_rushing: {
        sound: 'souffle_calme',
        intensity: 0.2,
        duration: 1500,
        delay: 800,
        fadeIn: 500,
        fadeOut: 700
      },
      good_silence: {
        sound: 'silence_attentif',
        intensity: 0.9,
        duration: 3200,
        delay: 100,
        fadeIn: 200,
        fadeOut: 400
      },
      hesitations: null,
      strong_phrase: {
        sound: 'micro_approbation',
        intensity: 0.75,
        duration: 1600,
        delay: 200,
        fadeIn: 150,
        fadeOut: 650
      },
      filler_words: null,
      energy_peak: {
        sound: 'micro_approbation',
        intensity: 0.85,
        duration: 1800,
        delay: 200,
        fadeIn: 150,
        fadeOut: 750
      },
      energy_drop: {
        sound: 'souffle_calme',
        intensity: 0.15,
        duration: 2000,
        delay: 600,
        fadeIn: 700,
        fadeOut: 900
      },
      monotone: null,  // Ami tolérant
      session_start: {
        sound: 'souffle_calme',
        intensity: 0.6,
        duration: 4000,
        delay: 0,
        fadeIn: 1500,
        fadeOut: 2000
      },
      session_end: {
        sound: 'applaudissement_fort',
        intensity: 0.9,
        duration: 5000,
        delay: 200,
        fadeIn: 250,
        fadeOut: 2500
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
// ANALYSE DES MÉTRIQUES → TRIGGERS
// ═══════════════════════════════════════════════════════════════════

export interface SpeechMetrics {
  wordsPerMinute: number
  previousWPM: number
  silenceDuration: number      // ms de silence actuel
  isCurrentlySilent: boolean
  hesitationCount: number
  fillerWordCount: number
  energyLevel: number          // 0-1
  previousEnergyLevel: number
  melodicVariation: number     // 0-1
}

export function detectTriggers(metrics: SpeechMetrics): ReactionTrigger[] {
  const triggers: ReactionTrigger[] = []
  
  // Détection ralentissement (WPM baisse de plus de 20%)
  if (metrics.previousWPM > 0) {
    const wpmChange = (metrics.wordsPerMinute - metrics.previousWPM) / metrics.previousWPM
    if (wpmChange < -0.2) {
      triggers.push('user_slowing')
    } else if (wpmChange > 0.25) {
      triggers.push('user_rushing')
    }
  }
  
  // Détection bon silence (800-2500ms, après une phrase)
  if (metrics.isCurrentlySilent && 
      metrics.silenceDuration >= 800 && 
      metrics.silenceDuration <= 2500) {
    triggers.push('good_silence')
  }
  
  // Détection hésitations
  if (metrics.hesitationCount >= 3) {
    triggers.push('hesitations')
  }
  
  // Détection mots de remplissage
  if (metrics.fillerWordCount >= 4) {
    triggers.push('filler_words')
  }
  
  // Détection pic d'énergie
  if (metrics.energyLevel > 0.7 && 
      metrics.energyLevel - metrics.previousEnergyLevel > 0.2) {
    triggers.push('energy_peak')
  }
  
  // Détection chute d'énergie
  if (metrics.energyLevel < 0.3 && 
      metrics.previousEnergyLevel - metrics.energyLevel > 0.2) {
    triggers.push('energy_drop')
  }
  
  // Détection monotonie
  if (metrics.melodicVariation < 0.15 && metrics.wordsPerMinute > 60) {
    triggers.push('monotone')
  }
  
  return triggers
}

// ═══════════════════════════════════════════════════════════════════
// CLASSE AMBIANCE ENGINE
// ═══════════════════════════════════════════════════════════════════

export class AmbianceEngine {
  private profile: AudienceProfileConfig
  private attention: number
  private isActive: boolean = false
  private lastTriggerTime: Record<ReactionTrigger, number> = {} as Record<ReactionTrigger, number>
  private cooldownMs: number = 3000  // Délai minimum entre deux réactions similaires
  private onReactionCallback?: (reaction: AmbianceReaction, trigger: ReactionTrigger) => void
  private onAttentionChangeCallback?: (attention: number) => void
  private attentionInterval?: NodeJS.Timeout
  
  constructor(profileType: AudienceProfile = 'neutral') {
    this.profile = AUDIENCE_PROFILES[profileType]
    this.attention = this.profile.baseAttention
  }
  
  // Démarrer le moteur
  start(onReaction?: typeof this.onReactionCallback, onAttentionChange?: typeof this.onAttentionChangeCallback) {
    this.isActive = true
    this.onReactionCallback = onReaction
    this.onAttentionChangeCallback = onAttentionChange
    this.attention = this.profile.baseAttention
    
    // Decay naturel de l'attention
    this.attentionInterval = setInterval(() => {
      if (this.isActive) {
        this.decayAttention()
      }
    }, 1000)
    
    // Déclencher le son de début de session
    this.triggerReaction('session_start')
  }
  
  // Arrêter le moteur
  stop() {
    this.triggerReaction('session_end')
    
    setTimeout(() => {
      this.isActive = false
      if (this.attentionInterval) {
        clearInterval(this.attentionInterval)
      }
    }, 500)
  }
  
  // Changer de profil
  setProfile(profileType: AudienceProfile) {
    this.profile = AUDIENCE_PROFILES[profileType]
    this.attention = this.profile.baseAttention
  }
  
  // Traiter les métriques vocales
  processMetrics(metrics: SpeechMetrics) {
    if (!this.isActive) return
    
    const triggers = detectTriggers(metrics)
    
    triggers.forEach(trigger => {
      this.triggerReaction(trigger)
    })
    
    // Ajuster l'attention basé sur la qualité de la parole
    this.adjustAttention(metrics)
  }
  
  // Déclencher une réaction
  private triggerReaction(trigger: ReactionTrigger) {
    const now = Date.now()
    const lastTime = this.lastTriggerTime[trigger] || 0
    
    // Vérifier cooldown
    if (now - lastTime < this.cooldownMs) return
    
    const reaction = this.profile.reactions[trigger]
    if (!reaction) return
    
    // Appliquer la réactivité du profil
    const adjustedReaction: AmbianceReaction = {
      ...reaction,
      intensity: reaction.intensity * this.profile.reactivityLevel * this.attention
    }
    
    this.lastTriggerTime[trigger] = now
    
    if (this.onReactionCallback) {
      this.onReactionCallback(adjustedReaction, trigger)
    }
    
    // Certains triggers récupèrent de l'attention
    if (trigger === 'good_silence' || trigger === 'strong_phrase' || trigger === 'energy_peak') {
      this.recoverAttention(0.1)
    }
  }
  
  // Decay naturel de l'attention
  private decayAttention() {
    this.attention = Math.max(0.1, this.attention - this.profile.attentionDecayRate)
    if (this.onAttentionChangeCallback) {
      this.onAttentionChangeCallback(this.attention)
    }
  }
  
  // Récupération d'attention
  private recoverAttention(amount: number) {
    this.attention = Math.min(1, this.attention + amount * this.profile.attentionRecoveryRate * 10)
    if (this.onAttentionChangeCallback) {
      this.onAttentionChangeCallback(this.attention)
    }
  }
  
  // Ajuster attention basé sur métriques
  private adjustAttention(metrics: SpeechMetrics) {
    // Bonne énergie = attention maintenue
    if (metrics.energyLevel > 0.5) {
      this.recoverAttention(0.02)
    }
    
    // Variation mélodique = intérêt
    if (metrics.melodicVariation > 0.3) {
      this.recoverAttention(0.03)
    }
    
    // Hésitations = perte d'attention
    if (metrics.hesitationCount > 2) {
      this.attention = Math.max(0.1, this.attention - 0.02)
    }
    
    if (this.onAttentionChangeCallback) {
      this.onAttentionChangeCallback(this.attention)
    }
  }
  
  // Getters
  getAttention(): number {
    return this.attention
  }
  
  getProfile(): AudienceProfileConfig {
    return this.profile
  }
  
  isRunning(): boolean {
    return this.isActive
  }
}

// ═══════════════════════════════════════════════════════════════════
// HOOK REACT POUR L'AMBIANCE ENGINE
// ═══════════════════════════════════════════════════════════════════

import { useCallback, useEffect, useRef, useState } from 'react'
import { useAmbianceStore } from '@/stores/ambianceStore'

export function useAmbianceEngine() {
  const engineRef = useRef<AmbianceEngine | null>(null)
  const [currentReaction, setCurrentReaction] = useState<{
    reaction: AmbianceReaction
    trigger: ReactionTrigger
  } | null>(null)
  
  const { 
    profile, 
    isActive, 
    updateAttention, 
    setReaction,
    activateAmbiance,
    deactivateAmbiance 
  } = useAmbianceStore()
  
  // Initialiser le moteur
  useEffect(() => {
    engineRef.current = new AmbianceEngine(profile)
    return () => {
      if (engineRef.current?.isRunning()) {
        engineRef.current.stop()
      }
    }
  }, [])
  
  // Changer de profil
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setProfile(profile)
    }
  }, [profile])
  
  // Démarrer l'ambiance
  const startAmbiance = useCallback((audienceProfile: AudienceProfile = 'neutral') => {
    activateAmbiance(audienceProfile)
    
    if (engineRef.current) {
      engineRef.current.setProfile(audienceProfile)
      engineRef.current.start(
        (reaction, trigger) => {
          setCurrentReaction({ reaction, trigger })
          setReaction(trigger)
          
          // Clear reaction after duration
          setTimeout(() => {
            setCurrentReaction(null)
          }, reaction.duration)
        },
        (attention) => {
          updateAttention(attention)
        }
      )
    }
  }, [activateAmbiance, updateAttention, setReaction])
  
  // Arrêter l'ambiance
  const stopAmbiance = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.stop()
    }
    deactivateAmbiance()
  }, [deactivateAmbiance])
  
  // Envoyer des métriques
  const sendMetrics = useCallback((metrics: SpeechMetrics) => {
    if (engineRef.current && isActive) {
      engineRef.current.processMetrics(metrics)
    }
  }, [isActive])
  
  return {
    startAmbiance,
    stopAmbiance,
    sendMetrics,
    currentReaction,
    isActive
  }
}
