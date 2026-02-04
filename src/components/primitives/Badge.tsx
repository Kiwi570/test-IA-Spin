'use client'

import { cn } from '@/lib/utils'

interface BadgeProps {
  variant?: 'default' | 'gold' | 'emerald'
  size?: 'sm' | 'md'
  className?: string
  children: React.ReactNode
}

const variants = {
  default: 'bg-bg-subtle text-text-secondary',
  gold: 'bg-gold-400/10 text-gold-400',
  emerald: 'bg-accent-emerald/10 text-accent-emerald',
}

const sizes = {
  sm: 'text-xs px-2 py-0.5 rounded',
  md: 'text-sm px-2.5 py-1 rounded-md',
}

export function Badge({ variant = 'default', size = 'sm', className, children }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center font-medium', variants[variant], sizes[size], className)}>
      {children}
    </span>
  )
}
