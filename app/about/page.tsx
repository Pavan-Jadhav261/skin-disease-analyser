import { Navbar } from '@/components/navbar'
import { Card } from '@/components/ui/card'
import { TrendingUp, Brain, Shield, Zap } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header Section */}
      <section className="border-b border-border bg-gradient-to-b from-blue-50 to-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold text-foreground">About SkinCheck AI</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Understanding skin diseases and how technology can help with early detection.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-16">
          {/* Skin Diseases Section */}
          <div>
            <h2 className="text-3xl font-bold text-foreground">Skin Diseases: A Growing Concern</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Skin diseases affect over 1.9 billion people worldwide, making them one of the most common health issues globally. 
              From eczema and psoriasis to acne and fungal infections, skin conditions impact quality of life significantly.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <Card className="border-border p-6">
                <TrendingUp className="h-8 w-8 text-primary" />
                <h3 className="mt-4 font-semibold text-foreground">Growing Prevalence</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Dermatological conditions are increasingly prevalent, affecting people of all ages and demographics.
                </p>
              </Card>

              <Card className="border-border p-6">
                <Shield className="h-8 w-8 text-accent" />
                <h3 className="mt-4 font-semibold text-foreground">Varied Impact</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  These conditions range from minor cosmetic concerns to serious health issues requiring urgent treatment.
                </p>
              </Card>

              <Card className="border-border p-6">
                <Zap className="h-8 w-8 text-primary" />
                <h3 className="mt-4 font-semibold text-foreground">Early Detection</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Early identification and treatment significantly improve outcomes and reduce complications.
                </p>
              </Card>
            </div>
          </div>

          {/* Problems Section */}
          <div>
            <h2 className="text-3xl font-bold text-foreground">Challenges with Traditional Diagnosis</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Traditional dermatology diagnosis faces several limitations that can delay treatment and care.
            </p>

            <div className="mt-8 space-y-4">
              <Card className="border-border p-6">
                <h3 className="font-semibold text-foreground">Long Wait Times</h3>
                <p className="mt-2 text-muted-foreground">
                  Dermatologist appointments often have lengthy wait times, delaying diagnosis and treatment initiation.
                </p>
              </Card>

              <Card className="border-border p-6">
                <h3 className="font-semibold text-foreground">Geographic Limitations</h3>
                <p className="mt-2 text-muted-foreground">
                  Many individuals lack access to specialized dermatological care in remote or underserved areas.
                </p>
              </Card>

              <Card className="border-border p-6">
                <h3 className="font-semibold text-foreground">High Costs</h3>
                <p className="mt-2 text-muted-foreground">
                  Professional consultations can be expensive, limiting accessibility for many patients.
                </p>
              </Card>

              <Card className="border-border p-6">
                <h3 className="font-semibold text-foreground">Initial Anxiety</h3>
                <p className="mt-2 text-muted-foreground">
                  Patients often experience anxiety about their conditions before seeking professional help.
                </p>
              </Card>
            </div>
          </div>

          {/* AI Solution Section */}
          <div>
            <h2 className="text-3xl font-bold text-foreground">How AI-Based Detection Helps</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Artificial intelligence and machine learning offer promising solutions to traditional diagnostic challenges.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <Card className="border-border p-6 bg-blue-50/50">
                <Brain className="h-8 w-8 text-primary" />
                <h3 className="mt-4 font-semibold text-foreground">Pattern Recognition</h3>
                <p className="mt-2 text-muted-foreground">
                  AI models trained on thousands of images can identify subtle patterns and characteristics that aid in preliminary assessment.
                </p>
              </Card>

              <Card className="border-border p-6 bg-green-50/50">
                <Zap className="h-8 w-8 text-accent" />
                <h3 className="mt-4 font-semibold text-foreground">Instant Analysis</h3>
                <p className="mt-2 text-muted-foreground">
                  Get preliminary results in seconds rather than waiting weeks for an appointment, enabling faster decision-making.
                </p>
              </Card>

              <Card className="border-border p-6 bg-blue-50/50">
                <Shield className="h-8 w-8 text-primary" />
                <h3 className="mt-4 font-semibold text-foreground">Accessibility</h3>
                <p className="mt-2 text-muted-foreground">
                  AI-powered tools can be accessed from anywhere with internet, democratizing initial skin health assessment.
                </p>
              </Card>

              <Card className="border-border p-6 bg-green-50/50">
                <TrendingUp className="h-8 w-8 text-accent" />
                <h3 className="mt-4 font-semibold text-foreground">Continuous Improvement</h3>
                <p className="mt-2 text-muted-foreground">
                  Machine learning models improve over time with more data, enhancing accuracy and reliability continuously.
                </p>
              </Card>
            </div>
          </div>

          {/* Important Disclaimer */}
          <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-8">
            <h3 className="text-xl font-bold text-amber-900">Important Disclaimer</h3>
            <p className="mt-4 text-amber-900">
              This AI Skin Disease Detector is designed for <strong>awareness and educational purposes only</strong>. 
              It is <strong>not</strong> intended to:
            </p>
            <ul className="mt-4 space-y-2 list-disc list-inside text-amber-900">
              <li>Replace professional medical diagnosis</li>
              <li>Serve as a substitute for consultation with a dermatologist</li>
              <li>Provide definitive medical advice</li>
              <li>Diagnose or treat any medical condition</li>
            </ul>
            <p className="mt-4 font-semibold text-amber-900">
              Always consult with a qualified healthcare professional for accurate diagnosis and treatment of skin conditions.
            </p>
          </div>

          {/* Call to Action */}
          <div className="rounded-lg border border-primary/20 bg-blue-50/50 p-8 text-center">
            <h3 className="text-xl font-bold text-foreground">Ready to Get Started?</h3>
            <p className="mt-2 text-muted-foreground">
              Use our AI detector for a preliminary assessment, then consult with a dermatologist for professional care.
            </p>
            <a href="/detect" className="inline-block mt-6 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Start Analysis
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2024 SkinCheck AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
