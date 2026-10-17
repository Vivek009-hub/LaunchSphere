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
              target_geography: profile.target_geography || '',
              primary_channel: profile.primary_channel || 'B2B Direct Field Sales',
              price_min: profile.price_min != null ? String(profile.price_min) : '',
              price_max: profile.price_max != null ? String(profile.price_max) : '',
              current_city: profile.current_city || 'Bengaluru',
              expansion_cities: profile.expansion_cities || [],
              traction_summary: profile.traction_summary || '',
              expansion_context: profile.expansion_context || '',
            })
          }
        }
      } catch (err) {
        console.error('Initialization error:', err)
      } finally {
        setInitialLoading(false)
      }
    }

    init()
  }, [supabase])

  const handleFieldChange = (
    field: keyof OnboardingFormData,
    value: OnboardingFormData[keyof OnboardingFormData]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const toggleExpansionCity = (cityName: string) => {
    let next: string[]
    if (form.expansion_cities.includes(cityName)) {
      next = form.expansion_cities.filter((c) => c !== cityName)
    } else {
      next = [...form.expansion_cities, cityName]
    }
    handleFieldChange('expansion_cities', next)
  }

  // Step-level validation
  const validateStep = (stepNumber: number): boolean => {
    const stepErrors: Record<string, string> = {}

    if (stepNumber === 1) {
      if (!form.name.trim() || form.name.trim().length < 2) {
        stepErrors.name = 'Startup name must be at least 2 characters.'
      }
      if (!form.business_description.trim() || form.business_description.trim().length < 10) {
        stepErrors.business_description = 'Provide a short business description (at least 10 characters).'
      }
      if (!form.industry.trim()) {
        stepErrors.industry = 'Please select or enter your industry.'
      }
      if (form.website_url.trim()) {
        try {
          new URL(form.website_url.trim())
        } catch {
          stepErrors.website_url = 'Enter a valid URL (including https://).'
        }
      }
    } else if (stepNumber === 2) {
      if (!form.product_desc.trim() || form.product_desc.trim().length < 10) {
        stepErrors.product_desc = 'Describe what your product does (at least 10 characters).'
      }
      if (!form.target_customer.trim() || form.target_customer.trim().length < 5) {
        stepErrors.target_customer = 'Specify your primary target customer segment.'
      }
      if (!form.primary_channel.trim()) {
        stepErrors.primary_channel = 'Select your primary distribution or sales channel.'
      }
      if (form.price_min && form.price_max) {
        const min = Number(form.price_min)
        const max = Number(form.price_max)
        if (min < 0) stepErrors.price_min = 'Price cannot be negative.'
        if (max < 0) stepErrors.price_max = 'Price cannot be negative.'
        if (min > max) {
          stepErrors.price_min = 'Minimum price cannot exceed maximum price.'
        }
      }
    } else if (stepNumber === 3) {
      if (!form.current_city.trim()) {
        stepErrors.current_city = 'Current operating city is required.'
      }
    }

    setErrors(stepErrors)
    return Object.keys(stepErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(3, prev + 1))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError(null)

    // Full schema parse
    const payload = {
      name: form.name.trim(),
      business_description: form.business_description.trim(),
      industry: form.industry.trim(),
      stage: form.stage,
      product_desc: form.product_desc.trim(),
      target_customer: form.target_customer.trim(),
      current_city: form.current_city.trim(),
      price_min: form.price_min ? Number(form.price_min) : undefined,
      price_max: form.price_max ? Number(form.price_max) : undefined,
      primary_channel: form.primary_channel.trim(),
      website_url: form.website_url.trim() || undefined,
      product_category: form.product_category.trim() || undefined,
      target_geography: form.target_geography.trim() || undefined,
      expansion_cities: form.expansion_cities,
      traction_summary: form.traction_summary.trim() || undefined,
      expansion_context: form.expansion_context.trim() || undefined,
    }

    const validation = startupProfileSchema.safeParse(payload)
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {}
      validation.error.issues.forEach((issue) => {
        const field = String(issue.path[0])
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)

      // Jump to first step that has an error
      if (fieldErrors.name || fieldErrors.business_description || fieldErrors.industry || fieldErrors.website_url) {
        setCurrentStep(1)
      } else if (fieldErrors.product_desc || fieldErrors.target_customer || fieldErrors.primary_channel || fieldErrors.price_min || fieldErrors.price_max) {
        setCurrentStep(2)
      } else {
        setCurrentStep(3)
      }
      return
    }

    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setServerError('Session expired. Please sign in again.')
        setLoading(false)
        return
      }

      const dbPayload = {
        name: payload.name,
        business_description: payload.business_description,
        industry: payload.industry,
        stage: payload.stage,
        product_desc: payload.product_desc,
        target_customer: payload.target_customer,
        current_city: payload.current_city,
        price_min: payload.price_min ?? null,
        price_max: payload.price_max ?? null,
        primary_channel: payload.primary_channel,
        website_url: payload.website_url ?? null,
        product_category: payload.product_category ?? null,
        target_geography: payload.target_geography ?? null,
        expansion_cities: payload.expansion_cities,
        traction_summary: payload.traction_summary ?? null,
        expansion_context: payload.expansion_context ?? null,
      }

      const { error: saveError } = isEdit
        ? await supabase
            .from('startup_profiles')
            .update(dbPayload)
            .eq('user_id', user.id)
        : await supabase
            .from('startup_profiles')
            .insert({
              ...dbPayload,
              user_id: user.id,
            })

      if (saveError) {
        throw new Error(saveError.message)
      }

      router.push(returnTo)
    } catch (err: unknown) {
      console.error('Error saving profile:', err)
      setServerError(err instanceof Error ? err.message : 'Failed to save startup profile.')
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading startup profile...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-500/20">
              <Rocket className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white">City Launchpad</span>
              <p className="text-[11px] text-slate-400">
                {isEdit ? 'Profile Settings' : 'Founder Onboarding'}
              </p>
            </div>
          </div>

          <Link href={returnTo}>
            <Button variant="ghost" size="sm" className="text-xs text-slate-400 hover:text-white">
              {isEdit ? 'Back to Dashboard' : 'Skip for now'}
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content Form */}
      <main className="flex-1 py-10 px-4">
        <div className="mx-auto max-w-2xl">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-2">
              <span className={currentStep === 1 ? 'text-blue-400 font-semibold' : ''}>
                1. Identity & Stage
              </span>
              <span className={currentStep === 2 ? 'text-blue-400 font-semibold' : ''}>
                2. Product & Market
              </span>
              <span className={currentStep === 3 ? 'text-blue-400 font-semibold' : ''}>
                3. City & Expansion
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>

          {serverError && (
            <div className="mb-6 flex items-center gap-2 rounded-lg border border-rose-800/50 bg-rose-950/40 p-4 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* STEP 1: Startup Identity & Stage */}
            {currentStep === 1 && (
              <Card className="border-slate-800 bg-slate-900/60 backdrop-blur shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                    <Building2 className="h-4 w-4" /> Step 1 of 3
                  </div>
                  <CardTitle className="text-xl text-white">Startup Identity & Stage</CardTitle>
                  <CardDescription className="text-xs">
                    Define who you are and what developmental stage your venture is currently in.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Startup Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs text-slate-300">
                      Startup Name *
                    </Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      placeholder="e.g. Bharat Logistics, KiranaStack, GreenKart"
                      className="bg-slate-950/70 border-slate-700 text-sm"
                      autoFocus
                    />
                    {errors.name && <p className="text-xs text-rose-400">{errors.name}</p>}
                  </div>

                  {/* Website URL (optional) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="website_url" className="text-xs text-slate-300">
                        Website or Pitch URL <span className="text-slate-500 font-normal">(optional)</span>
                      </Label>
                      <span className="text-[11px] text-slate-500">Include https://</span>
                    </div>
                    <Input
                      id="website_url"
                      type="url"
                      value={form.website_url}
                      onChange={(e) => handleFieldChange('website_url', e.target.value)}
                      placeholder="https://example.com"
                      className="bg-slate-950/70 border-slate-700 text-sm"
                    />
                    {errors.website_url && (
                      <p className="text-xs text-rose-400">{errors.website_url}</p>
                    )}
                  </div>

                  {/* Stage Selector */}
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-300">Current Stage *</Label>
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {STAGES.map((s) => {
                        const isSelected = form.stage === s.value
                        return (
                          <div
                            key={s.value}
                            onClick={() => handleFieldChange('stage', s.value)}
                            className={`cursor-pointer rounded-lg border p-3 transition-all ${
                              isSelected
                                ? 'border-blue-500 bg-blue-950/30 shadow-md'
                                : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-slate-100">{s.label}</span>
                              {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1 leading-snug">{s.desc}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Industry & Subcategory */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="industry" className="text-xs text-slate-300">
                        Industry / Category *
                      </Label>
                      <select
                        id="industry"
                        value={form.industry}
                        onChange={(e) => handleFieldChange('industry', e.target.value)}
                        className="w-full rounded-md border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {INDUSTRIES.map((ind) => (
                          <option key={ind} value={ind}>
                            {ind}
                          </option>
                        ))}
                      </select>
                      {errors.industry && <p className="text-xs text-rose-400">{errors.industry}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="product_category" className="text-xs text-slate-300">
                        Niche / Subcategory <span className="text-slate-500 font-normal">(optional)</span>
                      </Label>
                      <Input
                        id="product_category"
                        value={form.product_category}
                        onChange={(e) => handleFieldChange('product_category', e.target.value)}
                        placeholder="e.g. Cold Chain, POS Billing, Artisanal Tea"
                        className="bg-slate-950/70 border-slate-700 text-xs"
                      />
                    </div>
                  </div>

                  {/* Short Business Description */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="business_description" className="text-xs text-slate-300">
                        Short Elevator Pitch (One-Liner) *
                      </Label>
                      <span className="text-[10px] text-slate-500">10–500 chars</span>
                    </div>
                    <textarea
                      id="business_description"
                      rows={2}
                      value={form.business_description}
                      onChange={(e) => handleFieldChange('business_description', e.target.value)}
                      placeholder="e.g. AI-powered inventory replenishment and automated invoicing for neighbourhood kirana stores."
                      className="w-full rounded-md border border-slate-700 bg-slate-950/70 p-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.business_description && (
                      <p className="text-xs text-rose-400">{errors.business_description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* STEP 2: Product, Customers & Channels */}
            {currentStep === 2 && (
              <Card className="border-slate-800 bg-slate-900/60 backdrop-blur shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                    <Tag className="h-4 w-4" /> Step 2 of 3
                  </div>
                  <CardTitle className="text-xl text-white">Product, Customers & Pricing</CardTitle>
                  <CardDescription className="text-xs">
                    Explain what you deliver, who pays, and how products reach end buyers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Detailed Product Description */}
                  <div className="space-y-1.5">
                    <Label htmlFor="product_desc" className="text-xs text-slate-300">
                      Product or Service Offering *
                    </Label>
                    <textarea
                      id="product_desc"
                      rows={3}
                      value={form.product_desc}
                      onChange={(e) => handleFieldChange('product_desc', e.target.value)}
                      placeholder="e.g. A lightweight mobile app allowing store owners to scan distributor barcodes, reconcile GST credit in real time, and request 14-day working capital loans."
                      className="w-full rounded-md border border-slate-700 bg-slate-950/70 p-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.product_desc && (
                      <p className="text-xs text-rose-400">{errors.product_desc}</p>
                    )}
                  </div>

                  {/* Target Customer Segment */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="target_customer" className="text-xs text-slate-300">
                        Target Customer Segment *
                      </Label>
                      <Input
                        id="target_customer"
                        value={form.target_customer}
                        onChange={(e) => handleFieldChange('target_customer', e.target.value)}
                        placeholder="e.g. Independent Grocery Retailers"
                        className="bg-slate-950/70 border-slate-700 text-xs"
                      />
                      {errors.target_customer && (
                        <p className="text-xs text-rose-400">{errors.target_customer}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="target_geography" className="text-xs text-slate-300">
                        Target Geography Focus <span className="text-slate-500 font-normal">(optional)</span>
                      </Label>
                      <Input
                        id="target_geography"
                        value={form.target_geography}
                        onChange={(e) => handleFieldChange('target_geography', e.target.value)}
                        placeholder="e.g. High-density residential catchments"
                        className="bg-slate-950/70 border-slate-700 text-xs"
                      />
                    </div>
                  </div>

                  {/* Primary Sales / Distribution Channel */}
                  <div className="space-y-1.5">
                    <Label htmlFor="primary_channel" className="text-xs text-slate-300">
                      Primary Sales / Distribution Channel *
                    </Label>
                    <select
                      id="primary_channel"
                      value={form.primary_channel}
                      onChange={(e) => handleFieldChange('primary_channel', e.target.value)}
                      className="w-full rounded-md border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {CHANNELS.map((ch) => (
                        <option key={ch} value={ch}>
                          {ch}
                        </option>
                      ))}
                    </select>
                    {errors.primary_channel && (
                      <p className="text-xs text-rose-400">{errors.primary_channel}</p>
                    )}
                  </div>

                  {/* Price Range (optional / when applicable) */}
                  <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <DollarSign className="h-3.5 w-3.5 text-blue-400" /> Price or Price Range (INR)
                      </span>
                      <span className="text-[11px] text-slate-500">Leave blank if pre-pricing</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label htmlFor="price_min" className="text-[11px] text-slate-400">
                          Min Price (₹)
                        </Label>
                        <Input
                          id="price_min"
                          type="number"
                          min="0"
                          value={form.price_min}
                          onChange={(e) => handleFieldChange('price_min', e.target.value)}
                          placeholder="e.g. 499"
                          className="bg-slate-950 border-slate-700 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="price_max" className="text-[11px] text-slate-400">
                          Max Price (₹)
                        </Label>
                        <Input
                          id="price_max"
                          type="number"
                          min="0"
                          value={form.price_max}
                          onChange={(e) => handleFieldChange('price_max', e.target.value)}
                          placeholder="e.g. 1999"
                          className="bg-slate-950 border-slate-700 text-xs"
                        />
                      </div>
                    </div>
                    {errors.price_min && <p className="text-xs text-rose-400">{errors.price_min}</p>}
                    {errors.price_max && <p className="text-xs text-rose-400">{errors.price_max}</p>}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* STEP 3: City & Expansion Goals */}
            {currentStep === 3 && (
              <Card className="border-slate-800 bg-slate-900/60 backdrop-blur shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                    <MapPin className="h-4 w-4" /> Step 3 of 3
                  </div>
                  <CardTitle className="text-xl text-white">City & Expansion Geography</CardTitle>
                  <CardDescription className="text-xs">
                    Indicate your home hub and which candidate cities you want to evaluate.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Current Operating City */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="current_city" className="text-xs text-slate-300">
                        Current Operating City *
                      </Label>
                      <span className="text-[11px] text-slate-500">Loaded from database catalog</span>
                    </div>
                    <select
                      id="current_city"
                      value={form.current_city}
                      onChange={(e) => handleFieldChange('current_city', e.target.value)}
                      className="w-full rounded-md border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {citiesCatalog.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name} ({c.state})
                        </option>
                      ))}
                    </select>
                    {errors.current_city && (
                      <p className="text-xs text-rose-400">{errors.current_city}</p>
                    )}
                  </div>

                  {/* Candidate Expansion Cities */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-slate-300">
                        Candidate Expansion Cities{' '}
                        <span className="text-slate-500 font-normal">(select target markets)</span>
                      </Label>
                      <span className="text-[11px] text-blue-400">
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
                            className={`cursor-pointer rounded-lg border p-2.5 transition-all text-xs flex items-center justify-between ${
                              isHome
                                ? 'border-slate-800 bg-slate-900/30 opacity-60 cursor-not-allowed'
                                : isSelected
                                ? 'border-blue-500 bg-blue-950/40 text-blue-200'
                                : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 text-slate-400'
                            }`}
                          >
                            <div>
                              <span className="font-semibold block text-slate-200">{city.name}</span>
                              <span className="text-[10px] text-slate-500">
                                {isHome ? 'Home City' : city.state}
                              </span>
                            </div>
                            {isSelected && !isHome && (
                              <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Existing Traction (optional) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="traction_summary" className="text-xs text-slate-300">
                        Existing Traction / Milestone <span className="text-slate-500 font-normal">(optional)</span>
                      </Label>
                      <span className="text-[11px] text-slate-500">Be honest; leave blank if zero</span>
                    </div>
                    <textarea
                      id="traction_summary"
                      rows={2}
                      value={form.traction_summary}
                      onChange={(e) => handleFieldChange('traction_summary', e.target.value)}
                      placeholder="e.g. 45 pilot retailers live in Bengaluru with ₹3.2L GMV/month, 88% monthly retention."
                      className="w-full rounded-md border border-slate-700 bg-slate-950/70 p-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Expansion Context (optional) */}
                  <div className="space-y-1.5">
                    <Label htmlFor="expansion_context" className="text-xs text-slate-300">
                      Expansion Goals or Key Constraints <span className="text-slate-500 font-normal">(optional)</span>
                    </Label>
                    <textarea
                      id="expansion_context"
                      rows={2}
                      value={form.expansion_context}
                      onChange={(e) => handleFieldChange('expansion_context', e.target.value)}
                      placeholder="e.g. Planning Q3 expansion into Mumbai and Delhi-NCR. Seeking cold-chain distributor networks and B2B pilot accounts."
                      className="w-full rounded-md border border-slate-700 bg-slate-950/70 p-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="border-slate-800 text-slate-300 hover:bg-slate-900 text-xs gap-1.5"
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
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs gap-1.5"
                >
                  Continue <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loading}
                  id="btn-save-startup-profile"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5 min-w-36"
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
      <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-600">
        City Launchpad • AI-Assisted Local Market Entry for Indian Startups
      </footer>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading onboarding...
        </div>
      }
    >
      <OnboardingContent />
    </React.Suspense>
  )
}
