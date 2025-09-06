import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import  connectDB  from "@/lib/mongodb"
import User from "@/lib/models/User"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    await connectDB()

    const { id } = params
    const body = await request.json()
    const { 
      status, 
      paymentType, 
      sponsorName, 
      sponsorCategory, 
      paymentRemarks, 
      amount 
    } = body

    const updateData: any = {
      'registration.status': status,
      'registration.paymentType': paymentType,
      'registration.paymentRemarks': paymentRemarks
    }

    if (status === 'paid') {
      updateData['registration.paymentDate'] = new Date().toISOString()
    }

    if (paymentType === 'sponsored') {
      updateData['registration.sponsorName'] = sponsorName
      updateData['registration.sponsorCategory'] = sponsorCategory
      // Mirror into embedded payment (zero amount, verified)
      updateData['payment'] = {
        method: 'cash',
        status: status === 'paid' ? 'verified' : 'pending',
        amount: 0,
        transactionId: `ADMIN-SPONSORED-${Date.now()}`,
        paymentDate: new Date().toISOString(),
        remarks: paymentRemarks
      }
    } else if (paymentType === 'complementary') {
      // Complementary: zero amount, verified
      updateData['payment'] = {
        method: 'cash',
        status: status === 'paid' ? 'verified' : 'pending',
        amount: 0,
        transactionId: `ADMIN-COMPLEMENTARY-${Date.now()}`,
        paymentDate: new Date().toISOString(),
        remarks: paymentRemarks
      }
    } else if (amount > 0) {
      // Regular manual payment update: treat as bank transfer
      updateData['payment'] = {
        method: 'bank-transfer',
        status: status === 'paid' ? 'verified' : 'pending',
        amount,
        paymentDate: new Date().toISOString(),
        remarks: paymentRemarks
      }
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    )

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Registration not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Payment status updated successfully",
      data: user
    })

  } catch (error) {
    console.error("Update payment error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}