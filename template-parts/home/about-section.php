<?php
$heading = get_field('hd_ab_home');
$sub_hd = get_field('sub_hd_ab_home');
$desc = get_field('desc_ab_home');
$terms = get_terms([
    'taxonomy' => 'tour_locations',
    'hide_empty' => false,
]);
?>

<section class="vm-section about-section">
    <div class="container">
        <?php vm_icon_heading() ?>
        <?php if (!empty($heading)): ?>
            <h2 class="vm-heading">
                <?= $heading ?>
            </h2>
        <?php endif; ?>

        <?php if (!empty($sub_hd)): ?>
            <p class="vm-sub-heading">
                <?= $sub_hd ?>
            </p>
        <?php endif; ?>

        <?php if (!empty($desc)): ?>
            <div class="about-section__desc"> <?= $desc ?> </div>
        <?php endif; ?>

        <?php if (!is_wp_error($terms)): ?>
            <div class="about-section__map">
                <div class="map-locations">

                    <?php foreach ($terms as $term): ?>
                        <?php
                        $image = get_field('image', $term);
                        $custom_link = get_field('custom_link_page', $term);

                        $term_link = !empty($custom_link)
                            ? $custom_link
                            : get_term_link($term);
                        ?>
                        <a href="<?php echo esc_url($term_link); ?>" id="location-<?= $term->slug ?>" class="location">
                            <div class="location__image">
                                <img src="<?= $image ?>" alt="image for location <?= $term->name ?> " />
                            </div>

                            <div class="location-content">
                                <h3 class="location__name h6 mb-0 d-flex align-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="lucide lucide-map-pin-check-icon lucide-map-pin-check">
                                        <path
                                            d="M19.43 12.935c.357-.967.57-1.955.57-2.935a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 32.197 32.197 0 0 0 .813-.728" />
                                        <circle cx="12" cy="10" r="3" />
                                        <path d="m16 18 2 2 4-4" />
                                    </svg>

                                    <?= $term->name ?>
                                </h3>

                                <div class="location__desc"> <?= $term->description ?> </div>
                            </div>
                        </a>
                    <?php endforeach; ?>
                </div>

                <div class="map-images">
                    <img class="map-images__bg"
                        src="<?= get_template_directory_uri(); ?>/assets/images/img-map-phu-quoc.jpg"
                        alt="image map phu quoc" />

                    <div class="map-images__list">
                        <?php foreach ($terms as $key => $term): ?>
                            <?php $image = get_field('image', $term); ?>
                            <div id="map-<?= $term->slug ?>" data-location="#location-<?= $term->slug ?>" class="map-item"
                                aria-label="Go to <?= $term->name ?>" style="z-index:<?= $key + 1 ?>">
                                <img src="<?= $image ?>" alt="image for map <?= $term->name ?> " />

                                <div class="map-tooltip">
                                    <span class="map-tooltip__name"><?= $term->name ?></span>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
        <?php endif; ?>
    </div>
</section>