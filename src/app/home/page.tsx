'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Play, AlertTriangle, MessageCircle } from 'lucide-react'
import { useUserStore, useSessionStore } from '@/stores'
import { MainLayout } from '@/components/layouts'
import { SebPresence } from '@/components/blocks'
import { Button } from '@/components/primitives'

const dailyPhrases = [
  "La clarté rassure plus que la perfection.",
  "Parle comme quelqu'un qui mérite d'être écouté.",
  "Ce que tu assumes s'entend.",
  "La stabilité crée l'autorité.",
  "Le silence n'est pas un vide. C'est un cadre.",
  "Ralentir, c'est prendre sa place.",
  "L'impact vient de la présence, pas du volume.",
]

function getDailyPhrase(): string {
  const day = new Date().getDate()
  return dailyPhrases[day % dailyPhrases.length]
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bonjour'
  if (hour < 18) return 'Bon après-midi'
  return 'Bonsoir'
}

export default function HomePage() {
  const router = useRouter()
  const { user } = useUserStore()
  const { completedSessionIds } = useSessionStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (user && !user.isOnboarded) {
      router.replace('/onboarding')
    }
  }, [user, router])

  const nextSession = completedSessionIds.length + 1
  const hasStarted = completedSessionIds.length > 0

  if (!mounted) return null

  return (
    <MainLayout>
      <div className="flex flex-col items-center px-6 pt-6">
        {/* Orbe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <SebPresence state="idle" size="xl" />
        </motion.div>

        {/* Greeting */}
        <motion.h1
          className="font-serif text-4xl md:text-5xl text-text-primary mt-2"
          style={{ textShadow: '0 0 40px rgba(212, 168, 83, 0.25)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {getGreeting()}
        </motion.h1>

        {/* Citation */}
        <motion.p
          className="font-serif text-xl md:text-2xl italic text-center max-w-sm mt-8 px-4 text-gold-400"
          style={{ textShadow: '0 0 30px rgba(212, 168, 83, 0.35)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          "{getDailyPhrase()}"
        </motion.p>

        {/* Actions */}
        <motion.div
          className="w-full max-w-sm mt-12 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            fullWidth
            size="lg"
            onClick={() => router.push(`/session/${nextSession}`)}
            leftIcon={<Play className="w-5 h-5" />}
          >
            {hasStarted ? `Session ${nextSession}` : 'Commencer'}
          </Button>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => router.push('/conversation')}
              leftIcon={<MessageCircle className="w-4 h-4" />}
            >
              Parler avec Seb
            </Button>

            <Button
              variant="urgency"
              onClick={() => router.push('/urgency')}
              leftIcon={<AlertTriangle className="w-4 h-4" />}
              className="shrink-0"
            >
              Urgence
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        {hasStarted && (
          <motion.div
            className="w-full max-w-sm mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div 
              className="flex items-center justify-between p-5 rounded-2xl"
              style={{ 
                background: 'rgba(212, 168, 83, 0.08)', 
                border: '1px solid rgba(212, 168, 83, 0.2)',
                boxShadow: '0 0 25px rgba(212, 168, 83, 0.08)'
              }}
            >
              <span className="text-text-secondary">Progression</span>
              <div className="flex items-center gap-4">
                <div className="w-24 h-3 rounded-full bg-white/8 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ 
                      background: 'linear-gradient(90deg, #A67C3A 0%, #D4A853 50%, #E5C478 100%)',
                      boxShadow: '0 0 8px rgba(212, 168, 83, 0.5)'
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedSessionIds.length / 14) * 100}%` }}
                    transition={{ duration: 1, delay: 1 }}
                  />
                </div>
                <span className="text-lg font-semibold text-gold-400">
                  {completedSessionIds.length}/14
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </MainLayout>
  )
}
