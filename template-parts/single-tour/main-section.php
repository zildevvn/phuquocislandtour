<?php
$booking_form = get_field('form_booking', 'option');
$included_tour = get_field('included_tour');
$excluded_tour = get_field('excluded_tour');
$itinerary_tour = get_field('itinerary_tour');
$highlights = get_field('highlights_tour');
$price_group = get_field('price_for_group_tour');
$price_private = get_field('price_for_private_tour');
$gallery_tour = get_field('gallery_tour'); // From info-section
$price_tour = get_field('price_tour'); // For demo sticky
?>
<section class="vm-section main-section">
    <div class="container">
        <div class="main-section-wrap">
            <div class="main-section-content">
                <?php
                // Build array of menu items to display dynamically
                $nav_items = [];
                $nav_items['tour-overview'] = ['label' => __('Overview', 'hue-local-experience'), 'show' => true];
                $nav_items['tour-highlights'] = ['label' => __('Highlights', 'hue-local-experience'), 'show' => !empty($highlights) || !empty($gallery_tour)];
                $nav_items['tour-inclusions'] = ['label' => __('Inclusions', 'hue-local-experience'), 'show' => (!empty($included_tour) || !empty($excluded_tour))];
                $nav_items['tour-prices'] = ['label' => __('Prices', 'hue-local-experience'), 'show' => (!empty($price_group) || !empty($price_private))];
                $nav_items['tour-itinerary'] = ['label' => __('Itinerary', 'hue-local-experience'), 'show' => !empty($itinerary_tour)];
                $nav_items['tour-review'] = ['label' => __('Reviews', 'hue-local-experience'), 'show' => (comments_open() || get_comments_number() > 0)];
                ?>

                <!-- Anchor Navigation Menu -->
                <nav class="anchor-nav" id="vm-anchor-nav"
                    aria-label="<?php esc_attr_e('Tour navigation', 'hue-local-experience'); ?>">
                    <div class="anchor-nav__inner">
                        <ul class="anchor-nav__list">
                            <?php foreach ($nav_items as $id => $item):
                                if (!$item['show'])
                                    continue;
                                ?>
                                <li class="anchor-nav__item">
                                    <a href="#<?php echo esc_attr($id); ?>" class="anchor-nav__link">
                                        <?php echo esc_html($item['label']); ?>
                                    </a>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                </nav>

                <div class="main-section-content-wrapper">
                    <div id="tour-overview" class="tour-overview">
                        <h2 class="vm-heading ">Overview Tour</h2>
                        <div class="tour-overview__content">
                            <?php the_content() ?>
                        </div>
                    </div>

                    <?php if (!empty($highlights)): ?>
                        <div id="tour-highlights" class="tour-highlights">
                            <h2 class="vm-heading ">Tour Highlights</h2>
                            <div class="tour-highlights__content">
                                <?= !empty($highlights) ? $highlights : '' ?>
                            </div>
                        </div>
                    <?php endif; ?>


                    <?php if (!empty($included_tour) || !empty($excluded_tour)): ?>
                        <div id="tour-inclusions" class="tour-inclusions">
                            <div class="tour-inclusions__wrapper">
                                <?php if (!empty($included_tour)): ?>
                                    <div class="inclusion-card card-included">
                                        <h3>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                            </svg>
                                            What's Included
                                        </h3>
                                        <ul>
                                            <?php foreach ($included_tour as $index => $item):
                                                $text = is_array($item) ? current($item) : $item;
                                                if (empty($text))
                                                    continue;
                                                ?>
                                                <li>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                        stroke-linecap="round" stroke-linejoin="round"
                                                        class="lucide lucide-check-check-icon lucide-check-check">
                                                        <path d="M18 6 7 17l-5-5" />
                                                        <path d="m22 10-7.5 7.5L13 16" />
                                                    </svg>
                                                    <span>
                                                        <?php echo esc_html($text); ?>
                                                    </span>
                                                </li>
                                            <?php endforeach; ?>
                                        </ul>
                                    </div>
                                <?php endif; ?>

                                <?php if (!empty($excluded_tour)): ?>
                                    <div class="inclusion-card card-excluded">
                                        <h3>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                                <line x1="9" y1="9" x2="15" y2="15"></line>
                                            </svg>
                                            Not Included
                                        </h3>
                                        <ul>
                                            <?php foreach ($excluded_tour as $index => $item):
                                                $text = is_array($item) ? current($item) : $item;
                                                if (empty($text))
                                                    continue;
                                                ?>
                                                <li>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                        stroke-linecap="round" stroke-linejoin="round"
                                                        class="lucide lucide-x-icon lucide-x">
                                                        <path d="M18 6 6 18" />
                                                        <path d="m6 6 12 12" />
                                                    </svg>
                                                    <span>
                                                        <?php echo esc_html($text); ?>
                                                    </span>
                                                </li>
                                            <?php endforeach; ?>
                                        </ul>
                                    </div>
                                <?php endif; ?>
                            </div>
                        </div>
                    <?php endif; ?>

                    <?php if (!empty($itinerary_tour['itinerary_list'])): ?>
                        <div id="tour-itinerary" class="tour-itinerary">
                            <h2 class="vm-heading ">Itinerary</h2>
                            <?php if (!empty($itinerary_tour['itinerary_desc'])): ?>
                                <div class="tour-itinerary__desc">
                                    <?= $itinerary_tour['itinerary_desc']; ?>
                                </div>
                            <?php endif; ?>

                            <?php if (!empty($itinerary_tour['img'])): ?>
                                <img src="<?= $itinerary_tour['img'] ?>" alt="image Itinerary for <?= the_title() ?>" />
                            <?php endif; ?>

                            <div class="tour-itinerary__list">
                                <?php foreach ($itinerary_tour['itinerary_list'] as $index => $item): ?>
                                    <div class="itinerary-item">
                                        <?php
                                        $time = $item['time'] ?? '';
                                        $title = $item['title'] ?? '';
                                        $description = $item['description'] ?? '';
                                        ?>

                                        <div class="itinerary-item__time-wrapper">
                                            <?php if ($time): ?>
                                                <div class="itinerary-item__time">
                                                    <?= esc_html($time); ?>
                                                </div>
                                            <?php endif; ?>
                                        </div>
                                        <div class="itinerary-item__divider">
                                            <div class="itinerary-item__dot"></div>
                                            <div class="itinerary-item__line"></div>
                                        </div>
                                        <div class="itinerary-item__content">
                                            <h3 class="itinerary-item__title"><?= esc_html($title); ?></h3>
                                            <?php if ($description): ?>
                                                <div class="itinerary-item__desc">
                                                    <?= wp_kses_post($description); ?>
                                                </div>
                                            <?php endif; ?>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            </div>

                        </div>
                    <?php endif; ?>

                    <?php get_template_part('template-parts/single-tour/review-section'); ?>
                </div>
            </div>

            <div class="main-section__sidebar">
                <div class="vm-form-booking">
                    <div class="vm-form-booking__header">
                        <div class="price">
                            <span class="label">FROM</span>
                            <span
                                class="value">$<?php echo number_format((float) ($price_tour ? $price_tour : 100), 2); ?></span>
                            <span class="unit">/ person</span>
                        </div>
                        <div class="rating">
                            <span class="stars">★★★★★</span>
                            <span class="text">4.9 (128 reviews)</span>
                        </div>
                    </div>

                    <div class="vm-form-booking__body">
                        <div class="form-group">
                            <label>Date Visit</label>
                            <input type="date" id="vm-date-visit" name="date_visit" class="form-control"
                                value="<?php echo esc_attr(current_time('Y-m-d')); ?>"
                                min="<?php echo esc_attr(current_time('Y-m-d')); ?>">
                        </div>

                        <div class="form-row">
                            <div class="form-group half">
                                <label>Adults</label>
                                <div class="quantity-selector">
                                    <button class="qty-btn">-</button>
                                    <input type="number" value="2" min="1">
                                    <button class="qty-btn">+</button>
                                </div>
                            </div>
                            <div class="form-group half">
                                <label>Children <small>(4-11 yrs)</small></label>
                                <div class="quantity-selector">
                                    <button class="qty-btn">-</button>
                                    <input type="number" value="0" min="0">
                                    <button class="qty-btn">+</button>
                                </div>
                            </div>
                        </div>

                        <div class="vm-form-error"
                            style="display: none; color: #dc3545; font-size: 13px; font-weight: 500; margin-bottom: 15px; padding: 10px; background-color: #f8d7da; border-radius: 6px; border: 1px solid #f5c6cb;">
                        </div>
                        <button id="vm-btn-check-availability"
                            class="vm-button d-flex align-items-center justify-content-center">
                            Check Availability

                            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg" color="#000000">
                                <path d="M12 21L12 3M12 3L20.5 11.5M12 3L3.5 11.5" stroke="#000000" stroke-width="1.5"
                                    stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        </button>
                    </div>

                    <div class="vm-form-booking__footer">
                        <div class="feature-line">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            Free cancellation up to 24 hours
                        </div>
                        <div class="feature-line">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            Instant confirmation
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>