"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion, useInView, useMotionValue, useSpring } from "framer-motion"
import { MapPin, Calendar, Users, Clock, Award, Stethoscope, BookOpen, Timer, UserCheck } from "lucide-react"
// Removed animated grid background to simplify glass card
import { Badge } from "@/components/ui/badge"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

interface StatItemProps {
  value: number
  suffix: string
  label: string
  delay?: number
  duration?: number
}

function AnimatedCounter({ value, suffix, label, delay = 0, duration = 2 }: StatItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { 
    damping: 60, 
    stiffness: 100,
    duration: duration * 1000 
  })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        motionValue.set(value)
      }, delay * 1000)
      return () => clearTimeout(timer)
    }
  }, [isInView, motionValue, value, delay])

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Math.round(latest))
    })
    return unsubscribe
  }, [springValue])

        return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: delay + 0.2 }}
      className="text-center"
    >
      <div className="text-2xl sm:text-4xl lg:text-6xl font-bold text-white mb-1 sm:mb-2 drop-shadow-lg">
        {displayValue}{suffix}
      </div>
      <div className="text-xs sm:text-sm lg:text-base text-white/90 font-semibold">
        {label}
      </div>
    </motion.div>
  )
}

// Countdown Timer Component
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const conferenceDate = new Date('2026-02-04T09:00:00')
    
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = conferenceDate.getTime() - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="grid grid-cols-4 gap-2 sm:gap-3 w-full"
    >
      {[
        { value: timeLeft.days, label: 'Days' },
        { value: timeLeft.hours, label: 'Hrs' },
        { value: timeLeft.minutes, label: 'Min' },
        { value: timeLeft.seconds, label: 'Sec' }
      ].map((item, index) => (
        <div key={index} className="text-center">
          <motion.div 
            className="bg-white/15 backdrop-blur-md rounded-xl sm:rounded-2xl p-2 sm:p-5 border border-white/30 hover:bg-white/20 hover:border-white/40 transition-all duration-300 shadow-2xl hover:shadow-3xl"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.25)"
            }}
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg">
              {item.value.toString().padStart(2, '0')}
            </div>
            <div className="text-xs sm:text-sm text-white/90 font-semibold">
              {item.label}
            </div>
          </motion.div>
        </div>
      ))}
    </motion.div>
  )
}

// Quick Info Cards Component
function QuickInfoCards() {
  const infoCards = [
    {
      icon: MapPin,
      title: "Venue",
      content: "Kurnool Medical College",
      detail: "Department of Orthopaedics, Kurnool"
    },
    {
      icon: Calendar,
      title: "Dates",
      content: "Feb 4–6, 2026",
      detail: "3 days of intensive learning"
    },
    {
      icon: UserCheck,
      title: "Registration",
      content: "Early Bird Open",
      detail: "Limited seats available"
    }
  ]

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full">
      {infoCards.map((card, index) => (
        <HoverCard key={index}>
          <HoverCardTrigger asChild>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 cursor-pointer group shadow-2xl hover:shadow-3xl hover:scale-105"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)"
              }}
            >
              <card.icon className="w-4 h-4 sm:w-7 sm:h-7 text-white/90 mb-2 sm:mb-4 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
              <div className="text-xs sm:text-base font-bold text-white/95 mb-1 sm:mb-3 group-hover:text-white transition-colors">{card.title}</div>
              <div className="text-xs sm:text-sm text-white/80 font-medium group-hover:text-white/90 transition-colors leading-tight">{card.content}</div>
            </motion.div>
          </HoverCardTrigger>
          <HoverCardContent className="w-72 bg-black/95 backdrop-blur-xl border-white/30 shadow-2xl">
            <div className="flex items-center space-x-3">
              <card.icon className="w-5 h-5 text-white/90" />
              <div>
                <p className="text-base font-semibold text-white">{card.title}</p>
                <p className="text-sm text-white/80">{card.detail}</p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  )
}

export function ConferenceStats() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true })

  const stats = [
    { value: 300, suffix: "+", label: "Attendees", delay: 0 },
    { value: 50, suffix: "+", label: "Speakers", delay: 0.3 },
    { value: 3, suffix: "", label: "Days", delay: 0.6 },
  ]

  const badges = [
    { text: "CME Credits", icon: Award, color: "bg-white text-emerald-700 border-emerald-200" },
    { text: "Live Surgery", icon: Stethoscope, color: "bg-white text-red-700 border-red-200" },
    { text: "Workshops", icon: BookOpen, color: "bg-white text-blue-700 border-blue-200" },
  ]

  return (
    <div ref={containerRef} className="relative w-full h-full flex flex-col items-center justify-center sm:justify-between p-2 sm:p-4 overflow-hidden">


      {/* Top Section: Badges + Stats */}
      <div className="flex flex-col items-center w-full mb-4 sm:mb-0">
        {/* Conference Highlights Badges */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-3 sm:mb-6"
        >
          {badges.map((badge, index) => (
            <Badge
              key={index}
              variant="outline"
              className={`text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold ${badge.color}`}
              style={{
                boxShadow: "0 4px 16px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)"
              }}
            >
              <badge.icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              {badge.text}
            </Badge>
          ))}
        </motion.div>

        {/* Stats Grid */}
        <div className="relative z-10 grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-lg">
          {stats.map((stat, index) => (
            <div key={index}>
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                delay={stat.delay}
                duration={2}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Middle Section: Countdown Timer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="w-full flex flex-col items-center mb-4 sm:mb-0"
      >
        <div className="text-center mb-2 sm:mb-3">
          <motion.div 
            className="inline-flex items-center justify-center gap-1 sm:gap-2 bg-white/15 backdrop-blur-md rounded-xl sm:rounded-2xl px-3 sm:px-6 py-2 sm:py-3 border border-white/25 shadow-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)"
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-white/95" />
            <span className="font-bold text-sm sm:text-base text-white/95">Conference Starts In</span>
          </motion.div>
        </div>
        <CountdownTimer />
      </motion.div>

      {/* Bottom Section: Quick Info Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="w-full max-w-lg"
      >
        <QuickInfoCards />
      </motion.div>

      {/* Decorative orbs removed for a static glass card */}
    </div>
  )
}

export default ConferenceStats