'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Text } from '@/components/primitives'
import { SebPresence } from '@/components/blocks/SebPresence'
import { AdviceCardDisplay } from '@/components/blocks/AdviceCard'
import { DebriefResult, PeakMoment } from '@/lib/debriefEngine'

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

interface DebriefScreenProps {
  result: DebriefResult
  onComplete: () => void
  onSaveCard?: () => void
}

type DebriefPhase = 
  | 'intro'           // Seb apparaît
  | 'main_feedback'   // Feedback principal
  | 'strengths'       // Points forts
  | 'wow_moment'      // Moment wow (si présent)
  | 'card_reveal'     // Révélation de la carte
  | 'anchor'          // Phrase d'ancrage
  | 'complete'        // Fin

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT PHASE FEEDBACK
// ═══════════════════════════════════════════════════════════════════

interface FeedbackPhaseProps {
  text: string
  isVisible: boolean
}

function FeedbackPhase({ text, isVisible }: FeedbackPhaseProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
  // Effet machine à écrire
  useEffect(() => {
    if (!isVisible) {
      setDisplayedText('')
      return
    }
    
    setIsTyping(true)
    let index = 0
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        setIsTyping(false)
        clearInterval(interval)
      }
    }, 30)  // Vitesse d'écriture
    
    return () => clearInterval(interval)
  }, [text, isVisible])
  
  if (!isVisible) return null
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-md mx-auto"
    >
      <Text 
        className="font-serif text-lg leading-relaxed whitespace-pre-line"
      >
        {displayedText}
        {isTyping && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            |
          </motion.span>
        )}
      </Text>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT POINTS FORTS
// ═══════════════════════════════════════════════════════════════════

interface StrengthsPhaseProps {
  strengths: string[]
  isVisible: boolean
}

function StrengthsPhase({ strengths, isVisible }: StrengthsPhaseProps) {
  if (!isVisible || strengths.length === 0) return null
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="max-w-md mx-auto"
    >
      <Text variant="caption" className="text-accent mb-4 block">
        Ce qui a fonctionné
      </Text>
      <div className="space-y-3">
        {strengths.map((strength, index) => (
          <motion.div
            key={strength}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.3, duration: 0.5 }}
            className="flex items-start gap-3"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.3 + 0.2, type: 'spring' }}
              className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0"
            />
            <Text className="text-primary">{strength}</Text>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT MOMENT WOW
// ═══════════════════════════════════════════════════════════════════

interface WowMomentPhaseProps {
  moment: PeakMoment | null
  isVisible: boolean
}

function WowMomentPhase({ moment, isVisible }: WowMomentPhaseProps) {
  if (!isVisible || !moment) return null
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.6 }}
      className="max-w-md mx-auto text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', bounce: 0.5, delay: 0.3 }}
        className="inline-block mb-4"
      >
        <span className="text-4xl">✨</span>
      </motion.div>
      
      <Text variant="caption" className="text-emerald-400 mb-2 block">
        Moment de grâce
      </Text>
      
      <Text className="font-serif text-lg">
        {moment.description}
      </Text>
      
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ delay: 0.5, duration: 1 }}
        className="h-0.5 bg-emerald-500/30 mt-6 mx-auto max-w-[200px]"
      />
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT RÉVÉLATION CARTE
// ═══════════════════════════════════════════════════════════════════

interface CardRevealPhaseProps {
  result: DebriefResult
  isVisible: boolean
  onSave?: () => void
}

function CardRevealPhase({ result, isVisible, onSave }: CardRevealPhaseProps) {
  const [cardRevealed, setCardRevealed] = useState(false)
  
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setCardRevealed(true), 800)
      return () => clearTimeout(timer)
    }
    setCardRevealed(false)
  }, [isVisible])
  
  if (!isVisible) return null
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-md mx-auto"
    >
      <Text variant="caption" className="text-accent mb-6 block text-center">
        Ta carte du jour
      </Text>
      
      <motion.div
        initial={{ 
          rotateY: 180, 
          scale: 0.8,
          y: 100,
          opacity: 0 
        }}
        animate={cardRevealed ? { 
          rotateY: 0, 
          scale: 1,
          y: 0,
          opacity: 1 
        } : {}}
        transition={{ 
          duration: 0.8,
          type: 'spring',
          bounce: 0.3
        }}
        style={{ perspective: 1000 }}
      >
        <AdviceCardDisplay 
          card={result.adviceCard}
          variant="full"
          showSaveButton
          onSave={onSave}
        />
      </motion.div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT PHRASE D'ANCRAGE
// ═══════════════════════════════════════════════════════════════════

interface AnchorPhaseProps {
  phrase: string
  isVisible: boolean
}

function AnchorPhase({ phrase, isVisible }: AnchorPhaseProps) {
  if (!isVisible) return null
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-md mx-auto text-center"
    >
      <Text variant="caption" className="text-muted mb-6 block">
        Ta phrase à retenir
      </Text>
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative"
      >
        {/* Guillemets décoratifs */}
        <span className="absolute -left-4 -top-4 text-4xl text-accent/30 font-serif">
          "
        </span>
        <span className="absolute -right-4 -bottom-4 text-4xl text-accent/30 font-serif">
          "
        </span>
        
        <Text 
          className="font-serif text-2xl md:text-3xl font-medium text-accent px-8 py-4"
        >
          {phrase}
        </Text>
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-sm text-muted mt-8"
      >
        Répète-la avant ta prochaine prise de parole
      </motion.p>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL DEBRIEF SCREEN
// ═══════════════════════════════════════════════════════════════════

export function DebriefScreen({ result, onComplete, onSaveCard }: DebriefScreenProps) {
  const [phase, setPhase] = useState<DebriefPhase>('intro')
  const [phaseIndex, setPhaseIndex] = useState(0)
  
  // Séquence des phases
  const phases: DebriefPhase[] = [
    'intro',
    'main_feedback',
    ...(result.strengths.length > 0 ? ['strengths' as const] : []),
    ...(result.wowMoment ? ['wow_moment' as const] : []),
    'card_reveal',
    'anchor',
    'complete'
  ]
  
  // Avancer automatiquement les phases
  useEffect(() => {
    const durations: Record<DebriefPhase, number> = {
      intro: 2000,
      main_feedback: Math.max(4000, result.mainFeedback.length * 50), // Temps de lecture
      strengths: 3000,
      wow_moment: 3500,
      card_reveal: 5000,
      anchor: 4000,
      complete: 0
    }
    
    if (phase === 'complete') {
      onComplete()
      return
    }
    
    const timer = setTimeout(() => {
      const nextIndex = phaseIndex + 1
      if (nextIndex < phases.length) {
        setPhaseIndex(nextIndex)
        setPhase(phases[nextIndex])
      }
    }, durations[phase])
    
    return () => clearTimeout(timer)
  }, [phase, phaseIndex, phases, result.mainFeedback.length, onComplete])
  
  // Navigation manuelle (tap pour avancer)
  const handleTap = () => {
    const nextIndex = phaseIndex + 1
    if (nextIndex < phases.length) {
      setPhaseIndex(nextIndex)
      setPhase(phases[nextIndex])
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background flex flex-col"
      onClick={handleTap}
    >
      {/* Header avec progression */}
      <div className="p-6">
        <div className="flex gap-1 max-w-md mx-auto">
          {phases.slice(0, -1).map((p, i) => (
            <motion.div
              key={p}
              className="h-1 flex-1 rounded-full bg-secondary overflow-hidden"
            >
              <motion.div
                className="h-full bg-accent"
                initial={{ width: '0%' }}
                animate={{ width: i <= phaseIndex ? '100%' : '0%' }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        {/* Seb Presence (phases intro et feedback) */}
        <AnimatePresence mode="wait">
          {(phase === 'intro' || phase === 'main_feedback') && (
            <motion.div 
              key="seb"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-8 flex justify-center"
            >
              <SebPresence 
                state={phase === 'intro' ? 'thinking' : 'speaking'} 
                size="lg"
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Phases de contenu */}
        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <Text className="font-serif text-xl text-muted">
                Laisse-moi te faire un retour...
              </Text>
            </motion.div>
          )}
          
          {phase === 'main_feedback' && (
            <FeedbackPhase 
              key="feedback"
              text={result.mainFeedback}
              isVisible={true}
            />
          )}
          
          {phase === 'strengths' && (
            <StrengthsPhase 
              key="strengths"
              strengths={result.strengths}
              isVisible={true}
            />
          )}
          
          {phase === 'wow_moment' && (
            <WowMomentPhase 
              key="wow"
              moment={result.wowMoment}
              isVisible={true}
            />
          )}
          
          {phase === 'card_reveal' && (
            <CardRevealPhase 
              key="card"
              result={result}
              isVisible={true}
              onSave={onSaveCard}
            />
          )}
          
          {phase === 'anchor' && (
            <AnchorPhase 
              key="anchor"
              phrase={result.anchorPhrase}
              isVisible={true}
            />
          )}
        </AnimatePresence>
      </div>
      
      {/* Indication tap */}
      <motion.div 
        className="p-6 text-center"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Text variant="caption" className="text-muted">
          Touche pour continuer
        </Text>
      </motion.div>
    </motion.div>
  )
}

export default DebriefScreen
