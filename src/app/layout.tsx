import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import ConditionalBottomNav from '@/components/ConditionalBottomNav'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Mithai 2.0 — Modern Mithai. Honest Ingredients.',
  description: 'Healthy desserts & snacks made without refined sugar, maida, or preservatives. PCOS friendly, gut friendly, clean ingredients.',
  keywords:
    'healthy desserts, sugar-free sweets, PCOS friendly desserts, clean ingredients, mithai, cookies, brownies',
  authors: [{ name: 'Mithai 2.0' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://mithai2.0',
    siteName: 'Mithai 2.0',
    title: 'Mithai 2.0 — Modern Mithai. Honest Ingredients.',
    description: 'Healthy desserts & snacks made without refined sugar, maida, or preservatives.',
    images: [
      {
        url: 'https://mithai2.0/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mithai 2.0',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mithai 2.0',
    description: 'Healthy desserts & snacks made without refined sugar, maida, or preservatives.',
    images: ['https://mithai2.0/og-image.jpg'],
    creator: '@mithai2.0',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <link rel="icon" href="/logo/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-mithai-off text-mithai-charcoal">
        <AuthProvider>
          {children}
          <ConditionalBottomNav />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3500,
              style: { borderRadius: '16px', fontSize: '14px', fontWeight: 500 },
              success: { iconTheme: { primary: '#900c00', secondary: '#fff' } },
              error: { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
