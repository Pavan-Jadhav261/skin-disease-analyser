import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, DollarSign, Users, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-blue-50 to-background px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            OpenAI Skin Image Analysis
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            Early understanding. Better awareness. Healthier skin decisions.
          </p>
          <p className="mt-4 text-base text-muted-foreground">
            Upload a skin image and add symptoms to get a preliminary assessment using OpenAI vision. For informational purposes only - always consult a dermatologist for an accurate diagnosis.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row justify-center">
            <Link href="/detect">
              <Button className="inline-flex items-center gap-2 bg-primary text-white hover:bg-primary/90">
                Check Skin Condition
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="border-border bg-transparent">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground">Why Early Detection Matters</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Early identification of skin conditions can lead to better outcomes and faster treatment.
            Our AI-powered system provides preliminary assessments to help you understand your skin health better.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Card className="border-border p-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Quick Assessment</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Get preliminary results in seconds, not weeks of waiting for appointments.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-border p-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Zap className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">AI-Powered Analysis</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Uses OpenAI image understanding to inspect visual cues alongside your symptoms.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-border p-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Accessible to Everyone</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    No special equipment needed - just your smartphone and a clear image.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-border p-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Cost Effective</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Free initial screening to help you decide if professional consultation is needed.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-blue-50/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground">How It Works</h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white font-bold text-lg">
                1
              </div>
              <h3 className="text-xl font-semibold text-foreground">Upload Image</h3>
              <p className="text-muted-foreground">
                Take a clear photo of the affected skin area or upload an existing image from your device.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white font-bold text-lg">
                2
              </div>
              <h3 className="text-xl font-semibold text-foreground">Add Symptoms</h3>
              <p className="text-muted-foreground">
                Optionally describe any symptoms like itching, redness, or pain to improve accuracy.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-white font-bold text-lg">
                3
              </div>
              <h3 className="text-xl font-semibold text-foreground">Get Results</h3>
              <p className="text-muted-foreground">
                Receive an AI-powered assessment with confidence scores and recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-foreground">Ready to Check Your Skin?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start your skin analysis now. Remember: this is for awareness only. Always consult with a dermatologist for professional diagnosis.
          </p>
          <div className="mt-8">
            <Link href="/detect">
              <Button className="inline-flex items-center gap-2 bg-primary text-white hover:bg-primary/90 px-8 py-6 text-lg">
                Start Analysis
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2024 SkinCheck AI. Early detection for better skin health.</p>
            <p className="mt-2">
              This application is for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
