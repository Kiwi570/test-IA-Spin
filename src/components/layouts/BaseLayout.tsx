'use client'

import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { pageTransition } from '@/lib/animations'
import { cn } from '@/lib/utils'

// ═══════════════════════════════════════════════════════════════════
// BASE LAYOUT — Structure commune à toutes les pages
// ═══════════════════════════════════════════════════════════════════
interface BaseLayoutProps {
  children: ReactNode
  className?: string
  animate?: boolean
}

export function BaseLayout({ children, className, animate = true }: BaseLayoutProps) {
  if (animate) {
    return (
      <motion.div
        className={cn('min-h-screen min-h-[100dvh]', className)}
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={cn('min-h-screen min-h-[100dvh]', className)}>
      {children}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// CENTERED LAYOUT — Contenu centré verticalement et horizontalement
// ═══════════════════════════════════════════════════════════════════
interface CenteredLayoutProps {
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg'
}

const maxWidthClasses = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
}

export function CenteredLayout({
  children,
  className,
  maxWidth = 'md',
}: CenteredLayoutProps) {
  return (
    <div
      className={cn(
        'min-h-screen min-h-[100dvh] flex flex-col items-center justify-center',
        'px-6 py-12',
        className
      )}
    >
      <div className={cn('w-full', maxWidthClasses[maxWidth])}>
        {children}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// CONTAINER — Container standard avec padding
// ═══════════════════════════════════════════════════════════════════
interface ContainerProps {
  children: ReactNode
  className?: string
  size?: 'default' | 'narrow' | 'wide'
}

const containerSizes = {
  narrow: 'max-w-[680px]',
  default: 'max-w-[800px]',
  wide: 'max-w-[1200px]',
}

export function Container({ children, className, size = 'default' }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto px-6 md:px-8',
        containerSizes[size],
        className
      )}
    >
      {children}
    </div>
  )
}
