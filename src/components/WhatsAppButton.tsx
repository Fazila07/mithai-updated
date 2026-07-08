'use client'

export default function WhatsAppButton() {
  return (
    <>
      <a
        href="https://wa.me/9032538773"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-btn"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 32 32" width="28" height="28" fill="white">
          <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.9 15.9 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.31 22.596c-.388 1.094-2.274 2.094-3.13 2.168-.856.076-1.65.386-5.564-1.158-4.726-1.862-7.694-6.71-7.928-7.02-.232-.312-1.9-2.528-1.9-4.822s1.2-3.42 1.628-3.89c.428-.468.934-.586 1.246-.586.312 0 .622.002.896.016.288.014.674-.11 1.054.804.388.934 1.322 3.226 1.438 3.46.116.232.194.506.038.818-.154.312-.232.506-.464.778-.232.274-.488.61-.698.818-.232.232-.474.484-.204.95.272.466 1.208 1.994 2.594 3.23 1.78 1.586 3.28 2.078 3.746 2.31.466.232.738.194 1.01-.116.272-.312 1.166-1.36 1.476-1.828.312-.468.622-.388 1.05-.232.428.154 2.716 1.282 3.182 1.514.466.232.778.35.894.544.116.194.116 1.128-.272 2.222z"/>
        </svg>
      </a>

      <style jsx>{`
        .whatsapp-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 90;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #25D366;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .whatsapp-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 28px rgba(37, 211, 102, 0.55);
        }

        .whatsapp-btn:active {
          transform: scale(0.95);
        }

        @media (max-width: 640px) {
          .whatsapp-btn {
            bottom: 80px;
            right: 16px;
            width: 50px;
            height: 50px;
          }
        }
      `}</style>
    </>
  )
}
