import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import './globals.css'

const heading = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
})

const body = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: {
    default: 'Face and Glow | Ladies Beauty Parlour - Online Appointment Booking',
    template: '%s | Face and Glow',
  },
  description:
    'Face and Glow - Premium ladies beauty parlour. Book appointments online for facials, bridal makeup, hair spa, mehndi, nails, waxing and more at affordable prices.',
  keywords: [
    'beauty parlour',
    'ladies salon',
    'bridal makeup',
    'facial',
    'hair spa',
    'mehndi',
    'online appointment booking',
    'Face and Glow',
  ],
  generator: 'v0.app',
  icons: {
    icon: [{ url: '/images/logo.png', type: 'image/png' }],
    apple: '/images/logo.png',
  },
  openGraph: {
    title: 'Face and Glow | Ladies Beauty Parlour',
    description:
      'Book your beauty appointment online. Facials, bridal makeup, hair spa, mehndi, nails and more.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#faf6f2',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`bg-background ${heading.variable} ${body.variable}`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
