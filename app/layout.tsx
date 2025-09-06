import type React from "react"
import type { Metadata } from "next"
import { Inter, Orbitron, Plus_Jakarta_Sans } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "@/components/providers/SessionProvider"
import { Toaster } from "@/components/ui/sonner"
import GlobalErrorBoundary from "@/components/error/GlobalErrorBoundary"
import { Analytics } from "./analytics"
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt"
// import { ServiceWorkerUpdate } from "@/components/ServiceWorkerUpdate" // Removed to prevent infinite reload loops
import { DeviceSessionManager } from "@/components/auth/DeviceSessionManager"
import { RedirectLoopHandler } from "@/components/auth/RedirectLoopHandler"
import { PageTransition } from "@/components/ui/page-transition"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: 'swap',
  preload: true,
  fallback: ['Inter', 'system-ui', 'arial']
})

const orbitron = Orbitron({ 
  subsets: ["latin"], 
  variable: "--font-orbitron",
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
})

export const metadata: Metadata = {
  title: {
    default: "OSSAPCON 2026 - Annual Conference of Orthopedic Surgeons Society of Andhra Pradesh",
    template: "%s | OSSAPCON 2026"
  },
  description: "Join the premier orthopedic conference in Kurnool, Andhra Pradesh from February 4-6, 2026. Excellence in Orthopedic Care through innovation, collaboration, and clinical excellence. Register now for early bird pricing.",
  keywords: [
    "orthopedic",
    "conference", 
    "medical conference",
    "orthopedic surgery",
    "bone surgery",
    "joint surgery",
    "spine surgery",
    "trauma care",
    "Kurnool",
    "Andhra Pradesh",
    "India",
    "medical education",
    "CME",
    "orthopedics",
    "sports medicine",
    "rehabilitation",
    "Orthopedic Surgeons Society of Andhra Pradesh",
    "OSSAP",
    "2026"
  ],
  authors: [
    { name: "Orthopedic Surgeons Society of Andhra Pradesh" },
    { name: "LAXMI PRABHA" }
  ],
  creator: "Orthopedic Surgeons Society of Andhra Pradesh",
  publisher: "Orthopedic Surgeons Society of Andhra Pradesh",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ossapcon2026.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-IN': '/en-in',
      'en-US': '/en-us',
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://ossapcon2026.com',
    siteName: 'OSSAPCON 2026',
    title: 'OSSAPCON 2026 - Annual Conference of Orthopedic Surgeons Society of Andhra Pradesh',
    description: 'Join the premier orthopedic conference in Kurnool, Andhra Pradesh from February 4-6, 2026. Excellence in Orthopedic Care through innovation and clinical excellence.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'OSSAPCON 2026 Conference - Kurnool, Andhra Pradesh',
      },
      {
        url: '/og-image-square.jpg',
        width: 1200,
        height: 1200,
        alt: 'OSSAPCON 2026 Conference Logo',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@OSSAPCON2026',
    creator: '@OSSAP_India',
    title: 'OSSAPCON 2026 - Annual Conference of Orthopedic Surgeons Society of Andhra Pradesh',
    description: 'Join the premier orthopedic conference in Kurnool, Andhra Pradesh from February 4-6, 2026. Early bird registration now open!',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'Medical Conference',
  classification: 'Medical Education, Healthcare, Neuroscience',
  referrer: 'origin-when-cross-origin',
  bookmarks: ['https://ossapcon2026.com'],
  applicationName: 'OSSAPCON 2026',
  generator: 'Next.js',
  abstract: 'Annual Conference of Orthopedic Surgeons Society of Andhra Pradesh focusing on excellence in orthopedic care through research, innovation, and clinical excellence.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${orbitron.variable}`} suppressHydrationWarning>
      <head>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalEvent",
              "name": "OSSAPCON 2026 - Annual Conference of Orthopedic Surgeons Society of Andhra Pradesh",
              "description": "Premier orthopedic conference advancing care and research through innovation, collaboration, and clinical excellence in Kurnool, Andhra Pradesh.",
              "startDate": "2026-02-04T09:00:00+05:30",
              "endDate": "2026-02-06T18:00:00+05:30",
              "eventStatus": "https://schema.org/EventScheduled",
              "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
              "location": {
                "@type": "Place",
                "name": "Kurnool, Andhra Pradesh, India",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Kurnool",
                  "addressRegion": "Andhra Pradesh",
                  "addressCountry": "IN"
                }
              },
              "organizer": {
                "@type": "Organization",
                "name": "Orthopedic Surgeons Society of Andhra Pradesh",
                "url": "https://ossapcon2026.com"
              },
              "sponsor": [
                {
                  "@type": "Organization",
                  "name": "Kurnool Medical College"
                },
                {
                  "@type": "Organization", 
                  "name": "Department of Orthopedics"
                }
              ],
              "offers": {
                "@type": "Offer",
                "price": "5000",
                "priceCurrency": "INR",
                "availability": "https://schema.org/InStock",
                "validFrom": "2024-01-01T00:00:00+05:30",
                "url": "https://ossapcon2026.com/register"
              },
              "performer": [
                {
                  "@type": "Person",
                  "name": "LAXMI PRABHA",
                  "jobTitle": "Conference Coordinator"
                }
              ],
              "audience": {
                "@type": "MedicalAudience",
                "audienceType": "Medical Professionals, Orthopedic Surgeons, Sports Medicine Physicians, Researchers"
              },
              "image": [
                "https://ossapcon2026.com/og-image.jpg",
                "https://ossapcon2026.com/conference-banner.jpg"
              ],
              "url": "https://ossapcon2026.com",
              "workFeatured": {
                "@type": "CreativeWork",
                "name": "Excellence in Orthopedic Care",
                "description": "Conference theme focusing on innovation in orthopedic treatment and research"
              }
            })
          }}
        />
        
        {/* PWA Theme */}
        <meta name="theme-color" content="#020412" />

        {/* Additional Meta Tags for Enhanced SEO */}
        <meta name="msapplication-TileColor" content="#015189" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Geo Tags */}
        <meta name="geo.region" content="IN-AP" />
        <meta name="geo.placename" content="Kurnool" />
        <meta name="geo.position" content="15.8281;78.0373" />
        <meta name="ICBM" content="15.8281, 78.0373" />
        
        {/* Medical Conference Specific Tags */}
        <meta name="medical.specialty" content="Orthopedic Surgery, Trauma Care, Sports Medicine" />
        <meta name="event.date" content="2026-02-04/2026-02-06" />
        <meta name="event.location" content="Kurnool, Andhra Pradesh" />
        <meta name="conference.registration" content="Open" />
        <meta name="conference.pricing" content="₹5,000 Early Bird" />
        
        {/* Dublin Core Metadata */}
        <meta name="DC.title" content="OSSAPCON 2026 - Annual Conference" />
        <meta name="DC.creator" content="Orthopedic Surgeons Society of Andhra Pradesh" />
        <meta name="DC.subject" content="Orthopedics, Medical Conference, Orthopedic Surgery" />
        <meta name="DC.description" content="Premier orthopedic conference in Kurnool, Andhra Pradesh" />
        <meta name="DC.publisher" content="Orthopedic Surgeons Society of Andhra Pradesh" />
        <meta name="DC.date" content="2026-02-04" />
        <meta name="DC.type" content="Event" />
        <meta name="DC.format" content="text/html" />
        <meta name="DC.identifier" content="https://ossapcon2026.com" />
        <meta name="DC.language" content="en" />
        <meta name="DC.coverage" content="Kurnool, Andhra Pradesh" />
        
        {/* Preconnect for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        
        {/* Clash Display Font */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&display=swap" rel="stylesheet" />
        
        {/* PWA Manifest and Icons */}
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/placeholder-logo.png" />
        
        {/* Preload heavy static assets for smoother UX */}
        <link rel="preload" href="/spine_model.glb" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/video1.webm" as="video" type="video/webm" />
        
        {/* Service Worker Registration with Force Update (prod only) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Enhanced Cache Management and Auto-Update System
              if ('serviceWorker' in navigator && !(window && window.__OSSAP_SW_INIT_DONE)) {
                window.__OSSAP_SW_INIT_DONE = true;
                // Always clear existing service workers first
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  console.log('🔄 Found existing service workers:', registrations.length);
                  
                  // Unregister all existing service workers
                  const unregisterPromises = registrations.map(function(registration) {
                    console.log('🗑️ Unregistering SW:', registration.scope);
                    return registration.unregister();
                  });
                  
                  return Promise.all(unregisterPromises);
                }).then(function() {
                  console.log('✅ All existing service workers cleared');
                  
                  // Clear all caches
                  if ('caches' in window) {
                    return caches.keys().then(function(cacheNames) {
                      console.log('🗑️ Clearing caches:', cacheNames);
                      return Promise.all(
                        cacheNames.map(function(cacheName) {
                          return caches.delete(cacheName);
                        })
                      );
                    });
                  }
                }).then(function() {
                  console.log('✅ All caches cleared');
                  
                  // Only register new service worker in production
                  const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
                  if (!isLocal) {
                    console.log('🚀 Registering force-update service worker...');
                    return navigator.serviceWorker.register('/sw-force-update.js?' + Date.now(), {
                      scope: '/',
                      updateViaCache: 'none'
                    });
                  }
                  // In development, register the main SW so testing works
                  console.log('🧪 Dev: registering /sw.js for testing');
                  return navigator.serviceWorker.register('/sw.js?' + Date.now(), { scope: '/' });
                }).then(function(registration) {
                  if (registration) {
                    console.log('✅ Force-update SW registered:', registration.scope);
                    
                    // Force immediate activation
                    if (registration.waiting) {
                      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                    }
                    
                    // Check for updates every 5 minutes (less aggressive)
                    setInterval(function() {
                      registration.update();
                    }, 5 * 60 * 1000);
                  }
                }).catch(function(error) {
                  console.error('❌ Service worker registration failed:', error);
                });
              }
              
              // Auto Cache Updater disabled to avoid dynamic import errors in browsers
              
              // Add cache busting to all fetch requests (disabled for development to fix 3D models)
              if (typeof window !== 'undefined' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
                const originalFetch = window.fetch;
                window.fetch = function(input, init) {
                  // Skip cache busting for GLB files, blob URLs, and data URLs to fix 3D models
                  if (typeof input === 'string') {
                    if (input.startsWith('blob:') || input.startsWith('data:') || input.endsWith('.glb') || input.includes('.glb?')) {
                      return originalFetch(input, init);
                    }
                    
                    // Add cache busting parameter to other requests
                    if (!input.includes('cache_bust=')) {
                      const separator = input.includes('?') ? '&' : '?';
                      input = input + separator + 'cache_bust=' + Date.now();
                    }
                  }
                  
                  // Add no-cache headers (but not for GLB files)
                  const headers = new Headers(init?.headers || {});
                  headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
                  headers.set('Pragma', 'no-cache');
                  
                  return originalFetch(input, {
                    ...init,
                    headers: headers
                  });
                };
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <GlobalErrorBoundary>
                    <SessionProvider>
            <DeviceSessionManager>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange={false}
              >
                <div className="relative min-h-screen">
                  <PageTransition>
                    {children}
                  </PageTransition>
                  <Toaster />
                  <Analytics />
                  <PWAInstallPrompt />
                  {/* {process.env.NODE_ENV === 'production' && <ServiceWorkerUpdate />} */}
        {/* ServiceWorkerUpdate component removed to prevent infinite reload loops */}
                  <RedirectLoopHandler />

              {/* Background particles - Fixed positions to prevent memory leaks */}
              <div className="fixed inset-0 pointer-events-none z-0 opacity-60 dark:opacity-30">
                <div className="particle animate-pulse" style={{ left: '10%', top: '20%', width: '2px', height: '2px', background: 'hsl(204, 70%, 60%)', animationDelay: '0s', animationDuration: '8s' }} />
                <div className="particle animate-pulse" style={{ left: '80%', top: '10%', width: '3px', height: '3px', background: 'hsl(210, 70%, 60%)', animationDelay: '2s', animationDuration: '10s' }} />
                <div className="particle animate-pulse" style={{ left: '60%', top: '70%', width: '2px', height: '2px', background: 'hsl(200, 70%, 60%)', animationDelay: '4s', animationDuration: '12s' }} />
                <div className="particle animate-pulse" style={{ left: '30%', top: '80%', width: '4px', height: '4px', background: 'hsl(215, 70%, 60%)', animationDelay: '1s', animationDuration: '9s' }} />
                <div className="particle animate-pulse" style={{ left: '90%', top: '50%', width: '2px', height: '2px', background: 'hsl(205, 70%, 60%)', animationDelay: '3s', animationDuration: '11s' }} />
                <div className="particle animate-pulse" style={{ left: '20%', top: '40%', width: '3px', height: '3px', background: 'hsl(204, 70%, 60%)', animationDelay: '5s', animationDuration: '7s' }} />
                <div className="particle animate-pulse" style={{ left: '70%', top: '30%', width: '2px', height: '2px', background: 'hsl(210, 70%, 60%)', animationDelay: '6s', animationDuration: '13s' }} />
                <div className="particle animate-pulse" style={{ left: '50%', top: '90%', width: '3px', height: '3px', background: 'hsl(200, 70%, 60%)', animationDelay: '2s', animationDuration: '8s' }} />
              </div>
                </div>
              </ThemeProvider>
            </DeviceSessionManager>
          </SessionProvider>
        </GlobalErrorBoundary>
      </body>
    </html>
  )
}
