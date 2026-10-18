'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Rocket, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { PageLoader } from '@/components/shared/LoadingSpinner'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const errorParam = searchParams.get('error')
  const redirectedFrom = searchParams.get('redirectedFrom')
  const initialError =
    errorParam === 'auth-callback-failed'
      ? 'Email verification or authentication callback failed. The link may have expired.'
      : redirectedFrom
      ? 'Please sign in to access your protected dashboard.'
      : null

  const [error, setError] = useState<string | null>(initialError)
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Clear demo mode cookie on real sign in attempt
    document.cookie = 'demo_mode=; path=/; max-age=0'

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  const handleEnterDemo = () => {
    document.cookie = 'demo_mode=true; path=/; max-age=86400; SameSite=Lax'
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-[#252729] bg-[#101314]/95 p-8 shadow-2xl backdrop-blur-xl">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#252729] bg-[#151719] text-[#F5B94C] shadow-lg shadow-[#F5B94C]/20">
            <Rocket className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F5F5F2]">Welcome back</h1>
          <p className="mt-1 text-sm text-[#858783]">Sign in to City Launchpad</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4" id="form-login">
          <div className="space-y-1.5">
            <Label htmlFor="login-email" className="text-xs text-[#B4B5B2]">Email address</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="you@startup.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-[#151719] border-[#252729] text-sm text-[#F5F5F2] placeholder-[#858783] focus:border-[#F5B94C]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="login-password" className="text-xs text-[#B4B5B2]">Password</Label>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10 bg-[#151719] border-[#252729] text-sm text-[#F5F5F2] placeholder-[#858783] focus:border-[#F5B94C]"
              />
              <button
                type="button"
                id="btn-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#858783] hover:text-[#F5F5F2] transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4 text-[#858783]" />}
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-[#4E1821] bg-[#280D11]/40 px-4 py-3 text-sm text-[#FB7185]"
            >
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#FB7185]" />
              <span>{error}</span>
            </div>
          )}

          <Button
            id="btn-login"
            type="submit"
            className="w-full bg-gradient-to-r from-[#FFD27A] via-[#F5B94C] to-[#E5A83B] text-[#080A0B] font-bold shadow-lg shadow-[#F5B94C]/25 text-sm hover:brightness-105"
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-[#080A0B]" />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[#858783]">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            id="link-register"
            className="font-medium text-[#F5B94C] hover:text-[#FFD27A] transition-colors"
          >
            Create one →
          </Link>
        </p>

        <div className="mt-6 border-t border-[#252729] pt-5 text-center">
          <button
            type="button"
            onClick={handleEnterDemo}
            id="link-explore-demo"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#252729] bg-[#151719] px-4 py-2 text-xs font-semibold text-[#F5B94C] hover:bg-[#1A1D20] transition-colors"
          >
            <span>Explore Demo Prototype</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<PageLoader label="Loading sign in..." />}>
      <LoginForm />
    </Suspense>
  )
}
