const path = require('path')
const fs = require('fs')
const mongoose = require('mongoose')

// Load env from .env.local if present
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n')
  for (const line of lines) {
    const [k, ...v] = line.split('=')
    if (k && v.length) process.env[k] = v.join('=').trim().replace(/^["']|["']$/g, '')
  }
}

const configurationSchema = new mongoose.Schema({
  type: String,
  key: String,
  value: mongoose.Schema.Types.Mixed,
  isActive: { type: Boolean, default: true },
  createdBy: { type: String, default: 'system' },
}, { timestamps: true })

const Configuration = mongoose.models.Configuration || mongoose.model('Configuration', configurationSchema)

async function main() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('MONGODB_URI not set')
    process.exit(1)
  }
  await mongoose.connect(uri)

  // Pricing tiers per user table
  const pricing_tiers = {
    earlyBird: {
      name: 'Early Bird Registration', isActive: true,
      startDate: '2025-08-01',
      endDate: '2025-10-31',
      categories: {
        'ossap-member': { amount: 8250, currency: 'INR', label: 'OSSAP Member' },
        'non-member': { amount: 9440, currency: 'INR', label: 'OSSAP Non-Member' },
        'pg-student': { amount: 5900, currency: 'INR', label: 'PG' },
      }
    },
    regular: {
      name: 'Regular Registration', isActive: true,
      startDate: '2025-11-01',
      endDate: '2026-01-25',
      categories: {
        'ossap-member': { amount: 9440, currency: 'INR', label: 'OSSAP Member' },
        'non-member': { amount: 10620, currency: 'INR', label: 'OSSAP Non-Member' },
        'pg-student': { amount: 7080, currency: 'INR', label: 'PG' },
      }
    },
    onsite: {
      name: 'Late / Spot Registration', isActive: true,
      startDate: '2026-01-26',
      endDate: '2026-02-09',
      categories: {
        'ossap-member': { amount: 11210, currency: 'INR', label: 'OSSAP Member' },
        'non-member': { amount: 11800, currency: 'INR', label: 'OSSAP Non-Member' },
        'pg-student': { amount: 8260, currency: 'INR', label: 'PG' },
      }
    }
  }

  // Upsert pricing tiers
  await Configuration.findOneAndUpdate(
    { type: 'pricing', key: 'pricing_tiers' },
    { type: 'pricing', key: 'pricing_tiers', value: pricing_tiers, isActive: true, createdBy: 'system' },
    { upsert: true, new: true }
  )
  console.log('✅ Seeded pricing_tiers')

  // Legacy registration_categories for compatibility
  await Configuration.findOneAndUpdate(
    { type: 'pricing', key: 'registration_categories' },
    { type: 'pricing', key: 'registration_categories', value: pricing_tiers.regular.categories, isActive: true, createdBy: 'system' },
    { upsert: true, new: true }
  )
  console.log('✅ Seeded registration_categories')

  // Accompanying person fee (inclusive 18% GST) = 4720 as provided
  await Configuration.findOneAndUpdate(
    { type: 'pricing', key: 'accompanying_person' },
    { type: 'pricing', key: 'accompanying_person', value: { basePrice: 4720, currency: 'INR' }, isActive: true, createdBy: 'system' },
    { upsert: true, new: true }
  )
  console.log('✅ Seeded accompanying_person = 4720')

  // Disable all discounts by default
  await Configuration.findOneAndUpdate(
    { type: 'discounts', key: 'active_discounts' },
    { type: 'discounts', key: 'active_discounts', value: [], isActive: true, createdBy: 'system' },
    { upsert: true, new: true }
  )
  console.log('✅ Cleared active_discounts')

  await mongoose.connection.close()
}

main().catch(err => { console.error(err); process.exit(1) })


