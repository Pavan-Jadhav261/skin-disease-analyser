import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Shield, Sparkles } from 'lucide-react'

import { LoginForm } from '@/components/login-form'
import { getAuthSession } from '@/lib/auth'

export default async function LoginPage() {
  const session = await getAuthSession()

  if (session) {
    redirect('/detect')
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_40%),linear-gradient(180deg,_#f8fbff_0%,_#ffffff_45%,_#f3f7ff_100%)]">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="flex flex-col justify-center space-y-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-medium text-blue-900 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Secure JWT access
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                Sign in to use the skin analysis workspace
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-600">
                Use the demo credentials `admin` and `1234`, or register a new local account, to access the OpenAI-powered detector.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
                <Shield className="h-5 w-5 text-blue-600" />
                <h2 className="mt-3 font-semibold text-slate-950">Private session</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Your session is stored as an httpOnly JWT cookie.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
                <Shield className="h-5 w-5 text-emerald-600" />
                <h2 className="mt-3 font-semibold text-slate-950">AI analysis</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Upload an image and let the model inspect visual patterns plus symptoms.
                </p>
              </div>
            </div>

            <Link href="/" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950">
              Back to home
            </Link>
          </section>

          <section className="flex items-center">
            <div className="w-full max-w-md">
              <LoginForm />
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
