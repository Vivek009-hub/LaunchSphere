'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Rocket, Eye, EyeOff, Loader2, MailCheck } from 'lucide-react'
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
        emailRedirectTo: `${window.location.origin}/auth/callback`,
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
        <div className="rounded-2xl border border-[#252729] bg-[#101314]/95 p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#252729] bg-[#151719] text-[#F5B94C] shadow-lg shadow-[#F5B94C]/20">
            <MailCheck className="h-7 w-7" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-[#F5F5F2]">Check your email</h2>
          <p className="text-sm text-[#858783] leading-relaxed">
            We sent a confirmation link to <strong className="text-[#F5F5F2]">{email}</strong>.
            Click it to activate your account and set up your startup profile.
          </p>
          <Button
            id="btn-back-to-login"
            variant="outline"
            className="mt-6 w-full border-[#252729] text-[#F5F5F2] hover:border-[#F5B94C] hover:text-[#F5B94C]"
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
      <div className="rounded-2xl border border-[#252729] bg-[#101314]/95 p-8 shadow-2xl backdrop-blur-xl">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#252729] bg-[#151719] text-[#F5B94C] shadow-lg shadow-[#F5B94C]/20">
            <Rocket className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F5F5F2]">Create your account</h1>
          <p className="mt-1 text-sm text-[#858783]">Start your market-entry journey</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4" id="form-register">
          <div className="space-y-1.5">
            <Label htmlFor="register-name" className="text-xs text-[#B4B5B2]">Your name</Label>
            <Input
              id="register-name"
              type="text"
              placeholder="Arjun Sharma"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-[#151719] border-[#252729] text-sm text-[#F5F5F2] placeholder-[#858783] focus:border-[#F5B94C]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="register-email" className="text-xs text-[#B4B5B2]">Email address</Label>
            <Input
              id="register-email"
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
            <Label htmlFor="register-password" className="text-xs text-[#B4B5B2]">Password</Label>
            <div className="relative">
              <Input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10 bg-[#151719] border-[#252729] text-sm text-[#F5F5F2] placeholder-[#858783] focus:border-[#F5B94C]"
              />
              <button
                type="button"
                id="btn-toggle-reg-password"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#858783] hover:text-[#F5F5F2] transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4 text-[#858783]" />}
              </button>
            </div>
            <p className="text-[11px] text-[#858783]">Minimum 8 characters</p>
          </div>

          {error && (
            <div role="alert" className="rounded-lg border border-[#4E1821] bg-[#280D11]/40 px-4 py-3 text-sm text-[#FB7185]">
              {error}
            </div>
          )}

          <Button
            id="btn-register"
            type="submit"
            className="w-full bg-gradient-to-r from-[#FFD27A] via-[#F5B94C] to-[#E5A83B] text-[#080A0B] font-bold shadow-lg shadow-[#F5B94C]/25 text-sm hover:brightness-105"
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-[#080A0B]" />
                Creating account…
              </>
            ) : (
              'Create account'
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[#858783]">
          Already have an account?{' '}
          <Link href="/login" id="link-login" className="font-medium text-[#F5B94C] hover:text-[#FFD27A] transition-colors">
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  )
}
