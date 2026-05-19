'use client'
import { useState } from 'react'
import Link from 'next/link'
import { GENRES } from '@/lib/types'

export default function Navbar() {
  const [novelMenuOpen, setNovelMenuOpen] = useState(false)
  const [genreMenuOpen, setGenreMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <nav style={{
      background: '#1c2333',
      borderBottom: '1px solid #30363d',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 56, gap: 24 }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="18" fill="#2ea8a0" opacity="0.15"/>
              {/* Tree trunk */}
              <rect x="16.5" y="22" width="3" height="9" fill="#2ea8a0"/>
              {/* Tree layers */}
              <polygon points="18,4 8,18 28,18" fill="#2ea8a0"/>
              <polygon points="18,9 7,22 29,22" fill="#2ea8a0" opacity="0.7"/>
              {/* Roots */}
              <path d="M16.5 31 Q12 33 10 35" stroke="#2ea8a0" strokeWidth="1.5" fill="none"/>
              <path d="M19.5 31 Q24 33 26 35" stroke="#2ea8a0" strokeWidth="1.5" fill="none"/>
            </svg>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#e6edf3', letterSpacing: 2, fontFamily: 'serif' }}>
              OHARA
            </span>
          </Link>

          {/* Novel List Dropdown */}
          <div style={{ position: 'relative' }}
            onMouseEnter={() => setNovelMenuOpen(true)}
            onMouseLeave={() => setNovelMenuOpen(false)}
          >
            <button style={{
              background: 'none', border: 'none', color: '#e6edf3',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              padding: '8px 4px', display: 'flex', alignItems: 'center', gap: 4
            }}>
              Novel list ▾
            </button>
            {novelMenuOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: 0,
                background: '#1c2333', border: '1px solid #30363d',
                borderRadius: 4, minWidth: 180, zIndex: 200,
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              }}>
                {[
                  { label: 'Your Library', href: '/library' },
                  { label: 'Latest Novels', href: '/sort/latest-novel' },
                  { label: 'Latest Release', href: '/sort/latest-release' },
                  { label: 'Most Popular', href: '/sort/most-popular' },
                  { label: 'Completed Novels', href: '/sort/completed-novel' },
                ].map(item => (
                  <Link key={item.href} href={item.href} style={{
                    display: 'block', padding: '10px 16px',
                    color: '#e6edf3', fontSize: 14,
                    borderBottom: '1px solid #30363d',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#21262d')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >{item.label}</Link>
                ))}
              </div>
            )}
          </div>

          {/* Genres Dropdown */}
          <div style={{ position: 'relative' }}
            onMouseEnter={() => setGenreMenuOpen(true)}
            onMouseLeave={() => setGenreMenuOpen(false)}
          >
            <button style={{
              background: 'none', border: 'none', color: '#e6edf3',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              padding: '8px 4px', display: 'flex', alignItems: 'center', gap: 4
            }}>
              Genres ▾
            </button>
            {genreMenuOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: 0,
                background: '#1c2333', border: '1px solid #30363d',
                borderRadius: 4, zIndex: 200,
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                minWidth: 480, padding: 8,
              }}>
                {GENRES.map(genre => (
                  <Link key={genre} href={`/genre/${encodeURIComponent(genre)}`} style={{
                    display: 'block', padding: '7px 12px',
                    color: '#2ea8a0', fontSize: 13,
                    transition: 'background 0.15s',
                    borderRadius: 3,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#21262d')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >{genre}</Link>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <div style={{ flex: 1, maxWidth: 400, marginLeft: 'auto' }}>
            <form action="/search" method="get" style={{ display: 'flex' }}>
              <input
                name="q"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search novels or authors..."
                style={{
                  flex: 1, background: '#0d1117',
                  border: '1px solid #30363d', borderRight: 'none',
                  borderRadius: '4px 0 0 4px', padding: '7px 12px',
                  color: '#e6edf3', fontSize: 14, outline: 'none',
                }}
              />
              <button type="submit" style={{
                background: '#2ea8a0', border: 'none',
                borderRadius: '0 4px 4px 0', padding: '7px 14px',
                color: 'white', cursor: 'pointer', fontSize: 14,
              }}>🔍</button>
            </form>
          </div>

          {/* Admin link */}
          <Link href="/admin" style={{
            color: '#8b949e', fontSize: 13,
            padding: '6px 10px', border: '1px solid #30363d',
            borderRadius: 4, flexShrink: 0,
            transition: 'color 0.2s, border-color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#2ea8a0'; e.currentTarget.style.borderColor = '#2ea8a0' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#8b949e'; e.currentTarget.style.borderColor = '#30363d' }}
          >Admin</Link>
        </div>
      </div>
    </nav>
  )
}
