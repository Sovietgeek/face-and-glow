'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authClient } from '@/lib/auth-client'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result =
      mode === 'sign-up'
        ? await authClient.signUp.email({ email, password, name })
        : await authClient.signIn.email({ email, password })

    if (result.error) {
      setError(result.error.message ?? 'Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="flex min-h-[70svh] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <Image
            src="/images/logo.png"
            alt="Face and Glow logo"
            width={56}
            height={56}
            className="size-14 rounded-full object-cover"
          />
          <CardTitle className="font-serif text-2xl">
            {mode === 'sign-in' ? 'Welcome Back' : 'Create Your Account'}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {mode === 'sign-in'
              ? 'Sign in to book appointments and view your history.'
              : 'Join Face and Glow to book appointments online.'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'sign-up' && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Priya Sharma"
                />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading}>
              {loading
                ? 'Please wait...'
                : mode === 'sign-in'
                  ? 'Sign In'
                  : 'Create Account'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {mode === 'sign-in' ? (
              <>
                New to Face and Glow?{' '}
                <Link href="/sign-up" className="font-medium text-primary hover:underline">
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link href="/sign-in" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
