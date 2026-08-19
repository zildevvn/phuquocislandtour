<?php
/**
 * Template Name: Homepage
 * Front Page Template
 */

get_header();
?>
<main id="primary" class="site-main">
    <?php get_template_part('template-parts/home/hero-section'); ?>
    <?php get_template_part('template-parts/home/counters-section'); ?>
    <?php get_template_part('template-parts/home/about-section'); ?>
    <?php get_template_part('template-parts/shared/map-section'); ?>
    <?php get_template_part('template-parts/home/daily-tours-section'); ?>
    <?php get_template_part('template-parts/home/package-tours-section'); ?>
    <?php get_template_part('template-parts/home/car-tours-section'); ?>
    <?php get_template_part('template-parts/home/services-section'); ?>
    <?php get_template_part('template-parts/home/steps-booking-section'); ?>
    <?php get_template_part('template-parts/home/testimonials-section'); ?>
    <?php get_template_part('template-parts/home/faqs-section'); ?>
    <?php get_template_part('template-parts/home/posts-section'); ?>
</main>
<?php
get_footer();