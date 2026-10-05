import { getDictionary } from '@/lib/locale-server'

export async function SiteFooter() {
  const { t } = await getDictionary()

  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between md:px-8">
        <p className="font-medium text-foreground">Nest Education IT School</p>
        <p>
          © {new Date().getFullYear()} · {t.footer.rights}
        </p>
      </div>
    </footer>
  )
}
