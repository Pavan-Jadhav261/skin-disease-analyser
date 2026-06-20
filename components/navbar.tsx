'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    const loadSession = async () => {
      try {
        const response = await fetch('/api/auth/me', { cache: 'no-store' })
        const data = await response.json().catch(() => null)

        if (active) {
          setIsAuthenticated(Boolean(data?.authenticated))
          setIsAdmin(Boolean(data?.isAdmin))
        }
      } catch {
        if (active) {
          setIsAuthenticated(false)
          setIsAdmin(false)
        }
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    loadSession()

    return () => {
      active = false
    }
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setIsAuthenticated(false)
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white font-bold">
              Rx
            </div>
            <span className="text-xl font-bold text-foreground">SkinCheck</span>
          </Link>

          <div className="hidden gap-8 md:flex">
            <Link href="/" className="text-foreground transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="/detect" className="text-foreground transition-colors hover:text-primary">
              Detector
            </Link>
            <Link href="/about" className="text-foreground transition-colors hover:text-primary">
              About
            </Link>
            <Link href="/contact" className="text-foreground transition-colors hover:text-primary">
              Contact
            </Link>
            {isAuthenticated && isAdmin ? (
              <Link href="/admin" className="text-foreground transition-colors hover:text-primary">
                Admin
              </Link>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            {isLoading ? null : isAuthenticated ? (
              <Button
                onClick={handleLogout}
                variant="outline"
                className="hidden gap-2 border-border bg-transparent md:inline-flex"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Link href="/login">
                  <Button variant="outline" className="border-border bg-transparent">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-primary text-white hover:bg-primary/90">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            <Link href="/detect">
              <Button className="bg-primary text-white hover:bg-primary/90">
                Start Analysis
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
