'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

// ═══════════════════════════════════════════════════════════════════
// PAGE RACINE — Splash + Redirection
// ═══════════════════════════════════════════════════════════════════
export default function RootPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    // Import dynamique du store pour éviter SSR
    import('@/stores').then(({ useUserStore }) => {
      const { user, initUser } = useUserStore.getState()
      initUser()
      
      // Redirection après un court délai (splash)
      setTimeout(() => {
        const currentUser = useUserStore.getState().user
        if (currentUser?.isOnboarded) {
          router.replace('/home')
        } else {
          router.replace('/onboarding')
        }
      }, 1500)
    })
  }, [mounted, router])

  if (!mounted) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0A0A0F'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(145deg, #E5C478, #D4A853, #A67C3A)',
          boxShadow: '0 0 60px rgba(212, 168, 83, 0.4)'
        }} />
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0A0A0F',
      color: 'white'
    }}>
      <motion.div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Orbe Seb */}
        <motion.div
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(145deg, #E5C478, #D4A853, #A67C3A)',
            boxShadow: '0 0 60px rgba(212, 168, 83, 0.4), 0 0 100px rgba(212, 168, 83, 0.2)'
          }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Nom */}
        <motion.h1
          style={{ 
            fontFamily: 'Spectral, Georgia, serif', 
            fontSize: '2rem', 
            letterSpacing: '0.1em' 
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Seb
        </motion.h1>

        {/* Tagline */}
        <motion.p
          style={{ color: '#A8A8B3', textAlign: 'center' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Coach de parole incarnée
        </motion.p>
      </motion.div>
    </div>
  )
}
