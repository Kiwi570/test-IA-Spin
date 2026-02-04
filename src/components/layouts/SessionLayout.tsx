'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SessionLayoutProps {
  children: ReactNode
  showBack?: boolean
  showClose?: boolean
  onBack?: () => void
  onClose?: () => void
  className?: string
}

export function SessionLayout({
  children,
  showBack = false,
  showClose = false,
  onBack,
  onClose,
  className,
}: SessionLayoutProps) {
  const router = useRouter()

  const handleBack = () => onBack ? onBack() : router.back()
  const handleClose = () => onClose ? onClose() : router.push('/home')

  return (
    <div className="min-h-screen bg-[#0a0a12]">
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between h-14 px-4">
          <AnimatePresence>
            {showBack && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={handleBack}
                className="p-3 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>

          <div className="flex-1" />

          <AnimatePresence>
            {showClose && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onClick={handleClose}
                className="p-3 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main className={cn('min-h-screen flex flex-col items-center justify-center px-6 py-20', className)}>
        <div className="w-full max-w-lg">
          {children}
        </div>
      </main>
    </div>
  )
}
