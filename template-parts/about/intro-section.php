<?php
$heading = get_field('hd_intro_tpl_ab');
$sub_hd = get_field('sub_hd_intro_tpl_ab');
$desc = get_field('desc_intro_tpl_ab');
$image_ab = get_field('img_intro_tpl_ab');
$operator_license = get_field('operator_license', 'option');
$license_image = $operator_license['image'];
$license_desc = $operator_license['description'];
?>
<section class="vm-section intro-section">
    <div class="container">
        <?php vm_icon_heading() ?>

        <?php if (!empty($sub_hd)): ?>
            <h3 class="vm-heading-intro h5"> <?= $sub_hd ?> </h3>
        <?php endif; ?>

        <?php if (!empty($heading)): ?>
            <h2 class="vm-heading"> <?= $heading ?> </h2>
        <?php endif; ?>
    </div>
</section>