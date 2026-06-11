'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const featuredCreators = [
  {
    name: 'Luna Morais',
    verified: true,
    category: 'Sensualidade',
    preview: '/placeholders/Designer%20(6).png'
  },
  {
    name: 'Ayla Matos',
    verified: true,
    category: 'Fitness',
    preview: '/placeholders/Designer%20(7).png'
  },
  {
    name: 'Valentina Alves',
    verified: true,
    category: 'Lifestyle',
    preview: '/placeholders/Designer%20(8).png'
  },
  {
    name: 'Mika Monroe',
    verified: true,
    category: 'Fetiche',
    preview: '/placeholders/Designer%20(9).png'
  },
  {
    name: 'Gia Martins',
    verified: true,
    category: 'Alternativo',
    preview: '/placeholders/Designer%20(10).png'
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
  const [parallaxY, setParallaxY] = useState(0);
  const heroImage = '/placeholders/hero-main.png';

  useEffect(() => {
    const onScroll = () => {
      const offset = Math.min(90, window.scrollY * 0.2);
      setParallaxY(offset);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <main className="velvet-shell">
      <div className="velvet-container">
        <section className="velvet-hero rise delay-1">
          <div className="velvet-mobile-promo" aria-hidden="true">
            <div className="velvet-mobile-hero-brandblock">
                 <p className="velvet-mobile-hero-tagline">Onde a imaginação encontra o prazer.</p>
            </div>
            <img src={heroImage} alt="" className="velvet-mobile-promo-image" />
            <div className="velvet-mobile-promo-overlay" />
            <div className="velvet-mobile-promo-content">
              <div className="velvet-mobile-hero-actions">
                <Link href="/register" className="velvet-btn velvet-btn-main">
                  Criar perfil
                </Link>
                <Link href="/login" className="velvet-btn velvet-btn-ghost">
                  Entrar
                </Link>
              </div>
              <p className="velvet-mobile-hero-note">* Plataforma exclusiva para maiores de 18 anos.</p>
            </div>
          </div>

          <div className="velvet-hero-media" aria-hidden="true">
            <img
              src={heroImage}
              alt=""
              className="velvet-hero-media-img"
              style={{ '--parallax-y': `${parallaxY}px` } as React.CSSProperties}
            />
            <div className="velvet-hero-media-overlay" />
          </div>

          <div className="velvet-copy-col">
            <h1 className="velvet-title">
              onde a imaginação
              <br />
              <span>encontra</span>
              <br />
              o prazer
            </h1>
          </div>

          <aside className="velvet-register-card">
            <div className="velvet-register-brand">
              <span className="velvet-logo-mark">V</span>
              <span className="velvet-register-brand-text">ELVET</span>
            </div>
            <button type="button" className="velvet-register-social">Continuar com Google</button>
            <div className="velvet-register-divider"><span>ou</span></div>
            <p className="velvet-register-message">Registre-se para acompanhar criadoras verificadas e conteudo exclusivo.</p>
            <form className="velvet-register-form">
              <input type="text" placeholder="Nome de usuario" className="velvet-register-input" />
              <input type="password" placeholder="Senha" className="velvet-register-input" />
              <input type="email" placeholder="Email" className="velvet-register-input" />
              <div className="velvet-register-row">
                <input type="text" placeholder="Cidade" className="velvet-register-input" />
                <input type="text" placeholder="Estado" className="velvet-register-input" />
              </div>
              <div className="velvet-register-row velvet-register-date-row">
                <input type="text" placeholder="DD" className="velvet-register-input" />
                <input type="text" placeholder="MM" className="velvet-register-input" />
                <input type="text" placeholder="AAAA" className="velvet-register-input" />
              </div>
              <label className="velvet-register-check">
                <input type="checkbox" />
                <span>Confirmo que sou maior de 18 anos e aceito os Termos e Politica de Privacidade.</span>
              </label>
              <button type="button" className="velvet-btn velvet-btn-main velvet-register-submit">Criar conta →</button>
            </form>
          </aside>

          <div className="velvet-scroll-indicator" aria-hidden="true">
            <div className="velvet-scroll-mouse">
              <span className="velvet-scroll-wheel" />
            </div>
            <div className="velvet-scroll-arrows">
              <span>⌄</span>
              <span>⌄</span>
            </div>
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
            <a href="#">Ver todas <span aria-hidden="true">›</span></a>
          </div>

          <div className="velvet-cards-grid">
            {featuredCreators.map((creator) => (
              <article key={creator.name} className="velvet-creator-card">
                <img src={creator.preview} alt={`${creator.name} destaque`} className="velvet-preview-img" />
                <div className="velvet-preview-overlay" />
                <div className="velvet-card-footer">
                  <div>
                    <strong>{creator.name}</strong>
                    <p className="velvet-followers">
                      <span className="velvet-meta-dot" aria-hidden="true">●</span>
                      {creator.category}
                    </p>
                  </div>
                  <span className="velvet-verified-pill">{creator.verified ? 'Verificada' : 'Perfil'}</span>
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
            <span>ELVET</span>
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
