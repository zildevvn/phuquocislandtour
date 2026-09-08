<?php

$img = get_field('img_best_time_cate_tour_tpl');
$best_time = get_field('best_time_visit', 'option');
$heading = $best_time['heading'] ?: '';
$desc = $best_time['desc'] ?: '';
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
                <img src="<?= $img ?>" alt="image best time Phu Quoc Tour" />
            </div>
        </div>
    </div>
</section>