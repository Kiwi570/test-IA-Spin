'use client'

import { motion } from 'framer-motion'
import { useProgressStore, useSessionStore } from '@/stores'
import { MainLayout } from '@/components/layouts'
import { ProgressAxis } from '@/types'
import { cn } from '@/lib/utils'

const axisLabels: Record<ProgressAxis, string> = {
  presence: 'Présence',
  clarity: 'Clarté',
  stability: 'Stabilité',
  impact: 'Impact',
  leadership: 'Leadership',
}

const axisColors: Record<ProgressAxis, string> = {
  presence: 'bg-purple-500',
  clarity: 'bg-cyan-500',
  stability: 'bg-emerald-500',
  impact: 'bg-orange-500',
  leadership: 'bg-gold-400',
}

export default function ProgressPage() {
  const { axes, wowMoments } = useProgressStore()
  const { completedSessionIds } = useSessionStore()

  return (
    <MainLayout>
      <div className="px-6 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-2xl text-text-primary mb-1">Ta progression</h1>
          <p className="text-text-secondary">{completedSessionIds.length} sessions complétées</p>
        </motion.div>

        {/* Axes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card p-5 mb-8"
        >
          <h2 className="font-medium text-text-primary mb-5">Tes 5 axes</h2>
          
          <div className="space-y-4">
            {(Object.keys(axes) as ProgressAxis[]).map((axis, i) => (
              <motion.div
                key={axis}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-text-primary">{axisLabels[axis]}</span>
                  <span className="text-sm text-text-muted">{axes[axis]}%</span>
                </div>
                <div className="h-2 bg-bg-subtle rounded-full overflow-hidden">
                  <motion.div
                    className={cn('h-full rounded-full', axisColors[axis])}
                    initial={{ width: 0 }}
                    animate={{ width: `${axes[axis]}%` }}
                    transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Moments forts */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <h2 className="font-medium text-text-primary mb-4">Tes moments forts</h2>

          {wowMoments.length > 0 ? (
            <div className="space-y-3">
              {wowMoments.map((moment, i) => (
                <motion.div
                  key={moment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="card p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">✨</span>
                    <div className="flex-1">
                      <p className="text-text-primary font-medium">{moment.feedback}</p>
                      <p className="text-sm text-text-muted">Session {moment.sessionId.split('-')[1]}</p>
                    </div>
                    <span className="text-xs text-gold-400 bg-gold-400/10 px-2 py-1 rounded-full">
                      {axisLabels[moment.axis]}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="card p-6 text-center">
              <p className="text-text-muted mb-1">Pas encore de moments forts</p>
              <p className="text-sm text-text-muted">Continue tes sessions pour débloquer tes premiers highlights</p>
            </div>
          )}
        </motion.div>

        {/* Historique */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-8">
          <h2 className="font-medium text-text-primary mb-4">Historique</h2>

          {completedSessionIds.length > 0 ? (
            <div className="space-y-2">
              {completedSessionIds.map((sessionId) => (
                <div key={sessionId} className="card p-3 flex items-center justify-between">
                  <span className="text-text-primary">Session {sessionId.split('-')[1]}</span>
                  <span className="text-xs text-accent-emerald bg-accent-emerald/10 px-2 py-1 rounded-full">
                    Complétée
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-4 text-center">
              <p className="text-text-muted">Commence ta première session</p>
            </div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  )
}
