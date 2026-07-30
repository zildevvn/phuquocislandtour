<?php
$custom_logo_id = get_theme_mod('custom_logo');
$logo_url = wp_get_attachment_url($custom_logo_id);
$about_text = get_field('about_text_ft', 'option');
$address = get_field('address', 'option');
$email = get_field('email', 'option');
$phone = get_field('phone', 'option');
$copyright = get_field('copyright_ft', 'option');
$socials = get_field('socials', 'option');
$bg_footer = get_field('background_image', 'option');
?>



<footer class="main-footer">
    <div class="main-footer-warp">
        <div class="container">
            <div class="main-footer-top d-flex justify-content-between align-items-end">
                <div class="main-footer__logo">
                    <a class="d-flex " href="<?php echo home_url(); ?>"
                        aria-label="<?php echo get_bloginfo('name'); ?>">
                        <img src="<?php echo $logo_url; ?>" alt="<?php echo get_bloginfo('name'); ?>">
                    </a>
                </div>

                <div class="main-footer-top__right d-flex justify-content-between">
                    <?php if (!empty($phone)): ?>
                        <?php
                        $phone = preg_replace('/\D+/', '', $phone);
                        if (strpos($phone, '0') === 0) {
                            $phone = '84' . substr($phone, 1);
                        }
                        ?>
                        <div class="main-footer__phone">
                            <h2 class="h5">24/7 Support</h2>
                            <a href="https://wa.me/<?= esc_attr($phone); ?>" target="_blank" rel="noopener noreferrer"
                                aria-label="Chat with us on WhatsApp">
                                +<?= $phone ?>
                            </a>

                        </div>
                    <?php endif; ?>

                    <?php if (!empty($email)): ?>
                        <div class="main-footer__email">
                            <h2 class="h5">Email Us</h2>
                            <a href="mailto:<?= $email ?>">
                                <?= $email ?>
                            </a>
                        </div>
                    <?php endif; ?>


                    <?php if (!empty($address)): ?>
                        <div class="main-footer__address">
                            <h2 class="h5">Our Location </h2>
                            <p class="mb-0"> <?= $address ?> </p>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <div class="main-footer-middle d-flex justify-content-between">
                <?php if (!empty($about_text)): ?>
                    <div class="main-footer__about">
                        <h2 class="h5">About Us</h2>
                        <p class="mb-0"> <?= $about_text ?> </p>
                    </div>
                <?php endif; ?>

                <div class="main-footer__menus d-flex justify-content-between">

                    <?php if (has_nav_menu('company-menu')): ?>
                        <div class="main-footer__menu company-menu">
                            <h2 class="h5">Company</h2>
                            <?php wp_nav_menu(array('theme_location' => 'company-menu', 'menu_class' => 'company-menu')) ?>
                        </div>
                    <?php endif; ?>

                    <?php if (has_nav_menu('daily-tours-menu')): ?>
                        <div class="main-footer__menu daily-tours-menu">
                            <h2 class="h5">Daily Tours</h2>
                            <?php wp_nav_menu(array('theme_location' => 'daily-tours-menu', 'menu_class' => 'daily-tours-menu')) ?>
                        </div>
                    <?php endif; ?>

                    <?php if (has_nav_menu('package-tours-menu')): ?>
                        <div class="main-footer__menu package-tours-menu">
                            <h2 class="h5">Package Tours</h2>
                            <?php wp_nav_menu(array('theme_location' => 'package-tours-menu', 'menu_class' => 'package-tours-menu')) ?>
                        </div>
                    <?php endif; ?>

                </div>
            </div>

            <div class="main-footer-bottom d-flex justify-content-between align-items-center">
                <?php if (!empty($copyright)): ?>
                    <p class="mb-0 main-footer__copyright"><?= $copyright ?></p>
                <?php endif; ?>


                <?php if (!empty($socials)): ?>
                    <div class="main-footer__socials d-flex align-items-center">
                        <?php foreach ($socials as $social): ?>
                            <div class="item-social">
                                <a href="<?= $social['link'] ?>" class="d-flex align-items-center justify-content-center">
                                    <img src="<?= $social['icon'] ?>" alt="icon-footer">
                                </a>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</footer>