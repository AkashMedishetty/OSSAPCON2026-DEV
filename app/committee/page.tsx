"use client"

import { useState } from "react"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Award, Sparkles, Users, MapPin, Calendar } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const committeeMembers = [
  {
    id: 1,
    name: "DR. K. SRINIVAS",
    title: "Organizing Chairman",
    credentials: "MS ORTHO",
    position: "PROF AND HOD DEPT OF ORTHOPAEDICS",
    institution: "KURNOOL MEDICAL COLLEGE",
    image: "/Srinivas_DR.png",
  },
  {
    id: 2,
    name: "DR. K. VENKATESWARLU",
    title: "Organizing Secretary",
    credentials: "MS ORTHO",
    position: "SUPERINTENDENT",
    institution: "GGH KURNOOL",
    image: "/Venkateshwalu_DR.png",
  },
  {
    id: 3,
    name: "DR A.M. ILIAS BASHA",
    title: "Organizing Secretary",
    credentials: "MS ORTHO",
    position: "PROF OF ORTHOPAEDICS",
    institution: "KURNOOL MEDICAL COLLEGE",
    image: "/Iliyas_DR.png",
  },
  {
    id: 4,
    name: "DR. K. VIJAYMOHAN REDDY",
    title: "Treasurer",
    credentials: "MS ORTHO",
    position: "PROF OF ORTHOPAEDICS",
    institution: "KURNOOL MEDICAL COLLEGE",
    image: "/Vijay_DR.png",
  },
  {
    id: 5,
    name: "DR. Y. RAMANA",
    title: "Co‑Organizing Chairman",
    credentials: "MS ORTHO",
    position: "SENIOR ORTHOPAEDIC SURGEON",
    institution: "KURNOOL MEDICAL COLLEGE",
    image: "/RAMANA_DR.png",
  },
  {
    id: 6,
    name: "DR. M. RAJESH KUMAR",
    title: "Joint Secretary",
    credentials: "MS ORTHO",
    position: "—",
    institution: "—",
    image: "/RAJESH_DR.png",
  },
  {
    id: 7,
    name: "DR. N. R. S. MURTHY",
    title: "Joint Secretary",
    credentials: "MS ORTHO",
    position: "—",
    institution: "—",
    image: "/placeholder-user.jpg",
  },
  {
    id: 8,
    name: "DR. RAGHUNATHA REDDY",
    title: "Joint Secretary",
    credentials: "MS ORTHO",
    position: "—",
    institution: "—",
    image: "/placeholder-user.jpg",
  },
  {
    id: 9,
    name: "DR. D. RAJAIAH",
    title: "Scientific Committee Chairman",
    credentials: "MS ORTHO",
    position: "—",
    institution: "—",
    image: "/Rajayya_DR.png",
  },
]



export default function CommitteePage() {
  const [selectedMember, setSelectedMember] = useState<number | null>(null)
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-50 via-white to-sapphire-50 text-midnight-800 overflow-hidden dark:from-midnight-900 dark:to-midnight-800 dark:text-midnight-100">
      <Navigation currentPage="committee" />

      <div className="pt-16 md:pt-20 lg:pt-24">
        {/* Hero Section - Completely New Design */}
        <section className="relative py-20 md:py-32 lg:py-48 overflow-hidden">
          {/* Dynamic Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-ocean-50 via-sapphire-50/50 to-emerald-50/30 dark:from-midnight-900 dark:via-midnight-800 dark:to-midnight-900"></div>

          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-ocean-400/20 to-sapphire-500/20 rounded-full blur-3xl animate-[pulse_12s_ease-in-out_infinite]"></div>
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-ocean-500/20 rounded-full blur-3xl animate-[pulse_14s_ease-in-out_infinite]" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-sapphire-300/10 to-emerald-300/10 rounded-full blur-2xl animate-[pulse_16s_ease-in-out_infinite]" style={{ animationDelay: '4s' }}></div>
          </div>

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <motion.div
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 40 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-6xl mx-auto"
            >
              {/* Conference Info Badge */}
              <motion.div
                initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <Badge variant="glass" size="lg" className="text-ocean-700 font-medium">
                  <Calendar className="w-4 h-4 mr-2" />
                  OSSAPCON 2026 • February 6-8, 2026
                </Badge>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="font-display text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight tracking-tight"
              >
                <span className="block bg-gradient-to-r from-ocean-600 via-sapphire-600 to-emerald-600 bg-clip-text text-transparent">
                  ORGANIZING
                </span>
                <span className="block bg-gradient-to-r from-emerald-600 via-ocean-600 to-sapphire-600 bg-clip-text text-transparent">
                  COMMITTEE
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-fluid-xl text-midnight-600 dark:text-midnight-300 mb-12 max-w-4xl mx-auto leading-relaxed"
              >
                Distinguished medical professionals leading the advancement of orthopedic science and surgical excellence in Kurnool.
              </motion.p>

              {/* Key Info Cards */}
              <motion.div
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto"
              >
                {[
                  { icon: Users, title: "Leadership", desc: "Expert Medical Guidance", color: "ocean" },
                  { icon: Award, title: "Excellence", desc: "Proven Track Record", color: "emerald" },
                  { icon: Sparkles, title: "Innovation", desc: "Advancing Healthcare", color: "sapphire" },
                ].map((item, index) => (
                  <Card key={index} variant="glass" padding="lg" interactive="hover" className="text-center group bg-white/95 dark:bg-midnight-800/95 border border-gray-200 dark:border-midnight-700 shadow-sm">
                    <CardContent>
                      <item.icon className={`w-12 h-12 mx-auto mb-3 md:mb-4 transition-transform duration-300 group-hover:scale-110 ${item.color === 'ocean' ? 'text-ocean-600' :
                        item.color === 'emerald' ? 'text-emerald-600' :
                          'text-sapphire-600'
                        }`} />
                      <h3 className="font-display text-lg md:text-xl font-bold text-midnight-900 dark:text-white mb-1 md:mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm md:text-base text-midnight-700 dark:text-midnight-300">
                        {item.desc}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Key Organizers Section - Completely New Design */}
        <section className="py-20 md:py-32 lg:py-40 relative">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-ocean-50/20 to-sapphire-50/30 dark:from-midnight-800 dark:to-midnight-900"></div>

          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-ocean-300/20 to-emerald-300/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-sapphire-300/20 to-ocean-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
          </div>

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            {/* Section Header */}
            <motion.div
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16 md:mb-20"
            >
              <Badge variant="glass" size="lg" className="mb-6">
                <Users className="w-4 h-4 mr-2" />
                Leadership Team
              </Badge>
              <h2 className="font-display text-fluid-6xl font-bold mb-6 bg-gradient-to-r from-ocean-600 to-sapphire-600 bg-clip-text text-transparent">
                Key Organizers
              </h2>
              <p className="text-fluid-xl text-midnight-600 dark:text-midnight-300 max-w-3xl mx-auto leading-relaxed">
                Dedicated professionals steering OSSAPCON 2026 towards excellence in orthopedic education and innovation.
              </p>
            </motion.div>

            {/* Committee Members Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-7xl mx-auto">
              {committeeMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={shouldReduceMotion ? undefined : { opacity: 0, y: 40 }}
                  whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <Card
                    variant="glass"
                    padding="none"
                    interactive="hover"
                    className="overflow-hidden h-full cursor-pointer bg-white/95 dark:bg-midnight-800/95 border border-gray-200 dark:border-midnight-700"
                    onClick={() => setSelectedMember(selectedMember === member.id ? null : member.id)}
                  >
                    <div className="flex flex-col md:flex-row h-full">
                      {/* Profile Photo */}
                      <div className="relative w-full md:w-80 h-64 md:h-auto flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-midnight-700">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                        {/* Position Badge */}
                        <div className="hidden md:block absolute top-4 left-4">
                          <Badge
                            variant="glass"
                            size="lg"
                            className="bg-white/90 dark:bg-midnight-900/80 text-black dark:text-white font-semibold backdrop-blur-md px-4 py-2 shadow-md rounded-full"
                          >
                            {member.title}
                          </Badge>
                        </div>
                      </div>

                      {/* Content Section (minimal) */}
                      <div className="flex-1 p-6 md:p-8 flex flex-col bg-white dark:bg-midnight-800/90">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-fluid-2xl text-midnight-900 dark:text-white">
                            {member.name}
                          </CardTitle>
                          <CardDescription className="text-fluid-sm font-semibold text-midnight-700 dark:text-midnight-200">
                            {member.title}
                          </CardDescription>
                        </CardHeader>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional committee grid removed per request */}

        {/* Vision Statement */}
        {/* <section className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-900"></div>

          <motion.div
            className="relative z-10 container mx-auto px-4 md:px-6 text-center"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto">
              <motion.div
                className="relative p-6 md:p-8 lg:p-12 rounded-2xl md:rounded-3xl bg-white dark:bg-gray-800 backdrop-blur-xl border border-orange-200 dark:border-gray-700 shadow-xl"
                whileHover={{ scale: 1.02, rotateY: 2 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-600/5 rounded-2xl md:rounded-3xl blur-xl"></div>

                <div className="relative z-10">
                  <Sparkles className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-orange-500 mx-auto mb-6 md:mb-8" />

                  <blockquote className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light text-gray-800 dark:text-gray-100 mb-6 md:mb-8 leading-relaxed italic">
                    "We are not just organizing a conference—we are orchestrating the future of human mobility. Every
                    innovation, every breakthrough, every moment of collaboration brings us closer to a world where
                    orthopedic limitations become obsolete."
                  </blockquote>

                  <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-4">
                    <div className="hidden md:block w-8 lg:w-16 h-0.5 bg-gradient-to-r from-transparent to-orange-500"></div>
                    <Award className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-orange-500" />
                    <span className="text-sm md:text-base lg:text-lg font-semibold text-orange-600 uppercase tracking-wide text-center">
                      Our Vision Statement
                    </span>
                    <Award className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-orange-500" />
                    <div className="hidden md:block w-8 lg:w-16 h-0.5 bg-gradient-to-l from-transparent to-orange-500"></div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section> */}
      </div>
    </div>
  )
}