'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ChevronLeft, Download } from 'lucide-react'
import { cdnUrl, proxyUrl, type Book, type LevelId } from '@/lib/data'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useLocale } from '@/components/locale-provider'
import { AudioPlayer } from './audio-player'
import { LoadingNotice } from './loading-notice'

function ReaderLoading() {
  const { t } = useLocale()
  return (
    <div className="flex flex-1 items-center justify-center bg-secondary/60 p-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-6">
        <LoadingNotice title={t.reader.preparing} message={t.reader.pleaseWait} />
      </div>
    </div>
  )
}

const PdfViewer = dynamic(() => import('./pdf-viewer').then((mod) => mod.PdfViewer), {
  ssr: false,
  loading: () => <ReaderLoading />,
})

type BookReaderProps = {
  levelId: LevelId
  book: Book
  position: number
  total: number
}

export function BookReader({ levelId, book, position, total }: BookReaderProps) {
  const { t } = useLocale()

  return (
    <div className="flex h-dvh flex-col bg-background">
      <header className="flex items-center gap-2 border-b bg-card px-2 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] md:px-4">
        <Link
          href={`/level/${levelId}`}
          aria-label={t.reader.backTo(levelId)}
          className="flex size-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ChevronLeft aria-hidden="true" className="size-5" />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="text-xs text-muted-foreground">
            Level {levelId} · {position} / {total}
          </p>
          <h1 className="truncate font-serif text-sm font-medium md:text-base">{book.title}</h1>
        </div>
        <a
          href={cdnUrl(book.pdfKey)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.reader.downloadPdf}
          className="flex size-10 shrink-0 items-center justify-center gap-2 rounded-lg border text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:w-auto sm:px-3"
        >
          <Download aria-hidden="true" className="size-4" />
          <span aria-hidden="true" className="hidden sm:inline">
            {t.reader.downloadPdf}
          </span>
        </a>
        <LanguageSwitcher />
      </header>

      <main className="flex min-h-0 flex-1 flex-col">
        <PdfViewer
          fileUrl={proxyUrl(book.pdfKey)}
          directUrl={cdnUrl(book.pdfKey)}
          sizeMb={book.pdfSizeMb}
          title={book.title}
        />
        <AudioPlayer src={cdnUrl(book.audioKey)} title={book.title} sizeMb={book.audioSizeMb} />
      </main>
    </div>
  )
}
