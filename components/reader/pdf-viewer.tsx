'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { ChevronLeft, ChevronRight, ExternalLink, Minus, Plus, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLocale } from '@/components/locale-provider'
import { LoadingNotice } from './loading-notice'

// Must be set in the same module that renders <Document>.
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

const MIN_ZOOM = 1
const MAX_ZOOM = 2.5
const ZOOM_STEP = 0.25
const MAX_PAGE_WIDTH = 1100

type PdfViewerProps = {
  fileUrl: string
  directUrl: string
  sizeMb: number
  title: string
}

export function PdfViewer({ fileUrl, directUrl, sizeMb, title }: PdfViewerProps) {
  const { t } = useLocale()
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [numPages, setNumPages] = useState(0)
  const [page, setPage] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [progress, setProgress] = useState<{ loaded: number; total: number }>({ loaded: 0, total: 0 })
  const [pageRendering, setPageRendering] = useState(true)
  const [attempt, setAttempt] = useState(0)
  const touchStartX = useRef<number | null>(null)

  const file = useMemo(() => ({ url: fileUrl }), [fileUrl, attempt]) // eslint-disable-line react-hooks/exhaustive-deps
  const options = useMemo(() => ({ disableAutoFetch: true, disableStream: false }), [])
  const devicePixelRatio = typeof window === 'undefined' ? 1 : Math.min(2, window.devicePixelRatio || 1)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const goTo = useCallback(
    (next: number) => {
      if (!numPages) return
      const clamped = Math.min(numPages, Math.max(1, next))
      if (clamped === page) return
      setPageRendering(true)
      setPage(clamped)
      containerRef.current?.scrollTo({ top: 0, left: 0 })
    },
    [numPages, page],
  )

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
      if (event.key === 'ArrowRight') goTo(page + 1)
      if (event.key === 'ArrowLeft') goTo(page - 1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goTo, page])

  const pageWidth = containerWidth ? Math.min(containerWidth - 24, MAX_PAGE_WIDTH) * zoom : undefined
  const progressRatio = progress.total > 0 ? progress.loaded / progress.total : undefined
  const loadedMb = (progress.loaded / 1_000_000).toFixed(1)
  const totalMb = progress.total > 0 ? (progress.total / 1_000_000).toFixed(1) : sizeMb.toFixed(1)

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        ref={containerRef}
        className="relative min-h-0 flex-1 overflow-auto overscroll-contain bg-secondary/60"
        onTouchStart={(event) => {
          touchStartX.current = zoom === 1 ? event.touches[0].clientX : null
        }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null) return
          const deltaX = event.changedTouches[0].clientX - touchStartX.current
          touchStartX.current = null
          if (Math.abs(deltaX) > 60) goTo(deltaX < 0 ? page + 1 : page - 1)
        }}
      >
        {status === 'loading' && (
          <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl shadow-primary/5">
              <LoadingNotice
                title={t.reader.loadingBook}
                message={t.reader.loadingBookMessage(sizeMb.toFixed(1))}
                progress={progressRatio}
                detail={progress.loaded > 0 ? t.reader.downloaded(loadedMb, totalMb) : t.reader.connecting}
              />
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
            <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl border bg-card p-6 text-center">
              <p className="font-medium">{t.reader.loadFailed}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t.reader.loadFailedMessage}
              </p>
              <div className="flex flex-col justify-center gap-2 sm:flex-row">
                <Button
                  onClick={() => {
                    setStatus('loading')
                    setProgress({ loaded: 0, total: 0 })
                    setAttempt((value) => value + 1)
                  }}
                >
                  <RotateCw aria-hidden="true" />
                  {t.reader.retry}
                </Button>
                <Button variant="outline" nativeButton={false} render={<a href={directUrl} target="_blank" rel="noopener noreferrer" />}>
                  <ExternalLink aria-hidden="true" />
                  {t.reader.openDirect}
                </Button>
              </div>
            </div>
          </div>
        )}

        <Document
          key={attempt}
          file={file}
          options={options}
          loading={null}
          error={null}
          onLoadProgress={({ loaded, total }) => setProgress({ loaded, total })}
          onLoadSuccess={(pdf) => {
            setNumPages(pdf.numPages)
            setStatus('ready')
          }}
          onLoadError={() => setStatus('error')}
          className="flex min-h-full w-fit min-w-full justify-center p-3"
        >
          {status === 'ready' && pageWidth && (
            <div className="relative h-fit">
              <Page
                key={page}
                pageNumber={page}
                width={pageWidth}
                devicePixelRatio={devicePixelRatio}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                loading={<div style={{ width: pageWidth, height: pageWidth * 1.3 }} className="rounded-sm bg-card" />}
                onRenderSuccess={() => setPageRendering(false)}
                onRenderError={() => setPageRendering(false)}
                className="overflow-hidden rounded-sm bg-card shadow-lg shadow-foreground/10"
              />
              {pageRendering && (
                <div className="absolute inset-x-0 top-6 flex justify-center px-4">
                  <div className="w-full max-w-xs rounded-xl border bg-card/95 p-4 shadow-lg backdrop-blur">
                    <LoadingNotice compact title={t.reader.preparingPage(page)} message={t.reader.pleaseWait} />
                  </div>
                </div>
              )}
            </div>
          )}
        </Document>
      </div>

      <div className="flex items-center justify-between gap-2 border-t bg-card px-3 py-2">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-10"
            aria-label={t.reader.zoomOut}
            disabled={status !== 'ready' || zoom <= MIN_ZOOM}
            onClick={() => setZoom((value) => Math.max(MIN_ZOOM, value - ZOOM_STEP))}
          >
            <Minus aria-hidden="true" />
          </Button>
          <span className="w-12 text-center text-xs tabular-nums text-muted-foreground">{Math.round(zoom * 100)}%</span>
          <Button
            variant="outline"
            size="icon"
            className="size-10"
            aria-label={t.reader.zoomIn}
            disabled={status !== 'ready' || zoom >= MAX_ZOOM}
            onClick={() => setZoom((value) => Math.min(MAX_ZOOM, value + ZOOM_STEP))}
          >
            <Plus aria-hidden="true" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="size-10"
            aria-label={t.reader.prevPage}
            disabled={status !== 'ready' || page <= 1}
            onClick={() => goTo(page - 1)}
          >
            <ChevronLeft aria-hidden="true" />
          </Button>
          <p className="min-w-16 text-center text-sm tabular-nums" aria-live="polite">
            <span className="sr-only">{t.reader.pageOf(title)}</span>
            <span className="font-medium">{status === 'ready' ? page : '–'}</span>
            <span className="text-muted-foreground"> / {numPages || '–'}</span>
          </p>
          <Button
            size="icon"
            className="size-10"
            aria-label={t.reader.nextPage}
            disabled={status !== 'ready' || page >= numPages}
            onClick={() => goTo(page + 1)}
          >
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}
