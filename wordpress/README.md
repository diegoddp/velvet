# Separate WordPress Build

This folder contains a standalone WordPress version of the site.
The existing Next.js build is untouched.

## Local run

1. Create env file:
   - Copy `.env.example` to `.env`
2. Start WordPress:
   - `docker compose up -d`
3. Open:
   - `http://localhost:8090`
4. In WordPress admin:
   - Go to Appearance > Themes
   - Activate `Velvet Theme`
   - Go to Settings > Reading and set homepage to `A static page` with a page using template `Front Page`

## Theme location

- Theme: `wp-content/themes/velvet-theme`
- Main template: `wp-content/themes/velvet-theme/front-page.php`

## Images

Put images under:
- `wp-content/themes/velvet-theme/assets/images`

Current hero image expected by theme:
- `wp-content/themes/velvet-theme/assets/images/hero-main.png`

## Hostinger migration path

1. Export local DB from container (or use WordPress export for content).
2. Upload `velvet-theme` to Hostinger `wp-content/themes`.
3. Create/import MySQL DB in Hostinger.
4. Update `wp-config.php` DB credentials in Hostinger.
5. Activate theme in wp-admin.
