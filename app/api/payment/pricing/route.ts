import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Configuration from '@/lib/models/Configuration'
import { getCurrentTier, getTierSummary, getTierPricing } from '@/lib/registration'

export async function GET() {
  try {
    await connectDB()

    // Prefer admin-configured pricing if available; fallback to centralized config
    let currentTierName = getCurrentTier()
    let categories = getTierPricing(currentTierName)

    // Try DB-driven tier config
    try {
      const adminPricingConfig = await Configuration.findOne({ type: 'pricing', key: 'pricing_tiers', isActive: true })
      if (adminPricingConfig?.value?.regular?.categories) {
        // Choose tier by date if defined; fallback to regular
        const today = new Date()
        const iso = today.toISOString().split('T')[0]
        const tiers = adminPricingConfig.value
        const pick = (t: any) => t && t.isActive && iso >= t.startDate && iso <= t.endDate
        if (pick(tiers.earlyBird)) { currentTierName = 'Early Bird'; categories = tiers.earlyBird.categories }
        else if (pick(tiers.regular)) { currentTierName = 'Regular'; categories = tiers.regular.categories }
        else if (pick(tiers.onsite)) { currentTierName = 'Late / Spot'; categories = tiers.onsite.categories }
        else { currentTierName = 'Regular'; categories = tiers.regular.categories }
      }
    } catch {}

    // Fetch workshop configuration
    const workshopConfig = await Configuration.findOne({
      type: 'pricing',
      key: 'workshops',
      isActive: true
    })

    let workshops: any[] = []
    if (workshopConfig) {
      workshops = workshopConfig.value
    }

    if (workshops.length === 0) {
      workshops = [
        { id: 'joint-replacement', name: 'Advanced Joint Replacement Techniques', amount: 2000 },
        { id: 'spinal-surgery', name: 'Spine Surgery and Instrumentation', amount: 2500 },
        { id: 'pediatric-orthopedics', name: 'Pediatric Orthopedics', amount: 2000 },
        { id: 'arthroscopy', name: 'Arthroscopic Surgery Techniques', amount: 1500 },
        { id: 'orthopedic-rehab', name: 'Orthopedic Rehabilitation', amount: 1800 },
        { id: 'trauma-surgery', name: 'Orthopedic Trauma Surgery', amount: 2200 }
      ]
    }

    return NextResponse.json({
      success: true,
      data: {
        currentTier: {
          id: currentTierName.replace(/\s+/g, '-').toLowerCase(),
          name: currentTierName,
          description: getTierSummary(),
          startDate: null,
          endDate: null,
          categories
        },
        nextTier: null,
        workshops,
        // Legacy format for backward compatibility
        registration_categories: categories || {},
      }
    })

  } catch (error) {
    console.error('Pricing fetch error:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 })
  }
}