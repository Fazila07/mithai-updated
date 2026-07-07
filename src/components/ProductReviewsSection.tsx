'use client'

import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'

interface Review {
  _id: string
  userName: string
  userImage?: string
  rating: number
  title?: string
  text: string
  createdAt: string
}

const FALLBACK_REVIEWS: Review[] = [
  {
    _id: 'f1',
    userName: 'Priya M.',
    rating: 5,
    text: "Finally a dessert that doesn't make me feel guilty! The brownies are amazing and my blood sugar is stable.",
    createdAt: '',
    title: 'PCOS Warrior',
  },
  {
    _id: 'f2',
    userName: 'Rahul K.',
    rating: 5,
    text: 'No refined sugar but tastes so good. Been buying for 6 months now. Great quality!',
    createdAt: '',
    title: 'Fitness Enthusiast',
  },
  {
    _id: 'f3',
    userName: 'Anjali S.',
    rating: 5,
    text: 'My kids love these snacks and I love knowing exactly what goes into them. Best purchase ever!',
    createdAt: '',
    title: 'Mother of Two',
  },
]

interface ProductReviewsSectionProps {
  productId?: string
}

export default function ProductReviewsSection({ productId }: ProductReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(FALLBACK_REVIEWS)

  useEffect(() => {
    const url = productId
      ? `/api/reviews?productId=${productId}&limit=20`
      : '/api/reviews?limit=20'

    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        if (d.reviews && d.reviews.length > 0) {
          setReviews(d.reviews)
        }
      })
      .catch(() => {})
  }, [productId])

  return (
    <section className="product-reviews">
      <h2 className="product-reviews-title">Customer Reviews</h2>
      <div className="product-reviews-grid">
        {reviews.map((review) => (
          <article key={review._id} className="review-card">
            <div className="review-stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < review.rating ? '#ffa520' : 'none'}
                  className={i < review.rating ? 'text-mithai-gold' : 'text-mithai-taupe/30'}
                />
              ))}
            </div>
            <p className="review-text">&ldquo;{review.text}&rdquo;</p>
            <div className="review-author">{review.userName}</div>
            {review.title && <div className="review-role">{review.title}</div>}
          </article>
        ))}
      </div>

      <style jsx>{`
        .product-reviews {
          margin-top: 48px;
          padding-top: 40px;
          border-top: 1px solid rgba(107, 31, 31, 0.1);
        }
        .product-reviews-title {
          font-family: 'Tan Pearl', serif;
          font-size: clamp(22px, 4vw, 28px);
          font-weight: 700;
          color: #900c00;
          margin-bottom: 24px;
        }
        .product-reviews-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        .review-card {
          background: #faf6f0;
          border-radius: 16px;
          padding: 20px;
          border: 1px solid rgba(144, 12, 0, 0.08);
        }
        .review-stars {
          display: flex;
          gap: 2px;
          margin-bottom: 10px;
        }
        .review-text {
          font-size: 14px;
          color: #3d1a10;
          line-height: 1.65;
          font-style: italic;
          margin-bottom: 12px;
        }
        .review-author {
          font-size: 12px;
          font-weight: 700;
          color: #900c00;
        }
        .review-role {
          font-size: 11px;
          color: #9b7b6a;
          margin-top: 2px;
        }
        @media (min-width: 640px) {
          .product-reviews-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .product-reviews-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </section>
  )
}
