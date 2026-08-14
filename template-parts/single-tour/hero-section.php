<?php
$title = get_the_title();
$image = get_the_post_thumbnail_url();
if (!$image) {
    // fallback image
    $image = get_template_directory_uri() . '/assets/images/default-tour-bg.jpg';
}

$location_tour = get_field('location_tour');
$time_tour = get_field('time_tour');
$price_tour = get_field('price_tour');
$paxs_tours = get_field('paxs_tours');
$min_pax = isset($paxs_tours['min']) ? $paxs_tours['min'] : '';
$max_pax = isset($paxs_tours['max']) ? $paxs_tours['max'] : '';

// Taxonomy for Type/Badge (assume 'tour_category' or similar, we'll use a generic placeholder or try to fetch it if exists)
$tour_types = get_the_terms(get_the_ID(), 'tour_category');
$tour_type_name = ($tour_types && !is_wp_error($tour_types)) ? $tour_types[0]->name : 'Daily Tour';
?>
<section class="single-tour__hero" style="background-image: url('<?php echo esc_url($image); ?>');">
    <div class="single-tour__hero-overlay"></div>
    <div class="container">
        <div class="single-tour__hero-content">
            
            <div class="single-tour__breadcrumbs">
                <a href="<?php echo esc_url(home_url('/')); ?>">Home</a> &gt; 
                <a href="<?php echo esc_url(get_post_type_archive_link('tours')); ?>">Tours</a> &gt; 
                <span><?php echo esc_html($title); ?></span>
            </div>

            <span class="single-tour__badge"><?php echo esc_html($tour_type_name); ?></span>

            <h1 class="single-tour__title"><?php echo esc_html($title); ?></h1>

            <p class="single-tour__subtitle">
                Discover authentic flavors, local culture, and unforgettable culinary experiences across Phu Quoc Island.
            </p>

            <div class="single-tour__metadata">
                <?php if ($time_tour): ?>
                <div class="meta-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span><?php echo esc_html($time_tour); ?></span>
                </div>
                <?php endif; ?>

                <?php if ($min_pax && $max_pax): ?>
                <div class="meta-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span><?php echo esc_html($min_pax) . ' - ' . esc_html($max_pax); ?> guests</span>
                </div>
                <?php endif; ?>

                <div class="meta-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span><?php echo esc_html($tour_type_name); ?></span>
                </div>

                <?php if ($price_tour): ?>
                <div class="meta-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                    <span>From $<?php echo number_format((float) $price_tour, 2); ?></span>
                </div>
                <?php endif; ?>
            </div>

            <div class="single-tour__features">
                <span class="feature-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Local Food Experience
                </span>
                <span class="feature-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    English Speaking Guide
                </span>
                <span class="feature-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Hotel Pick-up
                </span>
                <span class="feature-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Free Cancellation
                </span>
            </div>

        </div>
    </div>
</section>