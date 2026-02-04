'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, Compass, Layers, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MainLayoutProps {
  children: ReactNode
  hideNav?: boolean
}

const navItems = [
  { href: '/home', icon: Home, label: 'Accueil' },
  { href: '/sessions', icon: Compass, label: 'Sessions' },
  { href: '/cards', icon: Layers, label: 'Cartes' },
  { href: '/progress', icon: TrendingUp, label: 'Progrès' },
]

export function MainLayout({ children, hideNav = false }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-bg-deep">
      <main className={cn('flex-1', !hideNav && 'pb-28')}>
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  )
}

function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div
        className="mx-4 mb-4 rounded-2xl"
        style={{
          background: 'rgba(15, 15, 20, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 -8px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex items-center justify-around h-[76px]">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex flex-col items-center justify-center gap-1.5',
                  'w-20 h-16 rounded-xl transition-all duration-200',
                  isActive ? 'text-gold-400' : 'text-text-muted hover:text-text-secondary'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-1 rounded-xl"
                    style={{
                      background: 'rgba(212, 168, 83, 0.12)',
                      border: '1px solid rgba(212, 168, 83, 0.25)',
                      boxShadow: '0 0 15px rgba(212, 168, 83, 0.15)',
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="relative z-10 w-6 h-6" style={{ strokeWidth: isActive ? 2.5 : 2 }} />
                <span className={cn('relative z-10 text-xs', isActive ? 'font-semibold' : 'font-medium')}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
