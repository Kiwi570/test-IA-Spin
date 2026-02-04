import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0A0A0F',
      color: 'white',
      padding: '24px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 'bold', color: '#D4A853', marginBottom: '16px' }}>
        404
      </h1>
      <p style={{ fontSize: '1.25rem', color: '#9ca3af', marginBottom: '32px' }}>
        Page non trouvée
      </p>
      <Link 
        href="/home"
        style={{
          padding: '12px 24px',
          backgroundColor: '#D4A853',
          color: '#0A0A0F',
          borderRadius: '12px',
          fontWeight: '600',
          textDecoration: 'none'
        }}
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  )
}
