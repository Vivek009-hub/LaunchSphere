import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mesh-bg flex min-h-screen items-center justify-center p-4">
      {children}
    </div>
  )
}
