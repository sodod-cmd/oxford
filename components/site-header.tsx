import Link from 'next/link'
import { LanguageSwitcher } from './language-switcher'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-8">
        <Link
          href="/"
          className="rounded-md font-serif text-base font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 md:text-lg"
        >
          Oxford Discover <span className="text-primary">3–6</span>
        </Link>
        <LanguageSwitcher />
      </div>
    </header>
  )
}
