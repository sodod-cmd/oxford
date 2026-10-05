import { cn } from '@/lib/utils'

type LoadingNoticeProps = {
  title: string
  message: string
  /** 0–1. Undefined renders an indeterminate bar. */
  progress?: number
  detail?: string
  className?: string
  compact?: boolean
}

export function LoadingNotice({ title, message, progress, detail, className, compact }: LoadingNoticeProps) {
  const percent = progress === undefined ? undefined : Math.round(Math.min(1, Math.max(0, progress)) * 100)

  return (
    <div role="status" aria-live="polite" className={cn('flex w-full flex-col gap-3', className)}>
      <div className={cn('flex items-start gap-3', compact && 'items-center')}>
        <span aria-hidden="true" className="relative mt-1 flex size-3 shrink-0">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75 motion-reduce:animate-none" />
          <span className="relative inline-flex size-3 rounded-full bg-accent" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className={cn('font-medium text-foreground', compact ? 'text-sm' : 'text-base')}>{title}</p>
          <p className={cn('leading-relaxed text-pretty text-muted-foreground', compact ? 'text-xs' : 'text-sm')}>{message}</p>
        </div>
        {percent !== undefined && (
          <span className="font-serif text-sm font-medium tabular-nums text-primary">{percent}%</span>
        )}
      </div>

      <div
        className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary"
        role="progressbar"
        aria-label={title}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        {percent === undefined ? (
          <div className="animate-indeterminate absolute inset-y-0 w-2/5 rounded-full bg-primary" />
        ) : (
          <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${percent}%` }} />
        )}
      </div>

      {detail && <p className="text-xs tabular-nums text-muted-foreground">{detail}</p>}
    </div>
  )
}
