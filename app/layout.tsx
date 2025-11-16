import type { Metadata } from 'next'
import { Rajdhani, Work_Sans } from 'next/font/google'
import './globals.css'

const rajdhani = Rajdhani({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-rajdhani',
  display: 'swap',
})

const workSans = Work_Sans({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-work-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Pull UP -N- Pump - On-Demand Fuel Delivery',
  description: 'Get fuel delivered to your location on-demand',
  manifest: '/manifest.json',
  themeColor: '#1a1b1e',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Pull UP -N- Pump',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${rajdhani.variable} ${workSans.variable}`}>
      <body className={workSans.className}>{children}</body>
    </html>
  )
}
