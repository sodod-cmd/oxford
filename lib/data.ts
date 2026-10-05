export const CDN_ORIGIN = 'https://d3mip5625qa9dx.cloudfront.net'

/** Same-origin proxy path configured in next.config.mjs (needed for PDF.js, CloudFront sends no CORS headers). */
export const MEDIA_PROXY_PREFIX = '/media'

export type LevelId = '3' | '4' | '5' | '6'

export type Book = {
  slug: string
  title: string
  /** Exact S3 object key for the PDF (spaces kept as-is, they are encoded at request time). */
  pdfKey: string
  /** Exact S3 object key for the MP3. */
  audioKey: string
  pdfSizeMb: number
  audioSizeMb: number
}

export type Level = {
  id: LevelId
  name: string
  books: Book[]
}

/**
 * Encode each path segment with encodeURIComponent so spaces become %20.
 * Never use "+" for spaces: S3 keys may contain a literal "+", and URL encoders
 * built for form data (URLSearchParams) would turn spaces into "+".
 */
export function encodeKey(key: string): string {
  return key.split('/').map(encodeURIComponent).join('/')
}

export function cdnUrl(key: string): string {
  return `${CDN_ORIGIN}/${encodeKey(key)}`
}

export function proxyUrl(key: string): string {
  return `${MEDIA_PROXY_PREFIX}/${encodeKey(key)}`
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

type RawBook = [title: string, pdfFile: string, audioFile: string, pdfMb: number, audioMb: number]

function buildLevel(id: LevelId, raw: RawBook[]): Level {
  return {
    id,
    name: `Level ${id}`,
    books: raw.map(([title, pdfFile, audioFile, pdfSizeMb, audioSizeMb]) => ({
      slug: slugify(title),
      title,
      pdfKey: `oxford/${id}/${pdfFile}`,
      audioKey: `oxford/${id}/${audioFile}`,
      pdfSizeMb,
      audioSizeMb,
    })),
  }
}

// File names mirror the real S3 keys (verified with HEAD requests), including
// irregular spacing, hyphens and the "mp.3" extension present in the bucket.
export const levels: Level[] = [
  buildLevel('3', [
    ['Amazing Minibeasts', 'Amazing Minibeasts - L3.pdf', 'Amazing-Minibeasts.mp3', 4.4, 4.9],
    ['Festivals Around the World', 'Festivals Around the World - L3.pdf', 'Festivals Around the World.mp3', 4.9, 6.0],
    ['Free Time Around the World', 'Free Time Around the World- L3.pdf', 'Free Time Around the World.mp3', 14.8, 11.5],
    ['How We Make Products', 'How We Make Products - L3.pdf', 'How-We-Make-Products.mp3', 4.9, 6.1],
    ['Life in Rainforests', 'Life in Rainforests - L3.pdf', 'Life-In-Rainforests.mp3', 9.3, 8.9],
    ['Sound and Music', 'Sound And Music - L3.pdf', 'Sound And Music.mp3', 5.7, 6.2],
    ['Super Structures', 'Super Structures - L3.pdf', 'Super Structures.mp3', 4.4, 6.3],
    ['Wonderful Water', 'Wonderful Water - L3.pdf', 'Wonderful Water.mp3', 4.4, 5.8],
    ['Your Five Senses', 'Your Five Senses - L3.pdf', 'Your Five Senses.mp3', 4.5, 5.3],
  ]),
  buildLevel('4', [
    ['All About Desert Life', 'All About Desert Life L4.pdf', 'All About Desert Life.mp3', 4.9, 7.6],
    ['All About Ocean Life', 'All About Ocean Life - L4.pdf', 'All About Ocean Life.mp3', 4.9, 6.9],
    ['All About Plants', 'All About Plants - L4.pdf', 'All About Plants.mp3', 8.1, 8.1],
    ['Animals in Art', 'Animals In Art - L4.pdf', 'Animals-In-Art.mp3', 5.3, 8.1],
    ['How to Stay Healthy', 'How to Stay Healthy - L4.pdf', 'How to Stay Healthy.mp3', 4.8, 6.8],
    ['Incredible Earth', 'Incredible Earth - L4.pdf', 'Incredible Earth.mp3', 5.0, 9.4],
    ['Machines Then and Now', 'Machines Then and Now - L4.pdf', 'Machines Then and Now.mp3', 4.6, 7.5],
    ['Why We Recycle', 'Why we Recycle - L4.pdf', 'Why-We-Recycle.mp3', 5.3, 7.1],
    ['Wonders of the Past', 'Wonders Of the Past - L4.pdf', 'Wonders Of the Past.mp3', 4.7, 10.1],
  ]),
  buildLevel('5', [
    ['Animal Life Cycles', 'Animal Life Cycles - L5.pdf', 'Animal Life Cycles.mp3', 5.7, 12.6],
    ['Exploring Our World', 'Exploring Our World - L5.pdf', 'Exploring Our World.mp3', 5.9, 14.5],
    ['Great Migrations', 'Great Migrations - L5.pdf', 'Great Migrations.mp3', 5.8, 14.7],
    ['Homes Around the World', 'Homes Around the World - L5.pdf', 'Homes Around the World.mp3', 6.9, 14.1],
    ['Materials to Products', 'Materials To Products - L5.pdf', 'Materials To Products.mp3', 6.3, 15.3],
    ['Medicine Then and Now', 'Medicine Then and Now - L5.pdf', 'Medicine Then and Now.mp3', 6.6, 13.2],
    ['Our World in Art', 'Our World In Art - L5.pdf', 'Our World In Art.mp3', 6.7, 14.2],
    ['Transportation Then and Now', 'Transportation Then and Now - L5.pdf', 'Transportation Then and Now.mp3', 5.4, 15.4],
    ['Wild Weather', 'Wild Weather - L5.pdf', 'Wild Weather.mp3', 5.7, 16.1],
  ]),
  buildLevel('6', [
    ['All About Space', 'All About Space - L6.pdf', 'All About Space.mp3', 5.7, 14.9],
    ['Caring for Our Planet', 'Caring for Our Planet - L6.pdf', 'Caring for Our PLanet.mp.3', 6.6, 14.7],
    ['Clothes Then and Now', 'Clothes Then and Now - L6.pdf', 'Clothes Then and Now.mp3', 6.0, 6.2],
    ['Earth Then and Now', 'Earth Then and Now - L6.pdf', 'Earth Then and Now.mp3', 7.0, 12.2],
    ['Food Around the World', 'Food Around the World - L6.pdf', 'Food Around the World.mp3', 22.4, 12.5],
    ['Helping Around the World', 'Helping Around the World - L6.pdf', 'Helping Around the World.mp3', 6.6, 7.5],
    ['Incredible Energy', 'Incredible Energy  - L6.pdf', 'Incredible Energy.mp3', 4.6, 12.6],
    ['Wonderful Ecosystems', 'Wonderful Ecosystems  - L6.pdf', 'Wonderful Ecosystems.mp3', 3.9, 8.8],
    ['Your Amazing Body', 'Your Amazing Body - L6.pdf', 'Your Amazing Body.mp3', 11.5, 9.2],
  ]),
]


export function getLevel(id: string): Level | undefined {
  return levels.find((level) => level.id === id)
}

export function getBook(levelId: string, slug: string): { level: Level; book: Book; index: number } | undefined {
  const level = getLevel(levelId)
  if (!level) return undefined
  const index = level.books.findIndex((book) => book.slug === slug)
  if (index === -1) return undefined
  return { level, book: level.books[index], index }
}
