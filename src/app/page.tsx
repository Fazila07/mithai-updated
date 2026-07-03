'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import CategorySection from '@/components/CategorySection'
import IngredientsSection from '@/components/IngredientsSection'
import DifferentOnPurposeSection from '@/components/DifferentOnPurposeSection'
import BestsellersSection from '@/components/BestsellersSection'
import GiftsSection from '@/components/GiftsSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  if (isLoading) return null

  return (
    <main className="overflow-x-hidden bg-mithai-off">
      <Navbar />
      <Hero />
      <section className="marquee-strip">
        <div className="marquee-track">
          <div className="marquee-item"><span>✨ No Refined Sugar</span><span className="marquee-diamond"></span></div>
          <div className="marquee-item"><span>🌾 No Maida</span><span className="marquee-diamond"></span></div>
          <div className="marquee-item"><span>💪 PCOS Friendly</span><span className="marquee-diamond"></span></div>
          <div className="marquee-item"><span>🌱 Clean Ingredients</span><span className="marquee-diamond"></span></div>
          <div className="marquee-item"><span>✨ No Refined Sugar</span><span className="marquee-diamond"></span></div>
          <div className="marquee-item"><span>🌾 No Maida</span><span className="marquee-diamond"></span></div>
          <div className="marquee-item"><span>💪 PCOS Friendly</span><span className="marquee-diamond"></span></div>
          <div className="marquee-item"><span>🌱 Clean Ingredients</span><span className="marquee-diamond"></span></div>
        </div>
      </section>
      <CategorySection />
      <IngredientsSection />
      <DifferentOnPurposeSection />
      <BestsellersSection />
      <GiftsSection />
      <TestimonialsSection />
      <Footer />
      <CartDrawer />
    </main>
  )
}
