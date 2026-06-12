<?php

if (!defined('ABSPATH')) {
    exit;
}

function velvet_theme_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
}
add_action('after_setup_theme', 'velvet_theme_setup');

function velvet_enqueue_assets() {
    wp_enqueue_style('velvet-theme-style', get_stylesheet_uri(), array(), '1.0.0');
}
add_action('wp_enqueue_scripts', 'velvet_enqueue_assets');
