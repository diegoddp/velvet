import Link from 'next/link';

const featuredCreators = [
  {
    name: 'Luna Morais',
    verified: true,
    followers: '152K',
    price: '39,90',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=320&h=320&q=80',
    preview: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&h=500&q=80'
  },
  {
    name: 'Aiko Martins',
    verified: true,
    followers: '98K',
    price: '34,90',
    avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=320&h=320&q=80',
    preview: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&h=500&q=80'
  },
  {
    name: 'Maya Santoro',
    verified: true,
    followers: '201K',
    price: '49,90',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&h=320&q=80',
    preview: 'https://images.unsplash.com/photo-1492288991661-058aa541ff43?auto=format&fit=crop&w=800&h=500&q=80'
  },
  {
    name: 'Nina Lisboa',
    verified: true,
    followers: '120K',
    price: '37,90',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=320&h=320&q=80',
    preview: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&h=500&q=80'
  },
  {
    name: 'Clara Rey',
    verified: true,
    followers: '175K',
    price: '44,90',
    avatar: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=320&h=320&q=80',
    preview: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=800&h=500&q=80'
  },
  {
    name: 'Bella Prado',
    verified: true,
    followers: '88K',
    price: '32,90',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=320&h=320&q=80',
    preview: 'https://images.unsplash.com/photo-1521577352947-9bb58764b69a?auto=format&fit=crop&w=800&h=500&q=80'
  }
];

const trustItems = [
  {
    title: 'Verificacao de idade',
    description: 'Processo seguro para garantir que todos sao maiores de 18 anos.',
    icon: 'id'
  },
  {
    title: 'Pagamentos seguros',
    description: 'Transacoes protegidas com criptografia e parceiros confiaveis.',
    icon: 'lock'
  },
  {
    title: 'Moderacao de conteudo',
    description: 'Equipe dedicada e tecnologia para manter a plataforma segura.',
    icon: 'shield'
  },
  {
    title: 'Privacidade em primeiro lugar',
    description: 'Seus dados e sua identidade estao sempre protegidos.',
    icon: 'eyeOff'
  }
];

function TrustIcon({ type }: { type: string }) {
  if (type === 'id') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="velvet-trust-icon-svg">
        <rect x="4" y="5" width="16" height="14" rx="2.5" />
        <circle cx="10" cy="11" r="2.3" />
        <path d="M7.5 15c0.9-1.4 2.1-2 3.5-2s2.6 0.6 3.5 2" />
      </svg>
    );
  }

  if (type === 'lock') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="velvet-trust-icon-svg">
        <rect x="6" y="10" width="12" height="9" rx="2" />
        <path d="M8.5 10V8.2a3.5 3.5 0 0 1 7 0V10" />
        <circle cx="12" cy="14.5" r="1.1" />
      </svg>
    );
  }

  if (type === 'shield') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="velvet-trust-icon-svg">
        <path d="M12 4.5 18 7v5.4c0 3.6-2.4 6.8-6 8.1-3.6-1.3-6-4.5-6-8.1V7l6-2.5Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="velvet-trust-icon-svg">
      <path d="M2.5 12c2.7-3.8 5.8-5.7 9.5-5.7S18.8 8.2 21.5 12c-2.7 3.8-5.8 5.7-9.5 5.7S5.2 15.8 2.5 12Z" />
      <circle cx="12" cy="12" r="2.2" />
      <path d="M4 20 20 4" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="velvet-shell">
      <div className="velvet-container">
        <header className="velvet-nav rise">
          <div className="velvet-logo">
            <span className="velvet-logo-mark">V</span>
            <span>VELVET</span>
          </div>
          <div className="velvet-search">
            <span className="velvet-search-icon" aria-hidden="true">⌕</span>
            <span>Buscar criadoras, temas, categorias...</span>
          </div>
          <nav className="velvet-links">
            <a href="#">Sobre</a>
            <a href="#">Recursos</a>
            <a href="#">Blog</a>
          </nav>
          <div className="velvet-nav-separator" aria-hidden="true" />
          <div className="velvet-cta-row">
            <Link href="/login" className="velvet-btn velvet-btn-ghost">
              <span className="velvet-btn-icon" aria-hidden="true">
                <svg viewBox="0 0 20 20" className="velvet-btn-icon-svg">
                  <path d="M10 2.5h4.5A2.5 2.5 0 0 1 17 5v10a2.5 2.5 0 0 1-2.5 2.5H10" />
                  <path d="M12 10H3" />
                  <path d="m6.5 6.5-3.5 3.5 3.5 3.5" />
                </svg>
              </span>
              Entrar
            </Link>
            <Link href="/register" className="velvet-btn velvet-btn-main">
              <span className="velvet-btn-icon" aria-hidden="true">
                <svg viewBox="0 0 20 20" className="velvet-btn-icon-svg">
                  <path d="M10 4v12" />
                  <path d="M4 10h12" />
                </svg>
              </span>
              Criar conta
            </Link>
          </div>
        </header>

        <section className="velvet-hero rise delay-1">
          <div className="velvet-copy-col">
            <h1 className="velvet-title">
              A rede premium
              <br />
              para criadoras
              <br />
              <span>verificadas 18+</span>
            </h1>
            <p className="velvet-subtitle">
              Conteudo exclusivo com seguranca e privacidade para criadoras e assinantes.
            </p>
            <div className="velvet-hero-actions">
              <Link href="/register" className="velvet-btn velvet-btn-main">
                <span className="velvet-btn-icon" aria-hidden="true">
                  <svg viewBox="0 0 20 20" className="velvet-btn-icon-svg">
                    <path d="M10 4v12" />
                    <path d="M4 10h12" />
                  </svg>
                </span>
                Criar perfil
              </Link>
              <Link href="/login" className="velvet-btn velvet-btn-ghost">
                <span className="velvet-btn-icon" aria-hidden="true">
                  <svg viewBox="0 0 20 20" className="velvet-btn-icon-svg">
                    <path d="M10 2.5h4.5A2.5 2.5 0 0 1 17 5v10a2.5 2.5 0 0 1-2.5 2.5H10" />
                    <path d="M12 10H3" />
                    <path d="m6.5 6.5-3.5 3.5 3.5 3.5" />
                  </svg>
                </span>
                Entrar
              </Link>
            </div>
            <p className="velvet-note">◌ Plataforma exclusiva para maiores de 18 anos.</p>
          </div>

          <div className="velvet-v-wrap" aria-hidden="true">
            <div className="velvet-v-glow" />
            <img src="/placeholders/hero-v.svg" alt="" className="velvet-v-image" />
          </div>

          <aside className="velvet-security-card">
            <div className="velvet-security-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="velvet-security-icon-svg">
                <path d="M12 4.5 18 7v5.4c0 3.6-2.4 6.8-6 8.1-3.6-1.3-6-4.5-6-8.1V7l6-2.5Z" />
              </svg>
            </div>
            <h3>Ambiente seguro</h3>
            <p>Verificacao 18+, pagamentos protegidos e protecao de conteudo.</p>
          </aside>
        </section>

        <section className="velvet-featured rise delay-2">
          <div className="velvet-featured-header">
            <h2>Criadoras em destaque</h2>
            <a href="#">Ver todas as criadoras <span aria-hidden="true">›</span></a>
          </div>

          <div className="velvet-cards-grid">
            {featuredCreators.map((creator) => (
              <article key={creator.name} className="velvet-creator-card">
                <div className="velvet-avatar-row">
                  <img src={creator.avatar} alt={`${creator.name} placeholder`} className="velvet-avatar" />
                  <div className="velvet-avatar-copy">
                    <strong>{creator.name}</strong>
                    <p className="velvet-verified">
                      <span className="velvet-meta-dot" aria-hidden="true">◉</span>
                      {creator.verified ? '18+ Verificada' : 'Perfil'}
                    </p>
                    <p className="velvet-followers">
                      <span className="velvet-heart-badge" aria-hidden="true">❤</span>
                      {creator.followers} seguidores
                    </p>
                  </div>
                  <button className="velvet-card-save" aria-label={`Salvar ${creator.name}`}>
                    ⌂
                  </button>
                </div>
                <div className="velvet-preview">
                  <img src={creator.preview} alt="Conteudo exclusivo placeholder" className="velvet-preview-img" />
                  <div className="velvet-preview-overlay">
                    <span className="velvet-lock" aria-hidden="true">⌂</span>
                    <span>Conteudo exclusivo</span>
                  </div>
                </div>
                <div className="velvet-card-footer">
                  <span className="velvet-price">
                    <strong>R$ {creator.price}</strong>
                    <em>/mês</em>
                  </span>
                  <button className="velvet-subscribe">Assinar</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="velvet-trust-bar rise delay-2">
          {trustItems.map((item) => (
            <div key={item.title} className="velvet-trust-item">
              <div className="velvet-trust-icon" aria-hidden="true">
                <TrustIcon type={item.icon} />
              </div>
              <div>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </section>

        <footer className="velvet-footer rise delay-2">
          <div className="velvet-logo">
            <span className="velvet-logo-mark">V</span>
            <span>VELVET</span>
          </div>
          <div className="velvet-footer-links">
            <a href="#">Termos de Uso</a>
            <a href="#">Politica de Privacidade</a>
            <a href="#">Politica de Conteudo</a>
            <a href="#">Suporte</a>
            <a href="#">Contato</a>
          </div>
        </footer>
      </div>
    </main>
  );
}
