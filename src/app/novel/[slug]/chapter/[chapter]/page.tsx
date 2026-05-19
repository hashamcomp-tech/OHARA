import { adminDb } from '@/lib/firebase-admin'
import { Novel, Chapter } from '@/lib/types'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function getNovel(slug: string): Promise<Novel | null> {
  const snap = await adminDb.collection('novels').where('slug', '==', slug).limit(1).get()
  if (snap.empty) return null
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Novel
}

async function getChapter(novelId: string, num: number): Promise<Chapter | null> {
  const snap = await adminDb.collection('chapters')
    .where('novelId', '==', novelId)
    .where('chapterNumber', '==', num)
    .limit(1).get()
  if (snap.empty) return null
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Chapter
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string; chapter: string }>
}) {
  const { slug, chapter: chapterStr } = await params
  const chapterNum = parseInt(chapterStr)
  const novel = await getNovel(slug)
  if (!novel) notFound()

  const chapter = await getChapter(novel.id, chapterNum)
  if (!chapter) notFound()

  const paragraphs = chapter.content.split(/\n\n+/).filter(Boolean)

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: 16 }}>
      {/* Novel title */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <Link href={`/novel/${novel.slug}`} style={{
          fontSize: 22, fontWeight: 800, color: '#2ea8a0',
          fontFamily: 'serif', letterSpacing: 1,
        }}>{novel.title.toUpperCase()}</Link>
        <h2 style={{ fontSize: 16, color: '#c9d1d9', marginTop: 6 }}>{chapter.title}</h2>
      </div>

      {/* Nav buttons */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24,
      }}>
        {chapterNum > 1 && (
          <Link href={`/novel/${novel.slug}/chapter/${chapterNum - 1}`} style={{
            background: '#21262d', border: '1px solid #30363d',
            color: '#e6edf3', padding: '7px 16px', borderRadius: 4, fontSize: 13,
          }}>← Prev Chapter</Link>
        )}
        <Link href={`/novel/${novel.slug}`} style={{
          background: '#21262d', border: '1px solid #30363d',
          color: '#e6edf3', padding: '7px 14px', borderRadius: 4, fontSize: 13,
        }}>☰</Link>
        {chapterNum < novel.totalChapters && (
          <Link href={`/novel/${novel.slug}/chapter/${chapterNum + 1}`} style={{
            background: '#2ea8a0', border: 'none',
            color: 'white', padding: '7px 16px', borderRadius: 4, fontSize: 13,
          }}>Next Chapter →</Link>
        )}
      </div>

      <div style={{
        borderTop: '1px solid #30363d', marginBottom: 24,
        paddingTop: 24,
      }}>
        {/* Chapter heading inside content */}
        <h3 style={{
          fontSize: 16, fontWeight: 700, marginBottom: 20,
          color: '#e6edf3',
        }}>{chapter.title}</h3>

        {/* Chapter content */}
        {paragraphs.map((p, i) => (
          <p key={i} style={{
            fontSize: 16, lineHeight: 1.9,
            color: '#c9d1d9', marginBottom: 18,
            fontFamily: 'var(--font-serif)',
          }}>{p}</p>
        ))}
      </div>

      {/* Bottom nav */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 8,
        borderTop: '1px solid #30363d', paddingTop: 20,
      }}>
        {chapterNum > 1 && (
          <Link href={`/novel/${novel.slug}/chapter/${chapterNum - 1}`} style={{
            background: '#21262d', border: '1px solid #30363d',
            color: '#e6edf3', padding: '7px 16px', borderRadius: 4, fontSize: 13,
          }}>← Prev Chapter</Link>
        )}
        <Link href={`/novel/${novel.slug}`} style={{
          background: '#21262d', border: '1px solid #30363d',
          color: '#e6edf3', padding: '7px 14px', borderRadius: 4, fontSize: 13,
        }}>☰</Link>
        {chapterNum < novel.totalChapters && (
          <Link href={`/novel/${novel.slug}/chapter/${chapterNum + 1}`} style={{
            background: '#2ea8a0', border: 'none',
            color: 'white', padding: '7px 16px', borderRadius: 4, fontSize: 13,
          }}>Next Chapter →</Link>
        )}
      </div>
    </div>
  )
}
