import connectDB from '../mongodb'
import Configuration from '../models/Configuration'
import User from '../models/User'
import Workshop from '../models/Workshop'
import bcrypt from 'bcryptjs'

export async function seedInitialConfiguration() {
  try {
    await connectDB()

    // Create admin user if it doesn't exist
    const adminExists = await User.findOne({ email: 'admin@ossapcon2026.com' })
    
    let adminUser
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123!@#', 12)
      adminUser = await User.create({
        email: 'admin@ossapcon2026.com',
        password: hashedPassword,
        profile: {
          title: 'Dr.',
          firstName: 'Admin',
          lastName: 'User',
          phone: '+91-9999999999',
          designation: 'Consultant',
          institution: 'Orthopedic Surgeons Society of Andhra Pradesh',
          address: {
            street: 'Conference Admin',
            city: 'Kurnool',
            state: 'Andhra Pradesh',
            country: 'India',
            pincode: '518002'
          }
        },
        registration: {
          registrationId: 'OSSAP-ADMIN',
          type: 'ossap-member',
          status: 'paid'
        },
        role: 'admin'
      })
      console.log('Admin user created')
    } else {
      adminUser = adminExists
    }

    // Pricing Tiers Configuration
    const pricingTiersConfig = {
      type: 'pricing',
      key: 'pricing_tiers',
      value: {
        specialOffers: [
          {
            id: 'independence-day-2025',
            name: '79th Independence Day Special Offer',
            description: 'Special offer valid till 15th Aug 2025 Only',
            startDate: '2025-08-01',
            endDate: '2025-08-15',
            isActive: true,
            categories: {
              'ossap-member': { amount: 5000, currency: 'INR', label: 'OSSAP Member' },
              'non-member': { amount: 5000, currency: 'INR', label: 'Non Member' },
              'pg-student': { amount: 5000, currency: 'INR', label: 'PG Student' }
            }
          }
        ],
        earlyBird: {
          name: 'Early Bird Registration',
          description: 'Early Bird Registration will start from 16th Aug 2025',
          startDate: '2025-08-16',
          endDate: '2026-06-30',
          isActive: true,
          categories: {
            'ossap-member': { amount: 10000, currency: 'INR', label: 'OSSAP Member' },
            'non-member': { amount: 14000, currency: 'INR', label: 'Non Member' },
            'pg-student': { amount: 8000, currency: 'INR', label: 'PG Student' },
            
          }
        },
        regular: {
          name: 'Regular Registration',
          description: 'Standard registration pricing',
          startDate: '2026-07-01',
          endDate: '2026-08-05',
          isActive: true,
          categories: {
            'ossap-member': { amount: 12000, currency: 'INR', label: 'OSSAP Member' },
            'non-member': { amount: 17000, currency: 'INR', label: 'Non Member' },
            'pg-student': { amount: 10000, currency: 'INR', label: 'PG Student' },
            
          }
        },
        onsite: {
          name: 'Onsite Registration',
          description: 'Registration at the venue',
          startDate: '2026-08-06',
          endDate: '2026-08-09',
          isActive: true,
          categories: {
            'ossap-member': { amount: 15000, currency: 'INR', label: 'OSSAP Member' },
            'non-member': { amount: 20000, currency: 'INR', label: 'Non Member' },
            'pg-student': { amount: 12000, currency: 'INR', label: 'PG Student' },
            
          }
        }
      },
      isActive: true,
      createdBy: adminUser._id
    }

    // Legacy pricing for backward compatibility
    const pricingConfig = {
      type: 'pricing',
      key: 'registration_categories',
      value: {
        'ossap-member': { amount: 12000, currency: 'INR', label: 'OSSAP Member' },
        'non-member': { amount: 17000, currency: 'INR', label: 'Non Member' },
        'pg-student': { amount: 10000, currency: 'INR', label: 'PG Student' },
        
      },
      isActive: true,
      createdBy: adminUser._id
    }

    // Workshop Configuration
    const workshopConfig = {
      type: 'pricing',
      key: 'workshops',
      value: [
        { id: 'joint-replacement', name: 'Advanced Joint Replacement Techniques', amount: 2000 },
        { id: 'spinal-surgery', name: 'Spine Surgery and Instrumentation', amount: 2500 },
        { id: 'pediatric-orthopedics', name: 'Pediatric Orthopedics', amount: 2000 },
        { id: 'arthroscopy', name: 'Arthroscopic Surgery Techniques', amount: 1500 },
        { id: 'orthopedic-rehab', name: 'Orthopedic Rehabilitation', amount: 1800 },
        { id: 'trauma-surgery', name: 'Orthopedic Trauma Surgery', amount: 2200 }
      ],
      isActive: true,
      createdBy: adminUser._id
    }

    // Discount Configuration
    const discountConfig = {
      type: 'discounts',
      key: 'active_discounts',
      value: [
        {
          id: 'independence-day',
          name: 'Independence Day Special',
          type: 'time-based',
          percentage: 15,
          startDate: '2024-08-10',
          endDate: '2024-08-20',
          applicableCategories: ['regular', 'faculty'],
          isActive: true
        },
        {
          id: 'early-bird',
          name: 'Early Bird Discount',
          type: 'time-based',
          percentage: 10,
          endDate: '2024-07-31',
          applicableCategories: ['all'],
          isActive: true
        }
      ],
      isActive: true,
      createdBy: adminUser._id
    }

    // Conference Content Configuration
    const contentConfig = {
      type: 'content',
      key: 'conference_details',
      value: {
        name: 'OSSAPCON 2026',
        fullName: 'Annual Conference of Orthopedic Surgeons Society of Andhra Pradesh',
        theme: 'Excellence in Orthopedic Care',
        dates: {
          start: '2026-08-07',
          end: '2026-08-09'
        },
        venue: {
          name: 'Kurnool Medical College',
          city: 'Kurnool',
          state: 'Andhra Pradesh',
          country: 'India'
        },
        contact: {
          email: 'contact@ossapcon2026.com',
          phone: '+91 9052192744',
          contactPerson: 'LAXMI PRABHA',
          website: 'https://ossapcon2026.com'
        }
      },
      isActive: true,
      createdBy: adminUser._id
    }

    // Email Configuration
    const emailConfig = {
      type: 'settings',
      key: 'email_settings',
      value: {
        fromName: 'OSSAPCON 2026',
        fromEmail: 'contact@ossapcon2026.com',
        replyTo: 'contact@ossapcon2026.com',
        smtp: {
          host: 'smtpout.secureserver.net',
          port: 465,
          secure: true,
          requireAuth: true
        },
        templates: {
          registration: {
            subject: 'Registration Confirmation - OSSAPCON 2026',
            enabled: true
          },
          payment: {
            subject: 'Payment Confirmation & Invoice - OSSAPCON 2026',
            enabled: true
          },
          reminder: {
            subject: 'Conference Reminder - OSSAPCON 2026',
            enabled: true
          },
          passwordReset: {
            subject: 'Password Reset - OSSAPCON 2026',
            enabled: true
          },
          bulkEmail: {
            subject: 'Important Update - OSSAPCON 2026',
            enabled: true
          }
        },
        rateLimiting: {
          maxEmailsPerHour: 100,
          maxBulkEmailsPerDay: 1000,
          batchSize: 10,
          delayBetweenBatches: 1000
        }
      },
      isActive: true,
      createdBy: adminUser._id
    }

    // Seed workshops
    const workshops = [
      {
        id: 'joint-replacement',
        name: 'Advanced Joint Replacement Techniques',
        description: 'Learn cutting-edge techniques in hip and knee replacement procedures.',
        instructor: 'Dr. Rajesh Kumar',
        duration: '4 hours',
        price: 2000,
        currency: 'INR',
        maxSeats: 30,
        bookedSeats: 0,
        registrationStart: new Date('2025-08-01'),
        registrationEnd: new Date('2026-08-06'),
        workshopDate: new Date('2026-08-07'),
        workshopTime: '09:00 AM - 01:00 PM',
        venue: 'Workshop Hall A',
        prerequisites: 'Basic orthopedic surgery knowledge required',
        materials: 'Surgical instruments will be provided',
        isActive: true
      },
      {
        id: 'spinal-surgery',
        name: 'Spine Surgery and Instrumentation',
        description: 'Comprehensive approach to spinal surgery and instrumentation techniques.',
        instructor: 'Dr. Priya Sharma',
        duration: '6 hours',
        price: 2500,
        currency: 'INR',
        maxSeats: 25,
        bookedSeats: 0,
        registrationStart: new Date('2025-08-01'),
        registrationEnd: new Date('2026-08-06'),
        workshopDate: new Date('2026-08-08'),
        workshopTime: '09:00 AM - 03:00 PM',
        venue: 'Workshop Hall B',
        prerequisites: 'Medical degree required',
        materials: 'Case studies and simulation models provided',
        isActive: true
      },
      {
        id: 'pediatric-orthopedics',
        name: 'Pediatric Orthopedics',
        description: 'Specialized care for pediatric orthopedic conditions and deformities.',
        instructor: 'Dr. Anita Reddy',
        duration: '4 hours',
        price: 2000,
        currency: 'INR',
        maxSeats: 20,
        bookedSeats: 0,
        registrationStart: new Date('2025-08-01'),
        registrationEnd: new Date('2026-08-06'),
        workshopDate: new Date('2026-08-07'),
        workshopTime: '02:00 PM - 06:00 PM',
        venue: 'Workshop Hall C',
        prerequisites: 'Pediatric experience preferred',
        materials: 'Pediatric simulation models available',
        isActive: true
      },
      {
        id: 'arthroscopy',
        name: 'Arthroscopic Surgery Techniques',
        description: 'Modern arthroscopic techniques for joint procedures.',
        instructor: 'Dr. Suresh Patel',
        duration: '3 hours',
        price: 1500,
        currency: 'INR',
        maxSeats: 35,
        bookedSeats: 0,
        registrationStart: new Date('2025-08-01'),
        registrationEnd: new Date('2026-08-06'),
        workshopDate: new Date('2026-08-08'),
        workshopTime: '10:00 AM - 01:00 PM',
        venue: 'Workshop Hall D',
        prerequisites: 'Surgical experience required',
        materials: 'Arthroscopic equipment for demonstration',
        isActive: true
      },
      {
        id: 'orthopedic-rehab',
        name: 'Orthopedic Rehabilitation',
        description: 'Comprehensive rehabilitation strategies for orthopedic patients.',
        instructor: 'Dr. Meera Joshi',
        duration: '5 hours',
        price: 1800,
        currency: 'INR',
        maxSeats: 40,
        bookedSeats: 0,
        registrationStart: new Date('2025-08-01'),
        registrationEnd: new Date('2026-08-06'),
        workshopDate: new Date('2026-08-09'),
        workshopTime: '09:00 AM - 02:00 PM',
        venue: 'Rehabilitation Center',
        prerequisites: 'Healthcare professional background',
        materials: 'Rehabilitation equipment and protocols',
        isActive: true
      },
      {
        id: 'trauma-surgery',
        name: 'Orthopedic Trauma Surgery',
        description: 'Critical decision making in orthopedic trauma situations.',
        instructor: 'Dr. Vikram Singh',
        duration: '4 hours',
        price: 2200,
        currency: 'INR',
        maxSeats: 28,
        bookedSeats: 0,
        registrationStart: new Date('2025-08-01'),
        registrationEnd: new Date('2026-08-06'),
        workshopDate: new Date('2026-08-08'),
        workshopTime: '04:00 PM - 08:00 PM',
        venue: 'Emergency Simulation Lab',
        prerequisites: 'Emergency medicine experience',
        materials: 'Trauma surgical kits and simulators',
        isActive: true
      }
    ]

    for (const workshopData of workshops) {
      await Workshop.findOneAndUpdate(
        { id: workshopData.id },
        workshopData,
        { upsert: true, new: true }
      )
      console.log(`Workshop ${workshopData.name} seeded`)
    }

    // Insert or update configurations
    // Accompanying Person Pricing Configuration
    const accompanyingPersonConfig = {
      type: 'pricing',
      key: 'accompanying_person',
      value: {
        basePrice: 3000,
        currency: 'INR',
        tierPricing: {
          'independence-day-2025': 5000,
          'earlyBird': 3000,
          'regular': 3500,
          'onsite': 4000
        },
        description: 'Pricing for accompanying persons by tier'
      },
      isActive: true,
      createdBy: adminUser._id
    }

    const configs = [pricingTiersConfig, pricingConfig, workshopConfig, discountConfig, contentConfig, emailConfig, accompanyingPersonConfig]
    
    for (const config of configs) {
      await Configuration.findOneAndUpdate(
        { type: config.type, key: config.key },
        config,
        { upsert: true, new: true }
      )
      console.log(`Configuration ${config.type}:${config.key} seeded`)
    }

    console.log('Initial configuration and workshops seeded successfully')
    return true
  } catch (error) {
    console.error('Error seeding initial configuration:', error)
    return false
  }
}