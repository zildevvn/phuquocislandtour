<?php
$heading = get_field('hd_ab_home');
$sub_hd = get_field('sub_hd_ab_home');
$desc = get_field('desc_ab_home');
$img = get_field('img_ab_home');
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


        <?php if (!empty($img)): ?>
            <div class="about-section__image">
                <img src="<?= $img ?>" alt="image for about section" />
            </div>
        <?php endif; ?>

        <?php if (!empty($desc)): ?>
            <div class="about-section__desc"> <?= $desc ?> </div>
        <?php endif; ?>

    </div>
</section>