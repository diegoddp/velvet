'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [content, setContent] = useState<any[]>([])
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    const userType = localStorage.getItem('userType')
    const demoMode = localStorage.getItem('demoMode') === 'true'

    if (!accessToken) {
      router.push('/login')
      return
    }

    if (demoMode || accessToken === 'demo-access-token') {
      setUser({
        id: 'demo-user',
        firstName: 'Demo',
        lastName: 'Tester',
        userType: 'SUBSCRIBER',
        creatorProfile: null
      })
      setSubscriptions([
        {
          id: 'sub-demo-1',
          renewalDate: new Date().toISOString(),
          tier: { name: 'Premium Creator Pack', price: 39.9 }
        }
      ])
      setContent([
        {
          id: 'content-demo-1',
          title: 'Beach Photoset',
          creator: { username: 'LunaRio' },
          accessType: 'PAID',
          price: 12.9,
          thumbnail: '/placeholders/content-preview.svg'
        },
        {
          id: 'content-demo-2',
          title: 'Private Livestream Replay',
          creator: { username: 'NeoCreator' },
          accessType: 'SUBSCRIPTION',
          price: null,
          thumbnail: '/placeholders/content-preview.svg'
        },
        {
          id: 'content-demo-3',
          title: 'Behind the Scenes',
          creator: { username: 'MayaStudio' },
          accessType: 'FREE',
          price: null,
          thumbnail: '/placeholders/content-preview.svg'
        }
      ])
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        // Get user profile
        const userResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )
        setUser(userResponse.data)

        // Get content
        const contentResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/content/search?limit=20`
        )
        setContent(contentResponse.data.content)

        // Get subscriptions if subscriber
        if (userType === 'SUBSCRIBER') {
          const subResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/my-subscriptions`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          )
          setSubscriptions(subResponse.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return (
      <div className="center-wrap">
        <div className="panel panel-sm">
          <p className="muted">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <div className="panel" style={{ margin: '0 auto' }}>
        <header className="topbar">
          <h1 className="topbar-brand">Admire</h1>
          <div className="actions-row">
            <span className="muted">{user?.firstName || 'User'}</span>
            <button
              onClick={() => {
                localStorage.clear()
                router.push('/login')
              }}
              className="button-danger"
            >
              Logout
            </button>
          </div>
        </header>

      <main>
        {/* Creator View */}
        {user?.userType === 'CREATOR' && (
          <div style={{ marginBottom: '1rem' }}>
            <div className="content-card">
              <h2 className="section-title" style={{ fontSize: '2rem' }}>Creator Dashboard</h2>
              <div className="kpi-grid" style={{ marginTop: '0.8rem' }}>
                <div className="kpi-card">
                  <p className="kpi-label">Followers</p>
                  <p className="kpi-value">{user?.creatorProfile?.followerCount || 0}</p>
                </div>
                <div className="kpi-card">
                  <p className="kpi-label">Content</p>
                  <p className="kpi-value">{user?.creatorProfile?.contentCount || 0}</p>
                </div>
                <div className="kpi-card">
                  <p className="kpi-label">Earnings</p>
                  <p className="kpi-value">R$ {user?.creatorProfile?.totalEarnings || 0}</p>
                </div>
                <div className="kpi-card">
                  <p className="kpi-label">Rating</p>
                  <p className="kpi-value">{user?.creatorProfile?.averageRating || 0}★</p>
                </div>
              </div>

              <div className="actions-row" style={{ marginTop: '0.8rem' }}>
                <Link
                  href="/creator/kyc"
                  className="button-primary"
                >
                  Complete KYC
                </Link>
                <Link
                  href="/creator/upload"
                  className="button-secondary"
                >
                  Upload Content
                </Link>
                <Link
                  href="/creator/tiers"
                  className="button-secondary"
                >
                  Manage Tiers
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Subscriber View */}
        {user?.userType === 'SUBSCRIBER' && (
          <div style={{ marginBottom: '1rem' }}>
            <h2 className="section-title" style={{ fontSize: '2rem' }}>Your Subscriptions</h2>
            <div className="cards-grid" style={{ marginTop: '0.8rem' }}>
              {subscriptions.map((sub) => (
                <div key={sub.id} className="content-card">
                  <div>
                    <h3 className="font-bold">{sub.tier.name}</h3>
                    <p className="muted" style={{ marginTop: '0.2rem' }}>R$ {sub.tier.price}/month</p>
                    <p className="muted" style={{ fontSize: '0.82rem' }}>
                      Renews: {new Date(sub.renewalDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Feed */}
        <div>
          <h2 className="section-title" style={{ fontSize: '2rem' }}>
            {user?.userType === 'CREATOR' ? 'Your Content' : 'Browse Content'}
          </h2>
          <div className="cards-grid" style={{ marginTop: '0.8rem' }}>
            {content.map((item) => (
              <div key={item.id} className="content-card">
                {item.thumbnail && (
                  <div>
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="thumb"
                    />
                  </div>
                )}
                <div style={{ marginTop: '0.5rem' }}>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="muted">{item.creator?.username || 'Creator'}</p>
                  {item.accessType === 'PAID' && (
                    <p style={{ color: 'var(--accent)', fontWeight: 700, marginTop: '0.4rem' }}>R$ {item.price}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      </div>
    </div>
  )
}
