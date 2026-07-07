'use client'

export default function GiftsSection() {
  return (
    <section id="gifts" className="sec bg-white">
      <div className="container">
        {/* Banner */}
        <div className="banner">
          <div className="banner-inner">
            <h2 className="banner-title">
              Thoughtful <em>Gifting</em>
            </h2>
            <p className="banner-subtitle">
              Customise chocolate gifts from us to your loved ones.
            </p>
          </div>
        </div>
      </div>

        <style jsx>{`
          .banner {
            background: linear-gradient(135deg, #900c00 0%, #b01600 50%, #900c00 100%);
            padding: 48px 32px;
            text-align: center;
            position: relative;
            overflow: hidden;
            border-radius: 24px;
            margin-bottom: 0;
          }
          .banner::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image: radial-gradient(circle, rgba(255, 165, 32, 0.13) 1px, transparent 1px);
            background-size: 24px 24px;
            pointer-events: none;
          }
          .banner-inner {
            position: relative;
            z-index: 1;
          }
          .banner-title {
            font-family: 'Tan Pearl', serif;
            font-size: clamp(24px, 5vw, 38px);
            color: white;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 12px;
          }
          .banner-title em {
            font-style: italic;
            color: #ffa520;
          }
          .banner-subtitle {
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
            line-height: 1.65;
            max-width: 460px;
            margin: 0 auto;
          }
        `}</style>
    </section>
  )
}
