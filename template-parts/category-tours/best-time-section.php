<?php
$heading = get_field('hd_best_time_cate_tour_tpl');
$desc = get_field('desc_best_time_cate_tour_tpl');
$img = get_field('img_best_time_cate_tour_tpl');
?>

<section class="vm-section best-time-section">
    <div class="container">
        <div class="best-time-section__grid">
            <div class="best-time-section__content">
                <h2 class="vm-heading h4">
                    <?= $heading ?>
                </h2>

                <div class="best-time-section__desc">
                    <?= $desc ?>
                </div>
            </div>

            <div class="best-time-section__media">
                <img src="<?= $img ?>" alt="image best time Phu Quoc Day Trip" />
            </div>
        </div>
    </div>
</section>