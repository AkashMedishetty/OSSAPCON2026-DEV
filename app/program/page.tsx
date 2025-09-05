"use client"

import React, { useState } from "react"
import { motion, useReducedMotion, AnimatePresence } from "framer-motion"
import { Clock, MapPin, Users, Award, Calendar, Download, Play, Zap, Brain, Cpu, Bell, Mail, CheckCircle, X, Stethoscope, BookOpen, Target, Microscope, Activity, TrendingUp, Star, Shield, Phone } from "lucide-react"
import { Navigation } from "@/components/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const futuristicProgram = {
  day1: [
    {
      time: "08:00 - 09:00",
      title: "Neural Interface Registration",
      type: "registration",
      venue: "Quantum Lobby",
      description: "Biometric registration with AI-powered health scanning",
      icon: Brain,
      color: "from-cyan-500 to-blue-600",
      tech: "AI Biometrics",
    },
    {
      time: "09:00 - 09:30",
      title: "Holographic Opening Ceremony",
      type: "ceremony",
      venue: "Main Reality Chamber",
      description: "3D holographic welcome by global leaders",
      speakers: ["Dr. Rajesh Kumar - Quantum Chairman"],
      icon: Zap,
      color: "from-purple-500 to-pink-600",
      tech: "Holographic Projection",
    },
    {
      time: "09:30 - 10:30",
      title: "Keynote: Quantum Joint Replacement",
      type: "keynote",
      venue: "Main Reality Chamber",
      description: "Nano-scale joint reconstruction using quantum mechanics",
      speakers: ["Dr. Elena Vasquez - MIT Quantum Lab"],
      icon: Cpu,
      color: "from-blue-600 to-blue-700",
      tech: "Quantum Computing",
    },
    {
      time: "10:30 - 11:00",
      title: "Neural Coffee Break",
      type: "break",
      venue: "Molecular Café",
      description: "AI-optimized nutrition and networking",
      icon: Brain,
      color: "from-green-500 to-teal-600",
      tech: "Molecular Gastronomy",
    },
    {
      time: "11:00 - 12:30",
      title: "Session 1: Robotic Surgery Evolution",
      type: "session",
      venue: "Cybernetic Hall A",
      description: "Autonomous surgical robots with machine learning",
      speakers: ["Dr. Priya Sharma", "Dr. Yuki Tanaka", "Dr. Marcus Weber"],
      icon: Cpu,
      color: "from-blue-500 to-purple-600",
      tech: "Autonomous Robotics",
    },
    {
      time: "11:00 - 12:30",
      title: "Session 2: Genetic Bone Engineering",
      type: "session",
      venue: "Bio-Lab Chamber B",
      description: "CRISPR-based bone regeneration and enhancement",
      speakers: ["Dr. Meera Reddy", "Dr. Chen Liu", "Dr. Sarah Johnson"],
      icon: Brain,
      color: "from-pink-500 to-purple-600",
      tech: "CRISPR Technology",
    },
    {
      time: "12:30 - 13:30",
      title: "Molecular Lunch Experience",
      type: "break",
      venue: "Quantum Dining",
      description: "Personalized nutrition based on genetic analysis",
      icon: Zap,
      color: "from-yellow-500 to-blue-600",
      tech: "Personalized Medicine",
    },
    {
      time: "13:30 - 15:00",
      title: "Workshop: VR Surgical Training",
      type: "workshop",
      venue: "Virtual Reality Lab",
      description: "Immersive surgical training in virtual environments",
      speakers: ["Dr. Arun Patel", "Dr. Lisa Chen"],
      icon: Brain,
      color: "from-indigo-500 to-blue-600",
      tech: "Virtual Reality",
    },
    {
      time: "15:00 - 15:30",
      title: "Quantum Energy Break",
      type: "break",
      venue: "Energy Chamber",
      description: "Bioenergy optimization and meditation",
      icon: Zap,
      color: "from-teal-500 to-green-600",
      tech: "Bioenergy",
    },
    {
      time: "15:30 - 17:00",
      title: "Panel: AI Consciousness in Medicine",
      type: "panel",
      venue: "Main Reality Chamber",
      description: "Ethical implications of conscious AI in healthcare",
      speakers: ["Dr. AI Consciousness", "Dr. Ethics Bot", "Dr. Future Mind"],
      icon: Brain,
      color: "from-red-500 to-pink-600",
      tech: "AI Consciousness",
    },
    {
      time: "19:00 - 21:00",
      title: "Holographic Gala Dinner",
      type: "social",
      venue: "Interdimensional Ballroom",
      description: "Multi-dimensional cultural experience",
      icon: Zap,
      color: "from-purple-500 to-pink-600",
      tech: "Holographic Entertainment",
    },
  ],
  day2: [
    {
      time: "08:30 - 09:00",
      title: "Quantum Registration Portal",
      type: "registration",
      venue: "Quantum Lobby",
      description: "Instant molecular-level health assessment",
      icon: Cpu,
      color: "from-blue-500 to-cyan-600",
      tech: "Quantum Scanning",
    },
    {
      time: "09:00 - 10:00",
      title: "Keynote: Regenerative Immortality",
      type: "keynote",
      venue: "Main Reality Chamber",
      description: "Achieving biological immortality through bone regeneration",
      speakers: ["Dr. Immortal Bones - Future Institute"],
      icon: Brain,
      color: "from-green-500 to-blue-600",
      tech: "Regenerative Medicine",
    },
    {
      time: "10:00 - 10:30",
      title: "Neural Enhancement Break",
      type: "break",
      venue: "Cognitive Café",
      description: "Brain-computer interface demonstrations",
      icon: Brain,
      color: "from-purple-500 to-blue-600",
      tech: "Neural Interface",
    },
    {
      time: "10:30 - 12:00",
      title: "Session 3: Nano-Medicine Revolution",
      type: "session",
      venue: "Molecular Hall A",
      description: "Microscopic robots for cellular repair",
      speakers: ["Dr. Nano Expert", "Dr. Micro Surgeon", "Dr. Cellular Pro"],
      icon: Cpu,
      color: "from-blue-600 to-blue-700",
      tech: "Nanotechnology",
    },
    {
      time: "10:30 - 12:00",
      title: "Session 4: Quantum Sports Medicine",
      type: "session",
      venue: "Athletic Enhancement Lab",
      description: "Quantum-enhanced athletic performance",
      speakers: ["Dr. Quantum Athlete", "Dr. Performance Plus", "Dr. Speed Force"],
      icon: Zap,
      color: "from-yellow-500 to-blue-600",
      tech: "Quantum Enhancement",
    },
    {
      time: "12:00 - 13:00",
      title: "Future Minds Forum",
      type: "forum",
      venue: "Consciousness Chamber",
      description: "Young researchers present breakthrough discoveries",
      speakers: ["Next-Gen Innovators"],
      icon: Brain,
      color: "from-pink-500 to-purple-600",
      tech: "Innovation Showcase",
    },
    {
      time: "13:00 - 14:00",
      title: "Molecular Gastronomy Lunch",
      type: "break",
      venue: "Quantum Dining",
      description: "Food designed at the molecular level",
      icon: Zap,
      color: "from-green-500 to-teal-600",
      tech: "Molecular Cuisine",
    },
    {
      time: "14:00 - 15:30",
      title: "Holographic Research Presentations",
      type: "presentation",
      venue: "Multiple Reality Chambers",
      description: "3D holographic research demonstrations",
      speakers: ["Holographic Presenters"],
      icon: Brain,
      color: "from-indigo-500 to-purple-600",
      tech: "Holographic Display",
    },
    {
      time: "15:30 - 16:00",
      title: "Quantum Energy Restoration",
      type: "break",
      venue: "Energy Chamber",
      description: "Quantum field energy restoration",
      icon: Zap,
      color: "from-cyan-500 to-blue-600",
      tech: "Quantum Energy",
    },
    {
      time: "16:00 - 17:00",
      title: "Interdimensional Awards Ceremony",
      type: "ceremony",
      venue: "Main Reality Chamber",
      description: "Recognition across multiple dimensions",
      speakers: ["Quantum Committee"],
      icon: Award,
      color: "from-gold-500 to-yellow-600",
      tech: "Interdimensional Tech",
    },
    {
      time: "17:00 - 17:30",
      title: "Portal Closing Ceremony",
      type: "ceremony",
      venue: "Main Reality Chamber",
      description: "Closing the conference portal to the future",
      speakers: ["Dr. Rajesh Kumar"],
      icon: Zap,
      color: "from-purple-500 to-pink-600",
      tech: "Portal Technology",
    },
  ],
}

const getTypeColor = (type: string) => {
  const colors = {
    keynote: "from-blue-500 to-blue-700",
    session: "from-blue-500 to-purple-600",
    workshop: "from-green-500 to-teal-600",
    panel: "from-purple-500 to-pink-600",
    ceremony: "from-red-500 to-pink-600",
    break: "from-gray-500 to-gray-600",
    registration: "from-yellow-500 to-blue-600",
    social: "from-pink-500 to-purple-600",
    forum: "from-indigo-500 to-blue-600",
    presentation: "from-teal-500 to-cyan-600",
  }
  return colors[type as keyof typeof colors] || "from-gray-500 to-gray-600"
}

export default function ProgramPage() {
  const [selectedTrack, setSelectedTrack] = useState('all')
  const [isNotifyOpen, setIsNotifyOpen] = useState(false)
  const [email, setEmail] = useState("")
  const shouldReduceMotion = useReducedMotion()

  const handleNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'program'
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
// Remove setIsSubmitted since it's not defined and not needed
        setTimeout(() => {
          setIsNotifyOpen(false)
// Remove setIsSubmitted since it's not defined
          setEmail("")
        }, 2000)
      } else {
        console.error('Failed to subscribe:', data.error)
        alert('Failed to subscribe. Please try again.')
      }
    } catch (error) {
      console.error('Error subscribing to notifications:', error)
      alert('Failed to subscribe. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-ocean-50 text-midnight-800 overflow-hidden dark:from-midnight-900 dark:to-midnight-800 dark:text-midnight-100">
      <Navigation currentPage="program" />

      <div className="pt-16 md:pt-20 lg:pt-24">
        {/* Zigzag Hero Section - Completely New Layout */}
        <section className="relative py-20 md:py-32 overflow-visible">
          {/* Diagonal Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-emerald-100/50 to-ocean-100/30 dark:from-midnight-800/40 dark:to-midnight-700/30 transform -skew-y-3 origin-top-left"></div>
            <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-tl from-sapphire-100/50 to-emerald-100/30 dark:from-midnight-800/40 dark:to-midnight-700/30 transform skew-y-3 origin-bottom-right"></div>
            <div className="absolute top-20 right-20 w-80 h-80 rounded-full blur-3xl bg-gradient-to-br from-emerald-400/20 to-ocean-500/20 dark:from-midnight-600/30 dark:to-midnight-500/30 animate-[pulse_16s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full blur-3xl bg-gradient-to-br from-ocean-400/20 to-sapphire-500/20 dark:from-midnight-600/30 dark:to-midnight-500/30 animate-[pulse_18s_ease-in-out_infinite]" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <motion.div
                initial={shouldReduceMotion ? undefined : { opacity: 0, x: -50 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Badge variant="success" size="lg" className="mb-6">
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Conference Program
                </Badge>
                
                <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight tracking-tight">
                  <span className="block bg-gradient-to-r from-emerald-600 to-ocean-600 bg-clip-text text-transparent">
                    SCIENTIFIC
                  </span>
                  <span className="block bg-gradient-to-r from-ocean-600 to-sapphire-600 bg-clip-text text-transparent">
                    PROGRAM
                  </span>
                </h1>

                <p className="text-fluid-xl text-midnight-600 dark:text-midnight-300 mb-8 leading-relaxed">
                  Three days of cutting-edge orthopedic science, featuring world-class speakers, innovative research presentations, and hands-on workshops.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button size="xl" className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700" asChild>
                    <Link href="/register">
                      <Calendar className="w-5 h-5 mr-2" />
                      Register Now
                    </Link>
                  </Button>
                  <Button 
                    size="xl" 
                    variant="outline" 
                    onClick={() => setIsNotifyOpen(true)}
                    className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                  >
                    <Bell className="w-5 h-5 mr-2" />
                    Get Updates
                  </Button>
                </div>

                {/* Conference Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-midnight-800 dark:text-midnight-200">February 6-8, 2026</p>
                      <p className="text-fluid-sm text-midnight-600 dark:text-midnight-400">Three Days</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-ocean-100 text-ocean-600">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-midnight-800 dark:text-midnight-200">Kurnool, AP</p>
                      <p className="text-fluid-sm text-midnight-600 dark:text-midnight-400">Kurnool Medical College</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Visual - Program Preview Cards */}
              <motion.div
                initial={shouldReduceMotion ? undefined : { opacity: 0, x: 50 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative z-10"
              >
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 md:gap-6">
                  {[
                    { title: "Keynote Sessions", count: "6+", icon: Star, color: "emerald" },
                    { title: "Workshops", count: "12+", icon: BookOpen, color: "ocean" },
                    { title: "Research Papers", count: "50+", icon: Microscope, color: "sapphire" },
                    { title: "Expert Speakers", count: "25+", icon: Users, color: "coral" }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
                      animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Card variant="glass" className="text-center bg-white/90 dark:bg-midnight-800/90 border border-gray-200 dark:border-midnight-700">
                        <CardContent className="p-5 md:p-6">
                          <div className={`w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center ${
                            item.color === 'emerald' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' :
                            item.color === 'ocean' ? 'bg-gradient-to-br from-ocean-500 to-ocean-600' :
                            item.color === 'sapphire' ? 'bg-gradient-to-br from-sapphire-500 to-sapphire-600' :
                            'bg-gradient-to-br from-coral-400 to-coral-500'
                          } text-white`}>
                            <item.icon className="w-6 h-6" />
                          </div>
                          <div className={`text-3xl md:text-4xl font-black mb-2 ${
                            item.color === 'emerald' ? 'text-emerald-600' :
                            item.color === 'ocean' ? 'text-ocean-600' :
                            item.color === 'sapphire' ? 'text-sapphire-600' :
                            'text-coral-500'
                          }`}>
                            {item.count}
                          </div>
                          <div className="text-sm md:text-base font-semibold text-midnight-700 dark:text-midnight-300">
                            {item.title}
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

        {/* Program Tracks - Circular Layout */}
        <section className="py-20 relative bg-gradient-to-r from-white via-emerald-50/30 to-ocean-50/20 dark:from-midnight-800 dark:to-midnight-900">
          <div className="container mx-auto px-6">
            <motion.div
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="font-display text-fluid-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-ocean-600 bg-clip-text text-transparent">
                Program Tracks
              </h2>
              <p className="text-fluid-xl text-midnight-600 dark:text-midnight-300 max-w-3xl mx-auto">
                Specialized tracks designed for different aspects of orthopedic practice
              </p>
            </motion.div>

            {/* Track Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-10">
              {[
                { id: 'all', label: 'All Tracks', icon: Target },
                { id: 'surgery', label: 'Surgical Techniques', icon: Microscope },
                { id: 'research', label: 'Research & Innovation', icon: Brain },
                { id: 'education', label: 'Medical Education', icon: BookOpen },
                { id: 'technology', label: 'Technology', icon: Cpu }
              ].map((track) => (
                <Button
                  key={track.id}
                  variant={selectedTrack === track.id ? "default" : "outline"}
                  size="lg"
                  onClick={() => setSelectedTrack(track.id)}
                  className={selectedTrack === track.id ? 
                    "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700" :
                    "border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-midnight-600 dark:text-midnight-100 dark:hover:bg-midnight-700/40"
                  }
                >
                  <track.icon className="w-4 h-4 mr-2" />
                  {track.label}
                </Button>
              ))}
            </div>

            {/* Circular Track Layout */}
            <div className="relative max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    title: "Advanced Surgical Techniques",
                    icon: Microscope,
                    color: "emerald",
                    track: "surgery"
                  },
                  {
                    title: "Trauma & Emergency Care",
                    icon: Activity,
                    color: "coral",
                    track: "surgery"
                  },
                  {
                    title: "Research Methodologies",
                    icon: Brain,
                    color: "sapphire",
                    track: "research"
                  },
                  {
                    title: "Biomechanics & Materials",
                    icon: Shield,
                    color: "ocean",
                    track: "technology"
                  },
                  {
                    title: "Medical Education",
                    icon: BookOpen,
                    color: "amber",
                    track: "education"
                  },
                  {
                    title: "Digital Health",
                    icon: TrendingUp,
                    color: "emerald",
                    track: "technology"
                  }
                ].filter(item => selectedTrack === 'all' || item.track === selectedTrack).map((item, index) => (
                  <motion.div
                    key={index}
                    initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
                    whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Card variant="glass" className="h-full bg-white/90 dark:bg-midnight-800/90 border border-gray-200 dark:border-midnight-700">
                      <CardHeader>
                        <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                          item.color === 'emerald' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' :
                          item.color === 'coral' ? 'bg-gradient-to-br from-coral-400 to-coral-500' :
                          item.color === 'sapphire' ? 'bg-gradient-to-br from-sapphire-500 to-sapphire-600' :
                          item.color === 'ocean' ? 'bg-gradient-to-br from-ocean-500 to-ocean-600' :
                          item.color === 'amber' ? 'bg-gradient-to-br from-amber-400 to-amber-500' :
                          'bg-gradient-to-br from-emerald-500 to-emerald-600'
                        } text-white`}>
                          <item.icon className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-center text-lg md:text-xl text-midnight-900 dark:text-white">{item.title}</CardTitle>
                        <Badge variant="outline" className="mx-auto text-midnight-700 dark:text-midnight-200 border-emerald-200 dark:border-midnight-600">
                          Coming Soon
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-center text-midnight-700 dark:text-midnight-300">
                          Program details will be announced soon. Stay tuned for updates.
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* COMMENTED OUT - Detailed Program Content */}
        {/*
        <section className="py-8 md:py-16 relative">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-8 md:mb-16">
              ... (all the existing detailed program content remains here, commented out)
            </div>
          </div>
        </section>
        */}

        {/* COMMENTED OUT - Day Selector & Program Schedule 
        <section className="py-4 md:py-8">
          ... (all existing day selector and program schedule content remains here, commented out)
        </section>
        */}



        {/* Coming Soon Banner - Wave Design */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-ocean-600 to-sapphire-600"></div>
          <div className="absolute inset-0">
            <svg className="absolute bottom-0 w-full h-32" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="rgba(255,255,255,0.1)"></path>
            </svg>
          </div>

          <motion.div
            className="relative z-10 container mx-auto px-6 text-center"
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 50 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="glass" size="lg" className="mb-8 text-emerald-800 bg-white/90 border-white/50">
              <Zap className="w-4 h-4 mr-2" />
              Program Coming Soon
            </Badge>

            <h2 className="font-display text-fluid-5xl font-bold mb-8 text-white">
              Detailed Program
              <br />
              <span className="text-emerald-200 drop-shadow-lg">
                Under Development
              </span>
            </h2>

            <p className="text-fluid-xl text-white mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
              Our organizing committee is carefully crafting a comprehensive program featuring world-class speakers, cutting-edge research, and hands-on workshops.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="xl" className="bg-emerald-600 text-white hover:bg-emerald-700" asChild>
                <Link href="/register">
                  <Calendar className="w-5 h-5 mr-2" />
                  Register Now
                </Link>
              </Button>
              <Button 
                size="xl" 
                variant="outline" 
                className="border-white/50 text-white hover:bg-white/20 bg-white/10"
                onClick={() => setIsNotifyOpen(true)}
              >
                <Bell className="w-5 h-5 mr-2" />
                Get Notified
              </Button>
            </div>


          </motion.div>
        </section>

        {/* Email Notification Modal */}
        {isNotifyOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
            >
              <button
                onClick={() => setIsNotifyOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  Get Notified
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Be the first to know when our program is released
                </p>
              </div>

              <form onSubmit={handleNotifySubmit} className="space-y-6">
                <div>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsNotifyOpen(false)}
                    className="flex-1 py-3 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Notify Me
                  </Button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  We'll only send you updates about the conference program. No spam, ever.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </div>


    </div>
  )
}