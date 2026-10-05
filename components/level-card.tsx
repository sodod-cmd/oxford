import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Level } from '@/lib/data'
import type { Dictionary } from '@/lib/i18n'

export function LevelCard({ level, t }: { level: Level; t: Dictionary }) {
  const meta = t.level.meta[level.id]

  return (
    <Link
      href={`/level/${level.id}`}
      aria-label={t.level.cardLabel(level.name, meta.label, level.books.length)}
      className="group flex h-full flex-col gap-8 rounded-2xl border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-xl hover:shadow-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 active:translate-y-0"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="relative font-serif text-7xl leading-none font-semibold tracking-tighter text-primary md:text-8xl">
          {level.id}
          <span aria-hidden="true" className="absolute -right-3 bottom-2 size-2.5 rounded-full bg-accent transition-transform group-hover:scale-150" />
        </span>
        <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border bg-muted shadow-sm transition-transform group-hover:-rotate-2 group-hover:scale-105 md:size-24">
          <Image
            src={`/covers/${level.id}cover.png`}
            alt=""
            fill
            sizes="(min-width: 768px) 96px, 80px"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{meta.label}</p>
        <h3 className="font-serif text-lg font-medium">{level.name}</h3>
        <p className="text-sm leading-relaxed text-pretty text-muted-foreground">{meta.description}</p>
        <p className="mt-2 flex items-center justify-between gap-2 border-t pt-3 text-sm font-medium text-foreground">
          {t.level.booksAndAudio(level.books.length)}
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
          />
        </p>
      </div>
    </Link>
  )
}
