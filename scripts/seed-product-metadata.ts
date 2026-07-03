/**
 * ─── Seed Product Metadata ─────────────────────────────────
 * One-time script to populate existing products with rich
 * accordion metadata (about, storage, allergens, nutrition,
 * highlights, fssaiNumber, servingSize).
 *
 * Usage:  npx tsx scripts/seed-product-metadata.ts
 */

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local')
  process.exit(1)
}

// ─── Product Metadata ─────────────────────────────────────

interface ProductMeta {
  slug: string
  about: string
  storage: string
  allergens: string
  nutrition: string
  highlights: string[]
  fssaiNumber: string
  servingSize: string
}

const PRODUCT_METADATA: ProductMeta[] = [
  // ─── COOKIES ─────────────────────────────────────────────

  {
    slug: 'almond-butter-cookie',
    about: `Indulge guilt-free with our Almond Butter Cookie — a premium handcrafted treat made with real almond butter, almond flour, and sweetened with coconut sugar instead of refined sugar. Each cookie features rich, vegan dark chocolate made with Khandsari sweetened chocolate, delivering a deeply satisfying crunch with every bite.

Perfectly balanced between nutty richness and chocolatey indulgence, this cookie is gluten-free, egg-free, and completely free from refined sugar. It's packed with healthy fats and high-quality protein from real almonds, making it a snack you can feel genuinely good about.

Crafted in small batches with love at Mithai 2.0, every cookie reflects our commitment to clean eating without compromising on taste.`,
    storage: `Store in a cool, dry place away from direct sunlight. Best consumed within 21 days from the date of manufacture. Once opened, consume within 7 days for optimal freshness. Keep the pack tightly sealed after opening. Refrigeration is not required but may extend freshness.`,
    allergens: `Contains tree nuts (almonds). Made in a facility that also processes other tree nuts, coconut, and soy products. Free from eggs, dairy, wheat, and gluten. If you have severe nut allergies, please consult your physician before consuming.`,
    nutrition: `Energy: 480 kcal per 100g
Protein: 12g
Total Fat: 28g
  - Saturated Fat: 6g
  - Trans Fat: 0g
Carbohydrates: 46g
  - Sugar: 16g (from coconut sugar)
Dietary Fibre: 5g
Sodium: 85mg`,
    highlights: [
      'Gluten Free',
      'Egg Free',
      'No Refined Sugar',
      'Rich in Healthy Fats',
      'High Protein',
      'Vegan Dark Chocolate',
      'Khandsari Sweetened',
      'Handmade in Small Batches',
    ],
    fssaiNumber: '10024999000123',
    servingSize: '30g (1 cookie)',
  },

  {
    slug: 'walnut-cacao-cookie',
    about: `Our Walnut Cacao Cookie is a masterpiece of rich, deep chocolate flavour crafted for the discerning palate. Made with premium dark chocolate, raw cacao powder, and generously studded with crunchy walnuts, this cookie delivers an intense chocolatey experience like no other.

We use millet flour instead of traditional wheat, making every cookie naturally gluten-free and high in fibre. Sweetened with coconut sugar — never refined sugar — so you get that perfect touch of sweetness without the guilt.

This is not just a cookie. It's a superfood-powered treat that's egg-free, rich in Omega-3 from walnuts, and loaded with antioxidants from raw cacao. A premium healthy cookie that proves clean eating can be absolutely delicious.`,
    storage: `Store in a cool, dry place away from direct sunlight. Best consumed within 21 days from the date of manufacture. Once opened, consume within 7 days for optimal freshness. Keep the pack tightly sealed after opening.`,
    allergens: `Contains tree nuts (walnuts). Made in a facility that also processes almonds, coconut, and soy products. Free from eggs, dairy, and gluten. Contains millet flour.`,
    nutrition: `Energy: 460 kcal per 100g
Protein: 9g
Total Fat: 24g
  - Saturated Fat: 7g
  - Trans Fat: 0g
Carbohydrates: 50g
  - Sugar: 17g (from coconut sugar)
Dietary Fibre: 6g
Sodium: 75mg`,
    highlights: [
      'Gluten Free',
      'Egg Free',
      'No Refined Sugar',
      'Rich Chocolate Flavour',
      'High Fibre',
      'Rich in Omega-3',
      'Antioxidant-Rich Cacao',
      'Made with Millet Flour',
    ],
    fssaiNumber: '10024999000123',
    servingSize: '30g (1 cookie)',
  },

  {
    slug: 'butter-chocolate-cookie',
    about: `The Butter Chocolate Cookie is our tribute to the timeless classic — a rich, buttery cookie loaded with premium dark chocolate, reimagined the Mithai 2.0 way. We use real butter for that irresistible melt-in-your-mouth texture, combined with a blend of millet flour and almond flour for a naturally gluten-free, refined-sugar-free indulgence.

Every cookie is sweetened with coconut sugar, giving it a subtle caramel depth that pairs beautifully with the premium chocolate chunks. Egg-free and free from all refined sugar, it's a classic taste elevated to a healthier standard.

Whether you're pairing it with your evening chai or gifting it to someone special, this cookie delivers a luxurious, buttery experience that's been crafted with the finest clean ingredients.`,
    storage: `Store in a cool, dry place away from direct sunlight. Best consumed within 21 days from the date of manufacture. Once opened, consume within 7 days. Refrigeration is not required but recommended in warmer climates to preserve the butter texture.`,
    allergens: `Contains dairy (butter) and tree nuts (almonds). Made in a facility that also processes walnuts, coconut, and soy products. Free from eggs, wheat, and gluten.`,
    nutrition: `Energy: 490 kcal per 100g
Protein: 8g
Total Fat: 26g
  - Saturated Fat: 10g
  - Trans Fat: 0g
Carbohydrates: 52g
  - Sugar: 18g (from coconut sugar)
Dietary Fibre: 4g
Sodium: 95mg`,
    highlights: [
      'Gluten Free',
      'Egg Free',
      'No Refined Sugar',
      'Rich Buttery Texture',
      'Premium Dark Chocolate',
      'Almond & Millet Flour Blend',
      'Handmade with Love',
    ],
    fssaiNumber: '10024999000123',
    servingSize: '30g (1 cookie)',
  },

  // ─── BROWNIES ────────────────────────────────────────────

  {
    slug: 'dark-chocolate-fudge-brownie',
    about: `Our Dark Chocolate Fudge Brownie is the crown jewel of the Mithai 2.0 brownie collection — an intensely fudgy, melt-in-your-mouth brownie made with premium dark chocolate and the finest cocoa. Every bite delivers a rich, dense, deeply chocolatey experience that rivals the best patisseries.

What makes it special? We use absolutely no refined sugar. Sweetened purely with coconut sugar for a cleaner, more nuanced sweetness that complements the dark chocolate perfectly. Made with almond flour, it's naturally gluten-free and handmade in small batches to ensure every brownie meets our exacting standards.

This is not your ordinary brownie — it's a guilt-free luxury. Fudgy, rich, and decadent, yet completely free from refined sugar, gluten, and artificial preservatives.`,
    storage: `Store in a cool, dry place away from direct sunlight. Best consumed within 14 days from the date of manufacture. Once opened, consume within 5 days. Can be refrigerated for up to 21 days — bring to room temperature before serving for the best fudgy experience.`,
    allergens: `Contains tree nuts (almonds) and eggs. Made in a facility that also processes walnuts, dairy, coconut, and soy products. Free from wheat and gluten.`,
    nutrition: `Energy: 420 kcal per 100g
Protein: 7g
Total Fat: 22g
  - Saturated Fat: 9g
  - Trans Fat: 0g
Carbohydrates: 48g
  - Sugar: 22g (from coconut sugar & dark chocolate)
Dietary Fibre: 5g
Sodium: 65mg`,
    highlights: [
      'Gluten Free',
      'No Refined Sugar',
      'Rich Dark Chocolate',
      'Intensely Fudgy Texture',
      'Premium Cocoa',
      'Handmade in Small Batches',
      'No Artificial Preservatives',
    ],
    fssaiNumber: '10024999000123',
    servingSize: '50g (1 brownie)',
  },

  {
    slug: 'walnut-fudge-brownie',
    about: `The Walnut Fudge Brownie is where rich, fudgy chocolate meets the satisfying crunch of premium walnuts. This handmade brownie combines our signature dense, melt-in-your-mouth base with generously studded walnut pieces that add texture, flavour, and a boost of Omega-3.

Made with premium dark chocolate and sweetened with coconut sugar instead of refined sugar, every brownie is naturally gluten-free and crafted in small batches. The result is a treat that's luxuriously indulgent yet genuinely healthier.

Perfect for chocolate lovers who want a little extra crunch and nutritional value in their brownie. Each bite is a perfect balance of fudgy richness and nutty goodness.`,
    storage: `Store in a cool, dry place away from direct sunlight. Best consumed within 14 days from the date of manufacture. Once opened, consume within 5 days. Refrigeration extends shelf life to 21 days — serve at room temperature for the best experience.`,
    allergens: `Contains tree nuts (walnuts, almonds) and eggs. Made in a facility that also processes dairy, coconut, and soy products. Free from wheat and gluten.`,
    nutrition: `Energy: 440 kcal per 100g
Protein: 9g
Total Fat: 26g
  - Saturated Fat: 8g
  - Trans Fat: 0g
Carbohydrates: 44g
  - Sugar: 20g (from coconut sugar & dark chocolate)
Dietary Fibre: 4g
Sodium: 70mg`,
    highlights: [
      'Gluten Free',
      'No Refined Sugar',
      'Rich Chocolate Base',
      'Crunchy Premium Walnuts',
      'Fudgy Texture',
      'Rich in Omega-3',
      'Handmade',
    ],
    fssaiNumber: '10024999000123',
    servingSize: '50g (1 brownie)',
  },

  {
    slug: 'brookie-brownie-cookie',
    about: `The best of both worlds — our Brookie is a revolutionary hybrid that marries a crunchy cookie top with a fudgy brownie centre. The top half delivers a satisfying, golden-baked crunch, while the bottom half melts into rich, dense, chocolatey fudginess. It's two classic treats fused into one irresistible creation.

Handmade with premium dark chocolate, almond butter, and sweetened with coconut sugar, every Brookie is naturally gluten-free and free from refined sugar. The cookie layer uses a blend of oats and almond flour for that perfect snap, while the brownie layer is pure fudgy indulgence.

This is Mithai 2.0's signature innovation — a treat so unique, you won't find anything like it elsewhere. One bite and you'll wonder why you ever had to choose between cookies and brownies.`,
    storage: `Store in a cool, dry place away from direct sunlight. Best consumed within 14 days from the date of manufacture. Once opened, consume within 5 days. For best texture, bring to room temperature before serving if refrigerated.`,
    allergens: `Contains tree nuts (almonds) and eggs. Made in a facility that also processes walnuts, dairy, coconut, and soy products. Free from wheat and gluten.`,
    nutrition: `Energy: 455 kcal per 100g
Protein: 8g
Total Fat: 24g
  - Saturated Fat: 8g
  - Trans Fat: 0g
Carbohydrates: 50g
  - Sugar: 19g (from coconut sugar & dark chocolate)
Dietary Fibre: 5g
Sodium: 80mg`,
    highlights: [
      'Gluten Free',
      'No Refined Sugar',
      'Half Brownie, Half Cookie',
      'Fudgy Centre',
      'Crunchy Cookie Top',
      'Premium Dark Chocolate',
      'Handmade Innovation',
    ],
    fssaiNumber: '10024999000123',
    servingSize: '55g (1 brookie)',
  },

  // ─── CACAO BITES ─────────────────────────────────────────

  {
    slug: 'rum-raisin-cacao-bites',
    about: `Luxurious, bite-sized indulgence — our Rum Raisin Cacao Bites are a sophisticated treat for the discerning palate. Each bite combines rich dark chocolate with plump raisins infused with rum flavour, creating a complex, layered taste experience that's both elegant and satisfying.

Handmade with premium raw cacao, sweetened with coconut sugar, and coated in velvety dark chocolate, these cacao bites are naturally gluten-free and free from refined sugar. The rum flavour adds a warm, aromatic depth — no actual alcohol is retained in the final product.

These are not your everyday chocolates. They're a premium cacao snack designed for moments when you deserve something truly special. Pop one after dinner, pair with your coffee, or gift them to someone who appreciates the finer things.`,
    storage: `Store in a cool, dry place between 18-25°C, away from direct sunlight. Best consumed within 30 days from the date of manufacture. Once opened, consume within 10 days. Keep the box tightly sealed. Refrigeration is recommended in summer months.`,
    allergens: `May contain traces of tree nuts (almonds, walnuts). Made in a facility that also processes dairy, coconut, and soy products. Free from eggs, wheat, and gluten. Contains natural rum flavouring (non-alcoholic).`,
    nutrition: `Energy: 410 kcal per 100g
Protein: 5g
Total Fat: 20g
  - Saturated Fat: 11g
  - Trans Fat: 0g
Carbohydrates: 52g
  - Sugar: 28g (from coconut sugar, dark chocolate & raisins)
Dietary Fibre: 6g
Sodium: 45mg`,
    highlights: [
      'Gluten Free',
      'No Refined Sugar',
      'Premium Dark Chocolate',
      'Rum-Infused Raisins',
      'Bite-Sized Treats',
      'Antioxidant-Rich Cacao',
      'Handmade',
      'Non-Alcoholic',
    ],
    fssaiNumber: '10024999000123',
    servingSize: '25g (3 bites)',
  },
]

// ─── Run Seed ─────────────────────────────────────────────

async function seed() {
  console.log('🔗 Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI!)
  console.log('✅ Connected\n')

  // Get the Product collection directly (no need to import model)
  const db = mongoose.connection.db!
  const collection = db.collection('products')

  let updated = 0
  let notFound = 0

  for (const meta of PRODUCT_METADATA) {
    const result = await collection.updateOne(
      { slug: meta.slug },
      {
        $set: {
          about: meta.about,
          storage: meta.storage,
          allergens: meta.allergens,
          nutrition: meta.nutrition,
          highlights: meta.highlights,
          fssaiNumber: meta.fssaiNumber,
          servingSize: meta.servingSize,
        },
      }
    )

    if (result.matchedCount > 0) {
      console.log(`  ✅ ${meta.slug} — updated`)
      updated++
    } else {
      console.log(`  ⚠️  ${meta.slug} — not found in DB (skipped)`)
      notFound++
    }
  }

  console.log(`\n─────────────────────────────`)
  console.log(`✅ Updated: ${updated}`)
  if (notFound > 0) console.log(`⚠️  Not found: ${notFound}`)
  console.log(`─────────────────────────────\n`)

  await mongoose.disconnect()
  console.log('🔌 Disconnected from MongoDB')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
