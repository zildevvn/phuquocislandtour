<?php
/**
 * Template Name: Category Tours
 */
get_header();
?>
<main id="primary" class="site-main">
    <?php get_template_part('template-parts/category-tours/hero-section'); ?>
    <?php get_template_part('template-parts/category-tours/about-section'); ?>
    <?php get_template_part('template-parts/category-tours/grid-tours-section'); ?>
    <?php get_template_part('template-parts/category-tours/famous-attractions'); ?>
    <?php get_template_part('template-parts/shared/map-section'); ?>
    <?php get_template_part('template-parts/category-tours/quick-facts-section'); ?>
    <?php get_template_part('template-parts/category-tours/best-time-section'); ?>
</main>
<?php get_footer(); ?>