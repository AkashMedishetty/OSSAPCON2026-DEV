"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, X, Sun, Moon, Monitor, User, LogOut, Settings, Bell, Search, Home, Calendar, Users, FileText, MapPin, Mail, Phone } from "lucide-react"
import { useTheme } from "next-themes"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

const navigationItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Committee", href: "/committee", icon: Users },
  { name: "Program", href: "/program", icon: Calendar },
  { name: "Abstracts", href: "/abstracts", icon: FileText },
  { name: "Venue", href: "/venue", icon: MapPin },
  { name: "Register", href: "/register", icon: User },
  { name: "Contact", href: "/contact", icon: Mail },
]

function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon-sm" className="glass">
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="glass" size="icon-sm" className="interactive">
          {theme === "light" ? (
            <Sun className="h-4 w-4" />
          ) : theme === "dark" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Monitor className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass border-white/20">
        <DropdownMenuItem onClick={() => setTheme("light")} className="hover:bg-ocean-50">
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="hover:bg-ocean-50">
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="hover:bg-ocean-50">
          <Monitor className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function UserMenu() {
  const { data: session } = useSession()

  if (!session) return null

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-2 interactive">
          <div className="flex items-center gap-3">
            <Avatar size="sm" variant="ring-primary">
              <AvatarImage src={(session.user as any)?.image || undefined} />
              <AvatarFallback variant="default">
                {getInitials(session.user?.name || session.user?.email?.split('@')[0] || 'User')}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-midnight-800 dark:text-white">
                {session.user?.name || 'User'}
              </p>
              <p className="text-xs text-midnight-500 dark:text-midnight-400">
                {session.user?.email}
              </p>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 glass border-white/20">
        <DropdownMenuLabel>
          <div className="flex items-center gap-3">
            <Avatar size="default" variant="ring-primary">
              <AvatarImage src={(session.user as any)?.image || undefined} />
              <AvatarFallback variant="default">
                {getInitials(session.user?.name || session.user?.email?.split('@')[0] || 'User')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{session.user?.name || 'User'}</p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {session.user?.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex items-center hover:bg-ocean-50 text-gray-900 dark:text-white">
            <User className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile" className="flex items-center hover:bg-ocean-50 text-gray-900 dark:text-white">
            <Settings className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        {session.user?.role === 'admin' && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="flex items-center hover:bg-ocean-50 text-gray-900 dark:text-white">
              <Settings className="mr-2 h-4 w-4" />
              Admin Panel
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-coral-600 dark:text-coral-400 hover:bg-coral-50 dark:hover:bg-coral-900/20">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface NavigationProps {
  currentPage?: string;
}

export function Navigation({ currentPage }: NavigationProps = {}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { data: session, status } = useSession()
  const { scrollY } = useScroll()
  
  // Enhanced scroll detection
  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setIsScrolled(latest > 50)
    })
    return unsubscribe
  }, [scrollY])
  
  const isActivePage = (href: string) => {
    if (href === "/" && currentPage === "home") return true;
    if (href !== "/" && currentPage && href.includes(currentPage)) return true;
    return false;
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/20 dark:border-white/10 shadow-lg" 
          : "bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-md border-b border-ocean-100/50 dark:border-white/10"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Enhanced Logo / Conference Name */}
          <Link href="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center interactive-spring"
            >
              <div className="block">
                <div className="text-lg sm:text-xl font-display font-extrabold bg-gradient-to-r from-emerald-400 to-ocean-400 bg-clip-text text-transparent dark:text-white">
                  OSSAPCON 2026
                </div>
                <div className="hidden sm:block text-xs text-midnight-700 dark:text-gray-300 font-medium">
                  Orthopedic Surgeons Society of Andhra Pradesh
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActivePage(item.href) ? "default" : "ghost"}
                    size="sm"
                    className={`interactive group ${
                      isActivePage(item.href)
                        ? "shadow-lg"
                        : "hover:bg-ocean-50 hover:text-ocean-700 dark:hover:bg-ocean-900/20 dark:hover:text-ocean-400 text-gray-900 dark:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Enhanced Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Search Button */}
            <Button variant="glass" size="icon-sm" className="interactive">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Notifications for authenticated users */}
            {session && (
              <Button variant="glass" size="icon-sm" className="interactive relative">
                <Bell className="h-4 w-4" />
                <Badge 
                  size="sm" 
                  variant="coral" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
                <span className="sr-only">Notifications</span>
              </Button>
            )}

            <ThemeToggle />
            
            {status === 'loading' ? (
              <div className="w-32 h-10 glass rounded-xl animate-pulse" />
            ) : session ? (
              <UserMenu />
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="outline" className="interactive">
                    Sign In
                  </Button>
                </Link>
                <a href="/register">
                  <Button variant="default" className="interactive shadow-lg">
                    Register Now
                  </Button>
                </a>
              </div>
            )}
          </div>

          {/* Enhanced Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            {session && (
              <Button variant="glass" size="icon-sm" className="interactive relative">
                <Bell className="h-4 w-4" />
                <Badge 
                  size="sm" 
                  variant="coral" 
                  className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Button>
            )}
            <ThemeToggle />
            <Button
              variant="glass"
              size="icon-sm"
              className="interactive"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </motion.div>
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="lg:hidden glass border-t border-white/20 bg-white/80 dark:bg-black/85"
          >
            <div className="container mx-auto px-4 py-6">
              {/* Mobile Search */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-3 glass rounded-xl border border-white/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ocean-500"
                  />
                </div>
              </motion.div>

              <div className="space-y-2">
                {navigationItems.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Link href={item.href} onClick={() => setIsMenuOpen(false)}>
                        <Button
                          variant={isActivePage(item.href) ? "default" : "ghost"}
                          className={`w-full justify-start text-left h-12 interactive group ${
                            isActivePage(item.href)
                              ? "text-gray-900 dark:text-white"
                              : "text-gray-900 dark:text-white"
                          } hover:bg-ocean-50 hover:text-ocean-700 dark:hover:bg-white/10`}
                        >
                          <Icon className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                          {item.name}
                        </Button>
                      </Link>
                    </motion.div>
                  )
                })}

                {/* Mobile User Actions */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + navigationItems.length * 0.05 }}
                  className="pt-4 space-y-3 border-t border-white/20"
                >
                  {session ? (
                    <>
                      {/* User Profile Card */}
                      <div className="glass rounded-xl p-4 border border-white/20">
                        <div className="flex items-center gap-3">
                          <Avatar size="default" variant="ring-primary">
                            <AvatarImage src={(session.user as any)?.image || undefined} />
                            <AvatarFallback variant="default">
                              {session.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {session.user?.name || 'User'}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {session.user?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" className="w-full h-12 interactive">
                          <User className="mr-2 h-4 w-4" />
                          Dashboard
                        </Button>
                      </Link>
                      {session.user?.role === 'admin' && (
                        <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                          <Button variant="outline" className="w-full h-12 interactive">
                            <Settings className="mr-2 h-4 w-4" />
                            Admin Panel
                          </Button>
                        </Link>
                      )}
                      <Button 
                        onClick={() => {
                          setIsMenuOpen(false)
                          signOut({ callbackUrl: '/' })
                        }}
                        variant="outline" 
                        className="w-full h-12 interactive text-coral-600 border-coral-200 hover:bg-coral-50"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" className="w-full h-12 interactive">
                          Sign In
                        </Button>
                      </Link>
                      <a href="/register" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="default" className="w-full h-12 interactive shadow-lg">
                          Register Now
                        </Button>
                      </a>
                    </>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}