'use client'

import { useState, useEffect } from 'react'

/**
 * Hook pour attendre que l'hydratation Zustand soit terminée
 * Évite les erreurs SSR avec localStorage
 */
export function useHydration() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  return hydrated
}
