'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Rocket,
  Loader2,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Building2,
  Tag,
  MapPin,
  DollarSign,
  Database,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { startupProfileSchema } from '@/lib/validations/schemas'
import { SUPPORTED_CITIES } from '@/lib/data/cityData'

const STAGES = [
  { value: 'idea', label: 'Idea Stage', desc: 'Concept stage, validating initial customer problem' },
  { value: 'pre-seed', label: 'Pre-Seed', desc: 'Building prototype / MVP, initial user discovery' },
  { value: 'seed', label: 'Seed', desc: 'Early product in market, searching for repeatable distribution' },
  { value: 'series-a', label: 'Series A', desc: 'Proven PMF, ready to scale geographically across cities' },
]

const INDUSTRIES = [
  'B2B SaaS',
  'Fintech',
  'FMCG & D2C',
  'E-commerce & Quick Commerce',
  'HealthTech & MedTech',
  'EdTech',
  'Logistics & Supply Chain',
  'DeepTech & AI',
  'Manufacturing Tech & AutoTech',
  'Agritech',
  'Retail Tech',
  'Other',
]

const CHANNELS = [
  'Direct-to-Consumer (Online D2C)',
  'B2B Direct Field Sales',
  'General Trade & Kirana Retail Outlets',
  'Modern Trade & Hypermarkets',
  'Third-Party Distributors & Wholesalers',
  'E-commerce Marketplaces (Amazon, Flipkart, etc.)',
  'Quick-Commerce Platforms (Blinkit, Zepto, Instamart)',
  'Enterprise Channel Partners / Resellers',
]

type OnboardingFormData = {
  name: string
  website_url: string
  stage: 'idea' | 'pre-seed' | 'seed' | 'series-a'
  industry: string
  product_category: string
  business_description: string
  product_desc: string
  target_customer: string
  target_geography: string
  primary_channel: string
  price_min: string
  price_max: string
  current_city: string
  expansion_cities: string[]
  traction_summary: string
  expansion_context: string
}

function OnboardingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/dashboard'
  const supabase = createClient()

  const [currentStep, setCurrentStep] = useState(1)
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [serverError, setServerError] = useState<string | null>(null)
  const [citiesCatalog, setCitiesCatalog] = useState<{ name: string; state: string }[]>([])

  const [form, setForm] = useState<OnboardingFormData>({
    name: '',
    website_url: '',
    stage: 'seed',
    industry: 'B2B SaaS',
    product_category: '',
    business_description: '',
    product_desc: '',
    target_customer: '',
    target_geography: 'Urban India Tier 1 & 2',
    primary_channel: 'B2B Direct Field Sales',
    price_min: '',
    price_max: '',
    current_city: 'Bengaluru',
    expansion_cities: ['Mumbai'],
    traction_summary: '',
    expansion_context: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load cities catalog from DB (with fallback to benchmark cities)
  useEffect(() => {
    async function init() {
      setInitialLoading(true)
      try {
        // Fetch cities catalog from Supabase
        const { data: dbCities } = await supabase
          .from('cities')
          .select('name, state')
          .eq('is_active', true)
          .order('name')

        if (dbCities && dbCities.length > 0) {
          setCitiesCatalog(dbCities)
        } else {
          // Fallback to supported benchmark cities
          setCitiesCatalog(SUPPORTED_CITIES.map((c) => ({ name: c.name, state: c.state })))
        }

        // Check if user already has a profile
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from('startup_profiles')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle()

          if (profile) {
            setIsEdit(true)
            setForm({
              name: profile.name || '',
              website_url: profile.website_url || '',
              stage: (profile.stage as OnboardingFormData['stage']) || 'seed',
              industry: profile.industry || 'B2B SaaS',
              product_category: profile.product_category || '',
              business_description: profile.business_description || '',
              product_desc: profile.product_desc || '',
              target_customer: profile.target_customer || '',
              target_geography: profile.target_geography || 'Urban India Tier 1 & 2',
              primary_channel: profile.primary_channel || 'B2B Direct Field Sales',
              price_min: profile.price_min != null ? String(profile.price_min) : '',
              price_max: profile.price_max != null ? String(profile.price_max) : '',
              current_city: profile.current_city || 'Bengaluru',
              expansion_cities: profile.expansion_cities || ['Mumbai'],
              traction_summary: profile.traction_summary || '',
              expansion_context: profile.expansion_context || '',
            })
          }
        }
      } catch (err) {
        console.warn('Could not prefill profile, starting fresh:', err)
      } finally {
        setInitialLoading(false)
      }
    }

    init()
  }, [supabase])

  const handleFieldChange = (field: keyof OnboardingFormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const toggleExpansionCity = (city: string) => {
    setForm((prev) => {
      const exists = prev.expansion_cities.includes(city)
      if (exists) {
        return { ...prev, expansion_cities: prev.expansion_cities.filter((c) => c !== city) }
      } else {
        return { ...prev, expansion_cities: [...prev.expansion_cities, city] }
      }
    })
  }

  const validateStep1 = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Startup name is required.'
    if (!form.industry) errs.industry = 'Please select an industry.'
    if (!form.business_description.trim() || form.business_description.length < 10) {
      errs.business_description = 'Brief elevator pitch must be at least 10 characters.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validateStep2 = () => {
    const errs: Record<string, string> = {}
    if (!form.product_desc.trim() || form.product_desc.length < 10) {
      errs.product_desc = 'Product/service description must be at least 10 characters.'
    }
    if (!form.target_customer.trim()) {
      errs.target_customer = 'Target customer segment is required.'
    }
    if (!form.primary_channel) {
      errs.primary_channel = 'Please select a primary sales channel.'
    }

    if (form.price_min && isNaN(Number(form.price_min))) {
      errs.price_min = 'Min price must be a valid number.'
    }
    if (form.price_max && isNaN(Number(form.price_max))) {
      errs.price_max = 'Max price must be a valid number.'
    }
    if (form.price_min && form.price_max && Number(form.price_min) > Number(form.price_max)) {
      errs.price_max = 'Max price cannot be less than Min price.'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validateStep3 = () => {
    const errs: Record<string, string> = {}
    if (!form.current_city) {
      errs.current_city = 'Current city is required.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError(null)

    if (!validateStep3()) return

    const payload = {
      name: form.name.trim(),
      website_url: form.website_url.trim() || null,
      stage: form.stage,
      industry: form.industry,
      product_category: form.product_category.trim() || null,
      business_description: form.business_description.trim(),
      product_desc: form.product_desc.trim(),
      target_customer: form.target_customer.trim(),
      target_geography: form.target_geography.trim() || null,
      primary_channel: form.primary_channel,
      price_min: form.price_min ? Number(form.price_min) : null,
      price_max: form.price_max ? Number(form.price_max) : null,
      current_city: form.current_city,
      expansion_cities: form.expansion_cities,
      traction_summary: form.traction_summary.trim() || null,
      expansion_context: form.expansion_context.trim() || null,
    }

    // Validate with Zod schema
    const parseRes = startupProfileSchema.safeParse(payload)
    if (!parseRes.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of parseRes.error.issues) {
        const path = issue.path[0] as string
        fieldErrors[path] = issue.message
      }
      setErrors(fieldErrors)
      setServerError('Please review highlighted fields before submitting.')
      return
    }

    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        document.cookie = 'demo_mode=true; path=/; max-age=86400; SameSite=Lax'
        router.push(returnTo)
        return
      }

      const { error: upsertError } = await supabase.from('startup_profiles').upsert(
        {
          user_id: user.id,
          ...payload,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )

      if (upsertError) {
        throw upsertError
      }

      router.push(returnTo)
      router.refresh()
    } catch (err: unknown) {
      console.error('Error saving profile:', err)
      setServerError(err instanceof Error ? err.message : 'Failed to save startup profile.')
      setLoading(false)
    }
  }

  const handleSkip = () => {
    document.cookie = 'demo_mode=true; path=/; max-age=86400; SameSite=Lax'
    router.push(returnTo)
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#080A0B] flex items-center justify-center text-[#858783]">
        <Loader2 className="h-6 w-6 animate-spin mr-2 text-[#F5B94C]" />
        Loading startup profile...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080A0B] text-[#F5F5F2] flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-[#252729] bg-[#090B0C]/80 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFD27A] to-[#F5B94C] text-[#080A0B] shadow-md shadow-[#F5B94C]/20">
              <Rocket className="h-5 w-5 fill-current" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-[#F5F5F2]">City Launchpad</span>
              <p className="text-[11px] text-[#858783]">
                {isEdit ? 'Profile Settings' : 'Founder Onboarding'}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-xs text-[#858783] hover:text-[#F5F5F2] hover:bg-[#151719]"
          >
            {isEdit ? 'Back to Dashboard' : 'Skip for now'}
          </Button>
        </div>
      </header>

      {/* Main Content Form */}
      <main className="flex-1 py-10 px-4">
        <div className="mx-auto max-w-2xl">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-medium text-[#858783] mb-2.5">
              <span className={currentStep === 1 ? 'text-[#F5B94C] font-semibold' : ''}>
                1. Identity & Stage
              </span>
              <span className={currentStep === 2 ? 'text-[#F5B94C] font-semibold' : ''}>
                2. Product & Market
              </span>
              <span className={currentStep === 3 ? 'text-[#F5B94C] font-semibold' : ''}>
                3. City & Expansion
              </span>
            </div>
            <div className="h-1.5 w-full bg-[#151719] rounded-full overflow-hidden border border-[#252729]">
              <div
                className="h-full bg-[#F5B94C] transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>

          {serverError && (
            serverError.toLowerCase().includes('startup_profiles') ||
            serverError.toLowerCase().includes('schema cache') ? (
              <div className="mb-6 rounded-xl border border-[#4E3516] bg-[#2A1D0B]/40 p-4 text-xs text-[#F5B94C] shadow-lg">
                <div className="flex items-start gap-3">
                  <Database className="h-5 w-5 shrink-0 text-[#F5B94C] mt-0.5" />
                  <div className="space-y-2 flex-1">
                    <p className="font-semibold text-[#F5B94C] text-sm">
                      Database Schema Setup Required in Supabase
                    </p>
                    <p className="text-[#B4B5B2] leading-relaxed">
                      The table <code className="px-1.5 py-0.5 rounded bg-[#101314] border border-[#252729] font-mono text-[#F5B94C] text-[11px]">public.startup_profiles</code> has not been created in your Supabase project yet.
                    </p>
                    <p className="text-[#858783] leading-relaxed">
                      To create all tables in 30 seconds, copy and execute <code className="px-1.5 py-0.5 rounded bg-[#101314] border border-[#252729] font-mono text-[#F5B94C] text-[11px]">supabase/combined_migrations.sql</code> in your Supabase SQL Editor.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleSkip}
                        className="bg-[#F5B94C] hover:bg-[#FFD27A] text-[#080A0B] font-semibold text-xs"
                      >
                        Explore in Demo Mode Now
                      </Button>
                      <a
                        href="https://supabase.com/dashboard/project/tgnmtohepifungxgenwl/sql/new"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#F5B94C] hover:text-[#FFD27A] underline underline-offset-4"
                      >
                        Open Supabase SQL Editor <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-6 flex items-center gap-2 rounded-lg border border-[#4E1821] bg-[#280D11]/40 p-4 text-xs text-[#FB7185]">
                <AlertCircle className="h-4 w-4 shrink-0 text-[#FB7185]" />
                <span>{serverError}</span>
              </div>
            )
          )}

          <form onSubmit={handleSubmit}>
            {/* STEP 1: Startup Identity & Stage */}
            {currentStep === 1 && (
              <Card className="border-[#252729] bg-[#101314] shadow-2xl">
                <CardHeader>
                  <div className="flex items-center gap-2 text-[#F5B94C] text-xs font-semibold uppercase tracking-wider font-mono">
                    <Building2 className="h-4 w-4" /> Step 1 of 3
                  </div>
                  <CardTitle className="text-xl text-[#F5F5F2]">Startup Identity & Stage</CardTitle>
                  <CardDescription className="text-xs text-[#858783]">
                    Define who you are and what developmental stage your venture is currently in.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Startup Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs text-[#B4B5B2]">
                      Startup Name *
                    </Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      placeholder="e.g. Bharat Logistics, KiranaStack, GreenKart"
                      className="bg-[#151719] border-[#252729] text-sm text-[#F5F5F2] placeholder-[#858783] focus:border-[#F5B94C]"
                      autoFocus
                    />
                    {errors.name && <p className="text-xs text-[#FB7185]">{errors.name}</p>}
                  </div>

                  {/* Website URL (optional) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="website_url" className="text-xs text-[#B4B5B2]">
                        Website or Pitch URL <span className="text-[#858783] font-normal">(optional)</span>
                      </Label>
                      <span className="text-[11px] text-[#858783]">Include https://</span>
                    </div>
                    <Input
                      id="website_url"
                      type="url"
                      value={form.website_url}
                      onChange={(e) => handleFieldChange('website_url', e.target.value)}
                      placeholder="https://example.com"
                      className="bg-[#151719] border-[#252729] text-sm text-[#F5F5F2] placeholder-[#858783] focus:border-[#F5B94C]"
                    />
                    {errors.website_url && (
                      <p className="text-xs text-[#FB7185]">{errors.website_url}</p>
                    )}
                  </div>

                  {/* Stage Selector */}
                  <div className="space-y-2">
                    <Label className="text-xs text-[#B4B5B2]">Current Stage *</Label>
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {STAGES.map((s) => {
                        const isSelected = form.stage === s.value
                        return (
                          <div
                            key={s.value}
                            onClick={() => handleFieldChange('stage', s.value)}
                            className={`cursor-pointer rounded-xl border p-3.5 transition-all duration-200 ${
                              isSelected
                                ? 'border-[#F5B94C] bg-[#151719] shadow-lg shadow-[#F5B94C]/10'
                                : 'border-[#252729] bg-[#151719]/40 hover:border-[#3A3D40]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-semibold ${isSelected ? 'text-[#F5B94C]' : 'text-[#F5F5F2]'}`}>{s.label}</span>
                              {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-[#F5B94C]" />}
                            </div>
                            <p className="text-[11px] text-[#858783] mt-1 leading-snug">{s.desc}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Industry & Subcategory */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="industry" className="text-xs text-[#B4B5B2]">
                        Industry / Category *
                      </Label>
                      <select
                        id="industry"
                        value={form.industry}
                        onChange={(e) => handleFieldChange('industry', e.target.value)}
                        className="w-full rounded-lg border border-[#252729] bg-[#151719] px-3 py-2 text-xs text-[#F5F5F2] focus:border-[#F5B94C] focus:outline-none"
                      >
                        {INDUSTRIES.map((ind) => (
                          <option key={ind} value={ind}>
                            {ind}
                          </option>
                        ))}
                      </select>
                      {errors.industry && <p className="text-xs text-[#FB7185]">{errors.industry}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="product_category" className="text-xs text-[#B4B5B2]">
                        Niche / Subcategory <span className="text-[#858783] font-normal">(optional)</span>
                      </Label>
                      <Input
                        id="product_category"
                        value={form.product_category}
                        onChange={(e) => handleFieldChange('product_category', e.target.value)}
                        placeholder="e.g. Cold Chain, POS Billing, Artisanal Tea"
                        className="bg-[#151719] border-[#252729] text-xs text-[#F5F5F2] placeholder-[#858783] focus:border-[#F5B94C]"
                      />
                    </div>
                  </div>

                  {/* Short Business Description */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="business_description" className="text-xs text-[#B4B5B2]">
                        Short Elevator Pitch (One-Liner) *
                      </Label>
                      <span className="text-[10px] text-[#858783]">10–500 chars</span>
                    </div>
                    <textarea
                      id="business_description"
                      rows={2}
                      value={form.business_description}
                      onChange={(e) => handleFieldChange('business_description', e.target.value)}
                      placeholder="e.g. AI-powered inventory replenishment and automated invoicing for neighbourhood kirana stores."
                      className="w-full rounded-lg border border-[#252729] bg-[#151719] p-2.5 text-xs text-[#F5F5F2] placeholder:text-[#858783] focus:border-[#F5B94C] focus:outline-none focus:ring-1 focus:ring-[#F5B94C]"
                    />
                    {errors.business_description && (
                      <p className="text-xs text-[#FB7185]">{errors.business_description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* STEP 2: Product, Customers & Channels */}
            {currentStep === 2 && (
              <Card className="border-[#252729] bg-[#101314] shadow-2xl">
                <CardHeader>
                  <div className="flex items-center gap-2 text-[#F5B94C] text-xs font-semibold uppercase tracking-wider font-mono">
                    <Tag className="h-4 w-4" /> Step 2 of 3
                  </div>
                  <CardTitle className="text-xl text-[#F5F5F2]">Product, Customers & Pricing</CardTitle>
                  <CardDescription className="text-xs text-[#858783]">
                    Explain what you deliver, who pays, and how products reach end buyers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Detailed Product Description */}
                  <div className="space-y-1.5">
                    <Label htmlFor="product_desc" className="text-xs text-[#B4B5B2]">
                      Product or Service Offering *
                    </Label>
                    <textarea
                      id="product_desc"
                      rows={3}
                      value={form.product_desc}
                      onChange={(e) => handleFieldChange('product_desc', e.target.value)}
                      placeholder="e.g. A lightweight mobile app allowing store owners to scan distributor barcodes, reconcile GST credit in real time, and request 14-day working capital loans."
                      className="w-full rounded-lg border border-[#252729] bg-[#151719] p-2.5 text-xs text-[#F5F5F2] placeholder:text-[#858783] focus:border-[#F5B94C] focus:outline-none focus:ring-1 focus:ring-[#F5B94C]"
                    />
                    {errors.product_desc && (
                      <p className="text-xs text-[#FB7185]">{errors.product_desc}</p>
                    )}
                  </div>

                  {/* Target Customer Segment */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="target_customer" className="text-xs text-[#B4B5B2]">
                        Target Customer Segment *
                      </Label>
                      <Input
                        id="target_customer"
                        value={form.target_customer}
                        onChange={(e) => handleFieldChange('target_customer', e.target.value)}
                        placeholder="e.g. Independent Grocery Retailers"
                        className="bg-[#151719] border-[#252729] text-xs text-[#F5F5F2] placeholder-[#858783] focus:border-[#F5B94C]"
                      />
                      {errors.target_customer && (
                        <p className="text-xs text-[#FB7185]">{errors.target_customer}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="target_geography" className="text-xs text-[#B4B5B2]">
                        Target Geography Focus <span className="text-[#858783] font-normal">(optional)</span>
                      </Label>
                      <Input
                        id="target_geography"
                        value={form.target_geography}
                        onChange={(e) => handleFieldChange('target_geography', e.target.value)}
                        placeholder="e.g. High-density residential catchments"
                        className="bg-[#151719] border-[#252729] text-xs text-[#F5F5F2] placeholder-[#858783] focus:border-[#F5B94C]"
                      />
                    </div>
                  </div>

                  {/* Primary Sales / Distribution Channel */}
                  <div className="space-y-1.5">
                    <Label htmlFor="primary_channel" className="text-xs text-[#B4B5B2]">
                      Primary Sales / Distribution Channel *
                    </Label>
                    <select
                      id="primary_channel"
                      value={form.primary_channel}
                      onChange={(e) => handleFieldChange('primary_channel', e.target.value)}
                      className="w-full rounded-lg border border-[#252729] bg-[#151719] px-3 py-2 text-xs text-[#F5F5F2] focus:border-[#F5B94C] focus:outline-none"
                    >
                      {CHANNELS.map((ch) => (
                        <option key={ch} value={ch}>
                          {ch}
                        </option>
                      ))}
                    </select>
                    {errors.primary_channel && (
                      <p className="text-xs text-[#FB7185]">{errors.primary_channel}</p>
                    )}
                  </div>

                  {/* Price Range */}
                  <div className="rounded-xl border border-[#252729] bg-[#151719]/50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#F5F5F2] flex items-center gap-1.5">
                        <DollarSign className="h-3.5 w-3.5 text-[#F5B94C]" /> Price or Price Range (INR)
                      </span>
                      <span className="text-[11px] text-[#858783]">Leave blank if pre-pricing</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label htmlFor="price_min" className="text-[11px] text-[#858783]">
                          Min Price (₹)
                        </Label>
                        <Input
                          id="price_min"
                          type="number"
                          min="0"
                          value={form.price_min}
                          onChange={(e) => handleFieldChange('price_min', e.target.value)}
                          placeholder="e.g. 499"
                          className="bg-[#101314] border-[#252729] text-xs text-[#F5F5F2] focus:border-[#F5B94C]"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="price_max" className="text-[11px] text-[#858783]">
                          Max Price (₹)
                        </Label>
                        <Input
                          id="price_max"
                          type="number"
                          min="0"
                          value={form.price_max}
                          onChange={(e) => handleFieldChange('price_max', e.target.value)}
                          placeholder="e.g. 1999"
                          className="bg-[#101314] border-[#252729] text-xs text-[#F5F5F2] focus:border-[#F5B94C]"
                        />
                      </div>
                    </div>
                    {errors.price_min && <p className="text-xs text-[#FB7185]">{errors.price_min}</p>}
                    {errors.price_max && <p className="text-xs text-[#FB7185]">{errors.price_max}</p>}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* STEP 3: City & Expansion Goals */}
            {currentStep === 3 && (
              <Card className="border-[#252729] bg-[#101314] shadow-2xl">
                <CardHeader>
                  <div className="flex items-center gap-2 text-[#F5B94C] text-xs font-semibold uppercase tracking-wider font-mono">
                    <MapPin className="h-4 w-4" /> Step 3 of 3
                  </div>
                  <CardTitle className="text-xl text-[#F5F5F2]">City & Expansion Geography</CardTitle>
                  <CardDescription className="text-xs text-[#858783]">
                    Indicate your home hub and which candidate cities you want to evaluate.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Current Operating City */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="current_city" className="text-xs text-[#B4B5B2]">
                        Current Operating City *
                      </Label>
                      <span className="text-[11px] text-[#858783]">Loaded from database catalog</span>
                    </div>
                    <select
                      id="current_city"
                      value={form.current_city}
                      onChange={(e) => handleFieldChange('current_city', e.target.value)}
                      className="w-full rounded-lg border border-[#252729] bg-[#151719] px-3 py-2 text-xs text-[#F5F5F2] focus:border-[#F5B94C] focus:outline-none"
                    >
                      {citiesCatalog.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name} ({c.state})
                        </option>
                      ))}
                    </select>
                    {errors.current_city && (
                      <p className="text-xs text-[#FB7185]">{errors.current_city}</p>
                    )}
                  </div>

                  {/* Candidate Expansion Cities */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-[#B4B5B2]">
                        Candidate Expansion Cities{' '}
                        <span className="text-[#858783] font-normal">(select target markets)</span>
                      </Label>
                      <span className="text-[11px] text-[#F5B94C] font-mono">
                        {form.expansion_cities.length} selected
                      </span>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-3">
                      {citiesCatalog.map((city) => {
                        const isSelected = form.expansion_cities.includes(city.name)
                        const isHome = form.current_city === city.name
                        return (
                          <div
                            key={city.name}
                            onClick={() => !isHome && toggleExpansionCity(city.name)}
                            className={`cursor-pointer rounded-xl border p-3 transition-all duration-200 text-xs flex items-center justify-between ${
                              isHome
                                ? 'border-[#252729] bg-[#101314]/40 opacity-50 cursor-not-allowed'
                                : isSelected
                                ? 'border-[#F5B94C] bg-[#151719] text-[#F5B94C]'
                                : 'border-[#252729] bg-[#151719]/40 hover:border-[#3A3D40] text-[#858783]'
                            }`}
                          >
                            <div>
                              <span className={`font-semibold block ${isSelected ? 'text-[#F5B94C]' : 'text-[#F5F5F2]'}`}>{city.name}</span>
                              <span className="text-[10px] text-[#858783]">
                                {isHome ? 'Home City' : city.state}
                              </span>
                            </div>
                            {isSelected && !isHome && (
                              <CheckCircle2 className="h-4 w-4 text-[#F5B94C] shrink-0" />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Existing Traction (optional) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="traction_summary" className="text-xs text-[#B4B5B2]">
                        Existing Traction / Milestone <span className="text-[#858783] font-normal">(optional)</span>
                      </Label>
                      <span className="text-[11px] text-[#858783]">Be honest; leave blank if zero</span>
                    </div>
                    <textarea
                      id="traction_summary"
                      rows={2}
                      value={form.traction_summary}
                      onChange={(e) => handleFieldChange('traction_summary', e.target.value)}
                      placeholder="e.g. 45 pilot retailers live in Bengaluru with ₹3.2L GMV/month, 88% monthly retention."
                      className="w-full rounded-lg border border-[#252729] bg-[#151719] p-2.5 text-xs text-[#F5F5F2] placeholder:text-[#858783] focus:border-[#F5B94C] focus:outline-none focus:ring-1 focus:ring-[#F5B94C]"
                    />
                  </div>

                  {/* Expansion Context (optional) */}
                  <div className="space-y-1.5">
                    <Label htmlFor="expansion_context" className="text-xs text-[#B4B5B2]">
                      Expansion Goals or Key Constraints <span className="text-[#858783] font-normal">(optional)</span>
                    </Label>
                    <textarea
                      id="expansion_context"
                      rows={2}
                      value={form.expansion_context}
                      onChange={(e) => handleFieldChange('expansion_context', e.target.value)}
                      placeholder="e.g. Planning Q3 expansion into Mumbai and Delhi-NCR. Seeking cold-chain distributor networks and B2B pilot accounts."
                      className="w-full rounded-lg border border-[#252729] bg-[#151719] p-2.5 text-xs text-[#F5F5F2] placeholder:text-[#858783] focus:border-[#F5B94C] focus:outline-none focus:ring-1 focus:ring-[#F5B94C]"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation & Submission Controls */}
            <div className="mt-6 flex items-center justify-between">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="border-[#252729] text-[#858783] hover:text-[#F5F5F2] hover:bg-[#151719] text-xs gap-1.5"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Previous
                </Button>
              ) : (
                <div />
              )}

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-[#F5B94C] hover:bg-[#FFD27A] text-[#080A0B] font-semibold text-xs gap-1.5 shadow-md shadow-[#F5B94C]/20"
                >
                  Continue <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loading}
                  id="btn-save-startup-profile"
                  className="bg-[#F5B94C] hover:bg-[#FFD27A] text-[#080A0B] font-semibold text-xs gap-1.5 min-w-36 shadow-lg shadow-[#F5B94C]/25"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving Profile...
                    </>
                  ) : (
                    <>
                      <Rocket className="h-3.5 w-3.5" />
                      {isEdit ? 'Save Changes' : 'Complete Onboarding'}
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#252729] py-4 text-center text-xs text-[#858783]">
        City Launchpad • AI-Assisted Local Market Entry for Indian Startups
      </footer>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#080A0B] flex items-center justify-center text-[#858783]">
          <Loader2 className="h-6 w-6 animate-spin mr-2 text-[#F5B94C]" />
          Loading onboarding...
        </div>
      }
    >
      <OnboardingContent />
    </React.Suspense>
  )
}
