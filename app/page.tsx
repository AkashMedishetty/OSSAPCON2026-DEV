"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/layout/MainLayout"
import { Navigation } from "@/components/navigation"
import { Calendar, MapPin, Users, Award, Play, Sparkles, ArrowRight, X, Navigation as NavigationIcon, ExternalLink, Zap, Star, Globe, Heart } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Lazy load 3D components for better performance
const BrainModel = dynamic(() => import("@/components/3d/BrainModel"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-emerald-100/60 via-emerald-50/40 to-emerald-200/30 rounded-3xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 border-t-2 border-t-transparent"></div>
        <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border border-emerald-300 opacity-20"></div>
      </div>
      <div className="absolute bottom-4 text-sm text-emerald-600 font-medium animate-pulse">Loading 3D Model...</div>
    </div>
  )
})

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
  const [isPlaying, setIsPlaying] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 1000], [0, -200])
  const y2 = useTransform(scrollY, [0, 1000], [0, -400])
  const opacity = useTransform(scrollY, [0, 500], [1, 0])
  const scale = useTransform(scrollY, [0, 500], [1, 0.8])

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
  const x = useSpring(0, springConfig)
  const y = useSpring(0, springConfig)

  useEffect(() => {
    const targetDate = new Date("2026-08-07T09:00:00").getTime()

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
        // Conference has started
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    // Update immediately
    updateCountdown()

    // Then update every second
    const timer = setInterval(updateCountdown, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 text-slate-800 overflow-hidden dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:text-slate-100">
      <Navigation currentPage="home" />

      {/* Modern Minimalist Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 dark:bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Geometric Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-transparent to-slate-100/20 dark:from-emerald-900/10 dark:via-transparent dark:to-slate-800/20"></div>
          <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl dark:bg-emerald-800/10"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-slate-200/30 rounded-full blur-3xl dark:bg-slate-700/20"></div>
        </div>

        {/* Main Content Container */}
        <div className="container mx-auto px-6 relative z-20">
          <div className="text-center space-y-12">
            {/* Conference Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-block"
            >
              <div className="px-8 py-4 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-emerald-100/50 dark:bg-slate-800/80 dark:border-slate-700/50">
                <div className="flex items-center justify-center space-x-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-3 text-emerald-600" />
                    August 7-9, 2026
                  </div>
                  <div className="h-6 w-px bg-slate-300 dark:bg-slate-600"></div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-emerald-600" />
                    Kurnool, Andhra Pradesh
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Title - Ultra Modern Typography */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="space-y-6"
            >
              <h1 className="text-7xl lg:text-8xl xl:text-9xl font-black leading-none tracking-tight">
                <span className="block bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent dark:from-white dark:via-slate-200 dark:to-white">
                  OSSAP
                </span>
                <span className="block bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-700 bg-clip-text text-transparent">
                  CON
                </span>
                <span className="block text-6xl lg:text-7xl xl:text-8xl bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                  2026
                </span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="max-w-4xl mx-auto"
            >
              <p className="text-2xl lg:text-3xl text-slate-600 dark:text-slate-300 font-light leading-relaxed mb-4">
                Annual Conference of Orthopedic Surgeons Society of Andhra Pradesh
              </p>
              <p className="text-xl text-emerald-600 dark:text-emerald-400 font-medium">
                Pioneering the Future of Orthopedic Excellence
              </p>
            </motion.div>

            {/* CTA Buttons - Modern Design */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <motion.div 
                whileHover={{ scale: 1.05, y: -3 }} 
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                <Link href="/register">
                  <Button className="relative px-10 py-6 text-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-2xl shadow-2xl hover:shadow-emerald-200/50 transition-all duration-500 border-0 font-semibold">
                    <Zap className="mr-3 h-6 w-6 group-hover:animate-pulse" />
                    Register Now
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05, y: -3 }} 
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <Link href="/program">
                  <Button variant="outline" className="px-10 py-6 text-xl border-2 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-2xl transition-all duration-500 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800/50 group-hover:border-emerald-400 group-hover:shadow-xl font-semibold">
                    <Globe className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-500" />
                    Explore Program
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats Section - Modern Cards */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-20"
            >
              {[
                { number: "500+", label: "Medical Experts", icon: Users, color: "emerald" },
                { number: "50+", label: "Research Papers", icon: Award, color: "slate" },
                { number: "3", label: "Days of Learning", icon: Calendar, color: "emerald" },
                { number: "25+", label: "Countries", icon: Globe, color: "slate" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="relative group"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className={`absolute -inset-1 bg-gradient-to-r ${stat.color === 'emerald' ? 'from-emerald-500/20 to-emerald-600/20' : 'from-slate-400/20 to-slate-500/20'} rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500`}></div>
                  <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-8 text-center transition-all duration-500 group-hover:bg-white/90 dark:group-hover:bg-slate-800/90 group-hover:shadow-2xl">
                    <stat.icon className={`w-8 h-8 ${stat.color === 'emerald' ? 'text-emerald-600' : 'text-slate-600'} mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`} />
                    <div className={`text-4xl font-black mb-2 bg-gradient-to-r ${stat.color === 'emerald' ? 'from-emerald-600 to-emerald-700' : 'from-slate-700 to-slate-800'} bg-clip-text text-transparent`}>
                      {stat.number}
                    </div>
                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Holographic Countdown */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-900"></div>
        <motion.div className="relative z-10">
          <div className="container mx-auto px-6 text-center">
            <motion.h2
              className="text-5xl font-bold mb-16 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              Conference Countdown
            </motion.h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Minutes", value: timeLeft.minutes },
                { label: "Seconds", value: timeLeft.seconds },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  className="relative group"
                  initial={{ scale: 0, rotateY: 180 }}
                  whileInView={{ scale: 1, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
                  whileHover={{ scale: 1.08, rotateY: 8, y: -5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-blue-700/30 rounded-3xl blur-xl group-hover:blur-2xl group-hover:from-blue-400/40 group-hover:to-blue-600/40 transition-all duration-500"></div>
                  <div className="relative bg-white/90 backdrop-blur-xl border border-blue-100 p-6 sm:p-8 rounded-3xl hover:border-blue-300 transition-all duration-500 shadow-lg hover:shadow-blue-200/30 dark:bg-gray-800/90 dark:border-gray-700 dark:hover:border-blue-500/50 dark:hover:shadow-blue-500/20 group-hover:bg-white dark:group-hover:bg-gray-800">
                    <div className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-b from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent dark:from-blue-400 dark:via-blue-500 dark:to-blue-600 mb-2 leading-none py-2 group-hover:animate-pulse">
                      {item.value.toString().padStart(2, "0")}
                    </div>
                    <div className="text-xs sm:text-sm uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">{item.label}</div>
                    
                    {/* Decorative elements */}
                    <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                    <div className="absolute bottom-2 left-2 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse delay-100"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Welcome Message Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-white dark:bg-gray-900"></div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.h2
            className="text-6xl font-bold text-center mb-20 bg-gradient-to-r from-gray-800 via-blue-600 to-blue-700 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            WELCOME MESSAGE
          </motion.h2>

          <div className="max-w-7xl mx-auto">
            {/* Welcome Content with Spine Model - 30-70 Split */}
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">
              {/* Left side: 3D Spine Model - 35% */}
              <div className="lg:w-[35%] flex justify-center items-center">
                <div className="three-canvas-container mobile-3d-model w-full max-w-md">
                  <SpineModel />
                </div>
              </div>

              {/* Right side: Welcome Content - 65% */}
              <div className="lg:w-[65%]">
                <motion.div
                  className="bg-white rounded-3xl p-8 shadow-2xl border border-blue-100 dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-900/50 flex flex-col justify-center min-h-[600px]"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <h3 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-8 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    Welcome to OSSAPCON 2026
                  </h3>
                  <div className="prose prose-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    <p className="mb-6 text-xl font-medium text-blue-700 dark:text-blue-300">
                      Dear Orthopedic Surgeons, Healthcare Professionals, and Medical Innovators,
                    </p>
                    <p className="mb-6">
                      We are thrilled to welcome you to <strong>OSSAPCON 2026</strong>, the premier annual conference of the Orthopedic Surgeons Society of Andhra Pradesh. This landmark event represents the convergence of excellence in orthopedic care, bringing together the most distinguished minds in orthopedic surgery, spine care, joint replacement, and trauma management.
                    </p>
                    <p className="mb-6">
                      Over three transformative days in Kurnool, we will delve deep into the latest advances in orthopedic medicine. From revolutionary surgical techniques and minimally invasive procedures to breakthrough research in spine surgery, joint arthroplasty, and sports medicine rehabilitation. Our comprehensive program features internationally renowned keynote speakers, hands-on workshops, live surgical demonstrations, and exceptional networking opportunities.
                    </p>
                    <p className="mb-6">
                      <strong>Kurnool Medical College</strong>, our host institution, stands as a beacon of medical education and healthcare excellence in Andhra Pradesh. The college's commitment to advancing orthopedic care and its state-of-the-art facilities provide the perfect environment for this prestigious gathering of orthopedic professionals.
                    </p>
                    <p className="mb-6">
                      The interactive <strong>3D spine model</strong> you see here represents our focus on anatomical precision and innovative approaches to spine surgery - a cornerstone of modern orthopedic practice. This conference will explore how technology, research, and clinical expertise combine to deliver superior patient outcomes.
                    </p>
                    <p className="mb-8">
                      Whether you are a practicing orthopedic surgeon, spine specialist, sports medicine physician, resident in training, or allied healthcare professional, OSSAPCON 2026 offers unparalleled opportunities for professional growth, knowledge exchange, and collaborative advancement of orthopedic care across Andhra Pradesh and beyond.
                    </p>

                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6 border-l-4 border-blue-500">
                      <p className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-2">Join us in shaping the future of orthopedic excellence!</p>
                      <p className="text-blue-700 dark:text-blue-300 font-medium">The Organizing Committee</p>
                      <p className="text-blue-600 dark:text-blue-400">Orthopedic Surgeons Society of Andhra Pradesh</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Department of Orthopedics, Kurnool Medical College</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Organizing Committee Members Section */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-900">
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
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 via-blue-600 to-blue-700 bg-clip-text text-transparent">
              Meet Our Organizing Committee
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Visionary orthopedic surgeons and healthcare leaders driving excellence in orthopedic care and medical education across Andhra Pradesh.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Dr. Manas Panigrahi",
                title: "Organising Chairman"
              },
              {
                name: "Dr. Raghavendra H",
                title: "Organising Secretary"
              },
              {
                name: "Dr. Swetha P",
                title: "Treasurer"
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                className="relative group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-blue-100 dark:border-gray-700 hover:shadow-2xl hover:shadow-blue-200/30 dark:hover:shadow-blue-500/20 transition-all duration-500 overflow-hidden"
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
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                    {member.name === "Dr. Manas Panigrahi" ? (
                      <img
                        src="/Dr. Manas P.jpg"
                        alt="Dr. Manas Panigrahi"
                        className="w-full h-full object-cover"
                      />
                    ) : member.name === "Dr. Raghavendra H" ? (
                      <img
                        src="/Dr. R H.jpg"
                        alt="Dr. Raghavendra H"
                        className="w-full h-full object-cover"
                      />
                    ) : member.name === "Dr. Swetha P" ? (
                      <img
                        src="/Dr S P.jpg"
                        alt="Dr. Swetha P"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-semibold">{member.title}</p>
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-blue-100 dark:border-gray-700 max-w-md mx-auto mb-8">
              <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Contact Information</h4>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p><strong>Contact Person:</strong> LAXMI PRABHA</p>
                <p><strong>Email:</strong> <a href="mailto:contact@ossapcon2026.com" className="text-blue-600 hover:text-blue-800">contact@ossapcon2026.com</a></p>
                <p><strong>Phone:</strong> <a href="tel:+919052192744" className="text-blue-600 hover:text-blue-800">+91 9052192744</a></p>
              </div>
            </div>
            
            <Link href="/committee">
              <Button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-full shadow-lg hover:shadow-blue-200/50 transition-all duration-300">
                View Complete Committee
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Explore Kurnool - Premium Horizontal Scrolling */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>

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
              <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wide">
                🏛️ Gateway of Rayalaseema
              </span>
            </motion.div>

            <motion.h2
              className="text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Discover Kurnool
            </motion.h2>

            <motion.p
              className="text-xl lg:text-2xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed"
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
                    image: "/Charminar.png"
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
                    image: "/KIMS.png"
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
                    image: "/placeholder.jpg"
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
                    image: "/placeholder.jpg"
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
                    image: "/placeholder.jpg"
                  },
                  {
                    name: "Kurnool City Center",
                    description: "Modern commercial hub with shopping and dining options",
                    category: "Modern",
                    rating: "4.2",
                    time: "2-3 hours",
                    bestTime: "Evening",
                    highlights: ["Shopping Centers", "Local Cuisine", "Urban Experience"],
                    icon: "🏢",
                    image: "/placeholder.jpg"
                  },
                  {
                    name: "Kondareddy Buruju",
                    description: "Historic watchtower offering panoramic views of Kurnool",
                    category: "Heritage",
                    rating: "4.3",
                    time: "1-2 hours",
                    bestTime: "Evening",
                    highlights: ["Historic Architecture", "City Views", "Photography Spot"],
                    icon: "🏗️",
                    image: "/placeholder.jpg"
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

      {/* Registration Section */}
      <section className="py-20 relative overflow-hidden bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="inline-block px-6 py-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wide">
                Independence Day Offer
              </span>
            </motion.div>

            <motion.h2
              className="text-5xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Secure Your Spot
            </motion.h2>

            <motion.p
              className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Join leading orthopedic professionals for three days of groundbreaking sessions, hands-on workshops, and networking opportunities.
            </motion.p>

            {/* Registration Card */}
            <motion.div
              className="bg-gradient-to-br from-blue-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 rounded-3xl p-8 shadow-2xl border border-blue-200 dark:border-gray-700 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="text-center mb-8">
                <div className="text-6xl font-black bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent mb-4">
                  ₹5,000
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Independence Day Offer</h3>
                <p className="text-gray-600 dark:text-gray-400">Independence Day special offer - Register now to secure your spot!</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8 text-left">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-gray-700 dark:text-gray-300">3 Days Full Access</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-gray-700 dark:text-gray-300">Welcome Kit</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-gray-700 dark:text-gray-300">All Meals Included</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-gray-700 dark:text-gray-300">Conference Certificate</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-gray-700 dark:text-gray-300">CME Credits</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-gray-700 dark:text-gray-300">Networking Sessions</span>
                  </div>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link href="/register">
                  <button className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-200/50 dark:hover:shadow-blue-900/50">
                    Register Now - ₹5,000
                  </button>
                </Link>
              </motion.div>

              <p className="text-xs text-gray-500 dark:text-gray-500 mt-4 text-center">
                *Independence Day offer now live! Early Bird registration starts from August 16.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Spectacular CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"></div>
        <div className="absolute inset-0 bg-white/10"></div>

        <motion.div
          className="relative z-10 container mx-auto px-6 text-center"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-7xl font-black mb-8 text-white">
            Ready to Shape
            <br />
            <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">The Future?</span>
          </h2>

          <p className="text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join the most revolutionary orthopedic conference ever conceived. Where advanced orthopedic surgery meets clinical
            excellence.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/register">
                <Button className="px-12 py-6 text-xl bg-white text-blue-600 hover:bg-gray-100 rounded-full shadow-2xl font-bold">
                  <Sparkles className="mr-3 h-6 w-6" />
                  Register Now
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/abstracts">
                <Button
                  variant="outline"
                  className="px-12 py-6 text-xl border-2 border-white text-white bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm font-bold shadow-lg"
                >
                  Submit Abstract
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Comprehensive Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-black text-white py-20">
        <div className="container mx-auto px-6">
          {/* Organizers Section */}
          <div className="mb-16">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-8 text-blue-400 leading-relaxed">Organized By</h3>
              <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12">
                {/* Orthopedic Surgeons Society of Andhra Pradesh */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    OSSAP
                  </div>
                  <p className="text-gray-300 text-center font-medium">Orthopedic Surgeons Society of Andhra Pradesh</p>
                </div>

                {/* Kurnool Medical College */}
                <div className="flex flex-col items-center space-y-4">
                  <img
                    src="/KIMS.png"
                    alt="Kurnool Medical College"
                    className="h-20 w-auto object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector('.fallback-logo')) {
                        const fallback = document.createElement('div');
                        fallback.className = 'fallback-logo h-20 w-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xl';
                        fallback.textContent = 'KMC';
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                  <p className="text-gray-300 text-center font-medium">Kurnool Medical College</p>
                </div>

                {/* Department of Orthopedics */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    DO
                  </div>
                  <p className="text-gray-300 text-center font-medium">Department of Orthopedics</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
            {/* Conference Info */}
            <div className="md:col-span-2 lg:col-span-1">
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent leading-tight py-2">
                OSSAPCON 2026
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Excellence in Orthopedic Care through innovation, collaboration, and excellence. Join us in Kurnool for three transformative days of medical learning.
              </p>
              <div className="space-y-2 text-gray-400">
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
              <h4 className="font-bold mb-6 text-blue-400 uppercase tracking-wide">Quick Links</h4>
              <ul className="space-y-3 text-gray-300">
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
              <h4 className="font-bold mb-6 text-blue-400 uppercase tracking-wide">Contact Information</h4>

              <div className="mb-6">
                <h5 className="font-semibold text-white mb-2">Conference Secretariat</h5>
                <p className="text-gray-300 text-sm">Dr. Raghavendra H</p>
                <p className="text-gray-400 text-sm">Conference Secretariat</p>
                <p className="text-gray-400 text-sm">Kurnool, Andhra Pradesh 518001</p>
              </div>

              {/* <div className="mb-6">
                <h5 className="font-semibold text-white mb-2">Registration Inquiries</h5>
                <p className="text-gray-300 text-sm">+91 9876 543 210</p>
                <p className="text-gray-300 text-sm">+91 9876 543 211</p>
                <p className="text-gray-300 text-sm">register@ossapcon2026.com</p>
                <p className="text-gray-400 text-xs">Mon-Fri: 9:00 AM - 6:00 PM</p>
              </div>

              <div>
                <h5 className="font-semibold text-white mb-2">Technical Support</h5>
                <p className="text-gray-300 text-sm">+91 9876 543 212</p>
                <p className="text-gray-300 text-sm">support@ossapcon2026.com</p>
                <p className="text-gray-300 text-sm">abstracts@ossapcon2026.com</p>
                <p className="text-gray-400 text-xs">Available 24/7</p>
              </div> */}
            </div>

            {/* Conference Manager */}
            <div>
              <h4 className="font-bold mb-6 text-blue-400 uppercase tracking-wide">Conference Manager</h4>

              <div className="mb-6">
                <h5 className="font-semibold text-white mb-2">Mr. Kiran Kumar Lella</h5>
                <p className="text-gray-400 text-sm mb-2">Conference Manager</p>
                <p className="text-gray-300 text-sm mb-1">Mobile: +91 – 9676541985</p>
                <p className="text-gray-300 text-sm mb-4">Email: kiran@cmchyd.com</p>

                {/* CMC Logo under Conference Manager */}
                <div className="flex items-center mt-4">
                  <img
                    src="/CMC Logo Footer.png"
                    alt="CMC Logo"
                    className="h-36 w-auto object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Social Media & Follow */}
            <div>
              <h4 className="font-bold mb-6 text-blue-400 uppercase tracking-wide">Follow Us</h4>
              <div className="flex space-x-4 mb-8">
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
                <h5 className="font-semibold text-white mb-4">Tech Partner</h5>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                    PurpleHat Events
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-400 text-sm">
                <p>&copy; 2026 OSSAPCON Conference. All rights reserved.</p>
                <p>Kurnool, Andhra Pradesh</p>
              </div>
              <div className="flex space-x-6 text-gray-400 text-sm">
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
              {/* Location Image */}
              <div className="w-full h-48 sm:h-64 rounded-lg overflow-hidden">
                <img
                  src={selectedLocation.image}
                  alt={selectedLocation.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Location Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Category</h3>
                    <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                      {selectedLocation.category}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Visit Duration</h3>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <span className="text-blue-500 mr-2">⏰</span>
                      {selectedLocation.time}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Best Time to Visit</h3>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <span className="text-blue-500 mr-2">🌅</span>
                      {selectedLocation.bestTime}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Rating</h3>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <span className="text-yellow-500 mr-2">⭐</span>
                      {selectedLocation.rating}/5.0
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Key Highlights</h3>
                  <div className="space-y-2">
                    {selectedLocation.highlights?.map((highlight: string, idx: number) => (
                      <div key={idx} className="flex items-center text-gray-600 dark:text-gray-400">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  onClick={() => handleGetDirections(selectedLocation.name)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white h-12"
                >
                  <NavigationIcon className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>

                <Button
                  onClick={() => {
                    const searchQuery = encodeURIComponent(`${selectedLocation.name} Kurnool tourism`)
                    window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank')
                  }}
                  variant="outline"
                  className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 h-12"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
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