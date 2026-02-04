'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight } from 'lucide-react'
import { SebPresence, SebMessage } from '@/components/blocks'
import { Button } from '@/components/primitives'

type Step = 'intro' | 'recentering' | 'clarity' | 'body' | 'ending' | 'ready'

const steps: Record<Step, { title: string; message: string; instruction?: string; duration: number }> = {
  intro: {
    title: 'Mode Urgence',
    message: 'Tu as une prise de parole maintenant. On va te préparer. Rapidement.',
    duration: 0,
  },
  recentering: {
    title: 'Recentrage',
    message: 'Plante tes pieds. Respire. Tu es ici. Tu mérites d\'être là.',
    instruction: '20 secondes — Respire profondément',
    duration: 20,
  },
  clarity: {
    title: 'Clarté',
    message: 'Quelle est ton idée principale ? Une seule. Dis-la mentalement.',
    instruction: '30 secondes — Une idée, une direction',
    duration: 30,
  },
  body: {
    title: 'Corps & voix',
    message: 'Redresse-toi légèrement. Prononce une phrase à voix basse. Sens ta voix.',
    instruction: '30 secondes — Ancre ta présence',
    duration: 30,
  },
  ending: {
    title: 'Fin anticipée',
    message: 'Comment veux-tu finir ? Une phrase suffit. Sache-la maintenant.',
    instruction: '30 secondes — Visualise ta conclusion',
    duration: 30,
  },
  ready: {
    title: 'Prêt',
    message: 'Parle calmement. Tu n\'as rien à prouver. Tu es prêt.',
    duration: 0,
  },
}

const stepOrder: Step[] = ['intro', 'recentering', 'clarity', 'body', 'ending', 'ready']

export default function UrgencyPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('intro')
  const [messageComplete, setMessageComplete] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)

  const stepIndex = stepOrder.indexOf(step)
  const content = steps[step]
  const isLast = step === 'ready'

  useEffect(() => {
    if (countdown === null || countdown <= 0) return
    const timer = setInterval(() => {
      setCountdown(prev => (prev && prev > 1) ? prev - 1 : 0)
    }, 1000)
    return () => clearInterval(timer)
  }, [countdown])

  useEffect(() => {
    if (countdown === 0 && !isLast) next()
  }, [countdown, isLast])

  const handleMessageComplete = useCallback(() => {
    setMessageComplete(true)
    if (content.duration > 0) setCountdown(content.duration)
  }, [content.duration])

  const next = useCallback(() => {
    const nextIndex = stepIndex + 1
    if (nextIndex < stepOrder.length) {
      setStep(stepOrder[nextIndex])
      setMessageComplete(false)
      setCountdown(null)
    }
  }, [stepIndex])

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* Close button */}
      <div className="absolute top-6 right-6 z-10">
        <button 
          onClick={() => router.push('/home')}
          className="w-10 h-10 rounded-full bg-bg-subtle flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress */}
      <div className="pt-6 px-6">
        <div className="flex gap-2 max-w-xs mx-auto">
          {stepOrder.map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${i <= stepIndex ? 'bg-gold-400' : 'bg-bg-subtle'}`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center text-center max-w-md"
          >
            <SebPresence state={messageComplete ? 'idle' : 'speaking'} size="md" />

            <p className="text-sm text-gold-400 uppercase tracking-wider mt-4 mb-2">{content.title}</p>

            <SebMessage text={content.message} onComplete={handleMessageComplete} />

            {messageComplete && content.instruction && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                <p className="text-text-secondary mb-4">{content.instruction}</p>
                {countdown !== null && countdown > 0 && (
                  <div className="w-16 h-16 mx-auto rounded-full border-2 border-gold-400/30 flex items-center justify-center">
                    <span className="text-2xl font-display text-gold-400">{countdown}</span>
                  </div>
                )}
              </motion.div>
            )}

            {messageComplete && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8">
                {isLast ? (
                  <Button onClick={() => router.push('/home')} size="lg">C'est bon, j'y vais</Button>
                ) : countdown === 0 || countdown === null ? (
                  <Button onClick={next} rightIcon={<ArrowRight className="w-4 h-4" />}>Suivant</Button>
                ) : (
                  <Button variant="ghost" onClick={next}>Passer</Button>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pb-8 text-center">
        <p className="text-sm text-text-muted">Durée totale : 2-3 minutes</p>
      </div>
    </div>
  )
}
