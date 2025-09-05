"use client"

import React, { useState, useEffect, useRef, useMemo } from "react"
import { useTheme } from "next-themes"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence, useMotionValue } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Calendar, MapPin, Users, Award, Play, Sparkles, ArrowRight, Clock, Star, Globe, Heart, Stethoscope, BookOpen, Trophy, Zap, Shield, Target, Microscope, Brain, Activity, Navigation as NavigationIcon, ExternalLink, Phone, ChevronRight, ChevronLeft, Plus, CheckCircle, Timer, TrendingUp, Award as AwardIcon, UserCheck, BookMarked, Video, Headphones, Camera, Wifi, Sun, Menu, X } from "lucide-react"
import Link from "next/link"
import Masonry from "@/components/Masonry"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import dynamic from "next/dynamic"
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern"
import Footer from "@/components/Footer"
const HeroVideoPlaylist = dynamic(() => import("@/components/home/HeroVideoPlaylist").then(m => m.HeroVideoPlaylist), { ssr: false })
const ConferenceStats = dynamic(() => import("@/components/hero/ConferenceStats"), { ssr: false })
import { GridBeams } from "@/components/magicui/grid-beams"
import { getCurrentTier, getTierSummary } from "@/lib/registration"


// Lazy load 3D components for better performance

const SpineModel = dynamic(() => import("@/components/3d/SpineModel"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-emerald-100/60 via-emerald-50/40 to-emerald-200/30 rounded-3xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 border-t-2 border-t-transparent"></div>
        <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border border-emerald-300 opacity-20"></div>
      </div>
      <div className="absolute bottom-4 text-sm text-emerald-600 font-medium animate-pulse">Loading Spine Model...</div>
    </div>
  )
})





export default function HomePage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [activeFeature, setActiveFeature] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentSpeaker, setCurrentSpeaker] = useState(0)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const { theme, setTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const heroRef = useRef<HTMLDivElement>(null)

  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 800], [0, -200])
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])

  useEffect(() => {
    const targetDate = new Date("2026-02-06T09:00:00").getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        gsap.registerPlugin(ScrollTrigger)
        const sections = document.querySelectorAll('.snap-sec')
        sections.forEach((sec) => {
          ScrollTrigger.create({
            trigger: sec as Element,
            start: 'top top',
            end: 'bottom top',
            scrub: false,
            snap: { snapTo: 1, duration: 0.4, ease: 'power1.inOut' }
          })
        })
      } catch (_) {}
    }
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      const xPos = (clientX / innerWidth - 0.5) * 2
      const yPos = (clientY / innerHeight - 0.5) * 2
      setMousePosition({ x: xPos, y: yPos })
      x.set(xPos * 20)
      y.set(yPos * 20)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [x, y])

  const handleLearnMore = (place: any) => {
    setSelectedLocation(place)
    setIsModalOpen(true)
  }

  const handleGetDirections = (placeName: string) => {
    const query = encodeURIComponent(`${placeName} Kurnool Andhra Pradesh`)
    window.open(`https://www.google.com/maps/search/${query}`, '_blank')
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedLocation(null)
  }

  // Registration tier logic (centralized)
  const now = new Date()
  const currentTier = getCurrentTier(now)
  const tierSummary = getTierSummary(now)

  // Responsive check for masonry items (mobile shows 4 only)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const masonryItems = [
    { id: "1", img: "/belum.png", height: 360 },
    { id: "2", img: "/kurnoolfort.png", height: 320 },
    { id: "3", img: "/Tugabadhra.png", height: 420 },
    { id: "4", img: "/alampur.png", height: 300 },
    { id: "5", img: "/kurnoolcollege.png", height: 280 },
    { id: "6", img: "/ms1.jpg", height: 360 },
    { id: "7", img: "/ms2.jpg", height: 320 },
    { id: "8", img: "/ms3.jpg", height: 360 }
  ]

  // Featured speakers data
  const featuredSpeakers = [
    {
      name: "Dr. Sarah Chen",
      title: "Chief of Orthopedic Surgery",
      hospital: "Johns Hopkins Hospital",
      specialty: "Spine Surgery",
      image: "/placeholder-user.jpg",
      color: "from-pink-500 to-rose-500"
    },
    {
      name: "Dr. Michael Rodriguez",
      title: "Director of Sports Medicine",
      hospital: "Mayo Clinic",
      specialty: "Sports Medicine",
      image: "/placeholder-user.jpg",
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Dr. Priya Sharma",
      title: "Head of Joint Replacement",
      hospital: "Cleveland Clinic",
      specialty: "Joint Arthroplasty",
      image: "/placeholder-user.jpg",
      color: "from-emerald-500 to-teal-500"
    },
    {
      name: "Dr. James Wilson",
      title: "Trauma Surgery Specialist",
      hospital: "Massachusetts General",
      specialty: "Trauma Surgery",
      image: "/placeholder-user.jpg",
      color: "from-purple-500 to-violet-500"
    }
  ]

  // Conference features with modern icons
  const conferenceFeatures = [
    {
      icon: Brain,
      title: "Advanced Learning",
      description: "Latest surgical techniques and medical innovations",
      color: "from-blue-500 to-cyan-500",
      stats: "25+ Sessions"
    },
    {
      icon: Users,
      title: "Expert Network",
      description: "Connect with leading orthopedic surgeons",
      color: "from-emerald-500 to-teal-500",
      stats: "50+ Speakers"
    },
    {
      icon: Trophy,
      title: "CME Credits",
      description: "Earn continuing medical education credits",
      color: "from-purple-500 to-violet-500",
      stats: "15 Credits"
    },
    {
      icon: Target,
      title: "Hands-on Workshops",
      description: "Practical skills and live demonstrations",
      color: "from-pink-500 to-rose-500",
      stats: "8 Workshops"
    }
  ]

  return (
    <div className="min-h-screen bg-white text-midnight-900 overflow-visible scroll-smooth snap-y snap-mandatory">
      {/* Navigation hidden on hero section - integrated into gradient */}
      <div className="hidden">
      <Navigation currentPage="home" />
      </div>

      {/* Hero Section - Pixel-accurate redesign with 70/30 layout */}
      <section className="relative w-full px-0 md:px-6 pt-0 md:pt-6 pb-0 md:pb-6">
        {/* Grid: Left 70% gradient canvas, Right 30% content column (desktop) */}
        <div className="grid grid-cols-1 xl:grid-cols-[70%_30%] gap-4 md:gap-6">
          {/* LEFT: Gradient Canvas */}
          <div className="relative rounded-none md:rounded-3xl overflow-hidden min-h-[78svh]">
            {/* Theme gradient (ocean/sapphire) */}
            <div className="absolute inset-0 bg-gradient-to-br from-ocean-500 via-sapphire-600 to-sapphire-900" />
            {/* Soft vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(14,165,233,0.18),transparent_60%)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-sapphire-950/30 to-transparent" />

            {/* Top micro-nav bar inside gradient */}
            <div className="relative z-50 px-5 sm:px-6 pt-4">
              <div className="mx-auto rounded-full bg-white/10 border border-white/25 backdrop-blur-xl shadow-glass ring-1 ring-white/20 px-4 sm:px-6 py-3 w-full max-w-7xl">
                {/* Mobile bar */}
                <div className="flex items-center justify-between md:hidden">
                  <button onClick={() => setIsMobileMenuOpen((v) => !v)} className="w-10 h-10 rounded-full bg-white/80 text-midnight-800 border border-white/60 inline-flex items-center justify-center">
                    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                  <span className="text-sm font-bold text-white drop-shadow">OSSAPCON 2026</span>
                  <a href="/register" className="rounded-full bg-midnight-900 text-white text-sm px-4 py-1.5 border border-black/5">Register</a>
                </div>
                {/* Desktop bar */}
                <div className="hidden md:flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-white drop-shadow">OSSAPCON 2026</span>
              </div>
                  <div className="flex items-center gap-3 flex-nowrap">
                    <Link href="/committee" className="rounded-full bg-white/70 text-midnight-700 text-sm px-4 py-2 border border-black/5">Committee</Link>
                    <Link href="/program" className="rounded-full bg-white/70 text-midnight-700 text-sm px-4 py-2 border border-black/5">Program</Link>
                    <Link href="/abstracts" className="rounded-full bg-white/70 text-midnight-700 text-sm px-4 py-2 border border-black/5">Abstracts</Link>
                    <Link href="/venue" className="rounded-full bg-white/70 text-midnight-700 text-sm px-4 py-2 border border-black/5">Venue</Link>
                    <Link href="/contact" className="rounded-full bg-white/70 text-midnight-700 text-sm px-4 py-2 border border-black/5">Contact</Link>
                    <Link href="/auth/login" className="rounded-full bg-white/70 text-midnight-700 text-sm px-4 py-2 border border-black/5">Log in</Link>
                    <button
                      aria-label="Toggle theme"
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className="rounded-full bg-white/70 text-midnight-700 text-sm px-4 py-2 border border-black/5 inline-flex items-center gap-1.5"
                    >
                      <Sun className="w-4 h-4" /> Theme
                </button>
                    <a href="/register" className="rounded-full bg-midnight-900 text-white text-sm px-5 py-2 border border-black/5">Register</a>
                </div>
              </div>
                {/* Mobile sheet */}
                {isMobileMenuOpen && (
                  <div className="fixed inset-0 z-[1000] md:hidden">
                    <div className="absolute inset-0 bg-midnight-900/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                    <div className="absolute top-4 left-4 right-4 rounded-3xl bg-white p-4 shadow-elevation-3">
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { label: 'Committee', href: '/committee' },
                          { label: 'Program', href: '/program' },
                          { label: 'Abstracts', href: '/abstracts' },
                          { label: 'Venue', href: '/venue' },
                          { label: 'Contact', href: '/contact' },
                          { label: 'Log in', href: '/auth/login' },
                        ].map((item) => (
                          <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="rounded-xl bg-gray-50 border border-gray-200 text-midnight-800 text-base px-4 py-3 text-center">
                            {item.label}
                          </Link>
                        ))}
                        <div className="flex items-center justify-between pt-2">
                          <button
                            aria-label="Toggle theme"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="rounded-xl bg-gray-50 border border-gray-200 text-midnight-800 text-base px-4 py-3 inline-flex items-center gap-2"
                          >
                            <Sun className="w-4 h-4" /> Theme
                </button>
                          <a href="/register" onClick={() => setIsMobileMenuOpen(false)} className="rounded-xl bg-midnight-900 text-white text-base px-4 py-3">
                            Register
                          </a>
              </div>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="w-full rounded-xl border mt-2 py-3 text-midnight-700">Close</button>
            </div>
              </div>
            </div>
                )}
          </div>
        </div>

            {/* Main content grid inside gradient: left text, right visual */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 sm:p-8 lg:p-12 items-center">
              {/* Left text block (first on mobile) */}
              <div className="text-white space-y-7 order-1 lg:order-1">
                <div className="text-white/90 text-sm md:text-base font-medium leading-snug [text-wrap:balance]">— Annual Conference of the Orthopedic Surgeons Society of Andhra Pradesh</div>
                <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl leading-tight tracking-[-0.02em] break-words">
                  OSSAPCON 2026
                </h1>
                <p className="text-white/90 text-xl sm:text-2xl md:text-3xl font-medium">Excellence in Orthopedic Care</p>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full border-2 border-white/40 flex items-center justify-center"><Users className="w-4 h-4 text-white" /></div>
                    <div className="w-8 h-8 bg-white/20 rounded-full border-2 border-white/40 flex items-center justify-center"><Award className="w-4 h-4 text-white" /></div>
                    <div className="w-8 h-8 bg-white/20 rounded-full border-2 border-white/40 flex items-center justify-center"><Stethoscope className="w-4 h-4 text-white" /></div>
                </div>
                  <span className="inline-flex items-center text-white/95 text-lg md:text-xl font-semibold bg-white/10 backdrop-blur border border-white/30 rounded-full px-4 py-2">Kurnool • Feb 4–6, 2026</span>
                </div>
                <p className="text-white/90 max-w-xl text-base sm:text-lg">Join India’s premier orthopedic conference advancing care through innovation, collaboration, and clinical excellence.</p>
                <div className="flex items-center gap-5">
                  <a href="/register">
                    <Button size="lg" variant="secondary" className="bg-white text-midnight-900 rounded-full h-14 px-8 text-base">
                      Register now
                      <Plus className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                  <Link href="/program" className="text-white/95 underline text-base">Program</Link>
              </div>
            </div>
              {/* Right visual block (second on mobile) */}
              <div className="relative order-2 lg:order-2">
                <div className="relative h-[55vh] sm:h-[50vh] lg:h-[65vh] rounded-2xl overflow-hidden bg-white/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/0" />
                  {/* Conference Stats Visualization */}
                  <ConferenceStats />
                </div>
                <div className="mt-6 flex flex-col gap-3 max-w-sm ml-auto">
                  <div className="flex items-center justify-between rounded-2xl bg-white/20 backdrop-blur border border-white/30 px-4 py-3 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/30" />
                      <div className="leading-tight">
                        <div className="text-sm font-medium">Watch conference overview</div>
                        <div className="text-[11px] text-white/80">What to expect at OSSAPCON 2026 • 2 min</div>
                  </div>
                </div>
                    <Play className="w-4 h-4 opacity-90" />
              </div>
                  <div className="rounded-2xl bg-white/15 backdrop-blur border border-white/25 px-4 py-4 text-white text-sm">
                    OSSAPCON 2026 brings together leading orthopedic surgeons and researchers for three days of clinical updates, hands‑on workshops, and collaborative discussions. Explore trauma, arthroplasty, spine, sports medicine, and pediatric orthopedics with experts from across India.
            </div>
                  </div>
                </div>
              </div>
            </div>

          {/* RIGHT: Content column */}
          <aside className="flex flex-col gap-4 md:gap-6 min-h-[78vh] xl:pl-4">
            {/* Designed for easy access card – add depth/glass */}
            <div className="relative overflow-hidden rounded-3xl bg-white/85 backdrop-blur-xl border border-white/60 shadow-glass-lg ring-1 ring-sapphire-200/50 p-5 md:p-6">
              <div className="pointer-events-none absolute -top-10 -right-6 h-40 w-40 rounded-full bg-gradient-to-br from-ocean-300/30 to-transparent blur-2xl" />
              <div className="pointer-events-none absolute -bottom-12 -left-8 h-44 w-44 rounded-full bg-gradient-to-tr from-sapphire-400/25 to-transparent blur-3xl" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-midnight-500">About</span>
                <Link href="/committee" className="rounded-full border px-2 py-1 text-xs text-midnight-600">Committee</Link>
                </div>
              <h3 className="text-xl font-semibold text-midnight-900 mb-2">Annual conference of the Orthopedic Surgeons Society of Andhra Pradesh.</h3>
              <p className="text-sm text-midnight-600">Organised by Department of Orthopaedics, Kurnool Medical College. Three days of high‑impact talks, cadaveric demos, trauma & arthroplasty updates, hands‑on workshops, and networking with leaders across India.</p>
                  </div>
            {/* Video card (portrait playlist) */}
            <div className="rounded-3xl overflow-hidden bg-midnight-900/90 relative text-white flex-1 min-h-[320px]">
              <HeroVideoPlaylist
                sources={[
                  { src: "/video1.webm", type: "video/webm", poster: "/placeholder.jpg", title: "Conference overview" },
                ]}
              />
              <div className="relative p-5 h-full flex flex-col justify-end">
                <a href="#discover-kurnool" className="flex items-center gap-3 bg-black/45 hover:bg-black/55 transition-colors backdrop-blur rounded-full px-4 py-2 w-max">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><Play className="w-4 h-4" /></div>
                  <div className="text-sm font-medium">Explore Kurnool City</div>
                </a>
                </div>
              </div>
          </aside>
      </div>

        {/* BELOW-HERO STRIP removed per request */}
      </section>


      {/* Pricing Section - Horizontal Layout */}
      <section className="snap-start min-h-screen flex items-center py-16 bg-gradient-to-r from-emerald-900 via-ocean-900 to-sapphire-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-fluid-5xl font-bold text-white mb-4 drop-shadow-2xl">
              Registration Pricing
            </h2>
            <p className="text-white/90 max-w-3xl mx-auto font-medium drop-shadow-lg">
              Current Tier: <span className="font-bold text-emerald-300">{currentTier}</span> — {tierSummary}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { 
                type: "OSSAP Member", 
                price: "₹8,250", 
                description: "Early Bird (Inclusive 18% GST)",
                features: ["Full conference access", "Conference materials", "Networking events"]
              },
              { 
                type: "OSSAP Non-Member", 
                price: "₹9,440", 
                description: "Early Bird (Inclusive 18% GST)",
                features: ["Full conference access", "Conference materials", "Networking events"]
              },
              { 
                type: "PG Student", 
                price: "₹5,900", 
                description: "Early Bird (Inclusive 18% GST)",
                features: ["Full conference access", "Conference materials", "Career guidance"]
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 40 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                
                <Card 
                  className={`h-[500px] text-center bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 shadow-2xl hover:shadow-white/5 flex flex-col`}
                >
                  <CardHeader className="pb-4 flex-shrink-0">
                    <CardTitle className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{plan.type}</CardTitle>
                    <div className="text-4xl font-black text-emerald-300 mb-2 drop-shadow-lg">{plan.price}</div>
                    <CardDescription className="text-white/90 text-sm font-medium">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-3 mb-6 flex-1">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-white/95 font-medium">
                          <Shield className="w-4 h-4 mr-3 text-emerald-300 flex-shrink-0" />
                          <span className="drop-shadow-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      size="lg" 
                      className="w-full h-14 text-lg bg-white/15 hover:bg-white/25 text-white border-white/20 hover:border-white/30 font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                      variant="outline"
                      asChild
                    >
                      <a href="/register">
                        Register Now
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - unified layout (no overlays) */}
      <section className="snap-start min-h-screen py-16 flex items-center bg-white dark:bg-gray-900">
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={shouldReduceMotion ? undefined : { opacity: 0, x: -50 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-fluid-5xl font-bold text-gray-900 dark:text-white mb-8">
                Why Attend OSSAPCON 2026?
              </h2>
              <p className="text-fluid-xl text-gray-700 dark:text-gray-300 mb-12 leading-relaxed">
                Join the most comprehensive orthopedic conference in South India, featuring cutting-edge research, innovative techniques, and networking opportunities.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: Brain, title: "Advanced Learning", desc: "Latest surgical techniques and medical innovations" },
                  { icon: Users, title: "Expert Network", desc: "Connect with leading orthopedic surgeons" },
                  { icon: Trophy, title: "CME Credits", desc: "Earn continuing medical education credits" },
                  { icon: Target, title: "Practical Skills", desc: "Hands-on workshops and live demonstrations" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
                    whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="p-3 rounded-xl bg-gradient-to-br from-ocean-500 to-sapphire-600 text-white shadow-lg">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-display text-fluid-lg font-bold text-gray-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={shouldReduceMotion ? undefined : { opacity: 0, x: 50 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-6">
                {[
                  { number: "500+", label: "Attendees", color: "ocean" },
                  { number: "50+", label: "Speakers", color: "emerald" },
                  { number: "25+", label: "Sessions", color: "sapphire" },
                  { number: "15+", label: "Workshops", color: "coral" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
                    whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Card className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6">
                        <div className={`text-fluid-4xl font-black mb-2 ${
                          stat.color === 'ocean' ? 'text-ocean-600 dark:text-ocean-400' :
                          stat.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                          stat.color === 'sapphire' ? 'text-sapphire-600 dark:text-sapphire-400' :
                          'text-coral-500 dark:text-coral-400'
                        }`}>
                          {stat.number}
                        </div>
                        <div className="text-fluid-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          {stat.label}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action - Full Width */}
      <section className="py-20 bg-gradient-to-r from-midnight-900 via-ocean-800 to-emerald-800">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="font-display text-fluid-5xl font-bold text-white mb-8">
              Ready to Advance Your Practice?
            </h2>
            <p className="text-fluid-xl text-white/80 mb-12 leading-relaxed">
              Join hundreds of orthopedic professionals at OSSAPCON 2026. Register now and be part of the future of orthopedic medicine.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="xl" className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700" asChild>
                <a href="/register">
                  <Zap className="w-5 h-5 mr-2" />
                  Register Today
                </a>
              </Button>
              <Button size="xl" variant="outline" className="border-white/50 text-white hover:bg-white/20 hover:text-white bg-transparent font-semibold" asChild>
                <Link href="/committee">
                  <Users className="w-5 h-5 mr-2" />
                  Meet the Team
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>



      {/* Enhanced Holographic Countdown - simplified */}
      <section className="snap-start py-4 bg-white dark:bg-gray-900" id="countdown-section">
        
        <motion.div className="relative z-10">
          <div className="container mx-auto px-6 text-center">
            <motion.h2
              className="text-fluid-4xl font-display font-bold mb-4 text-gradient-ocean dark:text-white"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Conference Countdown
            </motion.h2>

            <div className="max-w-6xl mx-auto">
              {/* Circular Countdown Timers */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
                {[
                  { 
                    label: "DAYS", 
                    value: timeLeft.days, 
                    maxValue: 365,
                    textColor: "text-blue-600",
                    ringColor: "#3B82F6"
                  },
                  { 
                    label: "HOURS", 
                    value: timeLeft.hours, 
                    maxValue: 24,
                    textColor: "text-cyan-600",
                    ringColor: "#06B6D4"
                  },
                  { 
                    label: "MINUTES", 
                    value: timeLeft.minutes, 
                    maxValue: 60,
                    textColor: "text-teal-600",
                    ringColor: "#14B8A6"
                  },
                  { 
                    label: "SECONDS", 
                    value: timeLeft.seconds, 
                    maxValue: 60,
                    textColor: "text-emerald-600",
                    ringColor: "#10B981"
                  },
                ].map((item, index) => {
                  const progress = (item.value / item.maxValue) * 100;
                  const radius = 50;
                  const circumference = 2 * Math.PI * radius;
                  const strokeDasharray = circumference;
                  const strokeDashoffset = circumference - (progress / 100) * circumference;
                  
                  return (
                    <div key={item.label} className="flex flex-col items-center">
                      {/* Circular Timer */}
                      <div className="relative w-32 h-32 md:w-36 md:h-36 mb-4">
                        {/* Progress Ring Background */}
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                          <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="8"
                            className="dark:stroke-gray-600"
                          />
                        </svg>
                        
                        {/* Progress Ring */}
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                          <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            fill="none"
                            stroke={item.ringColor}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                          />
                        </svg>
                        
                        {/* Center Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className={`text-3xl md:text-4xl font-bold ${item.textColor} dark:text-white mb-1`}>
                      {item.value.toString().padStart(2, "0")}
                    </div>
                          <div className={`text-xs font-semibold ${item.textColor} dark:text-gray-300 tracking-wider`}>
                      {item.label}
                          </div>
                        </div>
                    </div>
                    
                      {/* Progress Percentage */}
                      <div className="text-center">
                        <div className={`text-sm font-medium ${item.textColor} dark:text-gray-300`}>
                          {Math.round(progress)}% Complete
                  </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Enhanced Welcome Message Section - simplified */}
      <section className="snap-start py-6 bg-white dark:bg-gray-900" id="welcome-section">

        <div className="container mx-auto px-4 relative z-10">
          <motion.h2
            className="text-fluid-4xl font-display font-bold text-center mb-4 text-gradient-ocean dark:text-white"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            WELCOME MESSAGE
          </motion.h2>

          <div className="max-w-8xl mx-auto">
            {/* Welcome Content with Spine Model - 25-75 Split */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch">
              {/* 3D Spine Model - 25% on desktop, appears second on mobile */}
              <div className="order-2 lg:order-1 lg:w-[25%] flex justify-center items-center">
                <div className="three-canvas-container mobile-3d-model w-full max-w-sm">
                  <SpineModel />
                </div>
              </div>

              {/* Welcome Content - 75% on desktop, appears first on mobile */}
              <div className="order-1 lg:order-2 lg:w-[75%]">
                <motion.div
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-4xl p-4 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 flex flex-col justify-center min-h-[350px] interactive"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <h3 className="text-fluid-3xl font-display font-bold text-gradient-ocean dark:text-white mb-6">
                    Welcome to OSSAPCON 2026
                  </h3>
                  <div className="prose prose-base text-gray-800 dark:text-gray-200 leading-tight">
                    <p className="mb-3 text-fluid-base font-semibold text-emerald-600 dark:text-emerald-400">
                      Dear Orthopedic Surgeons, Healthcare Professionals, and Medical Innovators,
                    </p>
                    <p className="mb-2 text-fluid-sm text-gray-700 dark:text-gray-300">
                      We are thrilled to welcome you to <strong className="text-gray-900 dark:text-white">OSSAPCON 2026</strong>, the premier annual conference of the Orthopedic Surgeons Society of Andhra Pradesh. This landmark event represents the convergence of excellence in orthopedic care, bringing together the most distinguished minds in orthopedic surgery, spine care, joint replacement, and trauma management.
                    </p>
                    <p className="mb-2 text-fluid-sm text-gray-700 dark:text-gray-300">
                      Over three transformative days in Kurnool, we will delve deep into the latest advances in orthopedic medicine. From revolutionary surgical techniques and minimally invasive procedures to breakthrough research in spine surgery, joint arthroplasty, and sports medicine rehabilitation. Our comprehensive program features internationally renowned keynote speakers, hands-on workshops, live surgical demonstrations, and exceptional networking opportunities.
                    </p>
                    <p className="mb-2 text-fluid-sm text-gray-700 dark:text-gray-300">
                      <strong className="text-gray-900 dark:text-white">Kurnool Medical College</strong>, our host institution, stands as a beacon of medical education and healthcare excellence in Andhra Pradesh. The college's commitment to advancing orthopedic care and its state-of-the-art facilities provide the perfect environment for this prestigious gathering of orthopedic professionals.
                    </p>

                    <p className="mb-3 text-fluid-sm text-gray-700 dark:text-gray-300">
                      Whether you are a practicing orthopedic surgeon, spine specialist, sports medicine physician, resident in training, or allied healthcare professional, OSSAPCON 2026 offers unparalleled opportunities for professional growth, knowledge exchange, and collaborative advancement of orthopedic care across Andhra Pradesh and beyond.
                    </p>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-3 border border-gray-200 dark:border-gray-600 border-l-4 border-l-ocean-500">
                      <p className="font-bold text-gray-900 dark:text-white text-fluid-sm mb-1">Join us in shaping the future of orthopedic excellence!</p>
                      <p className="text-ocean-600 dark:text-ocean-400 font-semibold text-fluid-xs">The Organizing Committee</p>
                      <p className="text-ocean-600 dark:text-ocean-400 font-medium text-fluid-xs">Orthopedic Surgeons Society of Andhra Pradesh</p>
                      <p className="text-fluid-xs text-gray-600 dark:text-gray-400 mt-1">Department of Orthopedics, Kurnool Medical College</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Organizing Committee Members Section - unified */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-6 py-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
              <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wide">
                🏥 OSSAPCON 2026 Leadership
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Meet Our Organizing Committee
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Visionary orthopedic surgeons and healthcare leaders driving excellence in orthopedic care and medical education across Andhra Pradesh.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              {
                name: "DR. K. SRINIVAS",
                title: "Organizing Chairman",
                credentials: "MS ORTHO",
                position: "PROF AND HOD DEPT OF ORTHOPAEDICS",
                institution: "KURNOOL MEDICAL COLLEGE",
                photo: "/Srinivas_DR.png",
              },
              {
                name: "DR. Y. RAMANA",
                title: "Co‑Organizing Chairman",
                credentials: "MS ORTHO",
                position: "SENIOR ORTHOPAEDIC SURGEON",
                institution: "KURNOOL MEDICAL COLLEGE",
                photo: "/RAMANA_DR.png",
              },
              {
                name: "DR. K. VENKATESWARLU",
                title: "Organizing Secretary",
                credentials: "MS ORTHO",
                position: "SUPERINTENDENT",
                institution: "GGH KURNOOL",
                photo: "/Venkateshwalu_DR.png",
              },
              {
                name: "DR A.M. ILIAS BASHA",
                title: "Organizing Secretary",
                credentials: "MS ORTHO",
                position: "PROF OF ORTHOPAEDICS",
                institution: "KURNOOL MEDICAL COLLEGE",
                photo: "/Iliyas_DR.png",
              },
              {
                name: "DR. K. VIJAYMOHAN REDDY",
                title: "Treasurer",
                credentials: "MS ORTHO",
                position: "PROF OF ORTHOPAEDICS",
                institution: "KURNOOL MEDICAL COLLEGE",
                photo: "/Vijay_DR.png",
              },
              {
                name: "DR. M. RAJESH KUMAR",
                title: "Joint Secretary",
                credentials: "MS ORTHO",
                position: "—",
                institution: "—",
                photo: "/RAJESH_DR.png",
              },
              {
                name: "DR. N. R. S. MURTHY",
                title: "Joint Secretary",
                credentials: "MS ORTHO",
                position: "—",
                institution: "—",
                photo: "/placeholder-user.jpg",
              },
              {
                name: "DR. RAGHUNATHA REDDY",
                title: "Joint Secretary",
                credentials: "MS ORTHO",
                position: "—",
                institution: "—",
                photo: "/placeholder-user.jpg",
              },
              {
                name: "DR. D. RAJAIAH",
                title: "Scientific Committee Chairman",
                credentials: "MS ORTHO",
                position: "—",
                institution: "—",
                photo: "/Rajayya_DR.png",
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                className="relative group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:shadow-blue-200/30 dark:hover:shadow-blue-500/20 transition-all duration-500 overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -12, scale: 1.03 }}
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-blue-100/50 dark:from-blue-900/20 dark:via-transparent dark:to-blue-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Decorative corner elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-400/10 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"></div>
                <div className="text-center">
                  {/* Profile Photo */}
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-semibold">{member.title}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/committee">
              <Button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-full shadow-lg hover:shadow-blue-200/50 transition-all duration-300">
                View Complete Committee
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Explore Kurnool - unified (full viewport, dark-ready) */}
      <div id="discover-kurnool"></div>
      <section className="snap-start min-h-screen py-16 bg-gradient-to-b from-white to-slate-50 dark:from-[#0a0a0a] dark:to-[#0a0a0a] flex items-center">

        <div className="container mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              className="inline-block px-6 py-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-blue-600 dark:text-blue-300 font-semibold text-sm uppercase tracking-wide">
                🏛️ Gateway of Rayalaseema
              </span>
            </motion.div>

            <motion.h2
              className="text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 bg-clip-text text-transparent dark:text-white"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Discover Kurnool
            </motion.h2>

            <motion.p
              className="text-xl lg:text-2xl text-gray-700 dark:text-gray-200 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Experience the rich heritage and growing medical excellence of Kurnool while attending OSSAPCON 2026. From ancient forts and temples to modern healthcare facilities and educational institutions.
            </motion.p>
          </div>

          {/* Enhanced Horizontal Scrolling Cards Container */}
          <motion.div
            className="relative"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Scroll Indicators */}
            <div className="flex justify-center items-center space-x-4 mb-8">
              <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-6 py-3 border border-blue-100 dark:border-gray-700">
                <span className="text-sm font-medium">🖱️ Scroll horizontally or drag to explore</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </div>

            {/* Optimized Horizontal Scrolling Container */}
            <div
              ref={(el) => {
                if (el) {
                  const handleWheel = (e: WheelEvent) => {
                    // Only handle horizontal scrolling if shift is pressed or if we're on desktop
                    if (e.shiftKey || window.innerWidth >= 768) {
                      // Check if we can scroll horizontally
                      const canScrollLeft = el.scrollLeft > 0;
                      const canScrollRight = el.scrollLeft < (el.scrollWidth - el.clientWidth);
                      
                      if ((e.deltaY > 0 && canScrollRight) || (e.deltaY < 0 && canScrollLeft)) {
                        e.preventDefault();
                        el.scrollLeft += e.deltaY;
                      }
                    }
                  };
                  
                  el.addEventListener('wheel', handleWheel, { passive: false });
                  return () => el.removeEventListener('wheel', handleWheel);
                }
              }}
              className="overflow-x-auto overflow-y-hidden pb-8 snap-x snap-mandatory scrollbar-hide horizontal-scroll-container"
              style={{
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <div className="flex space-x-6 px-4" style={{ width: 'max-content' }}>
                {[
                  {
                    name: "Kurnool Fort",
                    description: "Historic fort and symbol of Kurnool's rich heritage",
                    category: "Heritage",
                    rating: "4.5",
                    time: "1-2 hours",
                    bestTime: "Evening",
                    highlights: ["Historic Architecture", "Night Illumination", "Local Markets"],
                    icon: "🏛️",
                    image: "/kurnoolfort.png"
                  },
                  {
                    name: "Kurnool Medical College",
                    description: "Premier medical institution and OSSAPCON 2026 venue",
                    category: "Education",
                    rating: "4.8",
                    time: "2-3 hours",
                    bestTime: "Morning",
                    highlights: ["Medical Excellence", "Modern Facilities", "Conference Venue"],
                    icon: "🏥",
                    image: "/kurnoolcollege.png"
                  },
                  {
                    name: "Belum Caves",
                    description: "Longest cave system in Indian subcontinent near Kurnool",
                    category: "Nature",
                    rating: "4.6",
                    time: "2-3 hours",
                    bestTime: "Morning",
                    highlights: ["Underground Formations", "Natural Wonder", "Geological Marvel"],
                    icon: "🕳️",
                    image: "/belum.png"
                  },
                  {
                    name: "Tungabhadra River",
                    description: "Sacred river flowing through Kurnool with scenic beauty",
                    category: "Nature",
                    rating: "4.4",
                    time: "1-2 hours",
                    bestTime: "Evening",
                    highlights: ["River Views", "Peaceful Atmosphere", "Photography"],
                    icon: "🌊",
                    image: "/Tugabadhra.png"
                  },
                  {
                    name: "Alampur Temples",
                    description: "Ancient Chalukyan temples showcasing architectural brilliance",
                    category: "Heritage",
                    rating: "4.5",
                    time: "2-3 hours",
                    bestTime: "Morning",
                    highlights: ["Ancient Architecture", "Spiritual Significance", "Historical Value"],
                    icon: "🛕",
                    image: "/alampur.png"
                  }
                ].map((place, index) => (
                  <div
                    key={index}
                    className="relative group w-80 h-[500px] flex-shrink-0 snap-center"
                  >
                    {/* Full Image Card with Simple Overlay */}
                    <div className="attraction-card relative w-full h-full rounded-3xl shadow-2xl overflow-hidden border border-white/20 transition-all duration-300 ease-out hover:shadow-blue-500/30 hover:shadow-2xl hover:border-blue-300/30 group-hover:scale-105">
                      {/* Full Background Image */}
                      <img
                        src={place.image}
                        alt={place.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />

                      {/* Dark Overlay for Better Text Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
                        {/* Category Badge */}
                        <div className="px-3 py-1 bg-white/90 rounded-full">
                          <span className="text-xs font-bold text-gray-800">{place.category}</span>
                        </div>

                        {/* Rating Badge */}
                        <div className="px-3 py-1 bg-white/90 rounded-full flex items-center space-x-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-xs font-bold text-gray-800">{place.rating}</span>
                        </div>
                      </div>

                      {/* Bottom Simple Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                        <div className="bg-black/60 rounded-xl p-4">
                          <h3 className="text-xl font-bold text-white mb-2">{place.name}</h3>
                          <p className="text-white/90 text-sm mb-3 line-clamp-2">{place.description}</p>

                          {/* Info Grid */}
                          <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                            <div className="flex items-center space-x-2">
                              <span className="text-blue-400">⏰</span>
                              <span className="text-white/80">{place.time}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-blue-400">🌅</span>
                              <span className="text-white/80">{place.bestTime}</span>
                            </div>
                          </div>

                          {/* Highlights */}
                          <div className="mb-3">
                            <div className="flex flex-wrap gap-1.5">
                              {place.highlights.slice(0, 2).map((highlight, idx) => (
                                <span key={idx} className="px-2 py-1 bg-blue-500/80 text-white text-xs rounded-full">
                                  {highlight}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Learn More Button */}
                          <button
                            onClick={() => handleLearnMore(place)}
                            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                          >
                            Learn More
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>


          </motion.div>
        </div>
      </section>

      {/* CTA Section with Grid Beams */}
      <section className="relative">
        <GridBeams 
          className="py-20 sm:py-24"
          rayCount={25}
          rayOpacity={0.7}
          raySpeed={1.5}
          backgroundColor="#0f172a"
          gridColor="rgba(200, 220, 255, 0.25)"
          rayLength="60vh"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Headline */}
              <div className="space-y-4">
                <motion.h2 
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  Ready to Join
                  <span className="bg-gradient-to-r from-ocean-400 via-sapphire-500 to-ocean-600 bg-clip-text text-transparent block">
                    OSSAPCON 2026?
                  </span>
                </motion.h2>
                
                <motion.p 
                  className="text-xl sm:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  Don't miss this opportunity to connect with leading orthopedic surgeons, 
                  learn cutting-edge techniques, and advance your practice.
                </motion.p>
              </div>

              {/* Stats Row */}
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-2">300+</div>
                  <div className="text-white/70 text-sm sm:text-base">Attendees</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-2">50+</div>
                  <div className="text-white/70 text-sm sm:text-base">Expert Speakers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-2">3</div>
                  <div className="text-white/70 text-sm sm:text-base">Days</div>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                viewport={{ once: true }}
              >
                <a href="/register">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
                  >
                    Register Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </a>
                
                <Link href="/program">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-white/50 bg-white/90 text-slate-900 hover:bg-white hover:text-slate-900 font-semibold px-8 py-4 text-lg rounded-2xl backdrop-blur-sm transition-all duration-300 hover:border-white"
                  >
                    View Program
                  </Button>
                </Link>
              </motion.div>

              {/* Additional Info */}
              <motion.div 
                className="flex flex-wrap justify-center gap-6 text-white/80 text-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>CME Credits Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Kurnool Medical College</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Feb 4-6, 2026</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </GridBeams>
      </section>

      {/* Comprehensive Footer with Animated Grid Background */}
      <footer className="text-white py-12 sm:py-16 relative overflow-hidden bg-[#0a0a0a]">
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className="absolute -inset-40 h-[260%] w-[160%] skew-y-12"
        />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 md:gap-12 items-start mb-12 sm:mb-16">
            {/* Conference Info */}
            <div>
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent leading-tight py-2">
                OSSAPCON 2026
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                Excellence in Orthopedic Care through innovation, collaboration, and excellence. Join us in Kurnool for three transformative days of medical learning.
              </p>
              <div className="space-y-2 text-gray-400 text-sm sm:text-base">
                <p className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                  August 7-9, 2026
                </p>
                <p className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                  Kurnool, Andhra Pradesh
                </p>
                <p className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-blue-500" />
                  400+ Expected Delegates
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4 sm:mb-6 text-blue-400 uppercase tracking-wide text-sm sm:text-base">Quick Links</h4>
              <ul className="space-y-2 sm:space-y-3 text-gray-300 text-sm sm:text-base">
                {[
                  "About Conference",
                  "Scientific Program",
                  "Registration",
                  "Abstracts",
                  "Venue Information",
                  "Local Tourism"
                ].map((item) => (
                  <li key={item}>
                    <Link href="#" className="hover:text-blue-400 transition-colors duration-300 flex items-center">
                      <ArrowRight className="w-3 h-3 mr-2" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="font-bold mb-4 sm:mb-6 text-blue-400 uppercase tracking-wide text-sm sm:text-base">Contact Information</h4>

              <div className="mb-4 sm:mb-6">
                <h5 className="font-semibold text-white mb-2 text-sm sm:text-base">Conference Manager</h5>
                <p className="text-gray-300 text-xs sm:text-sm">Ms. Lakhshmi Prabha</p>
                <p className="text-gray-400 text-xs sm:text-sm">+91 9052192744</p>
                <p className="text-gray-400 text-xs sm:text-sm">contact@ossapcon2026.com</p>
                <p className="text-gray-400 text-xs sm:text-sm">Kurnool, Andhra Pradesh</p>
              </div>

              <div className="mb-4 sm:mb-6">
                <h5 className="font-semibold text-white mb-2 text-sm sm:text-base">Apple Events</h5>
                <p className="text-gray-300 text-xs sm:text-sm">Lakhshmi Prabha: +91 9052192744</p>
                <p className="text-gray-400 text-xs sm:text-sm">Conference Management</p>
              </div>
            </div>

            {/* Social Media & Follow */}
            <div>
              <h4 className="font-bold mb-4 sm:mb-6 text-blue-400 uppercase tracking-wide text-sm sm:text-base">Follow Us</h4>
              <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8">
                {[
                  { logo: "/LinkedIn_logo_initials.png", label: "LinkedIn" },
                  { logo: "/Logo_of_Twitter.png", label: "Twitter" },
                  { logo: "/Facebook_Logo_(2019).png", label: "Facebook" },
                  { logo: "/Instagram_icon.png", label: "Instagram" },
                  { logo: "/Youtube_logo.png", label: "YouTube" }
                ].map((social, index) => (
                  <motion.div
                    key={index}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer p-1"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title={social.label}
                  >
                    <img
                      src={social.logo}
                      alt={social.label}
                      className="w-6 h-6 object-contain"
                    />
                  </motion.div>
                ))}
              </div>

              <div>
                <h5 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">Tech Partner</h5>
                <div className="flex items-center space-x-2">
                  <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                    PurpleHat Events
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-700 pt-6 sm:pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-400 text-sm text-center md:text-left">
                <p>&copy; 2026 OSSAPCON Conference. All rights reserved.</p>
                <p>Kurnool, Andhra Pradesh</p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6 text-gray-400 text-sm">
                <Link href="/privacy-policy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
                <Link href="/terms-conditions" className="hover:text-blue-400 transition-colors">Terms & Conditions</Link>
                <Link href="/cookies-policy" className="hover:text-blue-400 transition-colors">Cookies Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Location Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold pr-8">
              <span className="text-xl sm:text-2xl">{selectedLocation?.icon}</span>
              <span className="line-clamp-2">{selectedLocation?.name}</span>
            </DialogTitle>
            <DialogDescription className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
              {selectedLocation?.description}
            </DialogDescription>
          </DialogHeader>

          {selectedLocation && (
            <div className="space-y-6">
              <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden">
                <img
                  src={selectedLocation.image}
                  alt={selectedLocation.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

                <div className="space-y-4">
                  <div>
                  <h4 className="font-semibold text-lg mb-2">About this location</h4>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {selectedLocation.fullDescription}
                  </p>
                  </div>

                  <div>
                  <h4 className="font-semibold text-lg mb-2">How to reach</h4>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {selectedLocation.directions}
                  </p>
                  </div>

                  <div>
                  <h4 className="font-semibold text-lg mb-2">Best time to visit</h4>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {selectedLocation.bestTime}
                  </p>
                    </div>
                  </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={() => window.open(selectedLocation.mapsUrl, '_blank')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  View on Maps
                </Button>

                <Button
                  onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(selectedLocation.name + ' Kurnool')}`, '_blank')}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 h-12"
                >
                  Learn More Online
                </Button>

                <Button
                  onClick={() => setIsModalOpen(false)}
                  variant="outline"
                  className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 h-12 sm:hidden"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
