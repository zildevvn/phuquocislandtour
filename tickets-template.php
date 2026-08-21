<?php
/**
 * Template Name: Tickets
 */
get_header();
?>
<main id="primary" class="site-main">
    <?php get_template_part('template-parts/tickets/hero-section'); ?>
    <?php get_template_part('template-parts/tickets/about-section'); ?>
    <?php get_template_part('template-parts/tickets/popular-section'); ?>
    <?php get_template_part('template-parts/tickets/tips-section'); ?>
</main>
<?php get_footer(); ?>