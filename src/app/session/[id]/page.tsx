'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSessionStore, useProgressStore, useAudioStore, useAmbianceStore } from '@/stores'
import { getSessionByNumber, getScriptByNumber, getCardById } from '@/data'
import { SessionLayout } from '@/components/layouts'
import { SebPresence, SebMessage, MicIndicator } from '@/components/blocks'
import { AmbiancePlayer, CompactAmbianceIndicator } from '@/components/blocks/AmbiancePlayer'
import { DebriefScreen } from '@/components/blocks/DebriefScreen'
import { Button, Text } from '@/components/primitives'
import { useAmbianceEngine, SpeechMetrics } from '@/lib/ambianceEngine'
import { generateDebrief, detectPeakMoments, DebriefResult, SessionMetrics } from '@/lib/debriefEngine'
import { ArrowRight, RotateCcw, Clock, Users } from 'lucide-react'
import { AudienceProfile } from '@/types'
import { cn } from '@/lib/utils'

// Palette or unifiée
const GOLD = {
  light: '#E5C478',
  main: '#D4A853',
  dark: '#A67C3A',
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT TIMER CIRCULAIRE
// ═══════════════════════════════════════════════════════════════════

interface CircularTimerProps {
  duration: number
  elapsed: number
  size?: 'sm' | 'md' | 'lg'
}

function CircularTimer({ duration, elapsed, size = 'md' }: CircularTimerProps) {
  const remaining = Math.max(0, duration - elapsed)
  const progress = elapsed / duration
  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60
  
  const sizes = {
    sm: { outer: 60, stroke: 3, text: 'text-sm' },
    md: { outer: 80, stroke: 4, text: 'text-lg' },
    lg: { outer: 100, stroke: 5, text: 'text-xl' }
  }
  
  const { outer, stroke, text } = sizes[size]
  const radius = (outer - stroke * 2) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress)
  
  const getColor = () => {
    if (remaining <= 10) return '#EF4444'
    if (remaining <= 30) return '#F59E0B'
    return GOLD.main
  }
  
  return (
    <div className="relative" style={{ width: outer, height: outer }}>
      <svg className="absolute inset-0 -rotate-90" width={outer} height={outer}>
        <circle
          cx={outer / 2}
          cy={outer / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={outer / 2}
          cy={outer / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'linear' }}
        />
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`${text} font-mono tabular-nums`} style={{ color: getColor() }}>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT SÉLECTEUR DE PUBLIC
// ═══════════════════════════════════════════════════════════════════

interface AudienceSelectorProps {
  selected: AudienceProfile
  onSelect: (profile: AudienceProfile) => void
}

const AUDIENCE_OPTIONS: { profile: AudienceProfile; label: string; emoji: string; description: string }[] = [
  { profile: 'neutral', label: 'Neutre', emoji: '👥', description: 'Standard' },
  { profile: 'cold_jury', label: 'Jury', emoji: '🧊', description: 'Exigeant' },
  { profile: 'enthusiastic', label: 'Équipe', emoji: '🎉', description: 'Bienveillant' },
  { profile: 'hostile', label: 'Sceptique', emoji: '🤨', description: 'Difficile' },
  { profile: 'friendly', label: 'Ami', emoji: '💚', description: 'Soutien' },
]

function AudienceSelector({ selected, onSelect }: AudienceSelectorProps) {
  return (
    <div className="space-y-3">
      <Text variant="caption" className="text-text-muted flex items-center gap-2 justify-center">
        <Users className="w-4 h-4" />
        Choisis ton public
      </Text>
      <div className="flex flex-wrap gap-2 justify-center">
        {AUDIENCE_OPTIONS.map(({ profile, label, emoji }) => (
          <motion.button
            key={profile}
            onClick={() => onSelect(profile)}
            className={cn(
              'px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all text-sm font-medium',
              selected === profile 
                ? 'bg-gold-400/15 border border-gold-400 text-gold-400' 
                : 'bg-white/5 border border-white/10 text-text-secondary hover:bg-white/8 hover:border-white/20'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>{emoji}</span>
            <span>{label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// PAGE SESSION PRINCIPALE
// ═══════════════════════════════════════════════════════════════════

export default function SessionPage() {
  const params = useParams()
  const router = useRouter()
  const sessionNumber = parseInt(params.id as string, 10)

  const session = getSessionByNumber(sessionNumber)
  const script = getScriptByNumber(sessionNumber)
  const card = session ? getCardById(session.cardId) : undefined

  // Stores
  const { currentSession, startSession, setStep, completeSession, resetCurrentSession } = useSessionStore()
  const { updateAxes } = useProgressStore()
  const { isRecording, audioLevel, analysis, startRecording, stopRecording } = useAudioStore()
  const { attentionLevel } = useAmbianceStore()
  
  // Ambiance Engine
  const { startAmbiance, stopAmbiance, sendMetrics, currentReaction, isActive: ambianceActive } = useAmbianceEngine()

  // États locaux
  const [introComplete, setIntroComplete] = useState(false)
  const [selectedAudience, setSelectedAudience] = useState<AudienceProfile>('neutral')
  const [exerciseStarted, setExerciseStarted] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [debriefResult, setDebriefResult] = useState<DebriefResult | null>(null)
  const [showFullDebrief, setShowFullDebrief] = useState(false)
  
  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const metricsRef = useRef<SpeechMetrics>({
    wordsPerMinute: 120,
    previousWPM: 120,
    silenceDuration: 0,
    isCurrentlySilent: false,
    hesitationCount: 0,
    fillerWordCount: 0,
    energyLevel: 0.5,
    previousEnergyLevel: 0.5,
    melodicVariation: 0.3
  })
  const attentionHistoryRef = useRef<number[]>([])

  // Durée de l'exercice
  const exerciseDuration = script?.exercise.duration || 60

  // Initialiser la session
  useEffect(() => {
    if (session && !currentSession) {
      startSession(session.id)
    }
  }, [session, currentSession, startSession])

  const currentStep = currentSession?.currentStep || 'intro'

  // Timer de l'exercice
  useEffect(() => {
    if (exerciseStarted && isRecording) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => {
          const newTime = prev + 1
          if (newTime >= exerciseDuration) {
            handleStopExercise()
          }
          return newTime
        })
      }, 1000)
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [exerciseStarted, isRecording, exerciseDuration])

  // Envoyer les métriques à l'Ambiance Engine
  useEffect(() => {
    if (isRecording && ambianceActive) {
      const prevMetrics = metricsRef.current
      
      const newMetrics: SpeechMetrics = {
        wordsPerMinute: 100 + audioLevel * 80 + Math.random() * 20,
        previousWPM: prevMetrics.wordsPerMinute,
        silenceDuration: audioLevel < 0.1 ? prevMetrics.silenceDuration + 100 : 0,
        isCurrentlySilent: audioLevel < 0.1,
        hesitationCount: Math.floor(Math.random() * 3),
        fillerWordCount: Math.floor(Math.random() * 2),
        energyLevel: audioLevel,
        previousEnergyLevel: prevMetrics.energyLevel,
        melodicVariation: 0.2 + Math.random() * 0.4
      }
      
      metricsRef.current = newMetrics
      sendMetrics(newMetrics)
      attentionHistoryRef.current.push(attentionLevel)
    }
  }, [audioLevel, isRecording, ambianceActive, sendMetrics, attentionLevel])

  // Handlers
  const handleIntroComplete = useCallback(() => setIntroComplete(true), [])

  const handleStartExercise = useCallback(() => {
    setStep('exercise')
    setExerciseStarted(true)
    setElapsedTime(0)
    startRecording()
    startAmbiance(selectedAudience)
  }, [setStep, startRecording, startAmbiance, selectedAudience])

  const handleStopExercise = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    stopRecording()
    stopAmbiance()
    setExerciseStarted(false)
    
    const avgAttention = attentionHistoryRef.current.length > 0
      ? attentionHistoryRef.current.reduce((a, b) => a + b, 0) / attentionHistoryRef.current.length
      : 0.5
    
    const sessionMetrics: SessionMetrics = {
      duration: elapsedTime,
      analysis: analysis,
      transcription: '',
      audienceAttentionAvg: avgAttention,
      peakMoments: detectPeakMoments(analysis, '', elapsedTime)
    }
    
    const result = generateDebrief(sessionMetrics, session?.cardId)
    setDebriefResult(result)
  }, [stopRecording, stopAmbiance, elapsedTime, analysis, session?.cardId])

  const handleShowDebrief = useCallback(() => {
    setStep('debrief')
    setShowFullDebrief(true)
  }, [setStep])

  const handleDebriefComplete = useCallback(() => {
    setShowFullDebrief(false)
    setStep('anchor')
  }, [setStep])

  const handleComplete = useCallback(() => {
    if (session && debriefResult) {
      updateAxes({ [session.axisMain]: Math.round(debriefResult.internalScore * 5) }, session.id)
    }
    completeSession()
    router.push('/home')
  }, [session, debriefResult, updateAxes, completeSession, router])

  const handleExit = useCallback(() => {
    if (ambianceActive) stopAmbiance()
    if (isRecording) stopRecording()
    resetCurrentSession()
    router.push('/sessions')
  }, [ambianceActive, stopAmbiance, isRecording, stopRecording, resetCurrentSession, router])

  const handleRestart = useCallback(() => {
    setIntroComplete(false)
    setExerciseStarted(false)
    setElapsedTime(0)
    setDebriefResult(null)
    setShowFullDebrief(false)
    attentionHistoryRef.current = []
    setStep('intro')
  }, [setStep])

  // Session non trouvée
  if (!session || !script) {
    return (
      <SessionLayout showClose onClose={() => router.push('/sessions')}>
        <div className="text-center">
          <Text variant="heading" className="mb-6">Session non trouvée</Text>
          <Button onClick={() => router.push('/sessions')}>Retour aux sessions</Button>
        </div>
      </SessionLayout>
    )
  }

  // Affichage du debrief complet
  if (showFullDebrief && debriefResult) {
    return (
      <DebriefScreen 
        result={debriefResult}
        onComplete={handleDebriefComplete}
        onSaveCard={() => console.log('Save card')}
      />
    )
  }

  return (
    <SessionLayout 
      showClose 
      onClose={handleExit}
      title={`Session ${session.number}`}
      rightElement={
        currentStep === 'exercise' && exerciseStarted ? (
          <CompactAmbianceIndicator reaction={currentReaction} attention={attentionLevel} />
        ) : undefined
      }
    >
      <AnimatePresence mode="wait">
        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* INTRO */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {currentStep === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center text-center px-4"
          >
            <SebPresence state={introComplete ? 'idle' : 'speaking'} size="lg" />
            
            <motion.div className="mt-4 mb-8">
              <Text variant="heading" className="text-gold-400 mb-2">
                {session.title}
              </Text>
              <Text variant="caption" className="text-text-muted">
                {session.intention}
              </Text>
            </motion.div>

            {!introComplete ? (
              <SebMessage
                text={script.opening.sebMessages.map(m => m.text).join(' ')}
                onComplete={handleIntroComplete}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm space-y-6"
              >
                <AudienceSelector 
                  selected={selectedAudience} 
                  onSelect={setSelectedAudience} 
                />
                
                <div className="flex items-center justify-center gap-2 text-text-muted">
                  <Clock className="w-4 h-4" />
                  <Text variant="caption">
                    Exercice : {Math.floor(exerciseDuration / 60)} min {exerciseDuration % 60 > 0 ? `${exerciseDuration % 60}s` : ''}
                  </Text>
                </div>
                
                <Button 
                  onClick={handleStartExercise} 
                  size="lg" 
                  fullWidth
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Je suis prêt
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* EXERCISE */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {currentStep === 'exercise' && (
          <motion.div
            key="exercise"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center h-full"
          >
            {/* Timer */}
            <div className="mb-6">
              <CircularTimer 
                duration={exerciseDuration} 
                elapsed={elapsedTime} 
                size="lg" 
              />
            </div>

            {/* Instruction */}
            <Text className="text-text-secondary text-center mb-8 max-w-sm px-4">
              {script.exercise.instruction}
            </Text>

            {/* Mic */}
            <div className="flex-1 flex items-center justify-center">
              <MicIndicator 
                state={isRecording ? 'recording' : 'ready'} 
                onClick={exerciseStarted ? handleStopExercise : handleStartExercise}
                size="lg"
              />
            </div>

            {/* Ambiance Player */}
            {exerciseStarted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full mt-auto"
              >
                <AmbiancePlayer 
                  reaction={currentReaction}
                  attention={attentionLevel}
                  variant="full"
                />
              </motion.div>
            )}

            {/* Stop button */}
            {exerciseStarted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 mb-8"
              >
                <Button variant="ghost" onClick={handleStopExercise}>
                  Terminer maintenant
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* POST-EXERCISE (avant debrief complet) */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {currentStep === 'exercise' && !exerciseStarted && debriefResult && (
          <motion.div
            key="post-exercise"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center px-4"
          >
            <SebPresence state="idle" size="lg" />
            
            <Text variant="heading" className="mt-6 mb-8">
              Bien joué.
            </Text>
            
            <div className="space-y-4 w-full max-w-sm">
              <Button 
                onClick={handleShowDebrief} 
                size="lg" 
                fullWidth
              >
                Voir le retour de Seb
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={handleRestart}
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                Recommencer
              </Button>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* ANCHOR */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {currentStep === 'anchor' && debriefResult && (
          <motion.div
            key="anchor"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center px-4"
          >
            <SebPresence state="idle" size="md" />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 mb-12"
            >
              <Text variant="caption" className="text-text-muted mb-4 block">
                Ta phrase à emporter
              </Text>
              <span 
                className="font-serif italic text-2xl md:text-3xl px-4"
                style={{ color: GOLD.main }}
              >
                "{debriefResult.anchorPhrase}"
              </span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 1 }}
            >
              <Button onClick={handleComplete} size="lg">
                Terminer la session
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* COMPLETE */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {currentStep === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="text-4xl mb-6"
            >
              ✨
            </motion.div>
            <Text variant="heading" className="mb-2">Bien joué.</Text>
            <Text className="text-text-muted">À bientôt pour la prochaine session.</Text>
          </motion.div>
        )}
      </AnimatePresence>
    </SessionLayout>
  )
}
