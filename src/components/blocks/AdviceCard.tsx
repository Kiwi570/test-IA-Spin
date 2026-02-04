'use client'

import { motion } from 'framer-motion'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AdviceCard as AdviceCardType, ProgressAxis } from '@/types'

const categoryLabels: Record<ProgressAxis, string> = {
  presence: 'Présence',
  clarity: 'Clarté',
  stability: 'Stabilité',
  impact: 'Impact',
  leadership: 'Leadership',
}

const categoryColors: Record<ProgressAxis, string> = {
  presence: '#D4A853',   // Or
  clarity: '#60A5FA',    // Bleu
  stability: '#34D399',  // Vert
  impact: '#F472B6',     // Rose
  leadership: '#A78BFA', // Violet
}

interface AdviceCardProps {
  card: AdviceCardType
  compact?: boolean
  onSave?: () => void
  onClick?: () => void
  className?: string
}

export function AdviceCard({ card, compact, onSave, onClick, className }: AdviceCardProps) {
  return (
    <motion.div
      className={cn('card p-4', onClick && 'card-interactive', className)}
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-medium text-gold-400 bg-gold-400/10 px-2 py-1 rounded-full">
            {categoryLabels[card.category]}
          </span>
          <h3 className="font-display text-lg text-text-primary mt-2">{card.title}</h3>
        </div>

        {onSave && (
          <button
            onClick={(e) => { e.stopPropagation(); onSave() }}
            className={cn('p-2 rounded-lg hover:bg-bg-subtle transition-colors', card.isSaved ? 'text-gold-400' : 'text-text-muted')}
          >
            {card.isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
          </button>
        )}
      </div>

      {!compact && (
        <div className="mt-3 space-y-3">
          <p className="text-text-secondary text-sm">{card.principle}</p>
          <p className="font-display text-gold-400 italic text-sm">"{card.anchorPhrase}"</p>
        </div>
      )}

      {compact && (
        <p className="mt-2 font-display text-gold-400/80 italic text-sm line-clamp-2">"{card.anchorPhrase}"</p>
      )}
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT ADVICE CARD DISPLAY (pour le debrief)
// ═══════════════════════════════════════════════════════════════════

interface AdviceCardDisplayProps {
  card: AdviceCardType
  variant?: 'compact' | 'full'
  showSaveButton?: boolean
  onSave?: () => void
}

export function AdviceCardDisplay({ 
  card, 
  variant = 'full',
  showSaveButton = false,
  onSave 
}: AdviceCardDisplayProps) {
  const accentColor = categoryColors[card.category]
  
  if (variant === 'compact') {
    return (
      <div 
        className="p-4 rounded-xl"
        style={{
          background: `${accentColor}10`,
          border: `1px solid ${accentColor}30`,
        }}
      >
        <span 
          className="text-xs font-medium px-2 py-1 rounded-full inline-block"
          style={{ 
            backgroundColor: `${accentColor}20`,
            color: accentColor 
          }}
        >
          {categoryLabels[card.category]}
        </span>
        <p className="font-display text-lg text-primary mt-2">{card.title}</p>
        <p 
          className="mt-2 italic text-sm"
          style={{ color: accentColor }}
        >
          "{card.anchorPhrase}"
        </p>
      </div>
    )
  }
  
  return (
    <motion.div 
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: `linear-gradient(145deg, ${accentColor}15, transparent)`,
        border: `1px solid ${accentColor}30`,
      }}
    >
      {/* Effet de brillance subtil */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${accentColor}20, transparent 60%)`,
        }}
      />
      
      <div className="relative p-6">
        {/* Badge catégorie */}
        <div className="flex items-start justify-between">
          <span 
            className="text-xs font-medium px-3 py-1.5 rounded-full"
            style={{ 
              backgroundColor: `${accentColor}20`,
              color: accentColor 
            }}
          >
            {categoryLabels[card.category]}
          </span>
          
          {showSaveButton && onSave && (
            <motion.button
              onClick={onSave}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg transition-colors hover:bg-white/10"
              style={{ color: card.isSaved ? accentColor : '#9CA3AF' }}
            >
              {card.isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
            </motion.button>
          )}
        </div>
        
        {/* Titre */}
        <h3 className="font-display text-xl text-primary mt-4 mb-3">
          {card.title}
        </h3>
        
        {/* Principe */}
        <p className="text-muted text-sm leading-relaxed mb-4">
          {card.principle}
        </p>
        
        {/* Application */}
        {card.application && (
          <p className="text-sm text-primary/80 mb-4 pl-3 border-l-2" style={{ borderColor: `${accentColor}50` }}>
            {card.application}
          </p>
        )}
        
        {/* Phrase d'ancrage */}
        <div 
          className="mt-4 pt-4"
          style={{ borderTop: `1px solid ${accentColor}20` }}
        >
          <p className="text-xs text-muted mb-2">Phrase d'ancrage</p>
          <p 
            className="font-display text-lg italic"
            style={{ color: accentColor }}
          >
            "{card.anchorPhrase}"
          </p>
        </div>
      </div>
    </motion.div>
  )
}
