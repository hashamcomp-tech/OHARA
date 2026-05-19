import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import * as admin from 'firebase-admin'

// Scraper posts to this endpoint with novel metadata + chapters
// POST /api/ingest
// Body: {
//   apiKey: string,
//   novel: { title, slug, author, cover, description, genres, status, language, totalChapters, rating },
//   chapters: [{ chapterNumber, title, content }]
// }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Simple API key auth
    if (body.apiKey !== process.env.SCRAPER_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { novel, chapters } = body

    if (!novel || !novel.slug) {
      return NextResponse.json({ error: 'Missing novel data' }, { status: 400 })
    }

    // Upsert novel
    const novelRef = adminDb.collection('novels').doc(novel.slug)
    const existing = await novelRef.get()

    const novelData = {
      title: novel.title,
      slug: novel.slug,
      author: novel.author || 'Unknown',
      cover: novel.cover || '',
      description: novel.description || '',
      genres: novel.genres || [],
      status: novel.status || 'ongoing',
      language: novel.language || 'english',
      totalChapters: novel.totalChapters || chapters?.length || 0,
      latestChapter: novel.latestChapter || chapters?.[chapters.length - 1]?.chapterNumber || 0,
      latestChapterTitle: novel.latestChapterTitle || chapters?.[chapters.length - 1]?.title || '',
      rating: existing.exists ? (existing.data()?.rating || 0) : 0,
      ratingCount: existing.exists ? (existing.data()?.ratingCount || 0) : 0,
      views: existing.exists ? (existing.data()?.views || 0) : 0,
      createdAt: existing.exists ? existing.data()?.createdAt : Date.now(),
      updatedAt: Date.now(),
    }

    await novelRef.set(novelData, { merge: true })

    // Upload chapters in batches of 500
    if (chapters && chapters.length > 0) {
      const BATCH_SIZE = 500
      for (let i = 0; i < chapters.length; i += BATCH_SIZE) {
        const batch = adminDb.batch()
        const slice = chapters.slice(i, i + BATCH_SIZE)

        for (const ch of slice) {
          const chRef = adminDb.collection('chapters').doc(`${novel.slug}-ch${ch.chapterNumber}`)
          batch.set(chRef, {
            novelId: novel.slug,
            chapterNumber: ch.chapterNumber,
            title: ch.title,
            content: ch.content,
            createdAt: Date.now(),
          }, { merge: true })
        }

        await batch.commit()
      }
    }

    return NextResponse.json({
      success: true,
      novel: novel.slug,
      chaptersIngested: chapters?.length || 0,
    })

  } catch (err: any) {
    console.error('Ingest error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
