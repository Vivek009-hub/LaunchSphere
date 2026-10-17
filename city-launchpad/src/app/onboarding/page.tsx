'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Rocket, Loader2, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { startupProfileSchema } from '@/lib/validations/schemas'
import { z } from 'zod'

const STAGES = [
  { value: 'idea', label: 'Idea Stage' },
  { value: 'pre-seed', label: 'Pre-Seed' },
  { value: 'seed', label: 'Seed' },
  { value: 'series-a', label: 'Series A' },
]

type FormData = {
  name: string
  industry: string
  stage: string
  target_customer: string
  product_desc: string
}

export default function OnboardingPage() {
  const [form, setForm] = useState<FormData>({
    name: '',
    industry: '',
    stage: 'idea',
    target_customer: '',
    product_desc: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isEdit, setIsEdit] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadExisting() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('startup_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (profile) {
        setIsEdit(true)
        setForm({
          name: profile.name,
          industry: profile.industry,
          stage: profile.stage,
          target_customer: profile.target_customer,
          product_desc: profile.product_desc,
        })
      }
    }
    loadExisting()
  }, [supabase])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError(null)

    // Validate
    const result = startupProfileSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormData, string>> = {}
      result.error.issues.forEach((issue) => {
        const field = String(issue.path[0]) as keyof FormData
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setServerError('Session expired. Please sign in again.')
      setLoading(false)
      return
    }

    const { error } = isEdit
      ? await supabase.from('startup_profiles').update(result.data).eq('user_id', user.id)
      : await supabase.from('startup_profiles').insert({ ...result.data, user_id: user.id })

    setLoading(false)

    if (error) {
      setServerError(error.message)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="mesh-bg flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/30">
            <Rocket className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            {isEdit ? 'Edit your startup profile' : 'Set up your startup profile'}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            This helps City Launchpad tailor city recommendations and contact matches.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Startup details</CardTitle>
            <CardDescription>All fields are required for accurate analysis.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} id="form-onboarding" className="space-y-5">
              {/* Startup Name */}
              <div className="space-y-1.5">
                <Label htmlFor="onboarding-name">Startup name</Label>
                <Input
                  id="onboarding-name"
                  name="name"
                  placeholder="AgroTech Solutions"
                  value={form.name}
                  onChange={handleChange}
                  aria-describedby={errors.name ? 'error-name' : undefined}
                />
                {errors.name && (
                  <p id="error-name" role="alert" className="text-xs text-rose-400">{errors.name}</p>
                )}
              </div>

              {/* Industry */}
              <div className="space-y-1.5">
                <Label htmlFor="onboarding-industry">Industry / sector</Label>
                <Input
                  id="onboarding-industry"
                  name="industry"
                  placeholder="AgriTech, FMCG, HealthTech, EdTech…"
                  value={form.industry}
                  onChange={handleChange}
                  aria-describedby={errors.industry ? 'error-industry' : undefined}
                />
                {errors.industry && (
                  <p id="error-industry" role="alert" className="text-xs text-rose-400">{errors.industry}</p>
                )}
              </div>

              {/* Stage */}
              <div className="space-y-1.5">
                <Label htmlFor="onboarding-stage">Funding stage</Label>
                <Select
                  id="onboarding-stage"
                  name="stage"
                  value={form.stage}
                  onChange={handleChange}
                  aria-describedby={errors.stage ? 'error-stage' : undefined}
                >
                  {STAGES.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Select>
                {errors.stage && (
                  <p id="error-stage" role="alert" className="text-xs text-rose-400">{errors.stage}</p>
                )}
              </div>

              {/* Target Customer */}
              <div className="space-y-1.5">
                <Label htmlFor="onboarding-target">Target customer</Label>
                <Textarea
                  id="onboarding-target"
                  name="target_customer"
                  rows={2}
                  placeholder="Small farmers in Tier-2 cities with smartphone access and land under 5 acres…"
                  value={form.target_customer}
                  onChange={handleChange}
                  aria-describedby={errors.target_customer ? 'error-target' : undefined}
                />
                {errors.target_customer && (
                  <p id="error-target" role="alert" className="text-xs text-rose-400">{errors.target_customer}</p>
                )}
              </div>

              {/* Product description */}
              <div className="space-y-1.5">
                <Label htmlFor="onboarding-product">Product / service description</Label>
                <Textarea
                  id="onboarding-product"
                  name="product_desc"
                  rows={3}
                  placeholder="We help farmers reduce input costs by 30% through AI-driven soil analysis delivered via WhatsApp…"
                  value={form.product_desc}
                  onChange={handleChange}
                  aria-describedby={errors.product_desc ? 'error-product' : undefined}
                />
                {errors.product_desc && (
                  <p id="error-product" role="alert" className="text-xs text-rose-400">{errors.product_desc}</p>
                )}
              </div>

              {serverError && (
                <div role="alert" className="rounded-lg border border-rose-800/50 bg-rose-900/20 px-4 py-3 text-sm text-rose-400">
                  {serverError}
                </div>
              )}

              <Button
                id="btn-save-profile"
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    {isEdit ? 'Save changes' : 'Continue to Dashboard'}
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
