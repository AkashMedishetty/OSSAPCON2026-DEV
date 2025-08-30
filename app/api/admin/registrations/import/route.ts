import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import { generateRegistrationId } from "@/lib/utils/generateId"
import { EmailService } from "@/lib/email/service"
import csv from 'csv-parser'
import { Readable } from 'stream'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            )
        }

        await connectDB()

        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json(
                { success: false, message: "No file provided" },
                { status: 400 }
            )
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const stream = Readable.from(buffer)

        const results: any[] = []
        let imported = 0
        let errors: string[] = []

        return new Promise<NextResponse>((resolve) => {
            stream
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', async () => {
                    for (const row of results) {
                        try {
                            // Generate unique registration ID
                            let registrationId = await generateRegistrationId()
                            let attempts = 0
                            while (attempts < 10) {
                                const existingReg = await User.findOne({ 'registration.registrationId': registrationId })
                                if (!existingReg) break
                                registrationId = await generateRegistrationId()
                                attempts++
                            }

                            // Map registration types correctly
                            const mapRegistrationType = (type: string) => {
                                const typeMap: { [key: string]: string } = {
                                    'regular': 'ntsi-member',
                                    'faculty': 'ntsi-member',
                                    'ntsi-member': 'ntsi-member',
                                    'non-member': 'non-member',
                                    'pg-student': 'pg-student',
                                    'student': 'pg-student',
                                    'complimentary': 'complimentary',
                                    'sponsored': 'sponsored'
                                }
                                return typeMap[type?.toLowerCase()] || 'ntsi-member'
                            }

                            const userData = {
                                email: row['Email']?.toLowerCase(),
                                password: 'TempPassword123!', // Temporary password for admin-created accounts
                                profile: {
                                    title: row['Title'] || 'Dr.',
                                    firstName: row['First Name'] || '',
                                    lastName: row['Last Name'] || '',
                                    phone: row['Phone'] || '',
                                    designation: row['Designation'] || 'Consultant', // Default to Consultant
                                    institution: row['Institution'] || '',
                                    address: {
                                        street: '',
                                        city: row['City'] || '',
                                        state: row['State'] || '',
                                        country: row['Country'] || 'India',
                                        pincode: ''
                                    },
                                    dietaryRequirements: row['Dietary Requirements'] || '',
                                    specialNeeds: row['Special Needs'] || ''
                                },
                                registration: {
                                    registrationId,
                                    type: mapRegistrationType(row['Registration Type']),
                                    status: 'pending',
                                    membershipNumber: row['Membership Number'] || '',
                                    workshopSelections: [],
                                    accompanyingPersons: [],
                                    registrationDate: new Date(),
                                    paymentType: 'regular'
                                },
                                role: 'user',
                                isActive: true
                            }

                            // Check if user already exists
                            const existingUser = await User.findOne({ email: userData.email })

                            if (existingUser) {
                                errors.push(`User with email ${userData.email} already exists`)
                                continue
                            }

                            // Create new user
                            const newUser = await User.create(userData)
                            imported++

                            // Send registration confirmation email
                            try {
                                await EmailService.sendRegistrationConfirmation({
                                    email: newUser.email as string,
                                    name: `${newUser.profile.firstName} ${newUser.profile.lastName}`,
                                    registrationId: newUser.registration.registrationId,
                                    registrationType: newUser.registration.type,
                                    workshopSelections: newUser.registration.workshopSelections || [],
                                    accompanyingPersons: newUser.registration.accompanyingPersons?.length || 0
                                })
                            } catch (emailError) {
                                console.error('Failed to send confirmation email:', emailError)
                                // Don't fail the import if email fails
                            }

                        } catch (error) {
                            console.error('Import row error:', error)
                            errors.push(`Error importing row: ${JSON.stringify(row)}`)
                        }
                    }

                    resolve(NextResponse.json({
                        success: true,
                        imported,
                        errors: errors.length > 0 ? errors : undefined,
                        message: `Successfully imported ${imported} registrations${errors.length > 0 ? ` with ${errors.length} errors` : ''}`
                    }))
                })
                .on('error', (error) => {
                    console.error('CSV parsing error:', error)
                    resolve(NextResponse.json(
                        { success: false, message: "Error parsing CSV file" },
                        { status: 400 }
                    ))
                })
        })

    } catch (error) {
        console.error("Import registrations error:", error)
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        )
    }
}