import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'OHARA - Read Novels Online Free',
  description: 'Read web novels online for free. Latest chapters updated daily.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 120px)' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
