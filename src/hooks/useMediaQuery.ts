'use client'

import { useState, useEffect } from 'react'
import { isClient } from '@/lib/utils'

// ═══════════════════════════════════════════════════════════════════
// useMediaQuery — Hook pour les media queries responsives
// ═══════════════════════════════════════════════════════════════════
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (!isClient) return

    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}

// ═══════════════════════════════════════════════════════════════════
// Hooks de breakpoints prédéfinis
// ═══════════════════════════════════════════════════════════════════
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 639px)')
}

export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 640px) and (max-width: 1023px)')
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)')
}

// ═══════════════════════════════════════════════════════════════════
// useReducedMotion — Respecter les préférences utilisateur
// ═══════════════════════════════════════════════════════════════════
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
