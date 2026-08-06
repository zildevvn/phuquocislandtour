<?php
$heading = get_field('hd_posts_hp');
$sub_heading = get_field('sub_hd_posts_hp');

$args = array(
    'post_type' => 'post',
    'posts_per_page' => 3,
    'post_status' => 'publish',
);
$query = new WP_Query($args);

?>
<?php if ($query->have_posts()): ?>
    <section class="vm-section posts-section">
        <div class="container">
            <?php vm_icon_heading() ?>

            <?php if (!empty($heading)): ?>
                <h2 class="vm-heading">
                    <?= $heading ?>
                </h2>
            <?php endif; ?>
            <?php if (!empty($sub_heading)): ?>
                <p class="vm-sub-heading">
                    <?= $sub_heading ?>
                </p>
            <?php endif; ?>

            <div class="posts-section__list post-grid" data-aos="fade-up">
                <?php while ($query->have_posts()):
                    $query->the_post();
                    ?>
                    <?php vm_post_item(); ?>
                <?php endwhile; ?>
                <?php wp_reset_postdata(); ?>
            </div>

            <div class="posts-section__cta">
                <?php vm_load_button('#!', 'View All', '', 'view all posts') ?>
            </div>
        </div>
    </section>
<?php endif; ?>