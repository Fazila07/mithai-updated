'use client'

export default function OurStory() {
  return (
    <section className="story-section">
      <div className="story-container">
        <div className="story-label">Who We Are</div>
        <h2 className="story-title">Our Story</h2>

        <div className="story-divider" />

        <div className="story-body">
          <p>
            Mithai 2.0 is a reflection of everything I believe in—real food, honest ingredients, and the richness of Indian traditions.
          </p>
          <p>
            My love for India's food heritage, combined with my own hormonal health journey, inspired me to create desserts that are both nourishing and joyful. I wanted to prove that indulgence doesn't have to come at the cost of your well-being.
          </p>
          <p>
            Every brownie, cookie, laddoo, cracker, and chocolate is handcrafted using wholesome millet flours, naturally gluten-free ingredients, and made without refined sugar, maida, or compound chocolate. We carefully source every ingredient because quality begins with what goes into every bite.
          </p>
          <p>
            Every recipe is developed, tested, and refined until it meets one simple standard: <em>if I wouldn't proudly serve it to my own family, it will never become a part of Mithai 2.0.</em>
          </p>
          <p>
            Mithai 2.0 is our way of bringing India's timeless ingredients into modern desserts—clean, conscious, and crafted with care.
          </p>
          <p className="story-closing">
            <em>Welcome to a sweeter way of celebrating our roots.</em>
          </p>
        </div>
      </div>

      <style jsx>{`
        .story-section {
          background: #fff;
          padding: 64px 20px 72px;
        }

        .story-container {
          max-width: 720px;
          margin: 0 auto;
          text-align: center;
        }

        .story-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #ffa520;
          margin-bottom: 12px;
        }

        .story-title {
          font-family: 'Tan Pearl', serif;
          font-size: clamp(24px, 5vw, 38px);
          font-weight: 700;
          color: #900c00;
          line-height: 1.2;
          margin-bottom: 20px;
        }

        .story-divider {
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #900c00, #ffa520);
          border-radius: 2px;
          margin: 0 auto 32px;
        }

        .story-body {
          text-align: left;
        }

        .story-body p {
          font-size: 15px;
          line-height: 1.8;
          color: #5a3a2a;
          margin-bottom: 18px;
        }

        .story-body em {
          color: #900c00;
          font-style: italic;
        }

        .story-closing {
          font-family: 'Tan Pearl', serif;
          font-size: 17px !important;
          font-weight: 700;
          color: #900c00 !important;
          text-align: center;
          margin-top: 28px !important;
          margin-bottom: 0 !important;
        }

        @media (max-width: 640px) {
          .story-section {
            padding: 48px 16px 56px;
          }
          .story-body p {
            font-size: 14px;
          }
        }
      `}</style>
    </section>
  )
}
