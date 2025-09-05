const path = require('path');
const fs = require('fs');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      const cleanValue = value.replace(/^["']|["']$/g, '');
      process.env[key.trim()] = cleanValue;
    }
  });
  console.log('Environment variables loaded from .env.local');
}

const mongoose = require('mongoose');

// Configuration Schema
const configurationSchema = new mongoose.Schema({
  type: { type: String, required: true },
  key: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Configuration = mongoose.models.Configuration || mongoose.model('Configuration', configurationSchema);

async function seedAllConfigurations() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI not found in environment variables');
      process.exit(1);
    }

    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // 1. Pricing Configuration
    console.log('💰 Seeding Pricing Configuration...');
    await Configuration.findOneAndUpdate(
      { type: 'pricing', key: 'pricing_tiers' },
      {
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
              'pg-student': { amount: 8000, currency: 'INR', label: 'PG Student' }
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
              'pg-student': { amount: 10000, currency: 'INR', label: 'PG Student' }
            }
          },
          workshops: [
            {
              id: 'arthroscopy-101',
              name: 'Arthroscopy Fundamentals',
              description: 'Introduction to arthroscopic techniques',
              instructor: 'Dr. Rajesh Kumar',
              duration: '4 hours',
              price: 2500,
              currency: 'INR',
              maxSeats: 25,
              prerequisites: 'Basic orthopedic knowledge',
              isActive: true
            },
            {
              id: 'spine-surgery',
              name: 'Advanced Spine Surgery Techniques',
              description: 'Latest techniques in spinal surgery',
              instructor: 'Dr. Priya Sharma',
              duration: '6 hours',
              price: 3500,
              currency: 'INR',
              maxSeats: 20,
              prerequisites: 'Experience in spine surgery',
              isActive: true
            }
          ]
        },
        isActive: true,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    // 2. Discount Configuration
    console.log('🎯 Seeding Discount Configuration...');
    await Configuration.findOneAndUpdate(
      { type: 'discounts', key: 'active_discounts' },
      {
        type: 'discounts',
        key: 'active_discounts',
        value: [
          {
            id: 'early-bird',
            name: 'Early Bird Discount',
            type: 'time-based',
            percentage: 10,
            endDate: '2025-12-31',
            applicableCategories: ['all'],
            description: 'Early registration discount',
            isActive: true
          },
          {
            id: 'student-special',
            name: 'Student Special',
            type: 'code-based',
            code: 'STUDENT2026',
            percentage: 20,
            applicableCategories: ['pg-student'],
            description: 'Additional discount for verified students',
            isActive: true
          },
          {
            id: 'group-registration',
            name: 'Group Registration',
            type: 'code-based',
            code: 'GROUP5',
            percentage: 5,
            applicableCategories: ['all'],
            description: 'Discount for group registrations (5+ people)',
            isActive: true
          }
        ],
        isActive: true,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    // 3. Email Configuration (update existing)
    console.log('📧 Updating Email Configuration...');
    await Configuration.findOneAndUpdate(
      { type: 'settings', key: 'email_settings' },
      {
        $set: {
          'value.templates.registration.enabled': true,
          'value.templates.registration.subject': 'Application Received - OSSAPCON 2026',
          'value.templates.payment.enabled': true,
          'value.templates.payment.subject': 'Payment Confirmation - OSSAPCON 2026',
          'value.templates.reminder.enabled': true,
          'value.templates.reminder.subject': 'Conference Reminder - OSSAPCON 2026',
          'value.templates.bulkEmail.enabled': true,
          'value.templates.bulkEmail.subject': 'Important Update - OSSAPCON 2026',
          updatedAt: new Date()
        }
      }
    );

    // 4. Content Configuration
    console.log('📝 Seeding Content Configuration...');
    await Configuration.findOneAndUpdate(
      { type: 'content', key: 'website_content' },
      {
        type: 'content',
        key: 'website_content',
        value: {
          heroSection: {
            title: 'OSSAPCON 2026',
            subtitle: 'Excellence in Orthopedic Care',
            description: 'Join the premier orthopedic conference in Kurnool, Andhra Pradesh from February 4-6, 2026.',
            ctaText: 'Register Now',
            backgroundImage: '/hero-bg.jpg'
          },
          aboutSection: {
            title: 'About OSSAPCON 2026',
            description: 'The Orthopedic Surgeons Society of Andhra Pradesh (OSSAP) proudly presents OSSAPCON 2026, bringing together leading orthopedic professionals to share knowledge, innovations, and best practices.',
            highlights: [
              'Expert speakers from around the world',
              'Hands-on workshops and training',
              'Latest research presentations',
              'Networking opportunities'
            ]
          },
          venueInfo: {
            name: 'Kurnool Medical College',
            address: 'Kurnool, Andhra Pradesh, India',
            mapUrl: 'https://maps.google.com/...',
            facilities: ['Modern auditorium', 'Workshop labs', 'Exhibition space', 'Parking']
          },
          keyDates: {
            conferenceStart: '2026-02-04',
            conferenceEnd: '2026-02-06',
            earlyBirdDeadline: '2025-12-31',
            registrationDeadline: '2026-01-31'
          }
        },
        isActive: true,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    // 5. Report Configuration
    console.log('📊 Seeding Report Configuration...');
    await Configuration.findOneAndUpdate(
      { type: 'reports', key: 'report_settings' },
      {
        type: 'reports',
        key: 'report_settings',
        value: {
          exportFormats: ['csv', 'excel', 'pdf'],
          defaultFormat: 'csv',
          includeFields: {
            registrations: [
              'registrationId',
              'name',
              'email',
              'phone',
              'institution',
              'registrationType',
              'registrationDate',
              'paymentStatus',
              'amount',
              'utrNumber'
            ],
            payments: [
              'registrationId',
              'amount',
              'currency',
              'method',
              'status',
              'transactionDate',
              'utrNumber',
              'verifiedBy'
            ],
            workshops: [
              'workshopName',
              'participantName',
              'email',
              'registrationDate',
              'paymentStatus'
            ]
          },
          filters: {
            dateRange: true,
            registrationType: true,
            paymentStatus: true,
            verificationStatus: true
          }
        },
        isActive: true,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    // 6. Bulk Email Configuration
    console.log('📮 Seeding Bulk Email Configuration...');
    await Configuration.findOneAndUpdate(
      { type: 'bulk_email', key: 'bulk_email_settings' },
      {
        type: 'bulk_email',
        key: 'bulk_email_settings',
        value: {
          enabled: true,
          maxRecipientsPerBatch: 50,
          delayBetweenBatches: 2000, // 2 seconds
          maxEmailsPerDay: 1000,
          allowedSenders: ['admin', 'moderator'],
          templates: {
            welcome: {
              subject: 'Welcome to OSSAPCON 2026',
              enabled: true
            },
            reminder: {
              subject: 'Conference Reminder - OSSAPCON 2026',
              enabled: true
            },
            update: {
              subject: 'Important Update - OSSAPCON 2026',
              enabled: true
            },
            cancellation: {
              subject: 'Conference Update - OSSAPCON 2026',
              enabled: true
            }
          },
          recipientFilters: [
            'all_registered',
            'paid_only',
            'pending_payment',
            'ossap_members',
            'non_members',
            'students',
            'workshop_participants'
          ]
        },
        isActive: true,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    console.log('✅ All configurations seeded successfully!');

    // Display summary
    const configs = await Configuration.find({}, 'type key isActive').lean();
    console.log('\n📋 Configuration Summary:');
    configs.forEach(config => {
      console.log(`  ${config.isActive ? '✅' : '❌'} ${config.type}:${config.key}`);
    });

  } catch (error) {
    console.error('❌ Error seeding configurations:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seeding
seedAllConfigurations().then(() => {
  console.log('🎉 All configurations seeding completed');
  process.exit(0);
});
