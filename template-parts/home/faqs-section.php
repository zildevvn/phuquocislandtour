<?php
$heading = get_field('hd_faq_hp');
$sub_hd = get_field('sub_hd_faq_hp');
?>


<section class="vm-section faqs-section">
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
    </div>
</section>