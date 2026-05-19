export interface Novel {
  id: string
  title: string
  slug: string
  author: string
  cover: string
  description: string
  genres: string[]
  status: 'ongoing' | 'completed'
  language: 'english' | 'chinese' | 'korean' | 'japanese'
  totalChapters: number
  latestChapter: number
  latestChapterTitle: string
  rating: number
  ratingCount: number
  views: number
  createdAt: number
  updatedAt: number
}

export interface Chapter {
  id: string
  novelId: string
  chapterNumber: number
  title: string
  content: string
  createdAt: number
}

export const GENRES = [
  'Action', 'Adult', 'Adventure', 'Comedy', 'Drama', 'Eastern',
  'Ecchi', 'Fantasy', 'Game', 'Gender Bender', 'Harem', 'Historical',
  'Horror', 'Josei', 'Martial Arts', 'Mature', 'Mecha', 'Mystery',
  'Psychological', 'Reincarnation', 'Romance', 'School Life', 'Sci-fi',
  'Seinen', 'Shoujo', 'Shounen Ai', 'Shounen', 'Slice of Life', 'Smut',
  'Sports', 'Supernatural', 'Tragedy', 'Wuxia', 'Xianxia', 'Xuanhuan', 'Yaoi'
]
