'use client'

export default function FounderNote() {
  return (
    <section className="founder-section">
      <div className="founder-container">
        <div className="founder-label">From the Heart</div>
        <h2 className="founder-title">A Note From the Founder</h2>

        <div className="founder-divider" />

        <div className="founder-body">
          <p>
            I've always believed that the things we consume should be made with honesty.
          </p>
          <p>
            Whether it's the food we eat, the crafts we cherish, or the traditions we carry forward, I'm drawn to things that are authentic and made with intention. I've always had a deep love for India's rich food culture and the incredible ingredients our land has given us. Somewhere along the way, many of these treasures were replaced by convenience. Mithai 2.0 is my small effort to bring them back in a way that feels familiar, joyful, and relevant today.
          </p>
          <p>
            My own hormonal health journey changed the way I looked at food. It taught me that what we eat every day matters, but it also taught me that living consciously doesn't mean giving up the simple joy of desserts.
          </p>
          <p className="founder-highlight">
            That is why Mithai 2.0 exists.
          </p>
          <p>
            Every recipe is made with wholesome Indian millet flours, naturally gluten-free ingredients, and without refined sugar, maida, or compound chocolate. But beyond what we leave out, what matters most is what we choose to put in—ingredients that are real, thoughtfully sourced, and worthy of your trust.
          </p>
          <p className="founder-promise-label">
            There is one promise I will never compromise on:
          </p>
          <blockquote className="founder-promise">
            I will never serve you something that I wouldn't proudly eat myself or share with the people I love.
          </blockquote>
          <p>
            I'm a perfectionist by nature. Every recipe goes through countless trials until it feels just right—not because perfection is easy, but because I believe trust is earned, one bite at a time.
          </p>
          <p>
            Mithai 2.0 is more than a dessert brand. It is a celebration of conscious indulgence, Indian heritage, honest ingredients, and craftsmanship. My hope is that every bite reminds you that the best things are often the ones that bring us back to our roots.
          </p>
          <p className="founder-closing">
            Welcome to Mithai 2.0—where tradition meets mindful indulgence.
          </p>
        </div>
      </div>

      <style jsx>{`
        .founder-section {
          background: #F5E8D0;
          padding: 64px 20px 72px;
        }

        .founder-container {
          max-width: 720px;
          margin: 0 auto;
          text-align: center;
        }

        .founder-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #ffa520;
          margin-bottom: 12px;
        }

        .founder-title {
          font-family: 'Tan Pearl', serif;
          font-size: clamp(24px, 5vw, 38px);
          font-weight: 700;
          color: #900c00;
          line-height: 1.2;
          margin-bottom: 20px;
        }

        .founder-divider {
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #ffa520, #900c00);
          border-radius: 2px;
          margin: 0 auto 32px;
        }

        .founder-body {
          text-align: left;
        }

        .founder-body p {
          font-size: 15px;
          line-height: 1.8;
          color: #5a3a2a;
          margin-bottom: 18px;
        }

        .founder-highlight {
          font-family: 'Tan Pearl', serif;
          font-size: 20px !important;
          font-weight: 700;
          color: #900c00 !important;
          text-align: center;
          margin: 28px 0 !important;
        }

        .founder-promise-label {
          font-weight: 600;
          color: #900c00 !important;
          margin-bottom: 8px !important;
        }

        .founder-promise {
          border-left: 3px solid #ffa520;
          padding: 16px 20px;
          margin: 0 0 24px;
          background: rgba(255, 165, 32, 0.08);
          border-radius: 0 12px 12px 0;
          font-style: italic;
          font-size: 15px;
          line-height: 1.75;
          color: #900c00;
          font-weight: 600;
        }

        .founder-closing {
          font-family: 'Tan Pearl', serif;
          font-size: 17px !important;
          font-weight: 700;
          color: #900c00 !important;
          text-align: center;
          margin-top: 28px !important;
          margin-bottom: 0 !important;
        }

        @media (max-width: 640px) {
          .founder-section {
            padding: 48px 16px 56px;
          }
          .founder-body p {
            font-size: 14px;
          }
          .founder-promise {
            padding: 12px 16px;
            font-size: 14px;
          }
        }
      `}</style>
    </section>
  )
}
