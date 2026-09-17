<?php
$heading = get_field('hd_intro_tpl_ab');
$sub_hd = get_field('sub_hd_intro_tpl_ab');
$desc = get_field('desc_intro_tpl_ab');
$image = get_field('img_intro_tpl_ab');
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

        <div class="intro-section-media">
            <div class="intro-section-media__text">
                <div class="media-content">
                    <?php if (!empty($desc)): ?>
                        <?= $desc ?>
                    <?php endif; ?>

                    <div class="media-meta">
                        <a href="https://www.dmca.com/Protection/Status.aspx?ID=5c4df07a-1c07-4bfe-8313-2f6ceb587ac5&refurl=https://vmtravel.com/about-us/"
                            target="_blank" aria-label="read more VM Tralve DMC">
                            <img src="<?= get_template_directory_uri(); ?>/assets/images/img-dmc.png" alt="logo DMC">
                        </a>
                        <button type="button" class="vm-button btn-view-license">
                            View Operator License

                            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg" color="#000000">
                                <path d="M12 21L12 3M12 3L20.5 11.5M12 3L3.5 11.5" stroke="#000000" stroke-width="1.5"
                                    stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div class="intro-section-media__image">
                <?php if (!empty($image)): ?>
                    <img src="<?= esc_url($image) ?>" alt="Image intro for Phu Quoc Travel Agency">
                <?php endif; ?>
            </div>
        </div>
    </div>
</section>

<?php if (!empty($license_image)): ?>
    <div class="vm-license-modal" id="licenseModal">
        <div class="vm-license-modal__overlay"></div>
        <div class="vm-license-modal__content">
            <button type="button" class="vm-license-modal__close" aria-label="Close modal">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <div class="vm-license-modal__body">
                <div class="vm-license-modal__grid">
                    <div class="vm-license-modal__left">
                        <div class="vm-license-modal__image">
                            <img src="<?= esc_url($license_image) ?>" alt="Operator License" class="img-fluid"
                                loading="lazy" />
                        </div>
                    </div>
                    <div class="vm-license-modal__right">
                        <h3 class="vm-license-modal__title h4">About VM Travel Company</h3>
                        <?php if (!empty($license_desc)): ?>
                            <div class="vm-license-modal__desc">
                                <?= wp_kses_post($license_desc) ?>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
<?php endif; ?>