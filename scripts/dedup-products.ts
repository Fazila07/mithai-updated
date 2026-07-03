/**
 * ─── Cookie Dedup Script ─────────────────────────────────────
 * 
 * Finds and merges duplicate products with the same groupSlug.
 * For products sharing a groupSlug, the one with highest salesCount is kept
 * and the others are deleted (after consolidating stats).
 * 
 * Usage:
 *   npx tsx scripts/dedup-products.ts            # dry-run (shows what would change)
 *   npx tsx scripts/dedup-products.ts --execute   # actually performs the dedup
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

const ProductSchema = new mongoose.Schema({
  uniqueId: String,
  name: String,
  slug: { type: String, unique: true },
  groupSlug: String,
  categoryId: mongoose.Schema.Types.ObjectId,
  price: Number,
  comparePrice: Number,
  stock: Number,
  weight: String,
  tags: [String],
  ingredients: [String],
  benefits: [String],
  images: [String],
  bestSeller: Boolean,
  featured: Boolean,
  active: Boolean,
  rating: Number,
  reviewCount: Number,
  salesCount: Number,
  description: String,
  shortDescription: String,
  foodType: String,
  popularTags: [String],
  featuredImage: String,
  sku: String,
  subcategory: String,
}, { timestamps: true, strict: false })

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)

const isDryRun = !process.argv.includes('--execute')

async function main() {
  console.log(`\n🔍 Cookie/Product Dedup Script${isDryRun ? ' (DRY RUN — pass --execute to apply)' : ' (EXECUTING!)'}\n`)

  await mongoose.connect(MONGODB_URI!)
  console.log('✅ Connected to MongoDB\n')

  // Step 1: Find all products and identify duplicates by name (case-insensitive)
  const products = await Product.find({}).lean()
  console.log(`📋 Total products: ${products.length}\n`)

  // Group by normalized name (lowercase, trimmed)
  const nameGroups: Record<string, any[]> = {}
  for (const p of products) {
    const key = (p.name as string).toLowerCase().trim()
    if (!nameGroups[key]) nameGroups[key] = []
    nameGroups[key].push(p)
  }

  // Find duplicates
  const duplicateGroups = Object.entries(nameGroups).filter(([, items]) => items.length > 1)

  if (duplicateGroups.length === 0) {
    console.log('✅ No duplicate products found! Database is clean.')
    return
  }

  console.log(`⚠️  Found ${duplicateGroups.length} duplicate group(s):\n`)

  let totalToRemove = 0

  for (const [name, items] of duplicateGroups) {
    console.log(`  📦 "${name}" — ${items.length} entries:`)

    // Sort by salesCount descending — keep the one with most sales
    items.sort((a: any, b: any) => (b.salesCount || 0) - (a.salesCount || 0))

    const keep = items[0]
    const remove = items.slice(1)
    totalToRemove += remove.length

    // Consolidate stats from duplicates into the primary
    let totalSales = keep.salesCount || 0
    let totalReviews = keep.reviewCount || 0
    let totalStock = keep.stock || 0
    let bestImages = [...(keep.images || [])]

    for (const dup of remove) {
      totalSales += dup.salesCount || 0
      totalReviews += dup.reviewCount || 0
      totalStock += dup.stock || 0
      // Merge unique images
      for (const img of (dup.images || [])) {
        if (img && !bestImages.includes(img)) bestImages.push(img)
      }
    }

    console.log(`    ✅ KEEP: ${keep.slug} (sales: ${keep.salesCount || 0}, stock: ${keep.stock || 0}, id: ${keep._id})`)
    for (const dup of remove) {
      console.log(`    ❌ REMOVE: ${dup.slug} (sales: ${dup.salesCount || 0}, stock: ${dup.stock || 0}, id: ${dup._id})`)
    }

    if (!isDryRun) {
      // Update the primary with consolidated stats
      await Product.updateOne(
        { _id: keep._id },
        {
          $set: {
            salesCount: totalSales,
            reviewCount: totalReviews,
            stock: totalStock,
            images: bestImages,
          },
        }
      )

      // Delete duplicates
      const removeIds = remove.map((d: any) => d._id)
      await Product.deleteMany({ _id: { $in: removeIds } })
      console.log(`    ✅ Merged and removed ${remove.length} duplicate(s)`)
    }

    console.log('')
  }

  console.log(`\n📊 Summary:`)
  console.log(`   Duplicate groups: ${duplicateGroups.length}`)
  console.log(`   Products to remove: ${totalToRemove}`)

  if (isDryRun) {
    console.log(`\n💡 Run with --execute flag to perform the dedup:`)
    console.log(`   npx tsx scripts/dedup-products.ts --execute`)
  } else {
    console.log(`\n✅ Dedup completed!`)
  }
}

main()
  .catch((e) => { console.error('❌ Error:', e); process.exit(1) })
  .finally(() => mongoose.disconnect())
