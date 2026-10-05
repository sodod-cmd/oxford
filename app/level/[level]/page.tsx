import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { BookCard } from '@/components/book-card'
import { LevelSwitcher } from '@/components/level-switcher'
import { getLevel } from '@/lib/data'
import { getDictionary } from '@/lib/locale-server'

type Params = { params: Promise<{ level: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { level: levelId } = await params
  const level = getLevel(levelId)
  if (!level) return {}
  const { t } = await getDictionary()
  return {
    title: `${level.name} — Oxford Discover`,
    description: t.meta.levelDescription(level.name, level.books.length),
  }
}

export default async function LevelPage({ params }: Params) {
  const { level: levelId } = await params
  const level = getLevel(levelId)
  if (!level) notFound()
  const { t } = await getDictionary()
  const meta = t.level.meta[level.id]

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pt-6 pb-16 md:px-8 md:pt-10">
        <div className="flex flex-col gap-6">
          <Link
            href="/"
            className="flex w-fit items-center gap-1 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft aria-hidden="true" className="size-4" />
            {t.level.allLevels}
          </Link>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-end gap-5">
              <span aria-hidden="true" className="font-serif text-8xl leading-none font-semibold tracking-tighter text-primary">
                {level.id}
              </span>
              <div className="flex flex-col gap-1 pb-1">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{meta.label}</p>
                <h1 className="font-serif text-2xl font-medium md:text-3xl">{level.name}</h1>
                <p className="text-sm text-muted-foreground">{t.level.booksWithAudio(level.books.length)}</p>
              </div>
            </div>
            <LevelSwitcher current={level.id} label={t.level.switcher} />
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {level.books.map((book, index) => (
            <li key={book.slug} className="animate-rise" style={{ animationDelay: `${index * 40}ms` }}>
              <BookCard levelId={level.id} book={book} index={index} />
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </>
  )
}
