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
    <?php get_template_part('template-parts/home/services-section'); ?>
    <?php get_template_part('template-parts/home/map-section'); ?>
    <?php get_template_part('template-parts/home/steps-booking-section'); ?>
    <?php get_template_part('template-parts/home/daily-tours-section'); ?>
</main>
<?php
get_footer();