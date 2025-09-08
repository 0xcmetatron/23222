import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Buyback & Burn Terminal',
  description: 'Automated buyback and burn system powered by live Creator Rewards.',
  generator: 'v0.app',
  icons: {
    icon: '/buybackburn.png', // Favicon in /public/buybackburn.png
  },
  openGraph: {
    title: 'Buyback & Burn Terminal',
    description: 'Automated buyback and burn system powered by live Creator Rewards.',
    url: 'https://buybackburn.fun',
    siteName: 'Buyback & Burn Terminal',
    images: [
      {
        url: '/buybackburn.png', // Image in /public/buybackburn.png
        width: 500,
        height: 500,
        alt: 'Buyback & Burn Terminal',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buyback & Burn Terminal',
    description: 'Automated buyback and burn system powered by live Creator Rewards.',
    images: ['/buybackburn.png'],
    creator: '@BuybackBurnSol',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

// Extra tagline for landing page or footer
// Buyback & Burn Terminal
// A token that uses 100% of Creator Rewards to automatically buy back and burn tokens every 10 seconds,
// reducing supply and increasing value for holders.
