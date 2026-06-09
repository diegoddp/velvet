'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { email, password }
      )

      localStorage.setItem('accessToken', response.data.accessToken)
      localStorage.setItem('refreshToken', response.data.refreshToken)
      localStorage.setItem('userId', response.data.user.id)
      localStorage.setItem('userType', response.data.user.userType)

      toast.success('Login successful!')
      router.push('/dashboard')
    } catch (error: any) {
      if (error.response?.data?.requiresVerification) {
        toast.error('Age verification required')
        router.push('/verify-age')
      } else {
        toast.error(error.response?.data?.error || 'Login failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDemoAccess = () => {
    localStorage.setItem('accessToken', 'demo-access-token')
    localStorage.setItem('refreshToken', 'demo-refresh-token')
    localStorage.setItem('userId', 'demo-user')
    localStorage.setItem('userType', 'SUBSCRIBER')
    localStorage.setItem('demoMode', 'true')
    toast.success('Demo mode enabled')
    router.push('/dashboard')
  }

  return (
    <div className="center-wrap">
      <div className="panel panel-sm">
        <h1 className="section-title">Sign In</h1>
        <p className="section-subtitle">Access your account and continue to your personalized dashboard.</p>

        <form onSubmit={handleSubmit} className="stack" style={{ marginTop: '1rem' }}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="button-primary"
            style={{ width: '100%' }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleDemoAccess}
          className="button-secondary"
          style={{ width: '100%', marginTop: '0.7rem' }}
        >
          Enter Demo Mode
        </button>

        <p className="muted" style={{ marginTop: '1rem' }}>
          Don't have an account?{' '}
          <Link href="/register" className="link-inline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
