import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BookReader } from '@/components/reader/book-reader'
import { getBook } from '@/lib/data'
import { getDictionary } from '@/lib/locale-server'

type Params = { params: Promise<{ level: string; slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { level, slug } = await params
  const result = getBook(level, slug)
  if (!result) return {}
  const { t } = await getDictionary()
  return {
    title: `${result.book.title} — Level ${result.level.id} · Oxford Discover`,
    description: t.meta.bookDescription(result.book.title),
  }
}

export default async function BookPage({ params }: Params) {
  const { level, slug } = await params
  const result = getBook(level, slug)
  if (!result) notFound()

  return (
    <BookReader
      levelId={result.level.id}
      book={result.book}
      position={result.index + 1}
      total={result.level.books.length}
    />
  )
}
