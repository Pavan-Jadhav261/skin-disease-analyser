'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle, Sparkles, Upload, Zap } from 'lucide-react'

import { analyzeSkinCondition } from '@/app/actions/detectSkinDiseaseAction'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

export default function DetectPage() {
  const router = useRouter()
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [symptoms, setSymptoms] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<{
    disease: string
    confidence: number
    observations: string
    prevention: string
    cure: string
    notes: string
  } | null>(null)

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
        setResult({
          disease: response.data.predictedDisease || 'Unknown condition',
          confidence: response.data.confidenceScore || 0,
          observations: response.data.observations || 'No visual notes returned.',
          prevention: response.data.prevention || 'No prevention info available.',
          cure: response.data.cure || 'No cure info available.',
          notes: response.data.additionalNotes || '',
        })
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
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="border-b border-border bg-gradient-to-b from-green-50 to-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold text-foreground">Skin Analysis</h1>
          <p className="mt-2 text-muted-foreground">
            Upload an image or describe your symptoms for an OpenAI-powered preliminary assessment.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {!result ? (
            <Card className="border-border p-8">
              <div className="space-y-8">
                <div>
                  <label className="mb-4 block text-sm font-semibold text-foreground">
                    Upload Skin Image
                  </label>
                  <div className="group relative cursor-pointer rounded-lg border-2 border-dashed border-border p-8 text-center transition-colors hover:border-primary">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-10 w-10 text-muted-foreground transition-colors group-hover:text-primary" />
                      <p className="font-semibold text-foreground">
                        {image ? 'Image Selected' : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        JPG, JPEG, or PNG (Max 5MB)
                      </p>
                    </div>
                  </div>

                  {imagePreview && (
                    <div className="mt-6">
                      <p className="mb-3 text-sm font-semibold text-foreground">Preview:</p>
                      <img
                        src={imagePreview || '/placeholder.svg'}
                        alt="Skin condition"
                        className="max-h-64 w-full rounded-lg object-cover"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-4 block text-sm font-semibold text-foreground">
                    Describe Symptoms (Optional)
                  </label>
                  <Textarea
                    placeholder="E.g., itching, redness, rash, pain, swelling, burning sensation..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="min-h-32 border-border"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Provide details about any symptoms to improve analysis quality.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || (!image && !symptoms)}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
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

                <div className="flex gap-3 rounded-lg border border-primary/20 bg-blue-50 p-4">
                  <Sparkles className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <p className="text-sm text-foreground">
                    <strong>How it works:</strong> OpenAI looks at the image and the symptoms together, then returns a structured preliminary assessment.
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="border-border p-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-8 w-8 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Analysis Complete</h2>
                    <p className="text-muted-foreground">See the preliminary results below.</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-6">
                    <p className="text-sm text-muted-foreground">Predicted Condition</p>
                    <h3 className="mt-2 text-3xl font-bold text-primary">{result.disease}</h3>
                  </div>

                  <div className="rounded-lg border border-accent/20 bg-gradient-to-br from-accent/10 to-accent/5 p-6">
                    <p className="text-sm text-muted-foreground">Confidence Score</p>
                    <div className="mt-2">
                      <div className="text-3xl font-bold text-accent">{result.confidence}%</div>
                      <div className="mt-3 h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-accent transition-all duration-500"
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-slate-50/70 p-6">
                  <h4 className="mb-2 font-semibold text-foreground">What the model noticed</h4>
                  <p className="text-sm leading-6 text-muted-foreground">{result.observations}</p>
                </div>

                {imagePreview && (
                  <div>
                    <p className="mb-3 text-sm font-semibold text-foreground">Analyzed Image</p>
                    <img
                      src={imagePreview || '/placeholder.svg'}
                      alt="Analyzed skin"
                      className="max-h-64 w-full rounded-lg object-cover"
                    />
                  </div>
                )}

                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                    <div className="text-sm text-amber-900">
                      <p className="font-semibold">Important:</p>
                      <p className="mt-1">{result.notes}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-green-200 bg-green-50 p-6">
                    <h4 className="mb-2 font-semibold text-green-900">Prevention</h4>
                    <p className="text-sm text-green-800">{result.prevention}</p>
                  </div>

                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
                    <h4 className="mb-2 font-semibold text-blue-900">Cure / Treatment</h4>
                    <p className="text-sm text-blue-800">{result.cure}</p>
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-gray-50/50 p-6">
                  <h4 className="mb-3 font-semibold text-foreground">Next Steps</h4>
                  <ul className="list-inside list-disc space-y-2 text-sm text-foreground">
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
                    className="w-full border-border bg-transparent"
                  >
                    Analyze Another Image
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}
