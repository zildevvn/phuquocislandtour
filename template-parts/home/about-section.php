<?php
$heading = get_field('hd_ab_home');
$sub_hd = get_field('sub_hd_ab_home');
$desc = get_field('desc_ab_home');
$license_image = get_field('license_image_ab');
$terms = get_terms([
    'taxonomy' => 'tour_locations',
    'hide_empty' => false,
]);
?>
<section class="vm-section about-section">
    <div class="about-section__graphic">
        <img src="<?= get_template_directory_uri(); ?>/assets/images/img-graphic-001.png"
            alt="image graphic phu quoc island tour" />
    </div>

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

        <div class="about-section__content d-flex align-items-center justify-content-between">
            <?php if (!empty($license_image['url'])): ?>
                <div class="about-section__license_image">
                    <img src="<?= $license_image['url'] ?>" alt="<?= $license_image['alt'] ?>" class="img-fluid"
                        loading="lazy" />

                    <?php if (!empty($license_image['caption'])): ?>
                        <span class="about-section__license_image__caption">
                            <?= $license_image['caption'] ?>
                        </span>
                    <?php endif; ?>
                </div>
            <?php endif; ?>

            <?php if (!empty($desc)): ?>
                <div class="about-section__desc"> <?= $desc ?> </div>
            <?php endif; ?>
        </div>
    </div>
</section>