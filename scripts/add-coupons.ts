/**
 * Add missing coupons to the database without wiping existing data.
 * Usage: npx tsx scripts/add-coupons.ts
 */

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import dns from 'dns'

dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1'])
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) { console.error('❌ MONGODB_URI missing'); process.exit(1) }

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  description: { type: String, default: null },
  discountType: { type: String, required: true },
  value: { type: Number, required: true },
  minOrder: { type: Number, default: 0 },
  maxDiscount: { type: Number, default: null },
  usageLimit: { type: Number, default: null },
  usedCount: { type: Number, default: 0 },
  perUserLimit: { type: Number, default: 1 },
  active: { type: Boolean, default: true },
  expiryDate: { type: Date, required: true },
}, { timestamps: true })

const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema)

const COUPONS = [
  { code: 'MITHAI10', description: 'Get 10% off on your first order', discountType: 'percentage', value: 10, minOrder: 299, maxDiscount: 100, usageLimit: 1000, perUserLimit: 1, active: true, expiryDate: new Date('2026-12-31') },
  { code: 'HEALTHY20', description: '20% off on orders above ₹599', discountType: 'percentage', value: 20, minOrder: 599, maxDiscount: 200, usageLimit: 500, perUserLimit: 3, active: true, expiryDate: new Date('2026-06-30') },
  { code: 'SWEET50', description: 'Flat ₹50 off on orders above ₹399', discountType: 'flat', value: 50, minOrder: 399, maxDiscount: null, usageLimit: 200, perUserLimit: 2, active: true, expiryDate: new Date('2026-08-31') },
  { code: 'FESTIVE15', description: '15% off on all festive hampers', discountType: 'percentage', value: 15, minOrder: 499, maxDiscount: 150, usageLimit: 300, perUserLimit: 2, active: true, expiryDate: new Date('2026-10-31') },
  { code: 'PCOS30', description: '30% off on PCOS-friendly range', discountType: 'percentage', value: 30, minOrder: 349, maxDiscount: 250, usageLimit: 200, perUserLimit: 1, active: true, expiryDate: new Date('2026-09-30') },
  { code: 'RAGI25', description: '25% off on Ragi collection', discountType: 'percentage', value: 25, minOrder: 299, maxDiscount: 200, usageLimit: 150, perUserLimit: 2, active: true, expiryDate: new Date('2026-07-31') },
]

async function main() {
  await mongoose.connect(MONGODB_URI!)
  console.log('✅ Connected to MongoDB')

  let added = 0
  let skipped = 0

  for (const coupon of COUPONS) {
    const exists = await Coupon.findOne({ code: coupon.code })
    if (exists) {
      console.log(`⏭️  ${coupon.code} already exists, skipping`)
      skipped++
    } else {
      await Coupon.create(coupon)
      console.log(`✅ Created coupon: ${coupon.code}`)
      added++
    }
  }

  console.log(`\n🎉 Done! Added ${added}, skipped ${skipped} existing.`)
}

main()
  .catch((e) => { console.error('❌ Error:', e); process.exit(1) })
  .finally(() => mongoose.disconnect())
