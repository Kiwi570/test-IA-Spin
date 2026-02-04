'use client'

import { cn } from '@/lib/utils'

// ═══════════════════════════════════════════════════════════════════
// SPACER — Espace vide configurable
// ═══════════════════════════════════════════════════════════════════

type SpacerSize = '4' | '8' | '12' | '16' | '20' | '24' | '32' | '48' | '64'

interface SpacerProps {
  size?: SpacerSize
  axis?: 'vertical' | 'horizontal'
  className?: string
}

const spacerSizes: Record<SpacerSize, string> = {
  '4': '1rem',    // 16px
  '8': '2rem',    // 32px
  '12': '3rem',   // 48px
  '16': '4rem',   // 64px
  '20': '5rem',   // 80px
  '24': '6rem',   // 96px
  '32': '8rem',   // 128px
  '48': '12rem',  // 192px
  '64': '16rem',  // 256px
}

export function Spacer({ size = '8', axis = 'vertical', className }: SpacerProps) {
  const dimension = spacerSizes[size]
  
  return (
    <div
      className={cn('shrink-0', className)}
      style={{
        [axis === 'vertical' ? 'height' : 'width']: dimension,
        [axis === 'vertical' ? 'width' : 'height']: '100%',
      }}
      aria-hidden="true"
    />
  )
}

// ═══════════════════════════════════════════════════════════════════
// DIVIDER — Ligne de séparation
// ═══════════════════════════════════════════════════════════════════

interface DividerProps {
  variant?: 'subtle' | 'default' | 'strong'
  spacing?: 'sm' | 'md' | 'lg'
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

const dividerVariants = {
  subtle: 'bg-border-subtle',
  default: 'bg-border-default',
  strong: 'bg-border-strong',
}

const dividerSpacing = {
  sm: 'my-2',
  md: 'my-4',
  lg: 'my-8',
}

export function Divider({
  variant = 'subtle',
  spacing = 'md',
  orientation = 'horizontal',
  className,
}: DividerProps) {
  const isHorizontal = orientation === 'horizontal'
  
  return (
    <div
      className={cn(
        dividerVariants[variant],
        isHorizontal ? [dividerSpacing[spacing], 'h-px w-full'] : 'w-px h-full mx-2',
        className
      )}
      role="separator"
      aria-orientation={orientation}
    />
  )
}
