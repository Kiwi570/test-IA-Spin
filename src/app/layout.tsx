import type { Metadata, Viewport } from 'next'
import '@/styles/globals.css'

// ═══════════════════════════════════════════════════════════════════
// METADATA
// ═══════════════════════════════════════════════════════════════════
export const metadata: Metadata = {
  title: 'Seb — Coach de parole incarnée',
  description: 'Développe ta présence, ta clarté et ton impact à l\'oral avec Seb, ton coach IA.',
  keywords: ['prise de parole', 'coaching', 'présence', 'charisme', 'confiance'],
  authors: [{ name: 'Seb AI' }],
  creator: 'Seb AI',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0A0A0F',
}

// ═══════════════════════════════════════════════════════════════════
// ROOT LAYOUT
// ═══════════════════════════════════════════════════════════════════
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="dark">
      <head />
      <body style={{ 
        backgroundColor: '#0A0A0F', 
        color: '#F5F5F4',
        minHeight: '100dvh',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        {children}
      </body>
    </html>
  )
}
