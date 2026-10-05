'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LOCALE_COOKIE, locales, type Locale } from '@/lib/i18n'
import { useLocale } from './locale-provider'

const shortLabels: Record<Locale, string> = { en: 'EN', mn: 'MN' }

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, t } = useLocale()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function change(next: Locale) {
    if (next === locale) return
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`
    startTransition(() => router.refresh())
  }

  return (
    <div
      role="group"
      aria-label={t.language.label}
      aria-busy={isPending}
      className={cn('flex shrink-0 items-center gap-0.5 rounded-lg border bg-card p-0.5', isPending && 'opacity-70', className)}
    >
      {locales.map((value) => {
        const active = value === locale
        return (
          <button
            key={value}
            type="button"
            lang={value}
            aria-pressed={active}
            aria-label={t.language[value]}
            onClick={() => change(value)}
            className={cn(
              'h-8 min-w-10 rounded-md px-2 text-xs font-semibold tracking-wide transition-colors',
              active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
            )}
          >
            {shortLabels[value]}
          </button>
        )
      })}
    </div>
  )
}
