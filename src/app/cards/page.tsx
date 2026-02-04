'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { adviceCards, axisCategoryLabels } from '@/data'
import { useCardsStore } from '@/stores'
import { ProgressAxis } from '@/types'
import { MainLayout } from '@/components/layouts'
import { AdviceCard } from '@/components/blocks'
import { cn } from '@/lib/utils'

export default function CardsPage() {
  const [filter, setFilter] = useState<ProgressAxis | 'all'>('all')
  const [savedOnly, setSavedOnly] = useState(false)
  const { savedCardIds, toggleSaveCard, isCardSaved } = useCardsStore()

  const categories: Array<ProgressAxis | 'all'> = ['all', 'presence', 'clarity', 'stability', 'impact', 'leadership']

  const filteredCards = adviceCards.filter(card => {
    if (savedOnly && !isCardSaved(card.id)) return false
    if (filter !== 'all' && card.category !== filter) return false
    return true
  })

  return (
    <MainLayout>
      <div className="px-6 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="font-display text-2xl text-text-primary mb-1">Cartes conseil</h1>
          <p className="text-text-secondary">Tes ancres pour progresser</p>
        </motion.div>

        {/* Filtres */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                  filter === cat
                    ? 'bg-gold-400 text-bg-deep'
                    : 'bg-bg-subtle text-text-secondary hover:bg-bg-hover'
                )}
              >
                {cat === 'all' ? 'Toutes' : axisCategoryLabels[cat]}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Toggle favoris */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-6">
          <button
            onClick={() => setSavedOnly(!savedOnly)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all',
              savedOnly ? 'bg-gold-400/15 text-gold-400' : 'bg-bg-subtle text-text-muted hover:text-text-secondary'
            )}
          >
            <span>Mes favoris</span>
            {savedCardIds.length > 0 && (
              <span className={cn(
                'w-5 h-5 rounded-full flex items-center justify-center text-xs',
                savedOnly ? 'bg-gold-400/20' : 'bg-white/10'
              )}>
                {savedCardIds.length}
              </span>
            )}
          </button>
        </motion.div>

        {/* Cards */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredCards.length > 0 ? (
              filteredCards.map((card, i) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <AdviceCard
                    card={{ ...card, isSaved: isCardSaved(card.id) }}
                    onSave={() => toggleSaveCard(card.id)}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center py-12"
              >
                <p className="text-text-muted mb-2">
                  {savedOnly ? 'Aucune carte sauvegardée' : 'Aucune carte dans cette catégorie'}
                </p>
                {savedOnly && (
                  <button 
                    onClick={() => setSavedOnly(false)}
                    className="text-sm text-gold-400 hover:underline"
                  >
                    Voir toutes les cartes
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MainLayout>
  )
}
