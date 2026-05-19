import Link from 'next/link'
import Image from 'next/image'
import { Novel } from '@/lib/types'

export default function NovelCard({ novel }: { novel: Novel }) {
  return (
    <Link href={`/novel/${novel.slug}`} className="novel-card" style={{
      display: 'block', overflow: 'hidden',
    }}>
      <div style={{ position: 'relative', paddingTop: '140%' }}>
        <Image
          src={novel.cover || '/placeholder-cover.jpg'}
          alt={novel.title}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 33vw, 16vw"
        />
      </div>
      <div style={{ padding: '8px 10px' }}>
        <h3 style={{
          fontSize: 13, fontWeight: 600, color: '#e6edf3',
          marginBottom: 4, lineHeight: 1.3,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{novel.title}</h3>
        <p style={{ fontSize: 11, color: '#8b949e', marginBottom: 4, fontStyle: 'italic' }}>
          {novel.language === 'chinese' ? 'Chinese Novel' :
           novel.language === 'korean' ? 'Korean Novel' :
           novel.language === 'japanese' ? 'Japanese Novel' : 'English Novel'}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 6 }}>
          {novel.genres.slice(0, 2).map(g => (
            <span key={g} className="genre-tag">{g}</span>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="star-rating">★ {novel.rating.toFixed(1)}</span>
          <span style={{ fontSize: 11, color: '#8b949e' }}>
            {novel.status === 'completed' ? 'Full ' : ''}{novel.totalChapters} Ch
          </span>
        </div>
      </div>
    </Link>
  )
}
