'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export function ServiceWorkerUpdate() {
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const forceUpdate = async () => {
        try {
          setIsUpdating(true)
          console.log('🔄 Starting aggressive cache clearing...')
          
          // Step 1: Unregister ALL existing service workers
          const registrations = await navigator.serviceWorker.getRegistrations()
          console.log(`Found ${registrations.length} service worker registrations`)
          
          for (const registration of registrations) {
            console.log('Unregistering service worker:', registration.scope)
            await registration.unregister()
          }
          
          // Step 2: Clear all caches manually
          if ('caches' in window) {
            const cacheNames = await caches.keys()
            console.log('Clearing caches:', cacheNames)
            
            await Promise.all(
              cacheNames.map(cacheName => {
                console.log('Deleting cache:', cacheName)
                return caches.delete(cacheName)
              })
            )
          }
          
          // Step 3: Clear browser storage
          try {
            // Clear localStorage items related to app state
            const localStorageKeys = Object.keys(localStorage).filter(key => 
              key.includes('neurotrauma') || 
              key.includes('auth') || 
              key.includes('session') ||
              key.includes('nextauth') ||
              key.includes('cache')
            )
            localStorageKeys.forEach(key => {
              console.log('Clearing localStorage key:', key)
              localStorage.removeItem(key)
            })
            
            // Clear sessionStorage
            const sessionStorageKeys = Object.keys(sessionStorage).filter(key => 
              key.includes('neurotrauma') || 
              key.includes('auth') || 
              key.includes('session') ||
              key.includes('cache')
            )
            sessionStorageKeys.forEach(key => {
              console.log('Clearing sessionStorage key:', key)
              sessionStorage.removeItem(key)
            })
          } catch (error) {
            console.warn('Failed to clear storage:', error)
          }
          
          // Step 4: Register the new force-update service worker
          console.log('🚀 Registering new force-update service worker...')
          const registration = await navigator.serviceWorker.register('/sw-force-update.js', {
            scope: '/',
            updateViaCache: 'none' // Don't cache the service worker file itself
          })
          
          console.log('✅ New service worker registered:', registration.scope)
          
          // Step 5: Force activation
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' })
          }
          
          // Step 6: Show user notification
          toast.success('App Updated!', {
            description: 'Cache cleared and latest version loaded. Refreshing page...',
            duration: 3000
          })
          
          // Step 7: Force reload after a short delay
          setTimeout(() => {
            console.log('🔄 Force reloading page for fresh content...')
            window.location.href = window.location.href + '?cache_bust=' + Date.now()
          }, 2000)
          
        } catch (error) {
          console.error('❌ Failed to update service worker:', error)
          toast.error('Update Failed', {
            description: 'Could not clear cache. Please refresh manually.',
            duration: 5000
          })
        } finally {
          setIsUpdating(false)
        }
      }
      
      // Start the force update process
      forceUpdate()
      
      // Listen for messages from the new service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'FORCE_RELOAD') {
          console.log('📨 Received force reload message from SW:', event.data.message)
          toast.info('Fresh Content Available', {
            description: 'Reloading to get the latest updates...',
            duration: 2000
          })
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        }
      })
      
      // Listen for service worker updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('🔄 Service worker controller changed - reloading...')
        if (!isUpdating) {
          window.location.reload()
        }
      })
    }
  }, [])

  return null // This component doesn't render anything
}

export function FooterPWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [visible, setVisible] = useState(true)
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isIOSStandalone = (window.navigator as any).standalone === true
    if (isStandalone || isIOSStandalone) {
      setIsInstalled(true)
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  if (isInstalled || !visible) return null

  const onInstall = async () => {
    if (!deferredPrompt) {
      setShowHelp((s) => !s)
      return
    }
    try {
      // @ts-ignore
      deferredPrompt.prompt?.()
      // @ts-ignore
      const choice = await deferredPrompt.userChoice
      if (choice?.outcome === 'accepted') {
        setDeferredPrompt(null)
        setShowHelp(false)
      }
    } catch (_) {
      // Fallback to help if prompt fails
      setShowHelp(true)
    }
  }

  const isIOS = typeof navigator !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent)
  const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent)

  return (
    <div className="bg-white/10 border border-white/20 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">Install the NeuroTrauma 2026 App</div>
          <div className="text-sm text-white/80">Get quick access and offline support</div>
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-2 rounded-lg bg-white text-orange-600 font-semibold hover:bg-gray-100"
            onClick={onInstall}
            title={deferredPrompt ? 'Install App' : 'How to Install'}
          >
            {deferredPrompt ? 'Install App' : 'How to Install'}
          </button>
          <button
            className="px-3 py-2 rounded-lg border border-white/30 text-white/90 hover:bg-white/10"
            onClick={() => setVisible(false)}
          >
            Hide
          </button>
        </div>
      </div>
      {showHelp && (
        <div className="mt-3 text-sm text-white/90 space-y-2">
          {isAndroid && (
            <>
              <div>On Android (Chrome):</div>
              <ol className="list-decimal list-inside space-y-1 text-white/80">
                <li>Open the browser menu (⋮)</li>
                <li>Tap “Install app” or “Add to Home screen”</li>
                <li>Confirm to add NeuroTrauma 2026 to your home screen</li>
              </ol>
            </>
          )}
          {isIOS && (
            <>
              <div>On iOS (Safari):</div>
              <ol className="list-decimal list-inside space-y-1 text-white/80">
                <li>Tap the Share icon</li>
                <li>Choose “Add to Home Screen”</li>
                <li>Tap Add to install the app</li>
              </ol>
            </>
          )}
          {!isAndroid && !isIOS && (
            <>
              <div>On Desktop (Chrome/Edge):</div>
              <ol className="list-decimal list-inside space-y-1 text-white/80">
                <li>Look for the Install icon in the address bar</li>
                <li>Or open the browser menu and choose “Install app”</li>
              </ol>
            </>
          )}
        </div>
      )}
    </div>
  )
}