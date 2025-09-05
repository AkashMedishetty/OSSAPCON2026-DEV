"use client"

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './Masonry.css'

type MasonryItem = {
  id: string
  img: string
  url?: string
  height: number
}

type MasonryProps = {
  items: MasonryItem[]
  ease?: string
  duration?: number
  stagger?: number
  animateFrom?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'random' | 'none'
  scaleOnHover?: boolean
  hoverScale?: number
  blurToFocus?: boolean
  colorShiftOnHover?: boolean
  preloadImagesEnabled?: boolean
  gutter?: number
  zigzagStart?: boolean
}

const useMedia = (queries: string[], values: number[], defaultValue: number) => {
  const get = () => {
    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
      return defaultValue
    }
    const idx = queries.findIndex(q => window.matchMedia(q).matches)
    return values[idx] ?? defaultValue
  }
  const [value, setValue] = useState<number>(get)
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') return
    const handler = () => setValue(get)
    const mqls = queries.map(q => window.matchMedia(q))
    mqls.forEach(mql => mql.addEventListener('change', handler))
    return () => mqls.forEach(mql => mql.removeEventListener('change', handler))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queries.join('|')])
  return value
}

const useMeasure = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  useLayoutEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  return [ref, size] as const
}

const preloadImages = async (urls: string[]) => {
  await Promise.all(
    urls.map(
      src =>
        new Promise<void>(resolve => {
          const img = new Image()
          img.src = src
          img.onload = img.onerror = () => resolve()
        })
    )
  )
}

const Masonry = ({
  items,
  ease = 'power3.out',
  duration = 0.4,
  stagger = 0.02,
  animateFrom = 'none',
  scaleOnHover = true,
  hoverScale = 0.97,
  blurToFocus = false,
  colorShiftOnHover = false,
  preloadImagesEnabled = false,
  gutter = 12,
  zigzagStart = false,
}: MasonryProps) => {
  // Favor wider items with fewer columns on desktop
  const columns = useMedia(
    ['(min-width:1600px)', '(min-width:1280px)', '(min-width:1024px)', '(min-width:768px)', '(min-width:480px)'],
    [3, 3, 3, 2, 2],
    2
  )

  const [containerRef, { width }] = useMeasure()
  const [imagesReady, setImagesReady] = useState(!preloadImagesEnabled)

  useEffect(() => {
    if (!preloadImagesEnabled) return
    preloadImages(items.map(i => i.img)).then(() => setImagesReady(true))
  }, [items, preloadImagesEnabled])

  const grid = useMemo(() => {
    if (!width) return [] as (MasonryItem & { x: number; y: number; w: number; h: number })[]
    const colHeights: number[] = Array.from({ length: columns }, (_, i) =>
      zigzagStart ? (i % 2 === 0 ? 40 : 0) : 0
    )
    const columnWidth = (width - gutter * (columns - 1)) / columns
    const laidOut = items.map((child) => {
      const col = colHeights.indexOf(Math.min(...colHeights))
      const x = (columnWidth + gutter) * col
      const h = child.height
      const y = colHeights[col]
      colHeights[col] += h + gutter
      return { ...child, x, y, w: columnWidth, h }
    })
    // Constrain total height to viewport (with small margin)
    const maxHeight = Math.max(...colHeights) - gutter
    const viewport = typeof window !== 'undefined' ? window.innerHeight - 100 : maxHeight
    const scale = maxHeight > 0 ? Math.min(1, viewport / maxHeight) : 1
    if (containerRef.current) {
      containerRef.current.style.height = `${Math.floor(maxHeight * scale)}px`
    }
    return laidOut.map(i => ({ ...i, y: i.y * scale, h: i.h * scale }))
  }, [columns, items, width, gutter])

  const hasMounted = useRef(false)

  const getInitialPosition = (item: { x: number; y: number; w: number; h: number }) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return { x: item.x, y: item.y }
    let direction = animateFrom
    if (animateFrom === 'random') {
      const dirs = ['top', 'bottom', 'left', 'right'] as const
      direction = dirs[Math.floor(Math.random() * dirs.length)]
    }
    switch (direction) {
      case 'top':
        return { x: item.x, y: -200 }
      case 'bottom':
        return { x: item.x, y: window.innerHeight + 200 }
      case 'left':
        return { x: -200, y: item.y }
      case 'right':
        return { x: window.innerWidth + 200, y: item.y }
      case 'center':
        return { x: rect.width / 2 - item.w / 2, y: rect.height / 2 - item.h / 2 }
      case 'none':
        return { x: item.x, y: item.y }
      default:
        return { x: item.x, y: item.y + 100 }
    }
  }

  useLayoutEffect(() => {
    if (!imagesReady) return
    grid.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`
      const toProps = { x: item.x, y: item.y, width: item.w, height: item.h }
      if (!hasMounted.current) {
        const fromPos = getInitialPosition(item)
        const fromProps: any = { opacity: 0.001, x: fromPos.x, y: fromPos.y, width: item.w, height: item.h }
        gsap.fromTo(selector, fromProps, {
          opacity: 1,
          ...toProps,
          duration,
          ease: 'power3.out',
          delay: index * stagger,
        })
      } else {
        gsap.to(selector, { ...toProps, duration, ease, overwrite: 'auto' })
      }
    })
    hasMounted.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease])

  const onEnter = (id: string, el: HTMLElement) => {
    if (scaleOnHover) gsap.to(`[data-key="${id}"]`, { scale: hoverScale, duration: 0.25, ease: 'power2.out' })
    if (colorShiftOnHover) {
      const overlay = el.querySelector('.color-overlay') as HTMLElement | null
      if (overlay) gsap.to(overlay, { opacity: 0.3, duration: 0.25 })
    }
  }
  const onLeave = (id: string, el: HTMLElement) => {
    if (scaleOnHover) gsap.to(`[data-key="${id}"]`, { scale: 1, duration: 0.25, ease: 'power2.out' })
    if (colorShiftOnHover) {
      const overlay = el.querySelector('.color-overlay') as HTMLElement | null
      if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.25 })
    }
  }

  return (
    <div ref={containerRef} className="list">
      {grid.map(item => (
        <div
          key={item.id}
          data-key={item.id}
          className="item-wrapper"
          onClick={() => item.url && window.open(item.url, '_blank', 'noopener')}
          onMouseEnter={e => onEnter(item.id, e.currentTarget)}
          onMouseLeave={e => onLeave(item.id, e.currentTarget)}
        >
          <div className="item-img">
            <img src={item.img} alt="" loading="eager" decoding="async" draggable={false} />
            {colorShiftOnHover && <div className="color-overlay" />}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Masonry


