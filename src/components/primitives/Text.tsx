'use client'

import { cn } from '@/lib/utils'

interface TextProps {
  variant?: 'heading' | 'subheading' | 'body' | 'caption'
  color?: 'primary' | 'secondary' | 'muted' | 'gold'
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3'
  className?: string
  children: React.ReactNode
}

const variants = {
  heading: 'font-display text-2xl md:text-3xl',
  subheading: 'font-medium text-lg',
  body: 'text-base',
  caption: 'text-sm',
}

const colors = {
  primary: 'text-text-primary',
  secondary: 'text-text-secondary',
  muted: 'text-text-muted',
  gold: 'text-gold-400',
}

export function Text({ variant = 'body', color = 'primary', as = 'p', className, children }: TextProps) {
  const Component = as
  return (
    <Component className={cn(variants[variant], colors[color], className)}>
      {children}
    </Component>
  )
}
