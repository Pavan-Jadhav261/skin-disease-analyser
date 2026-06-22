'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertCircle,
  CheckCircle,
  Clock3,
  History,
  PanelLeft,
  Sparkles,
  Upload,
  Zap,
} from 'lucide-react'

import { analyzeSkinCondition } from '@/app/actions/detectSkinDiseaseAction'
import { Navbar } from '@/components/navbar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'

type AnalysisResult = {
  disease: string
  confidence: number
  observations: string
  prevention: string
  cure: string
  notes: string
}

type HistoryEntry = {
  id: string
  username: string
  kind: 'analysis' | 'login' | 'register'
  title: string
  summary: string
  createdAt: string
  payload?: Partial<AnalysisResult> & Record<string, unknown>
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'Just now'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export default function DetectPage() {
  const router = useRouter()
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [symptoms, setSymptoms] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([])
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  useEffect(() => {
    let active = true

    const loadHistory = async () => {
      try {
        const response = await fetch('/api/history', { cache: 'no-store' })
        const data = await response.json().catch(() => null)

        if (!active || !response.ok) {
          return
        }

        const entries = Array.isArray(data?.history) ? (data.history as HistoryEntry[]) : []
        setHistoryEntries(entries)

        if (!selectedHistoryId && entries.length > 0) {
          setSelectedHistoryId(entries[0].id)
        }
      } catch (error) {
        console.error('Failed to load history:', error)
      }
    }

    loadHistory()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!selectedHistoryId && historyEntries[0]) {
      setSelectedHistoryId(historyEntries[0].id)
    }
  }, [historyEntries, selectedHistoryId])

  const selectedEntry = useMemo(
    () => historyEntries.find((entry) => entry.id === selectedHistoryId) || null,
    [historyEntries, selectedHistoryId],
  )

  const activeResult: AnalysisResult | null =
    selectedEntry?.payload
      ? {
          disease: String(selectedEntry.payload.predictedDisease || 'Unknown condition'),
          confidence: Number(selectedEntry.payload.confidenceScore || 0),
          observations: String(selectedEntry.payload.observations || 'No observations available.'),
          prevention: String(selectedEntry.payload.prevention || 'No prevention info available.'),
          cure: String(selectedEntry.payload.cure || 'No cure info available.'),
          notes: String(selectedEntry.payload.additionalNotes || ''),
        }
      : analysis

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Please upload a JPG, JPEG, or PNG image.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Please upload an image smaller than 5MB.')
      return
    }

    setImage(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleAnalyze = async () => {
    if (!image && !symptoms) {
      alert('Please upload an image or describe symptoms')
      return
    }

    setIsAnalyzing(true)

    try {
      const formData = new FormData()
      if (image) {
        formData.append('image', image)
      }
      if (symptoms) {
        formData.append('symptoms', symptoms)
      }

      const response = await analyzeSkinCondition(formData)

      if (response.success && response.data) {
        const nextAnalysis: AnalysisResult = {
          disease: response.data.predictedDisease || 'Unknown condition',
          confidence: response.data.confidenceScore || 0,
          observations: response.data.observations || 'No visual notes returned.',
          prevention: response.data.prevention || 'No prevention info available.',
          cure: response.data.cure || 'No cure info available.',
          notes: response.data.additionalNotes || '',
        }

        setAnalysis(nextAnalysis)

        if (response.historyEntry) {
          const entry = response.historyEntry as HistoryEntry
          setHistoryEntries((current) => {
            const filtered = current.filter((item) => item.id !== entry.id)
            return [entry, ...filtered]
          })
          setSelectedHistoryId(entry.id)
        }
      } else if (response.error?.toLowerCase().includes('sign in')) {
        router.push('/login?next=/detect')
      } else {
        alert(response.error || 'Analysis failed. Please try again.')
      }
    } catch (error) {
      console.error('Analysis error:', error)
      alert('An error occurred during analysis.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetForm = () => {
    setImage(null)
    setImagePreview('')
    setSymptoms('')
    setAnalysis(null)
    setSelectedHistoryId(null)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <SheetContent
          side="left"
          className="w-[320px] border-slate-200 bg-slate-50 p-0 text-slate-900"
        >
          <SheetHeader className="border-b border-slate-200 px-5 py-5 text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700">
                <History className="h-5 w-5" />
              </div>
              <div>
                <SheetTitle className="text-lg font-semibold text-slate-950">
                  History
                </SheetTitle>
                <SheetDescription className="text-sm text-slate-500">
                  Recent analysis sessions
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-120px)]">
            <div className="space-y-3 p-4">
              {historyEntries.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
                  No history yet. Run your first analysis and it will appear here.
                </div>
              ) : (
                historyEntries.map((entry) => {
                  const isActive = entry.id === selectedHistoryId

                  return (
                    <button
                      key={entry.id}
                      onClick={() => setSelectedHistoryId(entry.id)}
                      className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                        isActive
                          ? 'border-emerald-400 bg-emerald-50'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-slate-950">{entry.title}</p>
                          <p className="mt-1 text-sm text-slate-500">{entry.summary}</p>
                        </div>
                        <Badge variant="secondary" className="shrink-0 bg-slate-100 text-slate-700">
                          {entry.kind}
                        </Badge>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                        <Clock3 className="h-3.5 w-3.5" />
                        {formatDate(entry.createdAt)}
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <section className="relative border-b border-slate-200 bg-gradient-to-b from-emerald-50 to-slate-50 px-4 py-12 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-start sm:gap-8 lg:gap-12">
            <div className="pt-1 sm:pt-2 lg:pt-4">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsHistoryOpen(true)}
                className="h-11 w-11 rounded-xl border border-slate-200 bg-white text-slate-700 shadow-md shadow-slate-200/50 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:text-slate-950 hover:shadow-lg sm:h-10 sm:w-10"
                aria-label="Open history panel"
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 pt-0 sm:pt-1 lg:pt-2">
              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                  OpenAI Detector
                </p>
                <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">Skin Analysis Workspace</h1>
                <p className="max-w-2xl text-slate-600">
                  Upload an image, describe symptoms, and keep your recent analyses tucked into the slide-out history panel.
                </p>
              </div>
          </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="space-y-6">
            <Card className="border-slate-200 p-6 shadow-xl shadow-slate-200/40">
              {!activeResult ? (
                <div className="space-y-8">
                  <div>
                    <label className="mb-4 block text-sm font-semibold text-slate-900">
                      Upload Skin Image
                    </label>
                    <div className="group relative cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center transition-colors hover:border-emerald-500">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-10 w-10 text-slate-400 transition-colors group-hover:text-emerald-600" />
                        <p className="font-semibold text-slate-900">
                          {image ? 'Image Selected' : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-slate-500">
                          JPG, JPEG, or PNG (Max 5MB)
                        </p>
                      </div>
                    </div>

                    {imagePreview && (
                      <div className="mt-6">
                        <p className="mb-3 text-sm font-semibold text-slate-900">Preview:</p>
                        <img
                          src={imagePreview || '/placeholder.svg'}
                          alt="Skin condition"
                          className="max-h-64 w-full rounded-2xl object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="mb-4 block text-sm font-semibold text-slate-900">
                      Describe Symptoms (Optional)
                    </label>
                    <Textarea
                      placeholder="E.g., itching, redness, rash, pain, swelling, burning sensation..."
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      className="min-h-32 border-slate-300 bg-white"
                    />
                    <p className="mt-2 text-xs text-slate-500">
                      Provide details about any symptoms to improve analysis quality.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || (!image && !symptoms)}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4" />
                          Analyze Skin
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                    <Sparkles className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                    <p className="text-sm text-slate-700">
                      <strong>How it works:</strong> OpenAI looks at the image and the symptoms together, then returns a structured preliminary assessment.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-8 w-8 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-950">Analysis Complete</h2>
                      <p className="text-slate-600">See the preliminary results below.</p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6">
                      <p className="text-sm text-slate-500">Predicted Condition</p>
                      <h3 className="mt-2 text-3xl font-bold text-emerald-700">{activeResult.disease}</h3>
                    </div>

                    <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-6">
                      <p className="text-sm text-slate-500">Confidence Score</p>
                      <div className="mt-2">
                        <div className="text-3xl font-bold text-sky-600">{activeResult.confidence}%</div>
                        <div className="mt-3 h-2 w-full rounded-full bg-slate-200">
                          <div
                            className="h-2 rounded-full bg-sky-500 transition-all duration-500"
                            style={{ width: `${activeResult.confidence}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedHistoryId === historyEntries[0]?.id && imagePreview ? (
                    <div>
                      <p className="mb-3 text-sm font-semibold text-slate-900">Analyzed Image</p>
                      <img
                        src={imagePreview || '/placeholder.svg'}
                        alt="Analyzed skin"
                        className="max-h-64 w-full rounded-2xl object-cover"
                      />
                    </div>
                  ) : null}

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    <h4 className="mb-2 font-semibold text-slate-900">What the model noticed</h4>
                    <p className="text-sm leading-6 text-slate-600">{activeResult.observations}</p>
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                      <div className="text-sm text-amber-900">
                        <p className="font-semibold">Important:</p>
                        <p className="mt-1">{activeResult.notes}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                      <h4 className="mb-2 font-semibold text-emerald-900">Prevention</h4>
                      <p className="text-sm text-emerald-800">{activeResult.prevention}</p>
                    </div>

                    <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6">
                      <h4 className="mb-2 font-semibold text-sky-900">Cure / Treatment</h4>
                      <p className="text-sm text-sky-800">{activeResult.cure}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-6">
                    <h4 className="mb-3 font-semibold text-slate-900">Next Steps</h4>
                    <ul className="list-inside list-disc space-y-2 text-sm text-slate-700">
                      <li>Schedule an appointment with a dermatologist for professional evaluation</li>
                      <li>Bring this assessment along with the image to your consultation</li>
                      <li>Follow professional medical advice for treatment and care</li>
                      <li>Maintain proper skin hygiene and follow recommended skincare routines</li>
                    </ul>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={resetForm}
                      variant="outline"
                      className="w-full border-slate-300 bg-transparent"
                    >
                      Analyze Another Image
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
