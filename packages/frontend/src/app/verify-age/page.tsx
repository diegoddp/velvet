'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function AgeVerification() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState('')

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId')
    const token = localStorage.getItem('accessToken')

    if (!storedUserId || !token) {
      router.push('/register')
    }
    setUserId(storedUserId || '')
  }, [router])

  const handlePersonaVerification = async () => {
    setLoading(true)
    try {
      const accessToken = localStorage.getItem('accessToken')
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/request-age-verification`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      )

      // Redirect to Persona verification
      window.location.href = response.data.redirectUrl
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to start verification')
    } finally {
      setLoading(false)
    }
  }

  const handleManualVerification = async () => {
    setLoading(true)
    try {
      const accessToken = localStorage.getItem('accessToken')
      
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-age`,
        {
          verificationMethod: 'id_selfie',
          providerId: 'persona'
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      )

      toast.success('Age verification completed!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="center-wrap">
      <div className="panel panel-sm">
        <h1 className="section-title">Age Verification Required</h1>

        {step === 1 && (
          <div className="stack" style={{ marginTop: '1rem' }}>
            <p className="section-subtitle">
              Per Brazil's Digital ECA (Lei 15.211/2025), we require robust age verification. This is not a simple confirmation—you must provide valid identification.
            </p>

            <div className="note note-danger">
              <p>
                We take child protection seriously. Providing false information violates Brazilian law.
              </p>
            </div>

            <button
              onClick={() => setStep(2)}
              className="button-primary"
              style={{ width: '100%' }}
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="stack" style={{ marginTop: '1rem' }}>
            <p className="section-subtitle">Choose your verification method:</p>

            <button
              onClick={handlePersonaVerification}
              disabled={loading}
              className="button-primary"
              style={{ width: '100%' }}
            >
              {loading ? 'Loading...' : 'Verify with ID Document'}
            </button>

            <p className="muted" style={{ textAlign: 'center' }}>or</p>

            <button
              onClick={handleManualVerification}
              disabled={loading}
              className="button-secondary"
              style={{ width: '100%' }}
            >
              Complete Verification
            </button>

            <button
              onClick={() => setStep(1)}
              className="button-secondary"
              style={{ width: '100%' }}
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
