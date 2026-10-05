'use client'

import { createContext, useContext } from 'react'
import { dictionaries, type Locale } from '@/lib/i18n'

const LocaleContext = createContext<Locale>('en')

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const locale = useContext(LocaleContext)
  return { locale, t: dictionaries[locale] }
}
