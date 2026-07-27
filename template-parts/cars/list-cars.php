<?php
$paged = get_query_var('paged') ?: (get_query_var('page') ?: 1);

$args = array(
    'post_type' => 'cars',
    'posts_per_page' => 12,
    'paged' => $paged,
    'post_status' => 'publish',
    'tax_query' => array(
        array(
            'taxonomy' => 'car_category',
            'field' => 'slug',
            'terms' => 'tour',
        ),
    ),
);
$query = new WP_Query($args);
?>

<?php if ($query->have_posts()): ?>
    <section class="vm-section list-cars-section">
        <div class="container">
            <h2 class="vm-heading vm-heading-animation">Hue Car Rental with Sightseeing</h2>

            <div class="list-cars-wrapper position-relative">
                <div class="tours-loading-overlay cars-loading-overlay">
                    <div class="tours-loading-spinner">
                        <div class="spinner-dot"></div>
                    </div>
                    <span class="tours-loading-text">Loading cars...</span>
                </div>

                <div id="vm-cars-results" class="list-cars-section__cars" data-query='<?= json_encode($args) ?>'
                    data-currentpage="<?= $paged ?>">
                    <?php while ($query->have_posts()):
                        $query->the_post();
                        vm_car_tour_item();
                    endwhile;
                    wp_reset_postdata(); ?>
                </div>

                <div id="vm-cars-pagination">
                    <?php vm_pagination($paged, $query->max_num_pages); ?>
                </div>
            </div>

        </div>
    </section>
<?php endif; ?>