'use client'

import { useEffect, useState } from 'react'

interface Review {
  _id: string
  userName: string
  userImage?: string
  rating: number
  title?: string
  text: string
  createdAt: string
}

const FALLBACK_TESTIMONIALS = [
  {
    _id: 'f1', userName: 'Priya M.', rating: 5,
    text: 'Finally a dessert that doesn\'t make me feel guilty! The brownies are amazing and my blood sugar is stable.',
    createdAt: '', title: 'PCOS Warrior',
  },
  {
    _id: 'f2', userName: 'Rahul K.', rating: 5,
    text: 'No refined sugar but tastes so good. Been buying for 6 months now. Great quality!',
    createdAt: '', title: 'Fitness Enthusiast',
  },
  {
    _id: 'f3', userName: 'Anjali S.', rating: 5,
    text: 'My kids love these snacks and I love knowing exactly what goes into them. Best purchase ever!',
    createdAt: '', title: 'Mother of Two',
  },
  {
    _id: 'f4', userName: 'Vikram P.', rating: 5,
    text: 'Recommend Mithai 2.0 to all my clients. The cookies are nutritious and delicious!',
    createdAt: '', title: 'Health Coach',
  },
  {
    _id: 'f5', userName: 'Deepa R.', rating: 5,
    text: 'Clean ingredients, no hidden sugars. This is what mindful desserts should look like.',
    createdAt: '', title: 'Dietician',
  },
  {
    _id: 'f6', userName: 'Arjun N.', rating: 5,
    text: 'Didn\'t think healthy desserts could taste this good. Mind blown!',
    createdAt: '', title: 'Sweet Tooth',
  },
]

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState<Review[]>(FALLBACK_TESTIMONIALS)

  useEffect(() => {
    fetch('/api/reviews?limit=20')
      .then((r) => r.json())
      .then((d) => {
        if (d.reviews && d.reviews.length > 0) {
          setReviews(d.reviews)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section id="testimonials" className="testimonials">
      <div className="container">
        <div className="testi-head">
          <span className="sec-label">Community Love</span>
          <h2 className="sec-title">What Our Customers Say</h2>
        </div>

        <div className="testi-scroll">
          <div className="testi-track">
            {[...reviews, ...reviews].map((testi, idx) => (
              <div key={idx} className="testi-card">
                <div className="tstar">{'★'.repeat(testi.rating)}</div>
                <p className="ttext">&quot;{testi.text}&quot;</p>
                <div className="tauth">{testi.userName}</div>
                {testi.title && <div className="trole">{testi.title}</div>}
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          .testimonials {
            background: white;
            padding: 56px 0;
            overflow: hidden;
          }
          .testi-head {
            padding: 0 var(--px);
            margin-bottom: 28px;
          }
          .sec-label {
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            color: #ffa520;
            margin-bottom: 8px;
            display: block;
          }
          .sec-title {
            font-family: 'Tan Pearl', serif;
            font-size: clamp(24px, 6vw, 42px);
            font-weight: 700;
            color: #900c00;
            line-height: 1.18;
            margin-bottom: 10px;
          }
          .testi-scroll {
            overflow: hidden;
          }
          .testi-track {
            display: flex;
            gap: 16px;
            animation: marquee 32s linear infinite;
            width: max-content;
          }
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .testi-card {
            flex: 0 0 270px;
            background: #f7f3ee;
            border-radius: 18px;
            padding: 20px;
            border: 1px solid rgba(144, 12, 0, 0.1);
          }
          .tstar {
            color: #ffa520;
            font-size: 13px;
            margin-bottom: 8px;
            letter-spacing: 2px;
          }
          .ttext {
            font-size: 13px;
            color: #6d0900;
            line-height: 1.6;
            font-style: italic;
            margin-bottom: 12px;
          }
          .tauth {
            font-size: 11px;
            font-weight: 700;
            color: #900c00;
            margin-bottom: 2px;
          }
          .trole {
            font-size: 10px;
            color: #900c00;
          }
          :root {
            --px: 18px;
          }
          @media (min-width: 640px) {
            :root {
              --px: 28px;
            }
          }
          @media (min-width: 960px) {
            :root {
              --px: 40px;
            }
          }
        `}</style>
      </div>
    </section>
  )
}
