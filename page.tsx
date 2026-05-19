import { adminDb } from '@/lib/firebase-admin'
import { Novel } from '@/lib/types'
import NovelCard from '@/components/NovelCard'
import LatestReleaseItem from '@/components/LatestReleaseItem'
import Link from 'next/link'
import { GENRES } from '@/lib/types'

async function getNovels(orderBy: string, limit: number): Promise<Novel[]> {
  try {
    const snap = await adminDb.collection('novels')
      .orderBy(orderBy, 'desc')
      .limit(limit)
      .get()
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Novel))
  } catch { return [] }
}

export const revalidate = 300

export default async function Home() {
  const [latestRelease, latestNovels, completedNovels] = await Promise.all([
    getNovels('updatedAt', 20),
    getNovels('createdAt', 6),
    getNovels('totalChapters', 6).then(n => n.filter(x => x.status === 'completed').slice(0, 6)),
  ])

  const featuredNovels = latestRelease.slice(0, 7)

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>

        {/* Main content */}
        <div>
          {/* Featured novels grid */}
          <div style={{ marginBottom: 28 }}>
            <h2 className="section-title">Read Books Online Free & Free Novels Online</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: 12,
            }}>
              {featuredNovels.map(novel => (
                <NovelCard key={novel.id} novel={novel} />
              ))}
            </div>
            <div style={{ textAlign: 'right', marginTop: 12 }}>
              <Link href="/sort/latest-release" style={{
                color: '#2ea8a0', fontSize: 13,
                border: '1px solid #2ea8a0', padding: '4px 12px', borderRadius: 3,
              }}>See more →</Link>
            </div>
          </div>

          {/* Latest Novels */}
          <div style={{ marginBottom: 28 }}>
            <h2 className="section-title">Latest Novels</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: 12,
            }}>
              {latestNovels.map(novel => (
                <NovelCard key={novel.id} novel={novel} />
              ))}
            </div>
            <div style={{ textAlign: 'right', marginTop: 12 }}>
              <Link href="/sort/latest-novel" style={{
                color: '#2ea8a0', fontSize: 13,
                border: '1px solid #2ea8a0', padding: '4px 12px', borderRadius: 3,
              }}>See more →</Link>
            </div>
          </div>

          {/* Completed Novels */}
          <div style={{ marginBottom: 28 }}>
            <h2 className="section-title">Completed Novels</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: 12,
            }}>
              {completedNovels.map(novel => (
                <NovelCard key={novel.id} novel={novel} />
              ))}
            </div>
            <div style={{ textAlign: 'right', marginTop: 12 }}>
              <Link href="/sort/completed-novel" style={{
                color: '#2ea8a0', fontSize: 13,
                border: '1px solid #2ea8a0', padding: '4px 12px', borderRadius: 3,
              }}>See more →</Link>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Latest Release */}
          <div style={{
            background: '#161b22', border: '1px solid #30363d',
            borderRadius: 4, padding: '12px 16px', marginBottom: 20,
          }}>
            <h2 className="section-title">Latest Release Novels</h2>
            {latestRelease.map(novel => (
              <LatestReleaseItem key={novel.id} novel={novel} />
            ))}
          </div>

          {/* Genres */}
          <div style={{
            background: '#161b22', border: '1px solid #30363d',
            borderRadius: 4, padding: '12px 16px',
          }}>
            <h2 className="section-title">Genres</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {GENRES.map(genre => (
                <Link key={genre} href={`/genre/${encodeURIComponent(genre)}`} className="genre-tag">
                  {genre}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
