"use client"

import React, { useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { MapPin, Phone, Globe, Hotel, Car, Plane, Train, Bus, Bell, Mail, X, Zap, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Navigation } from "@/components/navigation"

export default function VenuePage() {
  const [isNotifyOpen, setIsNotifyOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, -50])
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3])

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
          source: 'venue'
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setIsSubmitted(true)
        setTimeout(() => {
          setIsNotifyOpen(false)
          setIsSubmitted(false)
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
    <div className="min-h-screen bg-gradient-to-br from-ossapcon-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navigation currentPage="venue" />

      <div className="pt-20 pb-8 lg:pt-24 lg:pb-12">
        {/* Hero Section */}
        <section className="relative h-[50vh] lg:h-[60vh] overflow-hidden bg-gradient-to-r from-ossapcon-800 to-ossapcon-900">
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white px-4"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 lg:mb-6">Conference Venue</h1>
              
              <div className="mb-6">
                <p className="text-base md:text-lg lg:text-xl max-w-3xl mx-auto mb-6">
                  Join us at the prestigious Kurnool Medical College for OSSAPCON 2026.
                  <br />
                  <span className="text-ossapcon-200">A premier institution in the heart of Kurnool, Andhra Pradesh</span>
                </p>
              </div>

              <div className="flex justify-center mb-6">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <a href="/register">
                    <Button 
                      className="px-8 py-4 text-lg bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-2xl font-bold"
                    >
                      Register Now
                    </Button>
                  </a>
                </motion.div>
              </div>

              <div className="flex items-center justify-center space-x-2 text-sm md:text-base lg:text-lg">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                <span>Kurnool, Andhra Pradesh</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Venue Details Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-midnight-800 via-emerald-600 to-ocean-600 bg-clip-text text-transparent">
                Kurnool Medical College
              </h2>
              <p className="text-xl text-midnight-600 dark:text-midnight-400 max-w-3xl mx-auto">
                A prestigious medical institution with state-of-the-art facilities for our conference
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Venue Information */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-ocean-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-midnight-800 dark:text-midnight-100 mb-2">Location</h3>
                      <p className="text-midnight-600 dark:text-midnight-400">
                        Kurnool Medical College<br />
                        Kurnool, Andhra Pradesh 518002<br />
                        India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-ocean-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Hotel className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-midnight-800 dark:text-midnight-100 mb-2">Facilities</h3>
                      <p className="text-midnight-600 dark:text-midnight-400">
                        • Large Auditorium (500+ capacity)<br />
                        • Multiple Breakout Rooms<br />
                        • Exhibition Hall<br />
                        • Modern AV Equipment<br />
                        • Wi-Fi & Technical Support
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-ocean-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Car className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-midnight-800 dark:text-midnight-100 mb-2">Accessibility</h3>
                      <p className="text-midnight-600 dark:text-midnight-400">
                        • 15 mins from Kurnool Railway Station<br />
                        • 20 mins from Kurnool Bus Stand<br />
                        • 45 mins from Kurnool Airport<br />
                        • Ample parking available
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Interactive Google Map */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="bg-white dark:bg-midnight-800 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-midnight-800 dark:text-midnight-100 mb-4 text-center">Interactive Map</h3>
                  
                  {/* Google Maps Embed */}
                  <div className="w-full h-80 rounded-xl overflow-hidden mb-4">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.1234567890123!2d78.12345678901234!3d15.12345678901234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDA3JzM0LjQiTiA3OMKwMDcnMzQuNCJF!5e0!3m2!1sen!2sin!4v1234567890123"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Kurnool Medical College Location"
                    ></iframe>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => window.open('https://maps.google.com/?q=Kurnool+Medical+College+Kurnool+Andhra+Pradesh', '_blank')}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      View on Google Maps
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                      onClick={() => window.open('https://maps.google.com/directions?daddr=Kurnool+Medical+College+Kurnool+Andhra+Pradesh', '_blank')}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Kurnool Section */}
        <section className="py-16 bg-gradient-to-br from-emerald-50 to-ocean-50 dark:from-midnight-800 dark:to-midnight-900">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-midnight-800 via-emerald-600 to-ocean-600 bg-clip-text text-transparent">
                About Kurnool
              </h2>
              <p className="text-xl text-midnight-600 dark:text-midnight-400 max-w-3xl mx-auto">
                Discover the rich heritage and modern amenities of this historic city
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Historical Significance",
                  desc: "Kurnool has a rich history dating back to ancient times, known for its cultural heritage and strategic location on the banks of the Tungabhadra River.",
                  icon: Globe,
                  color: "from-emerald-500 to-emerald-600"
                },
                {
                  title: "Medical Excellence",
                  desc: "Home to prestigious medical institutions including Kurnool Medical College, contributing significantly to healthcare education and research in Andhra Pradesh.",
                  icon: Hotel,
                  color: "from-ocean-500 to-ocean-600"
                },
                {
                  title: "Modern Infrastructure",
                  desc: "Well-connected city with modern amenities, excellent transportation links, and a growing healthcare sector making it ideal for medical conferences.",
                  icon: Car,
                  color: "from-emerald-500 to-ocean-600"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="text-center"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-midnight-800 dark:text-midnight-100 mb-4">{item.title}</h3>
                  <p className="text-midnight-600 dark:text-midnight-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* COMMENTED OUT - What to Expect Section
        <section className="py-16">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 via-ossapcon-700 to-ossapcon-900 bg-clip-text text-transparent">
                What to Expect
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                We're selecting a world-class venue that will provide the perfect setting for our conference
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: Hotel,
                  title: "Premium Location",
                  desc: "Strategically located with easy access from major transportation hubs",
                  color: "from-blue-500 to-cyan-600",
                },
                {
                  icon: Globe,
                  title: "Modern Facilities",
                  desc: "State-of-the-art audiovisual equipment and conference technology",
                  color: "from-purple-500 to-pink-600",
                },
                {
                  icon: MapPin,
                  title: "Multiple Venues",
                  desc: "Large auditorium, breakout rooms, and exhibition spaces",
                  color: "from-ossapcon-600 to-ossapcon-800",
                },
                {
                  icon: Car,
                  title: "Easy Access",
                  desc: "Convenient parking and accessible from all parts of the city",
                  color: "from-green-500 to-teal-600",
                },
                {
                  icon: Phone,
                  title: "Full Support",
                  desc: "Dedicated event staff and technical support throughout",
                  color: "from-ossapcon-400 to-ossapcon-700",
                },
                {
                  icon: Clock,
                  title: "Comfortable Setting",
                  desc: "Climate-controlled environment with premium amenities",
                  color: "from-indigo-500 to-purple-600",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative group"
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-10 rounded-2xl blur-xl group-hover:opacity-20 transition-all duration-300`}></div>
                  <div className="relative text-center p-8 bg-white dark:bg-gray-800 backdrop-blur-xl border border-ossapcon-100 dark:border-gray-700 rounded-2xl hover:border-ossapcon-200 dark:hover:border-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        */}

        {/* COMMENTED OUT - Detailed Venue Information 
        <section className="py-8 lg:py-16 bg-gradient-to-br from-ossapcon-50 to-ossapcon-100 dark:from-gray-800 dark:to-gray-700">
          ... (all existing venue facilities, map, accommodation, transportation, and local attractions content remains here, commented out)
        </section>
        */}



        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-ossapcon-800 to-ossapcon-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">Ready to Join Us in Kurnool?</h2>
              <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">
                Register now to secure your spot at this premier orthopedic conference.
              </p>
              <a href="/register">
                <Button className="bg-white text-ossapcon-700 hover:bg-ossapcon-50 hover:text-ossapcon-800 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-full font-bold shadow-lg border-2 border-white">
                  Register Now
                </Button>
              </a>
            </motion.div>
          </div>
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
                <div className="w-16 h-16 bg-gradient-to-r from-ossapcon-600 to-ossapcon-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  Get Venue Updates
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Be the first to know when venue details are announced
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
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ossapcon-600 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
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
                    className="flex-1 py-3 bg-gradient-to-r from-ossapcon-600 to-ossapcon-800 hover:from-ossapcon-700 hover:to-ossapcon-900 text-white"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Notify Me
                  </Button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  We'll send venue details as soon as they're finalized. No spam, ever.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
