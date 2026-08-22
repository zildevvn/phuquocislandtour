<?php
$heading = get_field('hd_ab_car_tpl');
$sub_hd = get_field('sub_hd_ab_car_tpl');
$desc = get_field('description_car_tpl');
$gallerys = get_field('gallery_car_tpl');
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

        <div class="about-section-media">
            <div class="about-section-media__content">
                <?php if (!empty($desc)): ?>

                    <?= $desc ?>

                <?php endif; ?>
            </div>

            <?php if (!empty($gallerys)): ?>
                    <div class="about-section-media__gallery swiper">
                        <div class="swiper-wrapper">
                            <?php foreach ($gallerys as $key => $gallery): ?>
                                    <div class="gallery-item swiper-slide">
                                        <img src="<?= $gallery ?>" alt="image <?= $key ?> for Car Rental in Phu Quoc" />
                                    </div>
                            <?php endforeach; ?>
                        </div>
                        <div class="swiper-button-prev">
                            <svg width="24px" height="24px" viewBox="0 0 24 24" stroke-width="1.5" fill="none"
                                xmlns="http://www.w3.org/2000/svg" color="#000000">
                                <path d="M21 12L3 12M3 12L11.5 3.5M3 12L11.5 20.5" stroke="#000000" stroke-width="1.5"
                                    stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        </div>
                        <div class="swiper-button-next">
                            <svg width="24px" height="24px" viewBox="0 0 24 24" stroke-width="1.5" fill="none"
                                xmlns="http://www.w3.org/2000/svg" color="#000000">
                                <path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke="#000000" stroke-width="1.5"
                                    stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        </div>
                    </div>
            <?php endif; ?>
        </div>
    </div>
</section>