import Link from 'next/link'
import { cn } from '@/lib/utils'
import { levels, type LevelId } from '@/lib/data'

export function LevelSwitcher({ current, label }: { current: LevelId; label: string }) {
  return (
    <nav aria-label={label} className="flex w-fit gap-1 rounded-xl border bg-card p-1">
      {levels.map((level) => {
        const active = level.id === current
        return (
          <Link
            key={level.id}
            href={`/level/${level.id}`}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex h-10 min-w-12 items-center justify-center rounded-lg px-3 font-serif text-sm font-medium transition-colors',
              active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
            )}
          >
            <span className="sr-only">Level </span>
            {level.id}
          </Link>
        )
      })}
    </nav>
  )
}
