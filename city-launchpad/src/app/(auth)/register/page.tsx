'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Rocket, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      setLoading(false)
      return
    }

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    })

    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    // Some Supabase projects auto-confirm; others send email.
    // If auto-confirm is on, redirect to onboarding.
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      router.push('/onboarding')
      router.refresh()
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md">
        <div className="gradient-border rounded-2xl bg-slate-900/90 p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="mb-4 text-4xl">📬</div>
          <h2 className="mb-2 text-xl font-bold text-white">Check your email</h2>
          <p className="text-sm text-slate-400">
            We sent a confirmation link to <strong className="text-slate-200">{email}</strong>.
            Click it to activate your account and set up your startup profile.
          </p>
          <Button
            id="btn-back-to-login"
            variant="outline"
            className="mt-6 w-full"
            onClick={() => router.push('/login')}
          >
            Back to Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="gradient-border rounded-2xl bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/30">
            <Rocket className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="mt-1 text-sm text-slate-400">Start your market-entry journey</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4" id="form-register">
          <div className="space-y-1.5">
            <Label htmlFor="register-name">Your name</Label>
            <Input
              id="register-name"
              type="text"
              placeholder="Arjun Sharma"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="register-email">Email address</Label>
            <Input
              id="register-email"
              type="email"
              placeholder="you@startup.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="register-password">Password</Label>
            <div className="relative">
              <Input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                id="btn-toggle-reg-password"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-slate-600">Minimum 8 characters</p>
          </div>

          {error && (
            <div role="alert" className="rounded-lg border border-rose-800/50 bg-rose-900/20 px-4 py-3 text-sm text-rose-400">
              {error}
            </div>
          )}

          <Button id="btn-register" type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account…
              </>
            ) : (
              'Create account'
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/login" id="link-login" className="font-medium text-indigo-400 hover:text-indigo-300">
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  )
}
