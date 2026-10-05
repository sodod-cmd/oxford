import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Montserrat, Onest } from 'next/font/google'
import { LocaleProvider } from '@/components/locale-provider'
import { getDictionary, getLocale } from '@/lib/locale-server'
import './globals.css'

const onest = Onest({ subsets: ['latin', 'cyrillic', 'cyrillic-ext'], variable: '--font-onest' })
// Montserrat covers the Mongolian Cyrillic letters ө and ү.
const unbounded = Montserrat({ subsets: ['latin', 'cyrillic', 'cyrillic-ext'], variable: '--font-unbounded' })

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDictionary()
  return {
    title: t.meta.title,
    description: t.meta.description,
    generator: 'v0.app',
    icons: {
      icon: [
        { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
        { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      apple: '/apple-icon.png',
    },
  }
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f4f6f9',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  return (
    <html lang={locale} className={`${onest.variable} ${unbounded.variable} bg-background`}>
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
