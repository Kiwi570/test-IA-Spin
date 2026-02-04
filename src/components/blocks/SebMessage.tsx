'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SebMessageProps {
  text: string
  variant?: 'normal' | 'anchor'
  animate?: boolean
  onComplete?: () => void
  className?: string
}

export function SebMessage({
  text,
  variant = 'normal',
  animate = true,
  onComplete,
  className,
}: SebMessageProps) {
  const [displayedWords, setDisplayedWords] = useState<string[]>([])
  const words = text.split(' ')

  useEffect(() => {
    if (!animate) {
      setDisplayedWords(words)
      return
    }

    setDisplayedWords([])
    let i = 0
    const interval = setInterval(() => {
      if (i < words.length) {
        setDisplayedWords(prev => [...prev, words[i]])
        i++
      } else {
        clearInterval(interval)
        onComplete?.()
      }
    }, 60)

    return () => clearInterval(interval)
  }, [text, animate])

  return (
    <p
      className={cn(
        'font-display leading-relaxed',
        variant === 'normal' && 'text-xl md:text-2xl text-text-primary',
        variant === 'anchor' && 'text-lg md:text-xl text-gold-400 italic',
        className
      )}
    >
      {displayedWords.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </p>
  )
}
