<?php
$heading = get_field('hd_feature_tour');
$sub_heading = get_field('sub_hd_feature_tour');


$args = array(
    'post_type' => 'tours',
    'posts_per_page' => 4,
    'post_status' => 'publish',
);
$query = new WP_Query($args);

if ($query->have_posts()): ?>
    <section class="vm-section featured-tours-section">
        <div class="container">
            <div class="section-heading">
                <h2 class="vm-heading center vm-heading-animation">
                    <?= $heading ?? '' ?>
                </h2>
                <p class="vm-sub-heading">
                    <?= $sub_heading ?? '' ?>
                </p>
            </div>

            <div class="featured-tours-section__list" data-aos="fade-up">
                <?php while ($query->have_posts()):
                    $query->the_post();
                    vm_tour_item();
                    ?>
                <?php endwhile; ?>
                <?php wp_reset_postdata(); ?>
            </div>

            <div class="d-flex justify-content-center vm-button-container">
                <a class="vm-button" href="/hue-experience-all-tour" role="button"> View All</a>
            </div>
        </div>
    </section>
<?php endif; ?>