'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    cpf: '',
    userType: 'subscriber',
    phoneNumber: ''
  })
  const [loading, setLoading] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!acceptedTerms) {
      toast.error('You must accept the terms and policies')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        formData
      )

      // Store tokens
      localStorage.setItem('accessToken', response.data.accessToken)
      localStorage.setItem('refreshToken', response.data.refreshToken)
      localStorage.setItem('userId', response.data.user.id)

      toast.success('Registration successful! Proceeding to age verification...')

      // Redirect to age verification
      router.push('/verify-age')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-grid">
          <aside className="auth-aside">
            <span className="auth-badge">
              18+ Protected Access
            </span>
            <h1 className="auth-title">Create Your Account</h1>
            <p className="auth-copy">
              Complete registration to continue with age verification and secure access. Creators can onboard for KYC and subscription setup after signup.
            </p>

            <div className="auth-points">
              <div className="auth-point">Compliance-first onboarding</div>
              <div className="auth-point">Subscriber and creator account types</div>
              <div className="auth-point">Policy acceptance required</div>
            </div>

            <p className="auth-signin-row">
              Already have an account?{' '}
              <Link href="/login" className="auth-link">
                Sign in
              </Link>
            </p>
          </aside>

          <section className="auth-form-panel">
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-row auth-row-2">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="auth-input"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="auth-input"
                  required
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="auth-input"
                required
              />

              <div className="auth-row auth-row-2">
                <input
                  type="text"
                  name="cpf"
                  placeholder="CPF (11 digits)"
                  value={formData.cpf}
                  onChange={handleChange}
                  className="auth-input"
                  required
                />

                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number (optional)"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>

              <input
                type="password"
                name="password"
                placeholder="Password (min 12 chars with strong complexity)"
                value={formData.password}
                onChange={handleChange}
                className="auth-input"
                required
              />

              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="auth-input auth-select"
              >
                <option value="subscriber">Subscriber (View Content)</option>
                <option value="creator">Creator (Upload Content)</option>
              </select>

              <label htmlFor="terms" className="auth-terms">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="auth-checkbox"
                />
                <span>
                  I confirm I am 18+, accept the Terms of Use, Privacy Policy, and Adult Content Policy. I understand this is a closed platform for consensual adult content only.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="auth-submit"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  )
}
