"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type AnimatedGridPatternProps = {
  className?: string
  width?: number
  height?: number
  x?: number
  y?: number
  strokeDasharray?: number
  strokeOpacity?: number
  numSquares?: number
  maxOpacity?: number
  duration?: number
  repeatDelay?: number
}

export function AnimatedGridPattern({
  className,
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  strokeOpacity = 0.15,
  numSquares = 200,
  maxOpacity = 0.5,
  duration = 1,
  repeatDelay = 0.5,
}: AnimatedGridPatternProps) {
  const squares = Array.from({ length: numSquares })
  return (
    <svg
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    >
      <defs>
        <pattern id="grid" width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
          <path d={`M ${width} 0 L 0 0 0 ${height}`} fill="none" stroke="currentColor" strokeOpacity={strokeOpacity} strokeWidth="1" strokeDasharray={strokeDasharray} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      <g color="currentColor">
        {squares.map((_, i) => (
          <motion.rect
            key={i}
            width={8}
            height={8}
            rx={2}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, maxOpacity, 0] }}
            transition={{ duration, repeat: Infinity, repeatDelay, delay: (i % 20) * 0.05 }}
            x={(i * 37) % 1200}
            y={Math.floor((i * 37) / 1200) * 60}
            className="text-white/20 dark:text-white/10"
          />
        ))}
      </g>
    </svg>
  )
}

export default AnimatedGridPattern


