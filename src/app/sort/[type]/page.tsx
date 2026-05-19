import { adminDb } from '@/lib/firebase-admin'
import { Novel } from '@/lib/types'
import NovelCard from '@/components/NovelCard'

const SORT_LABELS: Record<string, string> = {
  'latest-novel': 'Latest Novels',
  'latest-release': 'Latest Release',
  'most-popular': 'Most Popular',
  'completed-novel': 'Completed Novels',
}

async function getNovels(type: string): Promise<Novel[]> {
  try {
    let ref = adminDb.collection('novels')
    let query: any

    if (type === 'latest-novel') {
      query = ref.orderBy('createdAt', 'desc').limit(48)
    } else if (type === 'latest-release') {
      query = ref.orderBy('updatedAt', 'desc').limit(48)
    } else if (type === 'most-popular') {
      query = ref.orderBy('views', 'desc').limit(48)
    } else if (type === 'completed-novel') {
      query = ref.where('status', '==', 'completed').orderBy('updatedAt', 'desc').limit(48)
    } else {
      query = ref.orderBy('updatedAt', 'desc').limit(48)
    }

    const snap = await query.get()
    return snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as Novel))
  } catch { return [] }
}

export default async function SortPage({ params }: { params: { type: string } }) {
  const novels = await getNovels(params.type)
  const label = SORT_LABELS[params.type] || 'Novels'

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 16 }}>
      <h1 className="section-title" style={{ fontSize: 22, marginBottom: 20 }}>{label}</h1>
      {novels.length === 0 ? (
        <p style={{ color: '#8b949e', textAlign: 'center', padding: 40 }}>No novels yet.</p>
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
