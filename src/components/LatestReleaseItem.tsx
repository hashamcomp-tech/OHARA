import Link from 'next/link'
import Image from 'next/image'
import { Novel } from '@/lib/types'

function timeAgo(ts: number) {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 60) return `${mins} mins ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  return `${days} day${days > 1 ? 's' : ''} ago`
}

export default function LatestReleaseItem({ novel }: { novel: Novel }) {
  return (
    <div style={{
      display: 'flex', gap: 10, padding: '10px 0',
      borderBottom: '1px solid #21262d', alignItems: 'center',
    }}>
      <Link href={`/novel/${novel.slug}`} style={{ flexShrink: 0 }}>
        <Image
          src={novel.cover || '/placeholder-cover.jpg'}
          alt={novel.title}
          width={40}
          height={54}
          style={{ objectFit: 'cover', borderRadius: 2 }}
        />
      </Link>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Link href={`/novel/${novel.slug}`} style={{
          fontSize: 13, fontWeight: 600, color: '#e6edf3',
          display: 'block', marginBottom: 3,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{novel.title}</Link>
        <div style={{ display: 'flex', gap: 4, marginBottom: 3 }}>
          {novel.genres.slice(0, 2).map(g => (
            <span key={g} className="genre-tag">{g}</span>
          ))}
        </div>
        <Link href={`/novel/${novel.slug}/chapter/${novel.latestChapter}`} style={{
          fontSize: 12, color: '#2ea8a0',
          display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>CH.{novel.latestChapter}: {novel.latestChapterTitle}</Link>
      </div>
      <span style={{ fontSize: 11, color: '#8b949e', flexShrink: 0 }}>
        {timeAgo(novel.updatedAt)}
      </span>
    </div>
  )
}
