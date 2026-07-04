'use client'

export default function Hero() {
  return (
    <div className="hero-wrapper pt-[60px] bg-[#EDE3D5]">
      <section
        className="hero-banner relative w-full overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="hero-spacer w-full"
          style={{
            aspectRatio: '1920 / 1280',
            maxHeight: '80vh',
          }}
        />
      </section>
    </div>
  )
}
