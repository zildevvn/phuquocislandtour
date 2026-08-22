<?php
$heading = get_field('hd_ab_blog_tpl');
$desc = get_field('desc_ab_blog_tpl');
$image_ab = get_field('img_ab_blog_tpl');
?>
<section class="vm-section about-section">
    <div class="about-section__graphic">
        <img src="<?= get_template_directory_uri(); ?>/assets/images/img-graphic-001.png"
            alt="image graphic for Phu Quoc Island Travel Guide" />
    </div>

    <div class="container">
        <div class="about-section-media">
            <div class="about-section-media__content">
                <h2 class="h3">
                    <?= $heading ?>
                </h2>
                <?= $desc ?>
            </div>

            <div class="about-section-media__image">
                <img src="<?= $image_ab ?>" alt="image about Phu Quoc Island Travel Guide" class="img-fluid"
                    loading="lazy" />
            </div>
        </div>
    </div>
</section>