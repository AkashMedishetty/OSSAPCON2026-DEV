import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import Configuration from '@/lib/models/Configuration'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized'
      }, { status: 401 })
    }

    await connectDB()

    const adminUser = await User.findById(session.user.id)
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({
        success: false,
        message: 'Admin access required'
      }, { status: 403 })
    }

    // Get pricing configuration from the comprehensive config
    const pricingTiersConfig = await Configuration.findOne({ 
      type: 'pricing', 
      key: 'pricing_tiers' 
    })

    // Extract the needed parts from the comprehensive config
    let pricingData = null
    let workshopData = null
    
    if (pricingTiersConfig?.value) {
      // Extract registration categories from earlyBird/regular tiers
      const tiers = pricingTiersConfig.value
      if (tiers.earlyBird?.categories) {
        pricingData = tiers.earlyBird.categories
      } else if (tiers.regular?.categories) {
        pricingData = tiers.regular.categories
      }
      
      // Extract workshops
      if (tiers.workshops) {
        workshopData = tiers.workshops
      }
    }

    // Default pricing if not found
    const defaultPricing = {
      registration_categories: {
        regular: { amount: 15000, currency: 'INR', label: 'Regular Delegate' },
        student: { amount: 8000, currency: 'INR', label: 'Student/Resident' },
        international: { amount: 300, currency: 'USD', label: 'International Delegate' },
        faculty: { amount: 12000, currency: 'INR', label: 'Faculty Member' },
        accompanying: { amount: 3000, currency: 'INR', label: 'Accompanying Person' }
      },
      workshops: [
        { id: 'joint-replacement', name: 'Advanced Joint Replacement', amount: 2000 },
        { id: 'arthroscopic', name: 'Arthroscopic Surgery Masterclass', amount: 2500 },
        { id: 'spine-surgery', name: 'Spine Surgery Innovations', amount: 2000 },
        { id: 'trauma-management', name: 'Trauma Management', amount: 1500 }
      ]
    }

    const result = {
      registration_categories: pricingData || defaultPricing.registration_categories,
      workshops: workshopData || defaultPricing.workshops
    }

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('Pricing config fetch error:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized'
      }, { status: 401 })
    }

    await connectDB()

    const adminUser = await User.findById(session.user.id)
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({
        success: false,
        message: 'Admin access required'
      }, { status: 403 })
    }

    const body = await request.json()
    const { registration_categories, workshops } = body

    // Update registration categories
    await Configuration.findOneAndUpdate(
      { type: 'pricing', key: 'registration_categories' },
      {
        type: 'pricing',
        key: 'registration_categories',
        value: registration_categories,
        isActive: true,
        createdBy: adminUser._id,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    )

    // Update workshops
    await Configuration.findOneAndUpdate(
      { type: 'pricing', key: 'workshops' },
      {
        type: 'pricing',
        key: 'workshops',
        value: workshops,
        isActive: true,
        createdBy: adminUser._id,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    )

    return NextResponse.json({
      success: true,
      message: 'Pricing configuration updated successfully'
    })

  } catch (error) {
    console.error('Pricing config update error:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}