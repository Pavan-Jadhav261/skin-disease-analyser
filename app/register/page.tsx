import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Shield, Sparkles } from 'lucide-react'

import { RegisterForm } from '@/components/register-form'
import { Card } from '@/components/ui/card'
import { getAuthSession } from '@/lib/auth'

export default async function RegisterPage() {
  const session = await getAuthSession()

  if (session) {
    redirect('/detect')
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_40%),linear-gradient(180deg,_#f8fffc_0%,_#ffffff_45%,_#effdf7_100%)]">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="flex flex-col justify-center space-y-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-medium text-emerald-900 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Create an account
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                Register your account
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-600">
                Create a local account, sign in instantly, and keep access protected with a JWT session cookie.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border-border/70 bg-white/85 p-4 shadow-sm backdrop-blur">
                <Shield className="h-5 w-5 text-emerald-600" />
                <h2 className="mt-3 font-semibold text-slate-950">Hashed passwords</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Passwords are stored locally using a secure hash, not in plain text.
                </p>
              </Card>

              <Card className="border-border/70 bg-white/85 p-4 shadow-sm backdrop-blur">
                <Shield className="h-5 w-5 text-blue-600" />
                <h2 className="mt-3 font-semibold text-slate-950">JWT session</h2>
                <p className="mt-2 text-sm text-slate-600">
                  After registration, you are signed in automatically.
                </p>
              </Card>
            </div>

            <Link href="/login" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950">
              Back to login
            </Link>
          </section>

          <section className="flex items-center">
            <div className="w-full max-w-md">
              <RegisterForm />
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
