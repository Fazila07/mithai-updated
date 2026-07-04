'use client'

import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import Link from 'next/link'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-mithai-off pt-[60px]">
        {/* Founder hero image */}
        <div className="about-hero-image">
          <Image
            src="/images/founder.jpeg"
            alt="The heart behind our brand"
            width={1200}
            height={800}
            priority
            unoptimized
            className="about-hero-photo"
          />
        </div>

        <article className="about-content">
          <h1 className="about-heading">The Heart Behind Our Brand</h1>

          <div className="about-body">
            <p className="about-lead">
              A reflection of everything I believe in — real food, honest ingredients, and the timeless beauty of our culture.
            </p>

            <p>
              I&apos;ve always been drawn to authenticity. Whether it&apos;s food, craftsmanship, or traditions, I believe the finest things are often those that have been a part of our heritage for generations. I wanted to bring the richness of our own land back to the table by celebrating ingredients that are deeply rooted in Indian culture.
            </p>

            <p>
              My journey became even more personal after experiencing hormonal health challenges. It made me rethink the way I ate and inspired me to create desserts that I could truly trust — made with ingredients that nourish without compromising on taste.
            </p>

            <p>
              Every brownie, cookie, laddoo, cracker and chocolate is handcrafted using wholesome Indian millet flours, free from refined sugar and maida, naturally gluten-free, and made without compound chocolate. Every ingredient is thoughtfully and responsibly sourced because I believe quality begins long before a recipe is made.
            </p>

            <p>
              I&apos;m a perfectionist by nature. Every recipe is carefully developed, tested, and refined until it meets the standards I have for my own home. If I wouldn&apos;t feed it to myself or my loved ones, it will never become a part of our collection.
            </p>

            <p>
              This brand is my way of proving that indulgence doesn&apos;t have to come at the cost of your well-being, and that our traditional ingredients deserve a place in modern desserts. I hope to celebrate the richness of Indian food culture while creating desserts that are clean, conscious, and crafted with care.
            </p>

            <p className="about-closing">
              Welcome to a sweeter way of celebrating our roots.
            </p>
          </div>

          <div className="about-highlights">
            {[
              { icon: '🌾', label: 'Millet Flour Based' },
              { icon: '🚫', label: 'No Refined Sugar' },
              { icon: '🌿', label: 'Naturally Gluten-Free' },
              { icon: '🍫', label: 'No Compound Chocolate' },
              { icon: '🤲', label: 'Handcrafted with Love' },
            ].map((item, idx) => (
              <div key={idx} className="about-highlight-item">
                <span className="about-highlight-icon">{item.icon}</span>
                <span className="about-highlight-label">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="about-cta">
            <Link href="/shop" className="about-cta-btn">
              Explore Our Collection
            </Link>
          </div>
        </article>

        <style jsx>{`
          .about-hero-image {
            width: 100%;
            overflow: hidden;
            background: #ede3d5;
          }
          .about-hero-photo {
            width: 100%;
            height: auto;
            max-height: 70vh;
            object-fit: cover;
            display: block;
          }

          .about-content {
            max-width: 720px;
            margin: 0 auto;
            padding: 40px 24px 60px;
          }

          .about-heading {
            font-family: 'Libre Baskerville', serif;
            font-size: clamp(1.75rem, 5vw, 2.4rem);
            font-weight: 700;
            color: #900c00;
            margin-bottom: 28px;
            line-height: 1.2;
            letter-spacing: -0.01em;
          }

          .about-body p {
            font-size: 1.05rem;
            line-height: 1.85;
            color: #3d1a10;
            margin-bottom: 24px;
          }
          .about-lead {
            font-size: 1.15rem !important;
            font-weight: 600;
            color: #900c00 !important;
            line-height: 1.7 !important;
            border-left: 3px solid #e3b448;
            padding-left: 20px;
            margin-bottom: 32px !important;
          }
          .about-closing {
            font-family: 'Libre Baskerville', serif;
            font-size: 1.2rem !important;
            font-weight: 600;
            color: #900c00 !important;
            text-align: center;
            margin-top: 40px !important;
            padding-top: 32px;
            border-top: 1px solid rgba(144, 12, 0, 0.12);
          }

          .about-highlights {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 16px;
            margin: 40px 0;
            padding: 32px 0;
            border-top: 1px solid rgba(144, 12, 0, 0.08);
            border-bottom: 1px solid rgba(144, 12, 0, 0.08);
          }
          .about-highlight-item {
            display: flex;
            align-items: center;
            gap: 8px;
            background: white;
            padding: 10px 18px;
            border-radius: 100px;
            border: 1px solid rgba(144, 12, 0, 0.1);
            box-shadow: 0 2px 8px rgba(107, 31, 31, 0.05);
          }
          .about-highlight-icon {
            font-size: 1.2rem;
          }
          .about-highlight-label {
            font-size: 0.85rem;
            font-weight: 600;
            color: #3d1a10;
            letter-spacing: 0.01em;
          }

          .about-cta {
            text-align: center;
            margin-top: 20px;
          }
          .about-cta-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 16px 36px;
            border-radius: 8px;
            background: #900c00;
            color: white;
            font-size: 0.95rem;
            font-weight: 600;
            text-decoration: none;
            transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
            box-shadow: 0 4px 18px rgba(144, 12, 0, 0.28);
          }
          .about-cta-btn:hover {
            background: #6d0900;
            box-shadow: 0 8px 28px rgba(144, 12, 0, 0.38);
            transform: translateY(-2px);
          }
        `}</style>
      </main>
      <CartDrawer />
    </>
  )
}
