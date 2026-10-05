import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { LevelCard } from '@/components/level-card'
import { levels } from '@/lib/data'
import { getDictionary } from '@/lib/locale-server'

export default async function HomePage() {
  const { t } = await getDictionary()
  const totalBooks = levels.reduce((sum, level) => sum + level.books.length, 0)

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pt-10 pb-16 md:gap-14 md:px-8 md:pt-16">
        <section className="flex animate-rise flex-col gap-5" aria-labelledby="hero-title">
          <p className="text-sm font-medium tracking-wide text-primary uppercase">{t.home.eyebrow}</p>
          <h1 id="hero-title" className="max-w-3xl font-serif text-3xl leading-tight font-medium tracking-tight text-balance md:text-5xl">
            {t.home.title}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground md:text-lg">
            {t.home.intro(totalBooks)}
          </p>
        </section>

        <section aria-labelledby="levels-title" className="flex flex-col gap-5">
          <h2 id="levels-title" className="text-sm font-medium text-muted-foreground">
            {t.home.chooseLevel}
          </h2>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {levels.map((level, index) => (
              <li key={level.id} className="animate-rise" style={{ animationDelay: `${120 + index * 80}ms` }}>
                <LevelCard level={level} t={t} />
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
