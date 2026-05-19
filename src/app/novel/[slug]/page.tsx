import { adminDb } from '@/lib/firebase-admin'
import { Novel, Chapter } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 300

async function getNovel(slug: string): Promise<Novel | null> {
  const snap = await adminDb.collection('novels').where('slug', '==', slug).limit(1).get()
  if (snap.empty) return null
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Novel
}

async function getChapters(novelId: string): Promise<Chapter[]> {
  const snap = await adminDb.collection('chapters')
    .where('novelId', '==', novelId)
    .orderBy('chapterNumber', 'asc')
    .get()
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Chapter))
}

export default async function NovelPage({ params }: { params: { slug: string } }) {
  const novel = await getNovel(params.slug)
  if (!novel) notFound()
  const chapters = await getChapters(novel.id)

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 16 }}>
      {/* Novel info */}
      <div style={{
        background: '#161b22', border: '1px solid #30363d',
        borderRadius: 4, padding: 20, marginBottom: 20,
        display: 'flex', gap: 20,
      }}>
        <div style={{ flexShrink: 0 }}>
          <Image
            src={novel.cover || '/placeholder-cover.jpg'}
            alt={novel.title}
            width={160}
            height={224}
            style={{ objectFit: 'cover', borderRadius: 4 }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{novel.title}</h1>
          <p style={{ color: '#8b949e', fontSize: 14, marginBottom: 4 }}>
            Author: <span style={{ color: '#e6edf3' }}>{novel.author}</span>
          </p>
          <p style={{ color: '#8b949e', fontSize: 14, marginBottom: 8 }}>
            Status: <span style={{
              color: novel.status === 'completed' ? '#2ea8a0' : '#f4c542'
            }}>{novel.status === 'completed' ? 'Completed' : 'Ongoing'}</span>
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {novel.genres.map(g => (
              <Link key={g} href={`/genre/${encodeURIComponent(g)}`} className="genre-tag">{g}</Link>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
            <span className="star-rating">★ {novel.rating.toFixed(1)}</span>
            <span style={{ color: '#8b949e', fontSize: 13 }}>({novel.ratingCount} ratings)</span>
            <span style={{ color: '#8b949e', fontSize: 13 }}>• {novel.views.toLocaleString()} views</span>
          </div>
          {chapters.length > 0 && (
            <div style={{ display: 'flex', gap: 10 }}>
              <Link href={`/novel/${novel.slug}/chapter/1`} className="btn-teal">
                Read First Chapter
              </Link>
              <Link href={`/novel/${novel.slug}/chapter/${novel.latestChapter}`}
                style={{
                  background: '#21262d', border: '1px solid #30363d',
                  color: '#e6edf3', padding: '6px 16px', borderRadius: 4,
                  fontSize: 14, fontWeight: 600,
                }}>
                Latest Chapter
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div style={{
        background: '#161b22', border: '1px solid #30363d',
        borderRadius: 4, padding: 20, marginBottom: 20,
      }}>
        <h2 className="section-title">Description</h2>
        <p style={{ color: '#c9d1d9', fontSize: 14, lineHeight: 1.8 }}>{novel.description}</p>
      </div>

      {/* Chapter list */}
      <div style={{
        background: '#161b22', border: '1px solid #30363d',
        borderRadius: 4, padding: 20,
      }}>
        <h2 className="section-title">
          Chapters ({chapters.length})
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 4,
          maxHeight: 400,
          overflowY: 'auto',
        }}>
          {chapters.map(ch => (
            <Link key={ch.id}
              href={`/novel/${novel.slug}/chapter/${ch.chapterNumber}`}
              style={{
                display: 'block', padding: '8px 12px',
                color: '#8b949e', fontSize: 13,
                borderRadius: 3, transition: 'background 0.15s, color 0.15s',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#21262d'; e.currentTarget.style.color = '#2ea8a0' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8b949e' }}
            >
              CH.{ch.chapterNumber}: {ch.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
