'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function CreatorKYC() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    idDocumentUrl: '',
    selfieUrl: ''
  })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData({
        ...formData,
        [field]: reader.result as string
      })
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.idDocumentUrl || !formData.selfieUrl) {
      toast.error('Both ID document and selfie are required')
      return
    }

    setLoading(true)

    try {
      const accessToken = localStorage.getItem('accessToken')

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/creators/kyc/submit`,
        {
          idDocumentUrl: formData.idDocumentUrl,
          selfieUrl: formData.selfieUrl
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      )

      toast.success('KYC submitted for review!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'KYC submission failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell">
      <div className="panel panel-md" style={{ margin: '0 auto' }}>
        <h1 className="section-title">Creator Verification (KYC)</h1>
        <p className="section-subtitle" style={{ marginBottom: '1rem' }}>
          Brazil's Digital ECA requires full identity and age verification for all creators. This process is mandatory to monetize content.
        </p>

        <form onSubmit={handleSubmit} className="stack">
          <div className="content-card">
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Step 1: Government ID</h2>
            <p className="section-subtitle">Upload a clear photo of your government-issued ID (RG, CNH, or Passaporte)</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'idDocumentUrl')}
              className="field"
            />
            {formData.idDocumentUrl && (
              <div style={{ marginTop: '0.7rem' }}>
                <img
                  src={formData.idDocumentUrl}
                  alt="ID Document"
                  className="thumb"
                  style={{ maxWidth: '280px', height: 'auto' }}
                />
              </div>
            )}
          </div>

          <div className="content-card">
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Step 2: Selfie Verification</h2>
            <p className="section-subtitle">Take a clear selfie showing your face with the ID document</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'selfieUrl')}
              className="field"
            />
            {formData.selfieUrl && (
              <div style={{ marginTop: '0.7rem' }}>
                <img
                  src={formData.selfieUrl}
                  alt="Selfie"
                  className="thumb"
                  style={{ maxWidth: '280px', height: 'auto' }}
                />
              </div>
            )}
          </div>

          <div className="note note-warning">
            <h3 style={{ margin: 0 }}>LGPD & Compliance Notice</h3>
            <ul style={{ marginTop: '0.6rem', marginBottom: 0, paddingLeft: '1rem', lineHeight: 1.6 }}>
              <li>Your personal data is encrypted and securely stored</li>
              <li>You can request deletion of your data per LGPD Article 17</li>
              <li>This data is used only for age and identity verification</li>
              <li>Admin review typically takes 1-3 business days</li>
              <li>False information is a federal crime under Brazil's laws</li>
            </ul>
          </div>

          <div className="actions-row">
            <button
              type="button"
              onClick={() => router.back()}
              className="button-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.idDocumentUrl || !formData.selfieUrl}
              className="button-primary"
              style={{ flex: 1 }}
            >
              {loading ? 'Submitting...' : 'Submit KYC'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
