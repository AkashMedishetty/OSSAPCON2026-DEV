"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
  User,
  LogOut,
  Settings,
  CreditCard,
  FileText,
  Bell,
  Search,
  Home,
  Calendar,
  Users,
  Award,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  UserCheck,
  Shield,
  ChevronDown,
  ArrowRight
} from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FooterPWAInstallButton } from "@/components/ServiceWorkerUpdate"
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern"
import Footer from "@/components/Footer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { OptimizedImage } from "@/components/OptimizedImage"
import { useToast } from "@/hooks/use-toast"

const publicNavigationItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Committee", href: "/committee", icon: Users },
  { name: "Program", href: "/program", icon: Calendar },
  { name: "Abstracts", href: "/abstracts", icon: FileText },
  { name: "Venue", href: "/venue", icon: MapPin },
  { name: "Contact", href: "/contact", icon: Mail },
]

const authNavigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Payment", href: "/dashboard/payment", icon: CreditCard },
  { name: "Program", href: "/program", icon: Calendar },
]

function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
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
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function UserMenu({ userData }: { userData: any }) {
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      // Call our logout API to clean up session in database
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })

      // Then sign out from NextAuth
      await signOut({ redirect: false })

      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account."
      })
      router.push('/')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive"
      })
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userData?.profile?.profilePicture} />
            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              {userData?.profile ? getInitials(userData.profile.firstName, userData.profile.lastName) : 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userData?.profile ? `${userData.profile.title} ${userData.profile.firstName} ${userData.profile.lastName}` : 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {userData?.email}
            </p>
            {userData?.registration?.registrationId && (
              <Badge variant="secondary" className="text-xs w-fit">
                ID: {userData.registration.registrationId}
              </Badge>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex items-center">
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/payment" className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            Payment
          </Link>
        </DropdownMenuItem>
        {userData?.role === 'admin' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin" className="flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                Admin Panel
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface MainLayoutProps {
  children: React.ReactNode
  currentPage?: string
  showSearch?: boolean
}

export function MainLayout({ children, currentPage, showSearch = false }: MainLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.user && status === 'authenticated') {
      fetchUserData()
    }
  }, [session, status])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setUserData(result.data)
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const isActivePage = (href: string) => {
    if (href === "/" && currentPage === "home") return true
    if (href !== "/" && currentPage && href.includes(currentPage)) return true
    return false
  }

  const navigationItems = session ? authNavigationItems : publicNavigationItems

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-white to-sapphire-50 dark:from-midnight-950 dark:via-midnight-900 dark:to-midnight-950">
      {/* Top Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="sticky top-0 z-50 glass border-b border-white/20 shadow-lg"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Enhanced Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center interactive-spring"
              >
                <div className="flex items-center">
                  <div className="text-lg lg:text-xl font-display font-bold text-gradient-ocean">
                    OSSAPCON
                  </div>
                  <div className="ml-2 text-xs text-midnight-600 dark:text-midnight-400 font-medium">
                    2026
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Search Bar (if enabled) */}
            {showSearch && (
              <div className="hidden md:flex flex-1 max-w-md mx-8">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search conferences, abstracts..."
                    className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>
              </div>
            )}

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant="ghost"
                      className={`text-sm font-medium transition-all duration-200 ${isActivePage(item.href)
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md"
                        : "hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                        }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </Button>
                  </Link>
                )
              })}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Notifications */}
              {session && (
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </Button>
              )}

              <ThemeToggle />

              {session ? (
                <UserMenu userData={userData} />
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/auth/login">
                    <Button variant="ghost">
                      Log in
                    </Button>
                  </Link>
                  <a href="/register">
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg">
                      Register Now
                    </Button>
                  </a>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center space-x-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                className="w-9 h-9 p-0"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50"
            >
              <div className="container mx-auto px-4 py-4">
                {/* Mobile Search */}
                {showSearch && (
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search..."
                        className="pl-10 bg-gray-50 dark:bg-gray-800"
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col space-y-2">
                  {navigationItems.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link href={item.href} onClick={() => setIsMenuOpen(false)}>
                          <Button
                            variant="ghost"
                            className={`w-full justify-start text-left h-12 transition-all duration-200 ${isActivePage(item.href)
                              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                              : "hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                              }`}
                          >
                            <Icon className="w-4 h-4 mr-3" />
                            {item.name}
                          </Button>
                        </Link>
                      </motion.div>
                    )
                  })}

                  {/* Mobile Auth Actions */}
                  {!session && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: navigationItems.length * 0.1 }}
                        className="pt-2 space-y-2"
                      >
                        <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start h-12">
                            <User className="w-4 h-4 mr-3" />
                            Log in
                          </Button>
                        </Link>
                        <a href="/register" onClick={() => setIsMenuOpen(false)}>
                          <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-12 shadow-lg">
                            <UserCheck className="w-4 h-4 mr-3" />
                            Register Now
                          </Button>
                        </a>
                      </motion.div>
                    </>
                  )}

                  {/* Mobile User Menu */}
                  {session && userData && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navigationItems.length * 0.1 }}
                      className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2"
                    >
                      <div className="flex items-center space-x-3 px-3 py-2">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                            {userData.profile ?
                              `${userData.profile.firstName?.charAt(0) || ''}${userData.profile.lastName?.charAt(0) || ''}`.toUpperCase()
                              : 'U'
                            }
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {userData.profile ? `${userData.profile.title} ${userData.profile.firstName} ${userData.profile.lastName}` : 'User'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {userData.email}
                          </p>
                        </div>
                      </div>

                      {userData.role === 'admin' && (
                        <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start h-12">
                            <Shield className="w-4 h-4 mr-3" />
                            Admin Panel
                          </Button>
                        </Link>
                      )}

                      <Button
                        variant="ghost"
                        className="w-full justify-start h-12 text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={async () => {
                          setIsMenuOpen(false)
                          try {
                            // Call our logout API to clean up session in database
                            await fetch('/api/auth/logout', {
                              method: 'POST',
                              credentials: 'include'
                            })

                            // Then sign out from NextAuth
                            await signOut({ redirect: false })
                            router.push('/')
                          } catch (error) {
                            console.error('Logout error:', error)
                            // Still try to sign out even if API call fails
                            await signOut({ redirect: false })
                            router.push('/')
                          }
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Log out
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer - hidden on homepage to avoid duplicate */}
      {currentPage !== "home" && <Footer />}
    </div>
  )
}