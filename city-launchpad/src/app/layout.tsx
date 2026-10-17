import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'City Launchpad — AI-Assisted Market Entry for Indian Startups',
    template: '%s | City Launchpad',
  },
  description:
    'Evaluate cities, discover local contacts, and validate real customer demand before launching your startup in a new Indian market.',
  keywords: ['startup', 'market entry', 'India', 'city comparison', 'market validation'],
  authors: [{ name: 'City Launchpad' }],
  robots: { index: false, follow: false }, // keep private during hackathon dev
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-slate-950 text-slate-200`}>
        {children}
      </body>
    </html>
  )
}
