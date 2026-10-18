import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In — City Launchpad',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      suppressHydrationWarning
      className="relative flex min-h-screen items-center justify-center p-4 bg-[#080A0B] overflow-hidden"
    >
      {/* Ambient background golden glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(245,185,76,0.08),rgba(0,0,0,0))]" />
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
