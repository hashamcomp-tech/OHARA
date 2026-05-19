import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      background: '#161b22',
      borderTop: '1px solid #30363d',
      padding: '24px 16px',
      textAlign: 'center',
      color: '#8b949e',
      fontSize: 13,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <p style={{ marginBottom: 8, fontWeight: 700, fontSize: 15, color: '#e6edf3' }}>
          🌳 OHARA
        </p>
        <p style={{ marginBottom: 8 }}>Read Novels Online Free</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <Link href="/contact" style={{ color: '#2ea8a0' }}>Contact</Link>
          <Link href="/privacy" style={{ color: '#2ea8a0' }}>Privacy Policy</Link>
          <Link href="/terms" style={{ color: '#2ea8a0' }}>Terms of Use</Link>
        </div>
      </div>
    </footer>
  )
}
