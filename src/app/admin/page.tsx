'use client'
import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, deleteDoc, doc, orderBy, query, limit } from 'firebase/firestore'
import { Novel } from '@/lib/types'

export default function AdminPage() {
  const [novels, setNovels] = useState<Novel[]>([])
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)

  const handleAuth = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'ohara-admin') {
      setAuthed(true)
    } else {
      alert('Wrong password')
    }
  }

  useEffect(() => {
    if (!authed) return
    const load = async () => {
      const q = query(collection(db, 'novels'), orderBy('updatedAt', 'desc'), limit(50))
      const snap = await getDocs(q)
      setNovels(snap.docs.map(d => ({ id: d.id, ...d.data() } as Novel)))
      setLoading(false)
    }
    load()
  }, [authed])

  const deleteNovel = async (id: string, slug: string) => {
    if (!confirm(`Delete "${slug}"? This won't delete chapters.`)) return
    await deleteDoc(doc(db, 'novels', id))
    setNovels(prev => prev.filter(n => n.id !== id))
  }

  if (!authed) {
    return (
      <div style={{
        maxWidth: 400, margin: '80px auto', padding: 32,
        background: '#161b22', border: '1px solid #30363d', borderRadius: 8,
        textAlign: 'center',
      }}>
        <h1 style={{ marginBottom: 24, fontSize: 24 }}>🌳 OHARA Admin</h1>
        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAuth()}
          style={{
            width: '100%', padding: '10px 14px', marginBottom: 12,
            background: '#0d1117', border: '1px solid #30363d',
            borderRadius: 4, color: '#e6edf3', fontSize: 15,
          }}
        />
        <button onClick={handleAuth} className="btn-teal" style={{ width: '100%', padding: '10px' }}>
          Login
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 16 }}>
      <h1 style={{ marginBottom: 24, fontSize: 24, fontWeight: 700 }}>🌳 OHARA Admin</h1>

      <div style={{
        background: '#161b22', border: '1px solid #30363d',
        borderRadius: 4, padding: 20, marginBottom: 20,
      }}>
        <h2 className="section-title">API Ingest Info</h2>
        <p style={{ color: '#8b949e', fontSize: 14, marginBottom: 8 }}>
          Point your scraper to: <code style={{ color: '#2ea8a0' }}>POST /api/ingest</code>
        </p>
        <p style={{ color: '#8b949e', fontSize: 14 }}>
          Required env var: <code style={{ color: '#2ea8a0' }}>SCRAPER_API_KEY</code>
        </p>
      </div>

      <div style={{
        background: '#161b22', border: '1px solid #30363d',
        borderRadius: 4, padding: 20,
      }}>
        <h2 className="section-title">Novels ({novels.length})</h2>
        {loading ? (
          <p style={{ color: '#8b949e' }}>Loading...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #30363d', color: '#8b949e' }}>
                <th style={{ textAlign: 'left', padding: '8px 12px' }}>Title</th>
                <th style={{ textAlign: 'left', padding: '8px 12px' }}>Chapters</th>
                <th style={{ textAlign: 'left', padding: '8px 12px' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '8px 12px' }}>Views</th>
                <th style={{ textAlign: 'left', padding: '8px 12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {novels.map(novel => (
                <tr key={novel.id} style={{ borderBottom: '1px solid #21262d' }}>
                  <td style={{ padding: '8px 12px', color: '#e6edf3' }}>{novel.title}</td>
                  <td style={{ padding: '8px 12px', color: '#8b949e' }}>{novel.totalChapters}</td>
                  <td style={{ padding: '8px 12px' }}>
                    <span style={{ color: novel.status === 'completed' ? '#2ea8a0' : '#f4c542' }}>
                      {novel.status}
                    </span>
                  </td>
                  <td style={{ padding: '8px 12px', color: '#8b949e' }}>{novel.views?.toLocaleString()}</td>
                  <td style={{ padding: '8px 12px' }}>
                    <button
                      onClick={() => deleteNovel(novel.id, novel.slug)}
                      style={{
                        background: '#da3633', border: 'none', color: 'white',
                        padding: '4px 10px', borderRadius: 3, fontSize: 12, cursor: 'pointer',
                      }}
                    >Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
