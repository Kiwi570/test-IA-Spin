'use client'

import { motion } from 'framer-motion'
import { Mic, MicOff, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type MicState = 'inactive' | 'ready' | 'recording' | 'processing'

interface MicIndicatorProps {
  state?: MicState
  onClick?: () => void
  disabled?: boolean
  size?: 'md' | 'lg'
  className?: string
}

const sizes = {
  md: { btn: 72, icon: 28 },
  lg: { btn: 88, icon: 36 },
}

// Palette or unifiée
const GOLD = {
  light: '#E5C478',
  main: '#D4A853',
  dark: '#A67C3A',
}

export function MicIndicator({
  state = 'inactive',
  onClick,
  disabled = false,
  size = 'lg',
  className,
}: MicIndicatorProps) {
  const s = sizes[size]
  const isRecording = state === 'recording'
  const isReady = state === 'ready'
  const isProcessing = state === 'processing'

  return (
    <div 
      className={cn('relative flex items-center justify-center', className)}
      style={{ width: s.btn + 60, height: s.btn + 60 }}
    >
      {/* Glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: s.btn + 50,
          height: s.btn + 50,
          background: `radial-gradient(circle, rgba(212, 168, 83, 0.35) 0%, transparent 70%)`,
        }}
        animate={{
          opacity: isRecording ? [0.5, 0.9, 0.5] : isReady ? 0.4 : 0.15,
          scale: isRecording ? [1, 1.15, 1] : 1,
        }}
        transition={{ duration: isRecording ? 0.6 : 0.3, repeat: isRecording ? Infinity : 0 }}
      />

      {/* Ripples */}
      {isRecording && [0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: s.btn,
            height: s.btn,
            border: `3px solid rgba(212, 168, 83, 0.45)`,
          }}
          animate={{ scale: [1, 2], opacity: [0.5, 0] }}
          transition={{ duration: 1, delay: i * 0.3, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}

      {/* Bouton */}
      <motion.button
        className={cn(
          'relative flex items-center justify-center rounded-full',
          'focus-visible:outline-none transition-all duration-200',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
        style={{
          width: s.btn,
          height: s.btn,
          background: isRecording 
            ? `linear-gradient(145deg, rgba(212, 168, 83, 0.25) 0%, rgba(212, 168, 83, 0.12) 100%)`
            : isReady
            ? `linear-gradient(145deg, rgba(212, 168, 83, 0.12) 0%, rgba(212, 168, 83, 0.06) 100%)`
            : 'linear-gradient(145deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.03) 100%)',
          border: `3px solid ${isRecording ? 'rgba(212, 168, 83, 0.6)' : isReady ? 'rgba(212, 168, 83, 0.35)' : 'rgba(255, 255, 255, 0.12)'}`,
          boxShadow: isRecording 
            ? '0 0 40px rgba(212, 168, 83, 0.4), inset 0 0 15px rgba(212, 168, 83, 0.15)' 
            : '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.05 } : undefined}
        whileTap={!disabled ? { scale: 0.95 } : undefined}
      >
        {isProcessing ? (
          <Loader2 className="animate-spin" style={{ width: s.icon, height: s.icon, color: GOLD.main }} />
        ) : state === 'inactive' ? (
          <MicOff style={{ width: s.icon, height: s.icon, color: 'rgba(255, 255, 255, 0.35)' }} />
        ) : (
          <Mic style={{ 
            width: s.icon, 
            height: s.icon, 
            color: isRecording ? GOLD.light : GOLD.main,
            filter: isRecording ? 'drop-shadow(0 0 8px rgba(212, 168, 83, 0.7))' : 'none'
          }} />
        )}
      </motion.button>
    </div>
  )
}
