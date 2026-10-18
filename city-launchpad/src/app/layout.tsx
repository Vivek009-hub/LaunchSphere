import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <Script
          id="suppress-extension-noise"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function isExt(s) {
                  return s && (
                    s.indexOf('chrome-extension://') !== -1 ||
                    s.indexOf('moz-extension://') !== -1 ||
                    s.indexOf('safari-web-extension://') !== -1 ||
                    s.indexOf('MetaMask') !== -1 ||
                    s.indexOf('inpage.js') !== -1
                  );
                }
                window.addEventListener('unhandledrejection', function(e) {
                  var r = e.reason;
                  var str = typeof r === 'string' ? r : (r && (r.stack || r.message)) || '';
                  if (isExt(str)) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                  }
                }, true);
                window.addEventListener('error', function(e) {
                  var str = (e.filename || '') + ' ' + (e.message || '') + ' ' + (e.error && e.error.stack || '');
                  if (isExt(str)) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                  }
                }, true);
              })();
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} font-sans antialiased bg-slate-950 text-slate-200`}
      >
        {children}
      </body>
    </html>
  )
}

