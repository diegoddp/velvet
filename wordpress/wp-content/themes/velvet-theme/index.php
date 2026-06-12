<?php
if (!defined('ABSPATH')) {
    exit;
}

get_header();
?>
<main class="velvet-shell">
    <div class="velvet-container">
        <section class="velvet-simple-panel">
            <h1><?php bloginfo('name'); ?></h1>
            <p><?php bloginfo('description'); ?></p>
            <p>This is the fallback template. Use the Front Page template for the main landing page.</p>
        </section>
    </div>
</main>
<?php
get_footer();
