'use client'

import Image from 'next/image'

export default function Hero() {
  return (
    <div className="hero-wrapper pt-[60px] bg-[#EDE3D5]">
      <section className="hero-banner relative w-full overflow-hidden">
        <div className="relative w-full">
          <Image
            src="/images/banner.jpg"
            alt="Mithai 2.0 - Guiltfree Goodies"
            width={1920}
            height={1280}
            priority
            unoptimized
            quality={100}
            className="w-full h-auto object-cover block"
            style={{ maxHeight: '80vh' }}
          />
        </div>
      </section>
    </div>
  )
}
