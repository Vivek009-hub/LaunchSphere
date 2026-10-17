'use client'

import React, { useState, useEffect, Suspense } from 'react'
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
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const errorParam = searchParams.get('error')
    const redirectedFrom = searchParams.get('redirectedFrom')

    if (errorParam === 'auth-callback-failed') {
      setError('Email verification or authentication callback failed. The link may have expired.')
    } else if (redirectedFrom) {
      setError('Please sign in to access your protected dashboard.')
    }
  }, [searchParams])

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
      <div className="gradient-border rounded-2xl bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/30">
            <Rocket className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to City Launchpad</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4" id="form-login">
          <div className="space-y-1.5">
            <Label htmlFor="login-email">Email address</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="you@startup.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="login-password">Password</Label>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                id="btn-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-rose-800/50 bg-rose-900/20 px-4 py-3 text-sm text-rose-400"
            >
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            id="btn-login"
            type="submit"
            className="w-full"
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            id="link-register"
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            Create one →
          </Link>
        </p>

        <div className="mt-6 border-t border-slate-800 pt-5 text-center">
          <button
            type="button"
            onClick={handleEnterDemo}
            id="link-explore-demo"
            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 hover:text-amber-200 transition-colors"
          >
            <span>Explore Demo Prototype (Phase 2)</span>
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
