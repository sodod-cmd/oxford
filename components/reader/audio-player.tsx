'use client'

import { useEffect, useRef, useState } from 'react'
import { Headphones, Loader2, Pause, Play, RotateCcw, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useLocale } from '@/components/locale-provider'
import { LoadingNotice } from './loading-notice'

const SPEEDS = [0.75, 1, 1.25, 1.5]

type AudioStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'buffering' | 'error'

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const rest = Math.floor(seconds % 60)
  return `${minutes}:${rest.toString().padStart(2, '0')}`
}

export function AudioPlayer({ src, title, sizeMb }: { src: string; title: string; sizeMb: number }) {
  const { t } = useLocale()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [status, setStatus] = useState<AudioStatus>('idle')
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [speed, setSpeed] = useState(1)

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed
  }, [speed])

  // Metadata can arrive before hydration attaches the media event handlers.
  useEffect(() => {
    const audio = audioRef.current
    if (audio && audio.readyState >= 1 && Number.isFinite(audio.duration)) setDuration(audio.duration)
  }, [])

  function updateBuffered() {
    const audio = audioRef.current
    if (!audio || !audio.duration || audio.buffered.length === 0) return
    let end = 0
    for (let i = 0; i < audio.buffered.length; i++) {
      if (audio.buffered.start(i) <= audio.currentTime + 0.5) end = Math.max(end, audio.buffered.end(i))
    }
    setBuffered(end / audio.duration)
  }

  async function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (status === 'playing' || status === 'buffering') {
      audio.pause()
      return
    }
    if (status === 'error') audio.load()
    if (audio.readyState < 3) setStatus('loading')
    try {
      await audio.play()
    } catch (error) {
      if ((error as DOMException).name !== 'AbortError') setStatus('error')
    }
  }

  function skip(seconds: number) {
    const audio = audioRef.current
    if (!audio || !duration) return
    audio.currentTime = Math.min(duration, Math.max(0, audio.currentTime + seconds))
  }

  const isWaiting = status === 'loading' || status === 'buffering'
  const isPlaying = status === 'playing' || status === 'buffering'
  const playedPercent = duration ? (current / duration) * 100 : 0

  return (
    <section aria-label={t.audio.section} className="flex flex-col gap-3 border-t bg-card px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-5">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onDurationChange={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => {
          setCurrent(event.currentTarget.currentTime)
          updateBuffered()
        }}
        onProgress={updateBuffered}
        onPlaying={() => setStatus('playing')}
        onPause={() => setStatus('paused')}
        onWaiting={() => setStatus((value) => (value === 'loading' ? 'loading' : 'buffering'))}
        onEnded={() => setStatus('paused')}
        onError={() => setStatus('error')}
      />

      {isWaiting && (
        <LoadingNotice
          compact
          title={status === 'loading' ? t.audio.loading : t.audio.buffering}
          message={t.audio.loadingMessage(sizeMb.toFixed(1))}
          progress={buffered > 0 ? buffered : undefined}
          className="rounded-xl bg-secondary/60 p-3"
        />
      )}

      {status === 'error' && (
        <p role="alert" className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
          {t.audio.error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button
          size="icon"
          className="size-12 shrink-0 rounded-full"
          aria-label={isPlaying ? t.audio.pause : t.audio.play}
          onClick={togglePlay}
        >
          {status === 'loading' ? (
            <Loader2 aria-hidden="true" className="size-5 animate-spin" />
          ) : isPlaying ? (
            <Pause aria-hidden="true" className="size-5" />
          ) : (
            <Play aria-hidden="true" className="size-5 translate-x-px" />
          )}
        </Button>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex items-center justify-between gap-3">
            <p className="flex min-w-0 items-center gap-1.5 truncate text-sm font-medium">
              <Headphones aria-hidden="true" className="size-4 shrink-0 text-primary" />
              <span className="truncate">{title}</span>
            </p>
            <p className="shrink-0 text-xs tabular-nums text-muted-foreground">
              {formatTime(current)} / {formatTime(duration)}
            </p>
          </div>

          <div className="relative flex h-5 items-center">
            <div aria-hidden="true" className="absolute inset-x-0 h-1.5 overflow-hidden rounded-full bg-secondary">
              <div className="absolute inset-y-0 left-0 bg-primary/20 transition-[width]" style={{ width: `${buffered * 100}%` }} />
              <div className="absolute inset-y-0 left-0 bg-primary" style={{ width: `${playedPercent}%` }} />
            </div>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={current}
              disabled={!duration}
              aria-label={t.audio.position}
              aria-valuetext={`${formatTime(current)} / ${formatTime(duration)}`}
              onChange={(event) => {
                const audio = audioRef.current
                if (!audio) return
                audio.currentTime = Number(event.target.value)
                setCurrent(audio.currentTime)
              }}
              className="audio-range relative w-full cursor-pointer appearance-none bg-transparent disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-9" onClick={() => skip(-10)} disabled={!duration} aria-label={t.audio.back10}>
            <RotateCcw aria-hidden="true" />
            10{t.audio.seconds}
          </Button>
          <Button variant="ghost" size="sm" className="h-9" onClick={() => skip(10)} disabled={!duration} aria-label={t.audio.forward10}>
            <RotateCw aria-hidden="true" />
            10{t.audio.seconds}
          </Button>
        </div>
        <div role="group" aria-label={t.audio.speed} className="flex items-center gap-0.5 rounded-lg bg-secondary p-0.5">
          {SPEEDS.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={speed === value}
              onClick={() => setSpeed(value)}
              className={cn(
                'h-8 rounded-md px-2 text-xs font-medium tabular-nums transition-colors',
                speed === value ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {value}×
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
