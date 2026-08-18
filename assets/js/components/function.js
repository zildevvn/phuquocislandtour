

import Swiper from 'swiper';
import { Pagination, Navigation, Autoplay, EffectFade, Keyboard, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { CountUp } from 'countup.js';


(function ($) {
    "use strict";

    const vmHeroSliders = () => {
        const $sliders = $('.hero-section-gallery');
        if ($sliders.length === 0) return;

        $sliders.each(function () {
            const $this = $(this);

            if (this.swiper) {
                return;
            }

            new Swiper(this, {
                modules: [Autoplay, EffectFade],
                slidesPerView: 1,
                loop: true,
                speed: 400,
                effect: 'fade',
                fadeEffect: {
                    crossFade: true
                },
                pagination: false,
                navigation: false,
                autoplay: false,
                // autoplay: {
                //     delay: 5000,
                //     disableOnInteraction: false,
                //     pauseOnMouseEnter: true,
                // }
            });
        });
    }

    const vmCounters = () => {
        const counters = document.querySelectorAll('.vm-counter');
        if (!counters.length) return;

        const parseValue = (text) => {
            const match = text.trim().match(/^([^\d\-\.]+)?(-?[\d\.,]+)([^\d]+)?$/);
            if (!match) return null;

            const prefix = match[1] || '';
            const numberStr = match[2].replace(/,/g, '');
            const suffix = match[3] || '';

            const number = parseFloat(numberStr);
            if (isNaN(number)) return null;

            const decimalPlaces = numberStr.includes('.') ? numberStr.split('.')[1].length : 0;

            return { prefix, number, suffix, decimalPlaces };
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const parsed = parseValue(el.innerText);

                    if (parsed) {
                        const countUp = new CountUp(el, parsed.number, {
                            decimalPlaces: parsed.decimalPlaces,
                            prefix: parsed.prefix,
                            suffix: parsed.suffix,
                            duration: 2.5,
                            useEasing: true,
                            useGrouping: true
                        });

                        if (!countUp.error) {
                            countUp.start();
                        } else {
                            console.error(countUp.error);
                        }
                    }

                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.1 });

        counters.forEach(counter => observer.observe(counter));
    }

    const vmIconHeading = () => {
        const waves = document.querySelectorAll('.wave-svg');

        const isElementorEdit =
            window.elementorFrontend?.isEditMode?.() ||
            document.body.classList.contains('elementor-editor-active');


        if (isElementorEdit) {

            waves.forEach((wave) => {
                wave.classList.add('is-visible');
            });

            return;
        }

        const observer = new IntersectionObserver((entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    const wave = entry.target;

                    setTimeout(() => {
                        wave.classList.add('is-visible');
                    }, 500);

                    observer.unobserve(wave);
                }
            });

        }, {
            threshold: 0.3
        });

        waves.forEach((wave) => {
            observer.observe(wave);
        });

    }

    const vmInitToursSwiper = () => {
        const $carousels = $('.tours-carousel');
        if (!$carousels.length) return;

        $carousels.each(function () {
            const $carousel = $(this);
            const $slides = $carousel.find('.swiper-slide');

            if ($slides.length <= 1) return;

            new Swiper(this, {
                modules: [Navigation, Pagination, Autoplay],
                slidesPerView: 1,
                spaceBetween: 16,
                loop: $slides.length > 3,
                grabCursor: true,
                speed: 600,
                observer: true,
                observeParents: true,
                // autoplay: {
                //     delay: 3000,
                //     disableOnInteraction: false,
                //     pauseOnMouseEnter: true,
                // },
                autoplay: false,
                navigation: {
                    nextEl: $carousel.find('.swiper-button-next')[0],
                    prevEl: $carousel.find('.swiper-button-prev')[0],
                },
                pagination: {
                    el: $carousel.find('.swiper-pagination')[0],
                    clickable: true,
                },
                breakpoints: {
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 24,
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    }
                }
            });
        });
    };

    const vmInitCarToursSwiper = () => {
        const $carousels = $('.car-tours-swiper');
        if (!$carousels.length) return;

        const initOrDestroySwiper = () => {
            const isDesktop = window.innerWidth >= 1024;

            $carousels.each(function () {
                const $carousel = $(this);
                let swiper = $carousel.data('swiper-instance');

                if (isDesktop) {
                    if (swiper) {
                        swiper.destroy(true, true);
                        $carousel.removeData('swiper-instance');
                    }
                } else {
                    if (!swiper) {
                        const $slides = $carousel.find('.swiper-slide');

                        swiper = new Swiper(this, {
                            modules: [Navigation, Pagination, Autoplay],
                            slidesPerView: 1,
                            spaceBetween: 16,
                            loop: $slides.length > 2,
                            grabCursor: true,
                            speed: 600,
                            autoplay: {
                                delay: 3000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            },
                            // autoplay: false,
                            navigation: {
                                nextEl: $carousel.find('.swiper-button-next')[0],
                                prevEl: $carousel.find('.swiper-button-prev')[0],
                            }
                        });
                        $carousel.data('swiper-instance', swiper);
                    }
                }
            });
        };

        initOrDestroySwiper();

        let resizeTimer;
        $(window).on('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(initOrDestroySwiper, 150);
        });
    };

    const vmInitPostsSwiper = () => {
        const $carousels = $('.posts-swiper');
        if (!$carousels.length) return;

        const initOrDestroySwiper = () => {
            const isDesktop = window.innerWidth >= 1024;

            $carousels.each(function () {
                const $carousel = $(this);
                let swiper = $carousel.data('swiper-instance');

                if (isDesktop) {
                    if (swiper) {
                        swiper.destroy(true, true);
                        $carousel.removeData('swiper-instance');
                    }
                } else {
                    if (!swiper) {
                        const $slides = $carousel.find('.swiper-slide');

                        swiper = new Swiper(this, {
                            modules: [Navigation, Pagination, Autoplay],
                            slidesPerView: 1,
                            spaceBetween: 16,
                            loop: $slides.length > 2,
                            grabCursor: true,
                            speed: 600,
                            autoplay: {
                                delay: 3000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            },
                            // autoplay: false,
                            navigation: {
                                nextEl: $carousel.find('.swiper-button-next')[0],
                                prevEl: $carousel.find('.swiper-button-prev')[0],
                            },
                        });
                        $carousel.data('swiper-instance', swiper);
                    }
                }
            });
        };

        initOrDestroySwiper();

        let resizeTimer;
        $(window).on('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(initOrDestroySwiper, 150);
        });
    };

    const vmInitTestimonialsSwiper = () => {
        const $section = $('.testimonials-section');
        if (!$section.length) return;

        const $carousel = $section.find('.testimonials-carousel');
        const $thumbs = $section.find('.testimonials-thumbs');
        if (!$carousel.length || !$thumbs.length) return;

        const $slides = $carousel.find('.swiper-slide');
        if ($slides.length <= 1) return;

        const thumbsSwiper = new Swiper($thumbs[0], {
            modules: [Thumbs, Autoplay],
            spaceBetween: 10,
            slidesPerView: 3,
            centeredSlides: true,
            slideToClickedSlide: true,
            watchSlidesProgress: true,
            watchSlidesVisibility: true,
            freeMode: true,
            loop: true,
            direction: 'horizontal',
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 3,
                    spaceBetween: 16,
                    direction: 'horizontal',
                },
                992: {
                    slidesPerView: 3,
                    spaceBetween: 16,
                    direction: 'vertical',
                }
            }
        });

        new Swiper($carousel[0], {
            modules: [Navigation, Pagination, Autoplay, Thumbs, EffectFade],
            slidesPerView: 1,
            spaceBetween: 24,
            loop: true,
            grabCursor: true,
            speed: 600,
            observer: true,
            observeParents: true,
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            navigation: {
                nextEl: '.testimonials-section .swiper-button-next',
                prevEl: '.testimonials-section .swiper-button-prev',
            },
            pagination: {
                el: '.testimonials-section .swiper-pagination',
                clickable: true,
            },
            thumbs: {
                swiper: thumbsSwiper,
            }
        });
    };

    const vmInitFaqsAccordion = () => {
        $('.faqs-section__list').each(function () {
            const $list = $(this);

            // Initialize active items
            $list.find('.faq-item.is-active .faq-item__answer').show();

            $list.on('click', '.faq-item__question', function () {
                const $question = $(this);
                const $item = $question.closest('.faq-item');
                const $answer = $item.find('.faq-item__answer');

                if ($item.hasClass('is-active')) {
                    // Close this item
                    $item.removeClass('is-active');
                    $answer.slideUp(300);
                } else {
                    // Close other active items
                    const $activeItems = $list.find('.faq-item.is-active');
                    $activeItems.removeClass('is-active');
                    $activeItems.find('.faq-item__answer').slideUp(300);

                    // Open this item
                    $item.addClass('is-active');
                    $answer.slideDown(300);
                }
            });
        });
    };
    const vmInitMapLocationsScroll = () => {
        $('.map-images__list').on('click', '.map-item', function (e) {
            e.preventDefault();
            const $this = $(this);
            const targetId = $this.data('location');

            if (!targetId) return;

            const $target = $(targetId);
            const $container = $('.map-locations');

            if ($target.length && $container.length) {
                // Update active state
                $('.map-images__list .map-item').removeClass('is-active');
                $this.addClass('is-active');

                // Calculate dynamic header height offset
                const $header = $('header, .header, #masthead, .site-header').first();
                const headerHeight = $header.length ? $header.outerHeight() : 0;
                const scrollOffset = headerHeight + 20;

                // Calculate the absolute position of the target within the container
                const targetPositionInContainer = $target.offset().top - $container.offset().top + $container.scrollTop();

                // Set the scroll position so the target is offset from the top, not hidden by the header
                const scrollTo = targetPositionInContainer - scrollOffset;

                // Smooth scroll the container
                $container.animate({
                    scrollTop: scrollTo
                }, 400);
            }
        });
    };

    const vmInitMapLocationsHover = () => {
        $('.map-locations').on('mouseenter', '.location', function () {
            const locationId = $(this).attr('id');
            if (!locationId) return;

            const targetData = '#' + locationId;
            const $mapItem = $('.map-images__list .map-item[data-location="' + targetData + '"]');

            if ($mapItem.length) {
                $('.map-images__list .map-item').removeClass('is-hovered');
                $mapItem.addClass('is-hovered');
            }
        }).on('mouseleave', '.location', function () {
            $('.map-images__list .map-item').removeClass('is-hovered');
        });
    };

    const vmInitBackToTop = () => {
        const $btn = $('.back-to-top');
        if (!$btn.length) return;

        $(window).on('scroll', function () {
            if ($(this).scrollTop() > 300) {
                $btn.addClass('is-visible');
            } else {
                $btn.removeClass('is-visible');
            }
        });

        $btn.on('click', function (e) {
            e.preventDefault();
            $('html, body').animate({ scrollTop: 0 }, 600);
        });
    };

    const vmParallaxGraphics = () => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const graphics = document.querySelectorAll('[class*="-section__graphic"] img');
        if (!graphics.length) return;

        graphics.forEach((img, index) => {
            // Assign slightly different speeds (e.g. 0.05, 0.1, 0.15)
            const speed = 0.05 + (index % 3) * 0.03;
            img.dataset.parallaxSpeed = speed;
            img.style.willChange = 'transform';
        });

        const onScroll = () => {
            const windowHeight = window.innerHeight;

            graphics.forEach(img => {
                const container = img.parentElement;
                const rect = container.getBoundingClientRect();

                // Only animate if container is in viewport (with a small buffer)
                if (rect.top <= windowHeight + 100 && rect.bottom >= -100) {
                    const speed = parseFloat(img.dataset.parallaxSpeed);
                    const centerOffset = (rect.top + rect.height / 2) - (windowHeight / 2);
                    const yPos = centerOffset * speed;

                    img.style.transform = `translate3d(0, ${yPos}px, 0)`;
                }
            });
        };

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    onScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        onScroll();
    };

    const vmInitLicenseModal = () => {
        const $btn = $('.btn-view-license');
        const $modal = $('#licenseModal');
        const $close = $modal.find('.vm-license-modal__close');
        const $overlay = $modal.find('.vm-license-modal__overlay');

        if (!$btn.length || !$modal.length) return;

        $btn.on('click', function (e) {
            e.preventDefault();
            $modal.addClass('is-active');
            $('body').css('overflow', 'hidden');
        });

        const closeModal = () => {
            $modal.removeClass('is-active');
            $('body').css('overflow', '');
        };

        $close.on('click', function (e) {
            e.preventDefault();
            closeModal();
        });

        $overlay.on('click', function () {
            closeModal();
        });

        $(document).on('keydown', function (e) {
            if (e.key === "Escape" && $modal.hasClass('is-active')) {
                closeModal();
            }
        });
    };

    const vmInitTourGallery = () => {
        const $dataElement = $('#tourGalleryData');
        if (!$dataElement.length) return;

        let galleryData = [];
        try {
            galleryData = JSON.parse($dataElement.text());
        } catch (e) {
            console.error('Failed to parse gallery data');
            return;
        }

        if (galleryData.length === 0) return;

        const $lightbox = $('#tourGalleryLightbox');
        if (!$lightbox.length) return;

        const $lightboxImg = $('#tourGalleryLightboxImg');
        const $counter = $('#tourGalleryLightboxCounter');

        let currentIndex = 0;
        let isOpen = false;

        const updateLightbox = () => {
            if (galleryData[currentIndex]) {
                $lightboxImg.attr('src', galleryData[currentIndex].url);
                $lightboxImg.attr('alt', galleryData[currentIndex].alt);
                $counter.text(`${currentIndex + 1} / ${galleryData.length}`);
            }
        };

        const openLightbox = (index) => {
            currentIndex = index;
            updateLightbox();
            $lightbox.addClass('is-active').attr('aria-hidden', 'false');
            $('body').css('overflow', 'hidden');
            isOpen = true;
        };

        const closeLightbox = () => {
            $lightbox.removeClass('is-active').attr('aria-hidden', 'true');
            $('body').css('overflow', '');
            isOpen = false;
        };

        const nextImage = () => {
            currentIndex = (currentIndex + 1) % galleryData.length;
            updateLightbox();
        };

        const prevImage = () => {
            currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
            updateLightbox();
        };

        // Event Listeners for visible gallery items
        $('.tour-gallery').on('click', '.tour-gallery__item', function () {
            const index = parseInt($(this).data('index'), 10);
            if (!isNaN(index)) {
                openLightbox(index);
            }
        });

        // Lightbox controls
        $lightbox.on('click', '.tour-gallery__lightbox-close', function (e) {
            e.preventDefault();
            closeLightbox();
        });

        $lightbox.on('click', '.tour-gallery__lightbox-next', function (e) {
            e.preventDefault();
            nextImage();
        });

        $lightbox.on('click', '.tour-gallery__lightbox-prev', function (e) {
            e.preventDefault();
            prevImage();
        });

        // Close on overlay click
        $lightbox.on('click', function (e) {
            const $target = $(e.target);
            if ($target.hasClass('tour-gallery__lightbox-overlay') || $target.hasClass('tour-gallery__lightbox-image-container')) {
                closeLightbox();
            }
        });

        // Keyboard controls
        $(document).on('keydown', function (e) {
            if (!isOpen) return;

            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            }
        });
    };

    const vmInitQuantitySelectors = () => {
        $('.quantity-selector').on('click', '.qty-btn', function (e) {
            e.preventDefault();
            const $btn = $(this);
            const $input = $btn.siblings('input[type="number"]');
            let val = parseInt($input.val());
            if (isNaN(val)) val = 0;

            let min = parseInt($input.attr('min'));
            if (isNaN(min)) min = 0;

            let max = parseInt($input.attr('max'));
            if (isNaN(max)) max = 999;

            if ($btn.text().trim() === '+') {
                if (val < max) val++;
            } else if ($btn.text().trim() === '-') {
                if (val > min) val--;
            }

            $input.val(val).trigger('change');
        });

        $('.quantity-selector input[type="number"]').on('change input', function () {
            const $input = $(this);
            let val = parseInt($input.val());
            if (isNaN(val)) return; // Allow empty while typing, format on blur if needed

            let min = parseInt($input.attr('min'));
            if (isNaN(min)) min = 0;

            let max = parseInt($input.attr('max'));
            if (isNaN(max)) max = 999;

            if (val < min) $input.val(min);
            if (val > max) $input.val(max);
        });

        $('.quantity-selector input[type="number"]').on('blur', function () {
            const $input = $(this);
            let val = parseInt($input.val());
            let min = parseInt($input.attr('min'));
            if (isNaN(min)) min = 0;

            if (isNaN(val)) $input.val(min);
        });
    };

    const vmInitAjaxTourOptions = () => {
        const $form = $('.vm-form-booking');
        const $btn = $form.find('#vm-btn-check-availability');
        const $container = $('#vm-tour-options-container');

        if (!$form.length || !$btn.length || !$container.length) return;

        $container.hide();

        $btn.on('click', function (e) {
            e.preventDefault();

            const date = $form.find('input[type="date"]').val();
            const $error = $form.find('.vm-form-error');

            $error.hide().text('');

            if (!date) {
                $error.text('Please select a tour date.').slideDown(200);
                return;
            }

            const adults = parseInt($form.find('.quantity-selector input').eq(0).val()) || 0;
            const children = parseInt($form.find('.quantity-selector input').eq(1).val()) || 0;

            if ($btn.hasClass('is-loading')) return;

            const originalText = $btn.text();
            $btn.addClass('is-loading').text('CHECKING...');
            $btn.prop('disabled', true);

            const postId = $container.data('post-id');

            $.ajax({
                url: php_data.ajax_url,
                type: 'POST',
                data: {
                    action: 'vm_ajax_check_availability',
                    nonce: php_data.tour_options_nonce,
                    post_id: postId,
                    date: date,
                    adults: adults,
                    children: children
                },
                success: function (response) {
                    $btn.removeClass('is-loading').text(originalText);
                    $btn.prop('disabled', false);

                    if (response.success) {
                        if (response.data.count > 0) {
                            $container.html(response.data.html);
                            $container.slideDown(400, function () {
                                $('html, body').animate({
                                    scrollTop: $container.offset().top - 120
                                }, 600);
                            });
                        } else {
                            $container.html('<div class="container"><div class="vm-tour-options-empty" style="padding:40px 20px;text-align:center;background:#fff;border-radius:12px;margin:30px 0;border:1px solid #eaeaea;">No available tour options found for the selected date. Please try another date.</div></div>');
                            $container.slideDown(400);
                        }
                    } else {
                        alert(response.data.message || 'An error occurred.');
                    }
                },
                error: function () {
                    $btn.removeClass('is-loading').text(originalText);
                    $btn.prop('disabled', false);
                    alert('Server error. Please try again later.');
                }
            });
        });

        $container.on('click', '.option-item', function (e) {
            // Do not trigger selection logic if clicking the active button itself
            if ($(e.target).hasClass('btn-select--active')) return;

            $container.find('.option-item').removeClass('is-selected');
            $container.find('.btn-select').removeClass('btn-select--active').text('Select');

            $(this).addClass('is-selected');
            $(this).find('.btn-select').addClass('btn-select--active').text('Continue');
        });

        $container.on('click', '.btn-select.btn-select--active', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const $thisBtn = $(this);
            if ($thisBtn.hasClass('is-loading')) return;

            const originalText = $thisBtn.text();
            $thisBtn.addClass('is-loading').text('Processing...');
            $thisBtn.prop('disabled', true);

            const $tourItem = $thisBtn.closest('.option-item');
            const optionId = $tourItem.data('key');
            const postId = $container.data('post-id');
            const date = $form.find('input[type="date"]').val();
            const adults = parseInt($form.find('.quantity-selector input').eq(0).val()) || 0;
            const children = parseInt($form.find('.quantity-selector input').eq(1).val()) || 0;

            $.ajax({
                url: php_data.ajax_url,
                type: 'POST',
                data: {
                    action: 'vm_ajax_process_booking',
                    nonce: php_data.tour_options_nonce,
                    post_id: postId,
                    option_id: optionId,
                    date: date,
                    adults: adults,
                    children: children
                },
                success: function (response) {
                    if (response.success && response.data.redirect_url) {
                        window.location.href = response.data.redirect_url;
                    } else {
                        $thisBtn.removeClass('is-loading').text(originalText).prop('disabled', false);
                        alert(response.data.message || 'An error occurred.');
                    }
                },
                error: function () {
                    $thisBtn.removeClass('is-loading').text(originalText).prop('disabled', false);
                    alert('Server error. Please try again later.');
                }
            });
        });
    };

    const vmInitCheckoutForm = () => {
        const $form = $('#vm-checkout-form');
        if (!$form.length) return;

        // Clear error on input
        $form.find('input, textarea').on('input change', function () {
            const $this = $(this);
            $this.closest('.form-group').find('.invalid-feedback').slideUp(200, function () { $(this).text(''); });
        });

        $form.on('submit', function (e) {
            e.preventDefault();

            const $btn = $form.find('button[type="submit"]');
            if ($btn.hasClass('is-loading')) return;

            // Reset errors
            $form.find('.invalid-feedback').hide().text('');

            let isValid = true;

            // Validate Name
            const name = $form.find('input[name="customer_name"]').val().trim();
            if (!name) {
                isValid = false;
                $form.find('input[name="customer_name"]').siblings('.invalid-feedback').text('Full name is required.').slideDown(200);
            }

            // Validate Email
            const email = $form.find('input[name="customer_email"]').val().trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                isValid = false;
                $form.find('input[name="customer_email"]').siblings('.invalid-feedback').text('A valid email address is required.').slideDown(200);
            }

            // Validate Phone
            const phone = $form.find('input[name="customer_phone"]').val().trim();
            if (!phone) {
                isValid = false;
                $form.find('input[name="customer_phone"]').siblings('.invalid-feedback').text('Phone number is required.').slideDown(200);
            }

            // Validate Pick-up
            const pickup = $form.find('input[name="customer_pickup"]').val().trim();
            if (!pickup) {
                isValid = false;
                $form.find('input[name="customer_pickup"]').siblings('.invalid-feedback').text('Pick-up location is required.').slideDown(200);
            }

            // Validate Drop-off
            const dropoff = $form.find('input[name="customer_dropoff"]').val().trim();
            if (!dropoff) {
                isValid = false;
                $form.find('input[name="customer_dropoff"]').siblings('.invalid-feedback').text('Drop-off location is required.').slideDown(200);
            }

            // Validate T&C
            const terms = $form.find('input[name="terms_conditions"]').is(':checked');
            if (!terms) {
                isValid = false;
                $form.find('input[name="terms_conditions"]').closest('.form-group').find('.invalid-feedback').text('You must accept the terms and conditions.').slideDown(200);
            }

            if (!isValid) return;

            const originalText = $btn.text();
            $btn.addClass('is-loading').text('SUBMITTING...');
            $btn.prop('disabled', true);

            // Prepare Data
            const formData = {
                action: 'vm_ajax_submit_checkout',
                nonce: php_data.tour_options_nonce,
                booking_token: $form.find('input[name="booking_token"]').val(),
                customer_name: name,
                customer_email: email,
                customer_phone: phone,
                customer_pickup: pickup,
                customer_dropoff: dropoff,
                customer_address: $form.find('input[name="customer_address"]').val().trim(),
                customer_messages: $form.find('textarea[name="customer_messages"]').val().trim(),
                payment_method: $form.find('input[name="payment_method"]:checked').val()
            };

            $.ajax({
                url: php_data.ajax_url,
                type: 'POST',
                data: formData,
                success: function (response) {
                    if (response.success) {
                        $form.fadeOut(400, function () {
                            $('#vm-booking-success').fadeIn(400);
                            $('html, body').animate({
                                scrollTop: $('#vm-booking-success').offset().top - 150
                            }, 600);
                        });
                    } else {
                        $btn.removeClass('is-loading').text(originalText).prop('disabled', false);

                        let $errorBox = $form.find('.server-error');
                        if (!$errorBox.length) {
                            $form.append('<div class="server-error invalid-feedback" style="display:none; color:#dc3545; font-size:14px; margin-top:15px; text-align:center;"></div>');
                            $errorBox = $form.find('.server-error');
                        }
                        $errorBox.text(response.data.message || 'An error occurred during booking.').slideDown();
                    }
                },
                error: function () {
                    $btn.removeClass('is-loading').text(originalText).prop('disabled', false);
                    let $errorBox = $form.find('.server-error');
                    if (!$errorBox.length) {
                        $form.append('<div class="server-error invalid-feedback" style="display:none; color:#dc3545; font-size:14px; margin-top:15px; text-align:center;"></div>');
                        $errorBox = $form.find('.server-error');
                    }
                    $errorBox.text('Server error. Please try again later.').slideDown();
                }
            });
        });
    };

    const vmInitTourFilters = () => {
        const paxSlider = document.getElementById('vm-tours-pax-slider');
        if (paxSlider) {
            const paxMin = document.getElementById('vm-tours-pax-min');
            const paxMax = document.getElementById('vm-tours-pax-max');
            const paxDisplay = document.getElementById('vm-tours-pax-display');

            noUiSlider.create(paxSlider, {
                start: [parseInt(paxMin.value) || 1, parseInt(paxMax.value) || 50],
                connect: true,
                step: 1,
                range: {
                    'min': 1,
                    'max': 50
                }
            });

            paxSlider.noUiSlider.on('update', function (values, handle) {
                const min = Math.round(values[0]);
                const max = Math.round(values[1]);
                paxMin.value = min;
                paxMax.value = max;
                if (paxDisplay) {
                    paxDisplay.innerHTML = `${min} &ndash; ${max} Guests`;
                }
            });
        }

        const priceSlider = document.getElementById('vm-tours-price-slider');
        if (priceSlider) {
            const priceMin = document.getElementById('vm-tours-price-min');
            const priceMax = document.getElementById('vm-tours-price-max');
            const priceDisplay = document.getElementById('vm-tours-price-display');

            noUiSlider.create(priceSlider, {
                start: [parseInt(priceMin.value) || 0, parseInt(priceMax.value) || 1000],
                connect: true,
                step: 10,
                range: {
                    'min': 0,
                    'max': 1000
                }
            });

            priceSlider.noUiSlider.on('update', function (values, handle) {
                const min = Math.round(values[0]);
                const max = Math.round(values[1]);
                priceMin.value = min;
                priceMax.value = max;
                if (priceDisplay) {
                    const formatUSD = (val) => {
                        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(val);
                    };
                    priceDisplay.innerHTML = `${formatUSD(min)} &mdash; ${formatUSD(max)}`;
                }
            });
        }
    };

    $(document).ready(function () {
        vmHeroSliders()
        vmCounters()
        vmIconHeading()
        vmInitToursSwiper()
        vmInitTestimonialsSwiper()
        vmInitCarToursSwiper()
        vmInitPostsSwiper()
        vmInitFaqsAccordion()
        vmInitMapLocationsScroll()
        vmInitMapLocationsHover()
        vmInitBackToTop()
        vmParallaxGraphics()
        vmInitLicenseModal()
        vmInitTourGallery()
        vmInitQuantitySelectors()
        vmInitAjaxTourOptions()
        vmInitCheckoutForm()
        vmInitTourFilters()
    });
})(jQuery);