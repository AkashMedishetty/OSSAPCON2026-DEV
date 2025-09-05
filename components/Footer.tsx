"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react"
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern"

export default function Footer() {
  return (
    <footer className="text-white py-16 relative overflow-hidden bg-[#0a0a0a]">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className="absolute -inset-40 h-[260%] w-[160%] skew-y-12"
      />
      <div className="container mx-auto px-6 relative z-10">
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
              
              {/* Apple Events Logo */}
              <div className="mt-4">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-ocean-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AE</span>
                </div>
                <p className="text-emerald-400 text-xs mt-2 font-semibold">Apple Events</p>
              </div>
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
  )
}


