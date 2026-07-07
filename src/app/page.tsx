'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import CategorySection from '@/components/CategorySection'
import IngredientsSection from '@/components/IngredientsSection'
import BestsellersSection from '@/components/BestsellersSection'
import GiftsSection from '@/components/GiftsSection'
import Footer from '@/components/Footer'
import MarqueeStrip from '@/components/MarqueeStrip'
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
      <MarqueeStrip />
      <CategorySection />
      <IngredientsSection />
      <BestsellersSection />
      <GiftsSection />
      <Footer />
      <CartDrawer />
    </main>
  )
}
