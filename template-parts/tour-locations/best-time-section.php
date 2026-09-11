<?php
$term = get_queried_object();
$best_time = get_field('best_time_visit_section', $term);
$map = $best_time['map'] ?: '';
$desc = $best_time['description'] ?: '';
?>
<section class="vm-section best-time-section">
    <div class="container">
        <div class="best-time-section__grid">
            <div class="best-time-section__content">
                <div class="content-warp">
                    <h2 class="vm-heading h3">
                        Best time to visit <span><?= $term->name ?></span>
                    </h2>

                    <div class="best-time-section__desc">
                        <?= $desc ?>
                    </div>
                </div>
            </div>

            <div class="best-time-section__map">
                <?= $map; ?>
            </div>
        </div>
    </div>
</section>