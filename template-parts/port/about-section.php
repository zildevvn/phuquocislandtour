<?php
$heading = get_field('hd_ab_port_tpl');
$sub_hd = get_field('sub_hd_ab_port_tpl');
$desc = get_field('description_port_tpl');
$gallerys = get_field('gallery_port_tpl');
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
                <div class="content">
                    <?php if (!empty($desc)): ?>
                        <?= $desc ?>
                    <?php endif; ?>
                </div>

                <div class="d-flex align-items-center flex-wrap gap-2 mt-4">
                    <a href="#daily-tours-section" class="vm-button d-flex align-items-center ">
                        Daily Tours
                        <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg" color="#000000">
                            <path d="M12 21L12 3M12 3L20.5 11.5M12 3L3.5 11.5" stroke="#000000" stroke-width="1.5"
                                stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </a>

                    <a href="#book-car-section" class="vm-button vm-button-secondary d-flex align-items-center ">
                        Book Car
                        <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg" color="#000000">
                            <path d="M12 21L12 3M12 3L20.5 11.5M12 3L3.5 11.5" stroke="#000000" stroke-width="1.5"
                                stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </a>
                </div>
            </div>

            <?php if (!empty($gallerys)): ?>
                <div class="about-section-media__gallery swiper">
                    <div class="swiper-wrapper">
                        <?php foreach ($gallerys as $key => $gallery): ?>
                            <div class="gallery-item swiper-slide">
                                <img src="<?= $gallery ?>" alt="image <?= $key ?> for Phu Quoc ports" />
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