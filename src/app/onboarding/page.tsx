'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Sparkles, Target, MessageSquare, Check } from 'lucide-react'
import { useUserStore } from '@/stores'
import { UserIntention } from '@/types'
import { SebPresence, SebMessage, MicIndicator } from '@/components/blocks'
import { Button } from '@/components/primitives'
import { cn } from '@/lib/utils'

type Step = 'welcome' | 'intention' | 'voice-test' | 'feedback' | 'complete'

const intentions = [
  { id: 'clarity' as UserIntention, icon: MessageSquare, title: 'Parler avec plus de clarté', desc: 'Structurer mes idées et être compris' },
  { id: 'confidence' as UserIntention, icon: Sparkles, title: 'Gagner en assurance', desc: 'Me sentir légitime à l\'oral' },
  { id: 'preparation' as UserIntention, icon: Target, title: 'Préparer une prise de parole', desc: 'Un pitch, une réunion, une présentation' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { setIntention, completeOnboarding } = useUserStore()
  const [step, setStep] = useState<Step>('welcome')
  const [selected, setSelected] = useState<UserIntention | null>(null)

  const next = useCallback(() => {
    const steps: Step[] = ['welcome', 'intention', 'voice-test', 'feedback', 'complete']
    const i = steps.indexOf(step)
    if (i < steps.length - 1) {
      setStep(steps[i + 1])
    } else {
      completeOnboarding()
      router.push('/home')
    }
  }, [step, completeOnboarding, router])

  const selectIntention = (id: UserIntention) => {
    setSelected(id)
    setIntention(id)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-bg-deep">
      {/* Gradient de fond */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 100% 80% at 50% -10%, rgba(212, 168, 83, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse 80% 60% at 50% 110%, rgba(147, 51, 234, 0.06) 0%, transparent 50%)
          `
        }}
      />
      
      <AnimatePresence mode="wait">
        {step === 'welcome' && <WelcomeStep key="welcome" onNext={next} />}
        {step === 'intention' && <IntentionStep key="intention" selected={selected} onSelect={selectIntention} onNext={next} />}
        {step === 'voice-test' && <VoiceTestStep key="voice" onNext={next} />}
        {step === 'feedback' && <FeedbackStep key="feedback" onNext={next} />}
        {step === 'complete' && <CompleteStep key="complete" onNext={next} />}
      </AnimatePresence>
    </div>
  )
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  const [ready, setReady] = useState(false)

  return (
    <motion.div
      className="relative flex flex-col items-center text-center max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <SebPresence state="speaking" size="xl" />
      
      <div className="mt-6">
        <SebMessage
          text="Bienvenue. Ici, on travaille ta parole. Sans pression."
          onComplete={() => setReady(true)}
        />
      </div>

      {ready && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-10">
          <Button onClick={onNext} size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
            Commencer
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

function IntentionStep({ selected, onSelect, onNext }: { 
  selected: UserIntention | null
  onSelect: (id: UserIntention) => void
  onNext: () => void 
}) {
  return (
    <motion.div
      className="relative w-full max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 
        className="font-serif text-3xl text-text-primary text-center mb-10"
        style={{ textShadow: '0 0 30px rgba(212, 168, 83, 0.15)' }}
      >
        Qu'est-ce qui t'amène ici ?
      </h2>

      <div className="space-y-4 mb-8">
        {intentions.map((item) => {
          const Icon = item.icon
          const isSelected = selected === item.id

          return (
            <motion.div
              key={item.id}
              className={cn(
                'p-5 rounded-2xl cursor-pointer transition-all duration-200',
                isSelected 
                  ? 'bg-gold-400/10 border-2 border-gold-400' 
                  : 'bg-white/4 border-2 border-transparent hover:bg-white/6 hover:border-white/15'
              )}
              onClick={() => onSelect(item.id)}
              whileTap={{ scale: 0.98 }}
              style={{
                boxShadow: isSelected ? '0 0 25px rgba(212, 168, 83, 0.15)' : 'none'
              }}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
                  isSelected ? 'bg-gold-400/20 text-gold-400' : 'bg-white/8 text-text-muted'
                )}>
                  {isSelected ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-text-primary text-lg">{item.title}</p>
                  <p className="text-text-muted">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <p className="text-text-muted text-center mb-6">Tu pourras changer plus tard.</p>

      <div className="flex justify-center">
        <Button onClick={onNext} disabled={!selected} size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
          Continuer
        </Button>
      </div>
    </motion.div>
  )
}

function VoiceTestStep({ onNext }: { onNext: () => void }) {
  const [micState, setMicState] = useState<'inactive' | 'ready' | 'recording'>('ready')
  const [done, setDone] = useState(false)
  const [seconds, setSeconds] = useState(0)

  const handleMic = () => {
    if (micState === 'ready') {
      setMicState('recording')
      setSeconds(0)
      const interval = setInterval(() => {
        setSeconds(s => {
          if (s >= 5) {
            clearInterval(interval)
            setMicState('ready')
            setDone(true)
            return s
          }
          return s + 1
        })
      }, 1000)
    } else if (micState === 'recording') {
      setMicState('ready')
      setDone(true)
    }
  }

  return (
    <motion.div
      className="relative flex flex-col items-center text-center max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <SebPresence state={micState === 'recording' ? 'listening' : 'idle'} size="lg" />

      <p className="font-serif text-2xl text-text-primary mt-6">
        Parle librement pendant quelques secondes
      </p>

      <div className="mt-10">
        <MicIndicator state={micState} onClick={handleMic} size="lg" />
      </div>

      {micState === 'recording' && (
        <p className="text-gold-400 mt-6 text-lg font-medium">{seconds}s — Appuie pour terminer</p>
      )}

      {micState !== 'recording' && (
        <p className="text-text-muted mt-6">
          {done ? 'Parfait, le micro fonctionne bien.' : 'Appuie pour parler'}
        </p>
      )}

      {done && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
          <Button onClick={onNext} size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
            Continuer
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

function FeedbackStep({ onNext }: { onNext: () => void }) {
  const [ready, setReady] = useState(false)

  return (
    <motion.div
      className="relative flex flex-col items-center text-center max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <SebPresence state="speaking" size="lg" />

      <div className="mt-6">
        <SebMessage
          text="Bien reçu. On va pouvoir travailler ensemble. Je vais t'accompagner session après session, à ton rythme."
          onComplete={() => setReady(true)}
        />
      </div>

      {ready && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-10">
          <Button onClick={onNext} size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
            Continuer
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

function CompleteStep({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      className="relative flex flex-col items-center text-center max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <SebPresence state="idle" size="xl" />

      <div className="mt-6">
        <SebMessage text="On va travailler ensemble. À ton rythme." />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 2 }}
        className="mt-10"
      >
        <Button onClick={onNext} size="lg">
          Entrer dans l'espace Seb
        </Button>
      </motion.div>
    </motion.div>
  )
}
