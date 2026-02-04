'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Lock, CheckCircle2, ChevronRight } from 'lucide-react'
import { useSessionStore } from '@/stores'
import { sessions, categoryLabels, categoryDescriptions } from '@/data'
import { SessionCategory } from '@/types'
import { MainLayout } from '@/components/layouts'
import { cn } from '@/lib/utils'

export default function SessionsListPage() {
  const router = useRouter()
  const { completedSessionIds } = useSessionStore()

  const sessionsByCategory = sessions.reduce((acc, session) => {
    if (!acc[session.category]) acc[session.category] = []
    acc[session.category].push(session)
    return acc
  }, {} as Record<SessionCategory, typeof sessions>)

  const categories: SessionCategory[] = ['foundation', 'connection', 'affirmation', 'resistance']

  return (
    <MainLayout>
      <div className="px-6 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="font-display text-2xl text-text-primary mb-1">Ton parcours</h1>
          <p className="text-text-secondary">14 sessions pour transformer ta parole</p>
        </motion.div>

        {/* Progress */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-muted">Progression</span>
            <span className="text-sm text-gold-400 font-medium">{completedSessionIds.length} / 14</span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${(completedSessionIds.length / 14) * 100}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Sessions by category */}
        <div className="space-y-8">
          {categories.map((category, catIndex) => (
            <motion.section 
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + catIndex * 0.1 }}
            >
              <div className="mb-3">
                <h2 className="font-medium text-text-primary">{categoryLabels[category]}</h2>
                <p className="text-sm text-text-muted">{categoryDescriptions[category]}</p>
              </div>

              <div className="space-y-2">
                {sessionsByCategory[category]?.map((session) => {
                  const isCompleted = completedSessionIds.includes(session.id)
                  const prevCompleted = session.number === 1 || completedSessionIds.includes(`session-${session.number - 1}`)
                  const isLocked = !prevCompleted && !isCompleted
                  const isCurrent = prevCompleted && !isCompleted

                  return (
                    <div
                      key={session.id}
                      className={cn(
                        'card p-4 flex items-center gap-4',
                        !isLocked && 'card-interactive',
                        isLocked && 'opacity-50',
                        isCurrent && 'card-selected'
                      )}
                      onClick={() => !isLocked && router.push(`/session/${session.number}`)}
                    >
                      {/* Status icon */}
                      <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                        isCompleted && 'bg-accent-emerald/20 text-accent-emerald',
                        isCurrent && 'bg-gold-400/20 text-gold-400',
                        isLocked && 'bg-bg-subtle text-text-disabled',
                        !isCompleted && !isCurrent && !isLocked && 'bg-bg-subtle text-text-secondary'
                      )}>
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : isLocked ? <Lock className="w-4 h-4" /> : session.number}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={cn('font-medium truncate', isLocked ? 'text-text-muted' : 'text-text-primary')}>
                          {session.title}
                        </p>
                        <p className="text-sm text-text-muted">{session.duration}</p>
                      </div>

                      {/* Badge / Arrow */}
                      {isCurrent && (
                        <span className="text-xs font-medium text-gold-400 bg-gold-400/10 px-2 py-1 rounded-full">
                          En cours
                        </span>
                      )}
                      {!isLocked && <ChevronRight className="w-5 h-5 text-text-muted shrink-0" />}
                    </div>
                  )
                })}
              </div>
            </motion.section>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
