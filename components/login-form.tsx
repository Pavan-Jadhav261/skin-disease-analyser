'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LockKeyhole, LogIn, ShieldAlert } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = searchParams.get('next') || '/detect'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        setErrorMessage(data?.error || 'Sign in failed.')
        return
      }

      router.push(nextPath)
      router.refresh()
    } catch (error) {
      console.error('Login form error:', error)
      setErrorMessage('Unable to sign in right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-border/70 bg-white/85 p-6 shadow-2xl shadow-slate-950/5 backdrop-blur">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            placeholder="Enter your username"
            className="border-border bg-white"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            placeholder="Enter your password"
            className="border-border bg-white"
            required
          />
        </div>

        {errorMessage ? (
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900">
            <ShieldAlert className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <p>{errorMessage}</p>
          </div>
        ) : null}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 bg-primary text-white hover:bg-primary/90"
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Signing in...
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              Sign in
            </>
          )}
        </Button>

        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted-foreground">Need an account?</span>
          <Link href="/register" className="font-medium text-primary transition-colors hover:text-primary/90">
            Register
          </Link>
        </div>

        <p className="text-xs text-muted-foreground">
          Use the credentials configured in your local `.env` file.
        </p>
      </form>
    </Card>
  )
}
