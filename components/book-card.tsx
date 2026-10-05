import Link from 'next/link'
import { BookOpen, Headphones } from 'lucide-react'
import type { Book, LevelId } from '@/lib/data'

export function BookCard({ levelId, book, index }: { levelId: LevelId; book: Book; index: number }) {
  return (
    <Link
      href={`/level/${levelId}/${book.slug}`}
      className="group flex h-full items-stretch gap-4 rounded-xl border bg-card p-4 transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <div
        aria-hidden="true"
        className="relative flex w-16 shrink-0 flex-col justify-between overflow-hidden rounded-md bg-primary p-2 text-primary-foreground shadow-sm"
      >
        <span className="absolute inset-y-0 left-0 w-1.5 bg-accent" />
        <span className="pl-1.5 font-serif text-xs font-medium opacity-80">L{levelId}</span>
        <span className="pl-1.5 font-serif text-2xl leading-none font-semibold">{String(index + 1)}</span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 py-0.5">
        <h2 className="font-medium leading-snug text-pretty group-hover:text-primary">{book.title}</h2>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BookOpen aria-hidden="true" className="size-3.5" />
            PDF · {book.pdfSizeMb.toFixed(1)} MB
          </span>
          <span className="flex items-center gap-1.5">
            <Headphones aria-hidden="true" className="size-3.5" />
            MP3 · {book.audioSizeMb.toFixed(1)} MB
          </span>
        </div>
      </div>
    </Link>
  )
}
