<?php
/*
Template Name: Front Page
*/

if (!defined('ABSPATH')) {
    exit;
}

get_header();
?>
<main class="velvet-shell">
    <div class="velvet-container">
        <header class="velvet-nav">
            <div class="velvet-logo">Velvet</div>
            <div class="velvet-search">Buscar criadoras ou conteudo</div>
            <nav class="velvet-links">
                <a href="#">Inicio</a>
                <a href="#">Explorar</a>
                <a href="#">Categorias</a>
                <a href="#">Sobre nos</a>
                <a href="#">Blog</a>
            </nav>
            <div class="velvet-cta-row">
                <a href="#" class="velvet-btn velvet-btn-ghost">Entrar</a>
                <a href="#" class="velvet-btn velvet-btn-main">Criar conta</a>
            </div>
        </header>

        <section class="velvet-hero">
            <div class="velvet-copy-col">
                <p class="velvet-kicker">Plataforma premium</p>
                <h1 class="velvet-title">Criadoras verificadas.<br>Conteudo 18+ sem limites.</h1>
                <p class="velvet-subtitle">Privacidade absoluta. Pagamentos seguros. Sua experiencia do seu jeito.</p>
                <div class="velvet-hero-actions">
                    <a href="#" class="velvet-btn velvet-btn-main">Explorar criadoras</a>
                    <a href="#" class="velvet-btn velvet-btn-ghost">Saiba mais sobre seguranca</a>
                </div>
            </div>
            <div class="velvet-hero-media">
                <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/hero-main.png'); ?>" alt="Hero" class="velvet-hero-media-img">
                <span class="velvet-hero-media-badge">18+ verificadas</span>
            </div>
        </section>

        <section class="velvet-featured">
            <div class="velvet-featured-header">
                <h2>Criadoras em destaque</h2>
                <a href="#">Ver todas</a>
            </div>
            <div class="velvet-cards-grid">
                <article class="velvet-creator-card">
                    <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/hero-main.png'); ?>" alt="Luna" class="velvet-preview-img">
                    <div class="velvet-preview-overlay"></div>
                    <div class="velvet-card-footer"><strong>Luna Morais</strong><span>Verificada</span></div>
                </article>
                <article class="velvet-creator-card">
                    <img src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&h=500&q=80" alt="Ayla" class="velvet-preview-img">
                    <div class="velvet-preview-overlay"></div>
                    <div class="velvet-card-footer"><strong>Ayla Matos</strong><span>Verificada</span></div>
                </article>
                <article class="velvet-creator-card">
                    <img src="https://images.unsplash.com/photo-1492288991661-058aa541ff43?auto=format&fit=crop&w=800&h=500&q=80" alt="Valentina" class="velvet-preview-img">
                    <div class="velvet-preview-overlay"></div>
                    <div class="velvet-card-footer"><strong>Valentina Alves</strong><span>Verificada</span></div>
                </article>
                <article class="velvet-creator-card">
                    <img src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&h=500&q=80" alt="Mika" class="velvet-preview-img">
                    <div class="velvet-preview-overlay"></div>
                    <div class="velvet-card-footer"><strong>Mika Monroe</strong><span>Verificada</span></div>
                </article>
                <article class="velvet-creator-card">
                    <img src="https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=800&h=500&q=80" alt="Gia" class="velvet-preview-img">
                    <div class="velvet-preview-overlay"></div>
                    <div class="velvet-card-footer"><strong>Gia Martins</strong><span>Verificada</span></div>
                </article>
            </div>
        </section>
    </div>
</main>
<?php
get_footer();
