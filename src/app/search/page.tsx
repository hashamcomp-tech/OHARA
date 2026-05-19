import { adminDb } from '@/lib/firebase-admin'
import { Novel } from '@/lib/types'
import NovelCard from '@/components/NovelCard'

async function searchNovels(q: string): Promise<Novel[]> {
  if (!q) return []
  try {
    const snap = await adminDb.collection('novels')
      .orderBy('title')
      .startAt(q)
      .endAt(q + '\uf8ff')
      .limit(24)
      .get()
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Novel))
  } catch { return [] }
}

export default async function SearchPage({
  searchParams
}: {
  searchParams: { q?: string }
}) {
  const q = searchParams.q || ''
  const novels = await searchNovels(q)

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 16 }}>
      <h1 className="section-title" style={{ fontSize: 22, marginBottom: 20 }}>
        Search results for: <span style={{ color: '#2ea8a0' }}>{q}</span>
      </h1>
      {novels.length === 0 ? (
        <p style={{ color: '#8b949e', textAlign: 'center', padding: 40 }}>
          No results found for &quot;{q}&quot;
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: 12,
        }}>
          {novels.map(novel => (
            <NovelCard key={novel.id} novel={novel} />
          ))}
        </div>
      )}
    </div>
  )
}
