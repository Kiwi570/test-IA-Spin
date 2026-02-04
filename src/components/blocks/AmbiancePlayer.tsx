'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AmbianceSound, AmbianceReaction, ReactionTrigger } from '@/lib/ambianceEngine'
import { useAmbianceStore } from '@/stores/ambianceStore'

// ═══════════════════════════════════════════════════════════════════
// CONFIGURATION DES SONS (URLs ou descriptions pour génération)
// ═══════════════════════════════════════════════════════════════════

interface SoundConfig {
  name: string
  emoji: string           // Représentation visuelle
  color: string          // Couleur associée
  description: string    // Pour génération future
  visualEffect: 'wave' | 'pulse' | 'fade' | 'ripple' | 'glow'
}

const SOUND_CONFIGS: Record<AmbianceSound, SoundConfig> = {
  silence_attentif: {
    name: 'Silence attentif',
    emoji: '👀',
    color: '#D4A853',      // Or chaud - attention maximale
    description: 'Un silence dense, comme si chaque personne retenait son souffle',
    visualEffect: 'glow'
  },
  souffle_calme: {
    name: 'Souffle calme',
    emoji: '🌬️',
    color: '#6B7280',      // Gris doux
    description: 'Respiration collective légère et apaisante',
    visualEffect: 'wave'
  },
  murmure_leger: {
    name: 'Murmure léger',
    emoji: '💬',
    color: '#9CA3AF',      // Gris moyen
    description: 'Chuchotements discrets dans le public',
    visualEffect: 'ripple'
  },
  agitation: {
    name: 'Agitation',
    emoji: '📋',
    color: '#F59E0B',      // Orange attention
    description: 'Bruits de chaises, mouvements, papiers',
    visualEffect: 'pulse'
  },
  decrochage: {
    name: 'Décrochage',
    emoji: '📱',
    color: '#EF4444',      // Rouge alerte
    description: 'Bruits de distraction, attention qui se disperse',
    visualEffect: 'fade'
  },
  micro_approbation: {
    name: 'Approbation',
    emoji: '👍',
    color: '#10B981',      // Vert succès
    description: 'Léger "hmm" approbateur, hochements de tête',
    visualEffect: 'pulse'
  },
  tension: {
    name: 'Tension',
    emoji: '😐',
    color: '#8B5CF6',      // Violet intense
    description: 'Silence tendu, évaluateur',
    visualEffect: 'glow'
  },
  applaudissement_leger: {
    name: 'Applaudissements',
    emoji: '👏',
    color: '#10B981',      // Vert succès
    description: 'Applaudissements polis et discrets',
    visualEffect: 'ripple'
  },
  applaudissement_fort: {
    name: 'Ovation',
    emoji: '🎉',
    color: '#D4A853',      // Or célébration
    description: 'Applaudissements chaleureux et enthousiastes',
    visualEffect: 'ripple'
  }
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT VISUALISATION D'UNE RÉACTION
// ═══════════════════════════════════════════════════════════════════

interface ReactionVisualizerProps {
  reaction: AmbianceReaction
  trigger: ReactionTrigger
}

function ReactionVisualizer({ reaction, trigger }: ReactionVisualizerProps) {
  const config = SOUND_CONFIGS[reaction.sound]
  
  const renderEffect = () => {
    switch (config.visualEffect) {
      case 'glow':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0.3, reaction.intensity * 0.6, 0.3],
              scale: [0.9, 1.1, 0.9]
            }}
            transition={{ 
              duration: reaction.duration / 1000,
              ease: 'easeInOut',
              repeat: Infinity
            }}
            className="absolute inset-0 rounded-full"
            style={{ 
              background: `radial-gradient(circle, ${config.color}40 0%, transparent 70%)`,
              filter: 'blur(20px)'
            }}
          />
        )
      
      case 'wave':
        return (
          <motion.div className="flex items-center justify-center gap-1 h-6">
            {[0, 1, 2, 3, 4].map(i => (
              <motion.div
                key={i}
                initial={{ height: 4 }}
                animate={{ height: [4, 16 * reaction.intensity, 4] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: 'easeInOut'
                }}
                className="w-1 rounded-full"
                style={{ backgroundColor: config.color }}
              />
            ))}
          </motion.div>
        )
      
      case 'pulse':
        return (
          <motion.div
            initial={{ scale: 1, opacity: reaction.intensity }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [reaction.intensity * 0.8, reaction.intensity, reaction.intensity * 0.8]
            }}
            transition={{ 
              duration: 0.6,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
            style={{ backgroundColor: `${config.color}30` }}
          >
            {config.emoji}
          </motion.div>
        )
      
      case 'ripple':
        return (
          <div className="relative w-16 h-16 flex items-center justify-center">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                initial={{ scale: 0.5, opacity: reaction.intensity }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: 'easeOut'
                }}
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: config.color }}
              />
            ))}
            <span className="text-2xl z-10">{config.emoji}</span>
          </div>
        )
      
      case 'fade':
        return (
          <motion.div
            initial={{ opacity: reaction.intensity }}
            animate={{ opacity: [reaction.intensity * 0.5, reaction.intensity * 0.3] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="text-2xl"
          >
            {config.emoji}
          </motion.div>
        )
      
      default:
        return <span className="text-xl">{config.emoji}</span>
    }
  }
  
  return (
    <div className="relative flex flex-col items-center">
      {renderEffect()}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT BARRE D'ATTENTION
// ═══════════════════════════════════════════════════════════════════

interface AttentionBarProps {
  attention: number
  className?: string
}

function AttentionBar({ attention, className = '' }: AttentionBarProps) {
  const getColor = () => {
    if (attention > 0.7) return '#10B981'  // Vert - attention haute
    if (attention > 0.4) return '#D4A853'  // Or - attention moyenne
    return '#EF4444'                        // Rouge - attention basse
  }
  
  return (
    <div className={`relative ${className}`}>
      <div className="h-1 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: '50%' }}
          animate={{ width: `${attention * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ backgroundColor: getColor() }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-muted">Décrochage</span>
        <span className="text-[10px] text-muted">Captivé</span>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT SILHOUETTES DU PUBLIC
// ═══════════════════════════════════════════════════════════════════

interface AudienceSilhouettesProps {
  attention: number
  count?: number
}

function AudienceSilhouettes({ attention, count = 5 }: AudienceSilhouettesProps) {
  // Les silhouettes réagissent à l'attention
  const getHeadRotation = (index: number) => {
    if (attention > 0.7) return 0  // Tous regardent droit
    if (attention > 0.4) {
      // Quelques-uns regardent ailleurs
      return index % 3 === 0 ? [-5, 5][index % 2] : 0
    }
    // Beaucoup regardent ailleurs
    return index % 2 === 0 ? [-10, 10][index % 2] : [-5, 5][index % 2]
  }
  
  return (
    <div className="flex justify-center items-end gap-3 h-12">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="relative"
          animate={{ rotateZ: getHeadRotation(i) }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* Tête */}
          <motion.div 
            className="w-4 h-4 rounded-full bg-muted"
            animate={{ 
              opacity: attention > 0.3 ? 0.6 : 0.3,
              y: attention > 0.5 ? 0 : [0, 1, 0]
            }}
            transition={{ 
              y: { duration: 2, repeat: Infinity, delay: i * 0.3 }
            }}
          />
          {/* Épaules */}
          <div className="w-6 h-3 rounded-t-full bg-muted opacity-40 -mt-1 -ml-1" />
        </motion.div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL AMBIANCE PLAYER
// ═══════════════════════════════════════════════════════════════════

interface AmbiancePlayerProps {
  currentReaction: {
    reaction: AmbianceReaction
    trigger: ReactionTrigger
  } | null
  showSilhouettes?: boolean
  showAttentionBar?: boolean
  minimal?: boolean
  className?: string
}

export function AmbiancePlayer({
  currentReaction,
  showSilhouettes = true,
  showAttentionBar = true,
  minimal = false,
  className = ''
}: AmbiancePlayerProps) {
  const { isActive, attentionLevel, profile } = useAmbianceStore()
  const [reactionHistory, setReactionHistory] = useState<Array<{
    id: number
    reaction: AmbianceReaction
    trigger: ReactionTrigger
    timestamp: number
  }>>([])
  const historyIdRef = useRef(0)
  
  // Ajouter les réactions à l'historique pour affichage
  useEffect(() => {
    if (currentReaction) {
      const id = ++historyIdRef.current
      setReactionHistory(prev => [
        ...prev.slice(-2),  // Garder les 3 dernières
        { ...currentReaction, id, timestamp: Date.now() }
      ])
      
      // Retirer après la durée
      setTimeout(() => {
        setReactionHistory(prev => prev.filter(r => r.id !== id))
      }, currentReaction.reaction.duration)
    }
  }, [currentReaction])
  
  if (!isActive) return null
  
  if (minimal) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <AnimatePresence mode="popLayout">
          {currentReaction && (
            <motion.div
              key={currentReaction.trigger + Date.now()}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <ReactionVisualizer 
                reaction={currentReaction.reaction}
                trigger={currentReaction.trigger}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {showAttentionBar && (
          <AttentionBar attention={attentionLevel} className="w-20" />
        )}
      </div>
    )
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`rounded-xl bg-secondary/30 backdrop-blur-sm p-4 ${className}`}
    >
      {/* Silhouettes du public */}
      {showSilhouettes && (
        <div className="mb-4">
          <AudienceSilhouettes attention={attentionLevel} count={7} />
        </div>
      )}
      
      {/* Zone de réaction */}
      <div className="h-20 flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          {reactionHistory.length > 0 ? (
            <motion.div
              key={reactionHistory[reactionHistory.length - 1].id}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-2"
            >
              <ReactionVisualizer 
                reaction={reactionHistory[reactionHistory.length - 1].reaction}
                trigger={reactionHistory[reactionHistory.length - 1].trigger}
              />
              <span className="text-xs text-muted">
                {SOUND_CONFIGS[reactionHistory[reactionHistory.length - 1].reaction.sound].name}
              </span>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              className="text-sm text-muted text-center"
            >
              Public à l'écoute...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Barre d'attention */}
      {showAttentionBar && (
        <AttentionBar attention={attentionLevel} className="mt-4" />
      )}
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT INDICATEUR COMPACT (pour la session)
// ═══════════════════════════════════════════════════════════════════

interface CompactAmbianceIndicatorProps {
  currentReaction: {
    reaction: AmbianceReaction
    trigger: ReactionTrigger
  } | null
}

export function CompactAmbianceIndicator({ currentReaction }: CompactAmbianceIndicatorProps) {
  const { isActive, attentionLevel } = useAmbianceStore()
  
  if (!isActive) return null
  
  const getAttentionColor = () => {
    if (attentionLevel > 0.7) return 'bg-emerald-500'
    if (attentionLevel > 0.4) return 'bg-amber-500'
    return 'bg-red-500'
  }
  
  return (
    <div className="flex items-center gap-3">
      {/* Indicateur d'attention */}
      <div className="flex items-center gap-1.5">
        <motion.div 
          className={`w-2 h-2 rounded-full ${getAttentionColor()}`}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-xs text-muted">
          {attentionLevel > 0.7 ? 'Captivé' : attentionLevel > 0.4 ? 'Attentif' : 'Distrait'}
        </span>
      </div>
      
      {/* Réaction actuelle */}
      <AnimatePresence mode="wait">
        {currentReaction && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center gap-1"
          >
            <span className="text-sm">
              {SOUND_CONFIGS[currentReaction.reaction.sound].emoji}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { SOUND_CONFIGS }
