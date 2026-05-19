import { adminDb } from '@/lib/firebase-admin'
import { Novel } from '@/lib/types'
import NovelCard from '@/components/NovelCard'

async function getNovels(genre: string): Promise<Novel[]> {
  try {
    let query = adminDb.collection('novels').orderBy('updatedAt', 'desc').limit(48)
    if (genre !== 'all') {
      query = adminDb.collection('novels')
        .where('genres', 'array-contains', genre)
        .orderBy('updatedAt', 'desc')
        .limit(48)
    }
    const snap = await query.get()
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Novel))
  } catch { return [] }
}

export default async function GenrePage({
  params,
}: {
  params: Promise<{ genre: string }>
}) {
  const { genre: rawGenre } = await params
  const genre = decodeURIComponent(rawGenre)

  const novels = await getNovels(genre)

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 16 }}>
      <h1 className="section-title" style={{ fontSize: 22, marginBottom: 20 }}>
        {genre === 'all' ? 'All Novels' : `${genre} Novels`}
      </h1>

      {novels.length === 0 ? (
        <p style={{ color: '#8b949e', textAlign: 'center', padding: 40 }}>
          No novels found in this genre yet.
        </p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: 12,
          }}
        >
          {novels.map(novel => (
            <NovelCard key={novel.id} novel={novel} />
          ))}
        </div>
      )}
    </div>
  )
}