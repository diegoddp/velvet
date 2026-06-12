'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ── mock data ─────────────────────────────────────────────── */
const creator = {
  name: 'Isabela Rossi',
  handle: '@isabela',
  avatar: '/placeholders/Designer%20(6).png',
  verified: true,
  balance: 12450.0,
  notifications: 2,
};

const kpis = [
  {
    label: 'Receita do mês',
    value: 'R$ 1.250,00',
    delta: '+13,7%',
    up: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    color: 'accent',
    sparkline: [40, 55, 45, 70, 60, 80, 95, 78, 90, 110, 125],
  },
  {
    label: 'Assinantes ativos',
    value: '25',
    delta: '+33,5%',
    up: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    color: 'purple',
    sparkline: [10, 11, 12, 14, 14, 16, 18, 19, 22, 24, 25],
  },
  {
    label: 'Conteúdo vendido',
    value: '43',
    delta: 'Unlocks',
    up: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    color: 'teal',
    sparkline: [5, 8, 6, 12, 10, 15, 18, 20, 25, 38, 43],
  },
  {
    label: 'Mensagens pendentes',
    value: '2',
    delta: 'Mensagens',
    up: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    color: 'orange',
    sparkline: [1, 0, 2, 1, 3, 0, 1, 2, 0, 1, 2],
  },
];

const recentPosts = [
  {
    id: '1',
    title: 'Coleção de inverno — ensaio',
    type: 'Foto',
    date: '22 jun • 2023',
    views: 1839,
    unlocks: 13,
    likes: 136,
    revenue: 'R$ 150,00',
    thumb: '/placeholders/Designer%20(7).png',
  },
  {
    id: '2',
    title: 'Professora — ato dois',
    type: 'Vídeo',
    date: '20 jun • 2023',
    views: 359,
    unlocks: 6,
    likes: 125,
    revenue: 'R$ 150,00',
    thumb: '/placeholders/Designer%20(8).png',
  },
  {
    id: '3',
    title: 'Valentina Alves con prazer',
    type: 'Foto',
    date: '18 jun • 2023',
    views: 233,
    unlocks: 2,
    likes: 125,
    revenue: 'R$ 150,00',
    thumb: '/placeholders/Designer%20(9).png',
  },
  {
    id: '4',
    title: 'Live Replay — 21/06',
    type: 'Vídeo',
    date: '21 jun • 2023',
    views: 621,
    unlocks: 8,
    likes: 88,
    revenue: 'R$ 80,00',
    thumb: '/placeholders/Designer%20(10).png',
  },
];

const topContent = [
  { rank: 1, title: 'Coleção de inverno — ensaio', revenue: 'R$ 150,00', unlocks: 13 },
  { rank: 2, title: 'Live Replay — 21/06', revenue: 'R$ 80,00', unlocks: 8 },
  { rank: 3, title: 'Professora — ato dois', revenue: 'R$ 150,00', unlocks: 6 },
];

const schedule = [
  { date: '22 set', time: '10:00', label: 'Agenda de Conteúdo' },
  { date: '23 set', time: '11:00', label: 'Evento de Conteúdo' },
  { date: '21 set', time: '11:00', label: 'Agenda de Conteúdo' },
];

const navItems = [
  {
    label: 'Visão Geral',
    href: '/creator/dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Conteúdo',
    href: '/creator/upload',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    label: 'Mensagens',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    badge: 2,
  },
  {
    label: 'Assinantes',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: 'Ganhos',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    label: 'Analytics',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    label: 'Configurações',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

/* ── Sparkline SVG ─────────────────────────────────────────── */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(' ');

  const colorMap: Record<string, string> = {
    accent: '#ff4d93',
    purple: '#a855f7',
    teal: '#2dd4bf',
    orange: '#fb923c',
  };
  const stroke = colorMap[color] ?? '#ff4d93';

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="vcd-sparkline" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

/* ── Bar chart (ganhos por mês) ────────────────────────────── */
const ganhosMes = [820, 950, 780, 1100, 1300, 1250];
const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];

function BarChart() {
  const max = Math.max(...ganhosMes);
  return (
    <div className="vcd-bar-chart">
      {ganhosMes.map((v, i) => (
        <div key={i} className="vcd-bar-col">
          <div
            className={`vcd-bar${i === ganhosMes.length - 1 ? ' vcd-bar--active' : ''}`}
            style={{ height: `${(v / max) * 100}%` }}
          />
          <span className="vcd-bar-label">{meses[i]}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Subscriber growth line ────────────────────────────────── */
const assinantesData = [8, 10, 10, 12, 13, 14, 15, 17, 19, 22, 24, 25];

function LineChart() {
  const max = Math.max(...assinantesData);
  const min = Math.min(...assinantesData);
  const range = max - min || 1;
  const w = 100;
  const h = 60;
  const pts = assinantesData
    .map((v, i) => {
      const x = (i / (assinantesData.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(' ');

  const fillPts = `0,${h} ` + pts + ` ${w},${h}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="vcd-line-chart" preserveAspectRatio="none">
      <defs>
        <linearGradient id="lgLine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon fill="url(#lgLine)" points={fillPts} />
      <polyline
        fill="none"
        stroke="#a855f7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
      />
    </svg>
  );
}

/* ── Main component ────────────────────────────────────────── */
export default function CreatorDashboard() {
  const [activeNav, setActiveNav] = useState('Visão Geral');
  const [contentFilter, setContentFilter] = useState<'todos' | 'foto' | 'video'>('todos');

  const filtered = recentPosts.filter((p) => {
    if (contentFilter === 'todos') return true;
    if (contentFilter === 'foto') return p.type === 'Foto';
    return p.type === 'Vídeo';
  });

  return (
    <div className="vcd-shell">
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className="vcd-sidebar">
        <div className="vcd-sidebar-brand">
          <Link href="/" className="vcd-logo">
            <span className="vcd-logo-mark">V</span>
            <span>ELVET</span>
          </Link>
        </div>

        <div className="vcd-sidebar-profile">
          <div className="vcd-avatar-wrap">
            <img src={creator.avatar} alt={creator.name} className="vcd-avatar" />
            {creator.verified && <span className="vcd-verified-dot" aria-label="Verificada" />}
          </div>
          <div className="vcd-profile-text">
            <span className="vcd-profile-name">{creator.name}</span>
            <span className="vcd-profile-handle">{creator.handle}</span>
          </div>
        </div>

        <nav className="vcd-nav">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`vcd-nav-item${activeNav === item.label ? ' is-active' : ''}`}
              onClick={() => setActiveNav(item.label)}
            >
              <span className="vcd-nav-icon">{item.icon}</span>
              <span className="vcd-nav-label">{item.label}</span>
              {item.badge ? <span className="vcd-nav-badge">{item.badge}</span> : null}
            </Link>
          ))}
        </nav>

        <div className="vcd-sidebar-footer">
          <Link href="/login" className="vcd-signout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="vcd-signout-icon">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sair
          </Link>
        </div>
      </aside>

      {/* ── Main area ───────────────────────────────────────── */}
      <div className="vcd-main">

        {/* Header */}
        <header className="vcd-header">
          <div className="vcd-header-title">
            <h1 className="vcd-page-title">Visão Geral</h1>
            <span className="vcd-page-sub">— {creator.name}</span>
          </div>

          <div className="vcd-header-actions">
            <button className="vcd-notif-btn" aria-label="Notificações">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {creator.notifications > 0 && (
                <span className="vcd-notif-badge">{creator.notifications}</span>
              )}
              <span className="vcd-notif-label">Notificações</span>
            </button>

            <div className="vcd-balance">
              <span className="vcd-balance-label">Seu Saldo</span>
              <span className="vcd-balance-value">
                R$ {creator.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <Link href="/creator/upload" className="vcd-btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Novo post
            </Link>
          </div>
        </header>

        {/* Scrollable body */}
        <div className="vcd-body">

          {/* KPI row */}
          <div className="vcd-kpi-row">
            {kpis.map((kpi) => (
              <div key={kpi.label} className={`vcd-kpi-card vcd-kpi--${kpi.color}`}>
                <div className="vcd-kpi-top">
                  <span className="vcd-kpi-icon">{kpi.icon}</span>
                  <div className={`vcd-kpi-delta${kpi.up ? ' is-up' : ' is-neutral'}`}>
                    {kpi.up && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="18 15 12 9 6 15" />
                      </svg>
                    )}
                    {kpi.delta}
                  </div>
                </div>
                <div className="vcd-kpi-value">{kpi.value}</div>
                <div className="vcd-kpi-label">{kpi.label}</div>
                <Sparkline data={kpi.sparkline} color={kpi.color} />
              </div>
            ))}
          </div>

          {/* Two-column layout */}
          <div className="vcd-grid-main">

            {/* ── Left: posts + charts ──────────────────────── */}
            <div className="vcd-col-main">

              {/* Recent posts */}
              <div className="vcd-section-card">
                <div className="vcd-section-head">
                  <h2 className="vcd-section-title">Desempenho dos posts recentes</h2>
                  <div className="vcd-tabs">
                    {(['todos', 'foto', 'video'] as const).map((f) => (
                      <button
                        key={f}
                        className={`vcd-tab${contentFilter === f ? ' is-active' : ''}`}
                        onClick={() => setContentFilter(f)}
                      >
                        {f === 'todos' ? 'Posts' : f === 'foto' ? 'Fotos' : 'Vídeos'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="vcd-posts-header">
                  <span>Posts</span>
                  <span>Views</span>
                  <span>Unlocks</span>
                  <span>Likes</span>
                  <span>Receita</span>
                </div>

                <div className="vcd-posts-list">
                  {filtered.map((post) => (
                    <div key={post.id} className="vcd-post-row">
                      <div className="vcd-post-info">
                        <div className="vcd-post-thumb">
                          <div
                            className="vcd-post-thumb-img"
                            style={{ backgroundImage: `url("${post.thumb}")` }}
                          />
                        </div>
                        <div className="vcd-post-meta">
                          <span className="vcd-post-title">{post.title}</span>
                          <span className="vcd-post-date">{post.date}</span>
                        </div>
                        <span className={`vcd-type-badge vcd-type--${post.type === 'Vídeo' ? 'video' : 'foto'}`}>
                          {post.type}
                        </span>
                      </div>
                      <span className="vcd-post-stat">{post.views.toLocaleString('pt-BR')}</span>
                      <span className="vcd-post-stat">{post.unlocks}</span>
                      <span className="vcd-post-stat">{post.likes}</span>
                      <span className="vcd-post-stat vcd-post-revenue">{post.revenue}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Charts row */}
              <div className="vcd-charts-row">
                {/* Ganhos */}
                <div className="vcd-section-card">
                  <div className="vcd-section-head">
                    <h2 className="vcd-section-title">Ganhos</h2>
                    <span className="vcd-chart-period">Últimos 6 meses</span>
                  </div>
                  <div className="vcd-chart-value">R$ 6.200,00</div>
                  <BarChart />
                </div>

                {/* Crescimento */}
                <div className="vcd-section-card">
                  <div className="vcd-section-head">
                    <h2 className="vcd-section-title">Crescimento de Assinantes</h2>
                    <div className="vcd-period-tabs">
                      {['1d', '1s', '1m', '6m', '1a'].map((p) => (
                        <button key={p} className={`vcd-period-btn${p === '1m' ? ' is-active' : ''}`}>{p}</button>
                      ))}
                    </div>
                  </div>
                  <div className="vcd-chart-value">25 <span className="vcd-chart-sub">assinantes</span></div>
                  <LineChart />
                </div>
              </div>

              {/* Top content ranking */}
              <div className="vcd-section-card">
                <div className="vcd-section-head">
                  <h2 className="vcd-section-title">Conteúdo com melhor performance</h2>
                </div>
                <div className="vcd-ranking">
                  {topContent.map((item) => (
                    <div key={item.rank} className="vcd-rank-row">
                      <span className={`vcd-rank-num${item.rank === 1 ? ' vcd-rank--gold' : ''}`}>
                        #{item.rank}
                      </span>
                      <span className="vcd-rank-title">{item.title}</span>
                      <span className="vcd-rank-unlocks">{item.unlocks} unlocks</span>
                      <span className="vcd-rank-revenue">{item.revenue}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right: sidebar widgets ────────────────────── */}
            <div className="vcd-col-side">

              {/* Ações rápidas */}
              <div className="vcd-section-card">
                <h2 className="vcd-section-title vcd-section-title--sm">Ações Rápidas</h2>
                <div className="vcd-quick-actions">
                  <button className="vcd-quick-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    Enviar mensagem em massa
                  </button>
                  <button className="vcd-quick-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polygon points="10 8 16 12 10 16 10 8" />
                    </svg>
                    Planejar Live
                  </button>
                </div>
              </div>

              {/* Avisos */}
              <div className="vcd-section-card">
                <h2 className="vcd-section-title vcd-section-title--sm">Avisos Importantes</h2>
                <div className="vcd-alerts">
                  <div className="vcd-alert vcd-alert--warn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <div>
                      <strong>Nova verificação de idade pendente</strong>
                      <p>Nova verificação de idade pendente</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agenda */}
              <div className="vcd-section-card">
                <div className="vcd-section-head">
                  <h2 className="vcd-section-title vcd-section-title--sm">Agenda de Conteúdo</h2>
                  <button className="vcd-text-btn">+ Novo</button>
                </div>
                <div className="vcd-schedule">
                  {schedule.map((s, i) => (
                    <div key={i} className="vcd-schedule-row">
                      <div className="vcd-schedule-date">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {s.date} · {s.time}
                      </div>
                      <span className="vcd-schedule-label">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metas do mês */}
              <div className="vcd-section-card">
                <h2 className="vcd-section-title vcd-section-title--sm">Metas de Junho</h2>
                <div className="vcd-goals">
                  <div className="vcd-goal">
                    <div className="vcd-goal-row">
                      <span>Receita</span>
                      <span>R$ 1.250 / R$ 2.000</span>
                    </div>
                    <div className="vcd-progress-bar">
                      <div className="vcd-progress-fill vcd-progress--accent" style={{ width: '62%' }} />
                    </div>
                  </div>
                  <div className="vcd-goal">
                    <div className="vcd-goal-row">
                      <span>Assinantes</span>
                      <span>25 / 40</span>
                    </div>
                    <div className="vcd-progress-bar">
                      <div className="vcd-progress-fill vcd-progress--purple" style={{ width: '62%' }} />
                    </div>
                  </div>
                  <div className="vcd-goal">
                    <div className="vcd-goal-row">
                      <span>Posts publicados</span>
                      <span>4 / 8</span>
                    </div>
                    <div className="vcd-progress-bar">
                      <div className="vcd-progress-fill vcd-progress--teal" style={{ width: '50%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
