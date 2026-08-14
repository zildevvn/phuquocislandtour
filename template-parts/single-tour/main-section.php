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
<section class="vm-section single-tour__main-section">
    <div class="container">
        <div class="single-tour__layout">
            <div class="single-tour__content">

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

                <div id="tour-overview" class="tour-overview">
                    <h2 class="vm-heading vm-heading-animation">Overview Tour</h2>
                    <div class="tour-overview__content">
                        <?php the_content() ?>
                    </div>
                    <div class="tour-overview__features">
                        <span class="feature-pill"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg> Taste 8+ Local Dishes</span>
                        <span class="feature-pill"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg> Visit Local Market</span>
                        <span class="feature-pill"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg> Local English Guide</span>
                        <span class="feature-pill"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg> Hotel Pick-up</span>
                    </div>
                </div>

                <?php if (!empty($highlights)): ?>
                    <div id="tour-highlights" class="tour-highlights">
                        <h2 class="vm-heading vm-heading-animation">Tour Highlights</h2>
                        <div class="tour-highlights__grid">
                            <div class="tour-highlights__list">
                                <?= !empty($highlights) ? $highlights : '' ?>
                            </div>
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
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                    stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                                <span><?php echo esc_html($text); ?></span>
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
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                    stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                                </svg>
                                                <span><?php echo esc_html($text); ?></span>
                                            </li>
                                        <?php endforeach; ?>
                                    </ul>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endif; ?>

                <?php if (!empty($price_group) || !empty($price_private)): ?>
                    <div id="tour-prices" class="tour-prices">
                        <h2 class="vm-heading vm-heading-animation">Tour Prices</h2>
                        <div class="tour-prices__cards">
                            <?php if (!empty($price_group)): ?>
                                <div class="price-card group-price-card">
                                    <div class="price-card__icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="9" cy="7" r="4"></circle>
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                        </svg>
                                    </div>
                                    <div class="price-card__content">
                                        <h3 class="price-card__title"><?= esc_html($price_group['label']) ?></h3>
                                        <div class="price-card__amount">
                                            <span class="price-card__value"><?= esc_html($price_group['price']) ?></span>
                                            <span class="price-card__unit">USD / Person</span>
                                        </div>
                                    </div>
                                </div>
                            <?php endif; ?>

                            <?php if (!empty($price_private)): ?>
                                <div class="price-card private-price-card">
                                    <div class="price-card__icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                    </div>
                                    <div class="price-card__content">
                                        <h3 class="price-card__title">Private Tour Prices</h3>
                                        <div class="price-card__grid">
                                            <?php
                                            $persons_map = [
                                                '1_person' => '1 Person',
                                                '2_persons' => '2 Persons',
                                                '3_persons' => '3 Persons',
                                                '4_persons' => '4 Persons',
                                                '5_persons' => '5 Persons',
                                                '6_persons' => '6 Persons',
                                                '7_persons' => '7 Persons',
                                                '8_persons' => '8 Persons',
                                                '9_persons' => '9 Persons',
                                                '10_persons' => '10 Persons',
                                                '11_persons' => '11 Persons',
                                                '12_persons' => '12 Persons',
                                            ];
                                            foreach ($persons_map as $key => $label):
                                                if (!empty($price_private[$key])):
                                                    ?>
                                                    <div class="price-card__grid-item">
                                                        <span class="price-card__grid-label"><?= esc_html($label) ?></span>
                                                        <span class="price-card__grid-value">
                                                            <strong><?= esc_html($price_private[$key]) ?></strong>
                                                            <small>USD / Person</small>
                                                        </span>
                                                    </div>
                                                    <?php
                                                endif;
                                            endforeach;
                                            ?>
                                        </div>
                                    </div>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endif; ?>

                <div class="tour-itinerary-section-wrapper">
                    <div id="tour-itinerary" class="tour-itinerary-wrapper">
                        <?php if (!empty($itinerary_tour)): ?>
                            <h2 class="vm-heading vm-heading-animation">Itinerary</h2>
                            <div class="tour-itinerary">
                                <?php foreach ($itinerary_tour as $index => $item): ?>
                                    <?php
                                    $title = $item['title'];
                                    $image = $item['image'];
                                    $desc = $item['desc'];
                                    ?>
                                    <div class="tour-itinerary__item">
                                        <div class="tour-itinerary__marker">
                                            <div class="tour-itinerary__dot"></div>
                                            <div class="tour-itinerary__line"></div>
                                        </div>
                                        <div class="tour-itinerary__content">
                                            <h3 class="tour-itinerary__title"><?= $title ?></h3>
                                            <div class="tour-itinerary__desc">
                                                <?= $desc ?>
                                                <?php if (!empty($image)): ?>
                                                    <img src="<?= $image ?>" alt="image for itinerary <?= $title ?>" />
                                                <?php endif; ?>
                                            </div>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                    </div>

                    <div class="tour-good-to-know">
                        <div class="good-to-know-card">
                            <h3>Good to Know</h3>
                            <ul>
                                <li>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    Please inform us of any food allergies or dietary requirements in advance.
                                </li>
                                <li>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    Wear comfortable clothing and walking shoes.
                                </li>
                                <li>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    Bring sunscreen, a hat, and a camera.
                                </li>
                                <li>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    The tour operates in most weather conditions.
                                </li>
                                <li>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    Please be ready at your hotel lobby before the scheduled pickup time.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <?php get_template_part('template-parts/single-tour/review-section'); ?>
            </div>

            <div class="single-tour__sidebar">

                <!-- DEMO Sticky Booking Card -->
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
                            <label>Tour Date</label>
                            <input type="date" class="form-control" placeholder="Select date">
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
                        <button class="btn-book-demo">CHECK AVAILABILITY</button>
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
                <!-- End DEMO -->
            </div>
        </div>
    </div>
</section>