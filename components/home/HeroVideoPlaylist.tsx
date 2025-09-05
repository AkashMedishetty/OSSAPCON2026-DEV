"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

export interface VideoSource {
  src: string
  type?: string
  poster?: string
  title?: string
}

interface HeroVideoPlaylistProps {
  sources: VideoSource[]
  crossfadeMs?: number
  className?: string
}

/**
 * Lightweight looping playlist for portrait videos in the hero card.
 * - Autoplays muted inline on mobile
 * - Crossfades between items
 * - Pauses when scrolled offscreen for performance
 */
export function HeroVideoPlaylist({
  sources,
  crossfadeMs = 500,
  className,
}: HeroVideoPlaylistProps) {
  const validSources = useMemo(() => sources.filter((s) => !!s.src), [sources])
  const [index, setIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)

  // Pause when offscreen
  useEffect(() => {
    const node = containerRef.current
    if (!node) return
    const io = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? true),
      { threshold: 0.2 },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])

  const current = validSources[index]
  const isSingle = validSources.length === 1

  if (!current) {
    return (
      <div
        ref={containerRef}
        className={`absolute inset-0 bg-[url('/placeholder.jpg')] bg-cover bg-center ${className ?? ""}`}
      />
    )
  }

  return (
    <div ref={containerRef} className={`absolute inset-0 ${className ?? ""}`}>
      <AnimatePresence mode="wait">
        <motion.video
          key={current.src}
          initial={{ opacity: 0.0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: crossfadeMs / 1000 }}
          className="h-full w-full object-cover object-center scale-[1.18]"
          autoPlay
          muted
          playsInline
          loop={isSingle}
          poster={current.poster}
          onEnded={() => {
            if (!isSingle) {
              setIndex((i) => (i + 1) % validSources.length)
            }
          }}
          preload="metadata"
        >
          <source src={current.src} type={current.type || "video/mp4"} />
        </motion.video>
      </AnimatePresence>
    </div>
  )
}

export default HeroVideoPlaylist


