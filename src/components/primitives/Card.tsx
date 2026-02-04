'use client'

import { cn } from '@/lib/utils'

interface CardProps {
  variant?: 'default' | 'interactive'
  padding?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
  children: React.ReactNode
}

const paddings = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

export function Card({ variant = 'default', padding = 'md', className, onClick, children }: CardProps) {
  return (
    <div
      className={cn(
        'card',
        variant === 'interactive' && 'card-interactive',
        paddings[padding],
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
