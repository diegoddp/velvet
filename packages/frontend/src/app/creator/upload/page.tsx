'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function UploadContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mediaUrl: '',
    thumbnail: '',
    type: 'PHOTO',
    accessType: 'SUBSCRIPTION',
    price: 0,
    requiredTierId: '',
    consentFormUrl: '/templates/consent-form-pt-br.pdf'
  })
  const [acceptedConsent, setAcceptedConsent] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    // In production, upload to S3
    // For demo, use base64
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

    if (!acceptedConsent) {
      toast.error('You must accept the consent form declaration')
      return
    }

    setLoading(true)

    try {
      const accessToken = localStorage.getItem('accessToken')

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/content/upload`,
        {
          ...formData,
          price: formData.accessType === 'PAID' ? parseFloat(formData.price as any) : 0,
          creatorDeclaresLegality: true
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      )

      toast.success('Content uploaded! Pending moderation review.')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell">
      <div className="panel panel-md" style={{ margin: '0 auto' }}>
        <h1 className="section-title">Upload Content</h1>

        <form onSubmit={handleSubmit} className="stack" style={{ marginTop: '1rem' }}>
          <div>
            <label className="field-label">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="field"
              required
            />
          </div>

          <div>
            <label className="field-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="field"
            />
          </div>

          <div className="row-2">
            <div>
              <label className="field-label">Content Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="field"
              >
                <option value="PHOTO">Photo</option>
                <option value="VIDEO">Video</option>
              </select>
            </div>

            <div>
              <label className="field-label">Access Type</label>
              <select
                name="accessType"
                value={formData.accessType}
                onChange={handleChange}
                className="field"
              >
                <option value="FREE">Free</option>
                <option value="SUBSCRIPTION">Subscription Only</option>
                <option value="PAID">Paid (One-time)</option>
              </select>
            </div>
          </div>

          {formData.accessType === 'PAID' && (
            <div>
              <label className="field-label">Price (R$)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="1"
                max="1000"
                step="0.01"
                className="field"
              />
            </div>
          )}

          <div>
            <label className="field-label">Upload Media</label>
            <input
              type="file"
              accept={formData.type === 'PHOTO' ? 'image/*' : 'video/*'}
              onChange={(e) => handleFileUpload(e, 'mediaUrl')}
              className="field"
              required
            />
          </div>

          <div className="note note-danger">
            <h3 style={{ margin: 0 }}>Content Moderation & Consent</h3>
            <p style={{ marginTop: '0.5rem' }}>
              All content is automatically scanned for illegal material and potential minor involvement. You declare that:
            </p>
            <ul style={{ marginTop: '0.5rem', marginBottom: '0.8rem', paddingLeft: '1rem', lineHeight: 1.6 }}>
              <li>No minors appear in this content</li>
              <li>All models are 18+ with documented consent</li>
              <li>Content does not violate Brazilian law</li>
              <li>Content is consensual adult content only</li>
              <li>You have the right to distribute this content</li>
            </ul>
            <label style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.6rem', alignItems: 'start' }}>
              <input
                type="checkbox"
                checked={acceptedConsent}
                onChange={(e) => setAcceptedConsent(e.target.checked)}
              />
              <span>
                I declare all the above is true and accept responsibility for this content
              </span>
            </label>
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
              disabled={loading || !acceptedConsent}
              className="button-primary"
              style={{ flex: 1 }}
            >
              {loading ? 'Uploading...' : 'Upload Content'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
