'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type SebState = 'idle' | 'listening' | 'speaking' | 'thinking'

interface SebPresenceProps {
  state?: SebState
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  sm: { orb: 80, glow: 140, core: 16 },
  md: { orb: 120, glow: 200, core: 24 },
  lg: { orb: 160, glow: 260, core: 32 },
  xl: { orb: 200, glow: 320, core: 40 },
}

// Palette or unifiée
const GOLD = {
  light: '#E5C478',
  main: '#D4A853',
  dark: '#A67C3A',
  darker: '#86612E',
}

export function SebPresence({ state = 'idle', size = 'lg', className }: SebPresenceProps) {
  const s = sizes[size]
  const isSpeaking = state === 'speaking'
  const isListening = state === 'listening'
  const isThinking = state === 'thinking'

  return (
    <div 
      className={cn('relative flex items-center justify-center', className)}
      style={{ width: s.glow, height: s.glow }}
    >
      {/* GLOW EXTERNE */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: s.glow,
          height: s.glow,
          background: `radial-gradient(circle, rgba(212, 168, 83, 0.35) 0%, rgba(212, 168, 83, 0.12) 35%, rgba(212, 168, 83, 0.04) 50%, transparent 70%)`,
          filter: 'blur(20px)',
        }}
        animate={{
          opacity: isSpeaking ? [0.7, 1, 0.7] : isThinking ? [0.4, 0.6, 0.4] : [0.5, 0.7, 0.5],
          scale: isSpeaking ? [1, 1.12, 1] : [1, 1.04, 1],
        }}
        transition={{ duration: isSpeaking ? 0.5 : 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ORBE PRINCIPALE */}
      <motion.div
        className="relative rounded-full"
        style={{
          width: s.orb,
          height: s.orb,
          background: `
            radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.3) 0%, transparent 35%),
            radial-gradient(circle at 70% 75%, rgba(134, 97, 46, 0.35) 0%, transparent 45%),
            linear-gradient(145deg, ${GOLD.light} 0%, ${GOLD.main} 35%, ${GOLD.dark} 70%, ${GOLD.darker} 100%)
          `,
          boxShadow: `
            0 0 50px rgba(212, 168, 83, 0.5),
            0 0 100px rgba(212, 168, 83, 0.25),
            inset 0 -15px 35px rgba(134, 97, 46, 0.35),
            inset 0 8px 25px rgba(255, 255, 255, 0.15)
          `,
        }}
        animate={{
          scale: isSpeaking 
            ? [1, 1.08, 1, 1.05, 1] 
            : isListening 
            ? [1, 0.96, 1] 
            : isThinking
            ? [1, 1.02, 0.98, 1]
            : [1, 1.03, 1],
        }}
        transition={{ 
          duration: isSpeaking ? 0.5 : isListening ? 1.2 : isThinking ? 2 : 4, 
          repeat: Infinity, 
          ease: 'easeInOut' 
        }}
      >
        {/* Reflet brillant */}
        <div
          className="absolute rounded-full"
          style={{
            width: s.orb * 0.45,
            height: s.orb * 0.28,
            top: s.orb * 0.12,
            left: s.orb * 0.18,
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.08) 100%)',
            filter: 'blur(6px)',
            borderRadius: '50%',
          }}
        />

        {/* CORE LUMINEUX */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: s.core,
            height: s.core,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, #FFFFFF 0%, #FFF8E7 30%, ${GOLD.light} 70%, ${GOLD.main} 100%)`,
            boxShadow: `0 0 25px rgba(255, 255, 255, 0.85), 0 0 50px rgba(212, 168, 83, 0.6), 0 0 80px rgba(212, 168, 83, 0.35)`,
          }}
          animate={{
            scale: isSpeaking ? [1, 1.5, 1] : isThinking ? [1, 1.3, 1.1, 1.3, 1] : [1, 1.2, 1],
            opacity: [0.85, 1, 0.85],
          }}
          transition={{ duration: isSpeaking ? 0.3 : isThinking ? 1.5 : 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Ripples quand speaking */}
      {isSpeaking && [0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: s.orb,
            height: s.orb,
            border: `2px solid rgba(212, 168, 83, 0.45)`,
          }}
          animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
          transition={{ duration: 0.8, delay: i * 0.25, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}
      
      {/* Pulse doux quand thinking */}
      {isThinking && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: s.orb * 1.2,
            height: s.orb * 1.2,
            border: `1px solid rgba(212, 168, 83, 0.3)`,
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </div>
  )
}
