

import Swiper from 'swiper';
import { Pagination, Navigation, Autoplay, EffectFade, Keyboard, Thumbs } from 'swiper/modules';
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
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }
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
                slidesPerView: 1.25,
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
                            slidesPerView: 1.25,
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
                            slidesPerView: 1.25,
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
        $('.faqs-list').each(function () {
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
        // Đồng bộ breakpoint với CSS: @media (max-width: 1023.98px)
        const mobileMediaQuery = window.matchMedia('(max-width: 1023.98px)');

        $('.map-images__list').on('click', '.map-item', function (e) {
            e.preventDefault();
            const $this = $(this);
            const targetId = $this.data('location');

            if (!targetId) return;

            const selector = targetId.toString().startsWith('#') ? targetId : `#${targetId}`;
            const $target = $(selector);
            const $container = $('.map-locations');

            if (!$target.length || !$container.length) return;

            // Update active state
            $('.map-images__list .map-item').removeClass('is-active');
            $this.addClass('is-active');

            $container.stop(true);

            if (mobileMediaQuery.matches) {
                // ===== MOBILE/TABLET: container scroll NGANG (row) =====
                const containerPaddingLeft = parseFloat($container.css('padding-left')) || 0;

                const targetPositionInContainer =
                    $target.offset().left - $container.offset().left + $container.scrollLeft();

                // Căn giữa item trong viewport container (thay vì offset trừ header như bản dọc)
                const scrollTo = targetPositionInContainer
                    - (containerPaddingLeft)
                    - ($container.outerWidth() / 2)
                    + ($target.outerWidth() / 2);

                $container.animate({ scrollLeft: scrollTo }, 400);

            } else {
                // ===== DESKTOP: container scroll DỌC (giữ nguyên logic cũ) =====
                const $header = $('header, .header, #masthead, .site-header').first();
                const headerHeight = $header.length ? $header.outerHeight() : 0;
                const scrollOffset = headerHeight + 20;

                const targetPositionInContainer =
                    $target.offset().top - $container.offset().top + $container.scrollTop();

                const scrollTo = targetPositionInContainer - scrollOffset;

                $container.animate({ scrollTop: scrollTo }, 400);
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
        let $lastFocusedElement = null;

        const updateLightbox = () => {
            if (galleryData[currentIndex]) {
                $lightboxImg.attr('src', galleryData[currentIndex].url);
                $lightboxImg.attr('alt', galleryData[currentIndex].alt);
                $counter.text(`${currentIndex + 1} / ${galleryData.length}`);
            }
        };

        const openLightbox = (index, opener) => {
            if (opener) $lastFocusedElement = $(opener);
            currentIndex = index;
            updateLightbox();
            $lightbox.addClass('is-active').attr('aria-hidden', 'false');
            $('body').css('overflow', 'hidden');
            isOpen = true;
            setTimeout(() => {
                $lightbox.find('.tour-gallery__lightbox-close').focus();
            }, 50);
        };

        const closeLightbox = () => {
            $lightbox.removeClass('is-active').attr('aria-hidden', 'true');
            $('body').css('overflow', '');
            isOpen = false;
            if ($lastFocusedElement && $lastFocusedElement.length) {
                $lastFocusedElement.focus();
            }
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
                openLightbox(index, this);
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
            } else if (e.key === 'Tab') {
                const focusableElements = $lightbox.find('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                if (focusableElements.length === 0) return;

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
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
                customer_country: $form.find('input[name="customer_country"]').val().trim(),
                customer_messages: $form.find('textarea[name="customer_messages"]').val().trim(),
                payment_method: $form.find('input[name="payment_method"]:checked').val()
            };

            $.ajax({
                url: php_data.ajax_url,
                type: 'POST',
                data: formData,
                success: function (response) {
                    if (response.success) {
                        $('#booking-ref').text(response.data.reference || '');
                        $('#booking-date').text(response.data.date || '');
                        $('#booking-payment').text(response.data.payment_method || '');

                        if (response.data.country) {
                            $('#booking-country').text(response.data.country);
                            $('#summary-item-country').css('display', 'flex');
                        } else {
                            $('#summary-item-country').hide();
                        }

                        $('#booking-status').text(response.data.status || 'Pending Confirmation');
                        $('#booking-email').text(email);

                        $('#vm-checkout-form-wrapper').fadeOut(300, function () {
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

    const vmInitAboutCarGallerySwiper = () => {
        const $carousels = $('.gallerys-carousel');
        if (!$carousels.length) return;

        $carousels.each(function () {
            const $carousel = $(this);
            const $slides = $carousel.find('.swiper-slide');

            if ($slides.length === 0) return;

            const isLoop = $slides.length > 1;
            const hasNavigation = $carousel.find('.swiper-button-next').length > 0;
            const hasPagination = $carousel.find('.swiper-pagination').length > 0;

            let modules = [Autoplay, EffectFade];
            if (hasNavigation) modules.push(Navigation);
            if (hasPagination) modules.push(Pagination);

            new Swiper(this, {
                modules: modules,
                slidesPerView: 1.2,
                spaceBetween: 16,
                loop: isLoop,
                speed: 600,
                autoplay: isLoop ? {
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                } : false,
                navigation: isLoop && hasNavigation ? {
                    nextEl: $carousel.find('.swiper-button-next')[0],
                    prevEl: $carousel.find('.swiper-button-prev')[0],
                } : false,
                pagination: isLoop && hasPagination ? {
                    el: $carousel.find('.swiper-pagination')[0],
                    clickable: true,
                } : false,
                breakpoints: {
                    768: { spaceBetween: 24 },
                    1024: { spaceBetween: 24 }
                }
            });
        });
    };

    const vmInitOurTeamSwiper = () => {
        const $carousels = $('.our-team-carousel');
        if (!$carousels.length) return;

        $carousels.each(function () {
            const $carousel = $(this);
            const $slides = $carousel.find('.swiper-slide');

            if ($slides.length <= 1) return;

            new Swiper(this, {
                modules: [Navigation, Autoplay],
                slidesPerView: 1,
                spaceBetween: 16,
                speed: 600,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                },
                navigation: {
                    nextEl: $carousel.find('.swiper-button-next')[0],
                    prevEl: $carousel.find('.swiper-button-prev')[0],
                },
                breakpoints: {
                    576: {
                        slidesPerView: 1,
                        spaceBetween: 20,
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 24,
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 24,
                    }
                }
            });
        });
    };

    const vmInitHotelAreaTabs = () => {
        const containers = document.querySelectorAll('.hotel-area-tabs-container');
        if (!containers.length) return;

        containers.forEach(container => {
            const tabs = container.querySelectorAll('.hotel-area-tab');
            const panels = container.querySelectorAll('.hotel-area-panel');

            if (!tabs.length || !panels.length) return;

            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const targetId = tab.getAttribute('aria-controls');

                    // Remove active state from all tabs
                    tabs.forEach(t => {
                        t.setAttribute('aria-selected', 'false');
                        t.classList.remove('is-active');
                    });

                    // Hide all panels
                    panels.forEach(p => {
                        p.setAttribute('hidden', '');
                    });

                    // Set clicked tab to active
                    tab.setAttribute('aria-selected', 'true');
                    tab.classList.add('is-active');

                    // Show corresponding panel
                    const targetPanel = container.querySelector('#' + targetId);
                    if (targetPanel) {
                        targetPanel.removeAttribute('hidden');
                    }
                });

                // Basic keyboard accessibility (Arrow keys to navigate)
                tab.addEventListener('keydown', (e) => {
                    let focusTab = null;
                    const index = Array.from(tabs).indexOf(tab);

                    if (e.key === 'ArrowRight') {
                        focusTab = tabs[(index + 1) % tabs.length];
                    } else if (e.key === 'ArrowLeft') {
                        focusTab = tabs[(index - 1 + tabs.length) % tabs.length];
                    }

                    if (focusTab) {
                        e.preventDefault();
                        focusTab.focus();
                        focusTab.click();
                    }
                });
            });
        });
    };

    const vmInitMobileGallerySwiper = () => {
        const $gallery = $('.tour-gallery');
        if (!$gallery.length) return;

        const initOrDestroyGallerySwiper = () => {
            const isMobile = window.innerWidth < 768;

            $gallery.each(function () {
                const $section = $(this);
                const $mainContainer = $section.find('.tour-gallery__main-container');
                const $grid = $section.find('.tour-gallery__grid');
                const $items = $grid.find('.tour-gallery__item');

                const $thumbsContainer = $section.find('.tour-gallery__thumbs-container');
                const $thumbsGrid = $section.find('.tour-gallery__thumbs-grid');
                const $thumbItems = $thumbsGrid.find('.tour-gallery__thumb-item');

                if (!$mainContainer.length || !$grid.length || $items.length === 0) {
                    return;
                }

                let mainSwiper = $mainContainer.data('swiper-instance');
                let thumbsSwiper = $thumbsContainer.data('swiper-instance');

                if (!isMobile) {
                    if (mainSwiper) {
                        mainSwiper.destroy(true, true);
                        $mainContainer.removeData('swiper-instance');
                    }
                    if (thumbsSwiper) {
                        thumbsSwiper.destroy(true, true);
                        $thumbsContainer.removeData('swiper-instance');
                    }

                    $mainContainer.removeClass('swiper');
                    $grid.removeClass('swiper-wrapper');
                    $items.removeClass('swiper-slide');

                    if ($thumbsContainer.length) {
                        $thumbsContainer.removeClass('swiper');
                        $thumbsGrid.removeClass('swiper-wrapper');
                        $thumbItems.removeClass('swiper-slide');
                        $thumbsGrid.removeAttr('style');
                        $thumbItems.removeAttr('style');
                    }

                    $grid.removeAttr('style');
                    $items.removeAttr('style');
                } else {
                    if (!mainSwiper) {
                        $mainContainer.addClass('swiper');
                        $grid.addClass('swiper-wrapper');
                        $items.addClass('swiper-slide');

                        // Initialize thumbs swiper only if we have more than 1 image and the container exists
                        if ($items.length > 1 && $thumbsContainer.length) {
                            $thumbsContainer.addClass('swiper');
                            $thumbsGrid.addClass('swiper-wrapper');
                            $thumbItems.addClass('swiper-slide');

                            thumbsSwiper = new Swiper($thumbsContainer[0], {
                                modules: [Thumbs],
                                spaceBetween: 8,
                                slidesPerView: 4,
                                freeMode: true,
                                watchSlidesProgress: true,
                            });
                            $thumbsContainer.data('swiper-instance', thumbsSwiper);
                        }

                        const mainSwiperConfig = {
                            modules: [Thumbs, Navigation],
                            spaceBetween: 10,
                            slidesPerView: 1,
                            navigation: {
                                nextEl: $mainContainer.find('.swiper-button-next')[0],
                                prevEl: $mainContainer.find('.swiper-button-prev')[0]
                            }
                        };

                        if (thumbsSwiper) {
                            mainSwiperConfig.thumbs = {
                                swiper: thumbsSwiper,
                            };
                        }

                        mainSwiper = new Swiper($mainContainer[0], mainSwiperConfig);
                        $mainContainer.data('swiper-instance', mainSwiper);
                    }
                }
            });
        };

        initOrDestroyGallerySwiper();

        let resizeTimer;
        $(window).on('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(initOrDestroyGallerySwiper, 150);
        });
    };

    const vmInitAjaxPagination = () => {
        $(document).on('click', '[data-ajax="true"] a.page-numbers', function (e) {
            e.preventDefault();
            const $this = $(this);
            const $wrapper = $this.closest('[data-ajax="true"]');
            const href = $this.attr('href');

            if (!href) return;

            // Extract page number
            let page = 1;
            const match = href.match(/paged=(\d+)/) || href.match(/\/page\/(\d+)/);
            if (match && match[1]) {
                page = parseInt(match[1], 10);
            } else if ($this.hasClass('prev')) {
                page = Math.max(1, parseInt($wrapper.find('.current').text() || 2, 10) - 1);
            } else if ($this.hasClass('next')) {
                page = parseInt($wrapper.find('.current').text() || 1, 10) + 1;
            }

            const action = $wrapper.data('action');
            const containerSelector = $wrapper.data('container');
            const nonce = $wrapper.data('nonce');

            // Read initial params
            let params = $wrapper.data('params') || {};
            if (typeof params === 'string') {
                try {
                    params = JSON.parse(params);
                } catch (e) {
                    params = {};
                }
            }

            // Allow external scripts to attach extra dynamic filters
            const eventData = { action: action, params: params, page: page };
            $(document).trigger('vm_pagination_before_ajax', [eventData]);

            // Prevent multiple requests
            if ($wrapper.hasClass('is-loading')) return;
            $wrapper.addClass('is-loading');

            const $container = $(containerSelector);
            if ($container.length) {
                // Find a common wrapper to add loading state
                $container.parent().addClass('is-loading');
            }

            $.ajax({
                url: php_data.ajax_url,
                type: 'POST',
                data: {
                    action: eventData.action,
                    nonce: nonce,
                    page: eventData.page,
                    ...eventData.params
                },
                success: function (res) {
                    $wrapper.removeClass('is-loading');
                    if ($container.length) {
                        $container.parent().removeClass('is-loading');
                    }
                    if (res.success && res.data) {
                        // Update items container
                        if (res.data.html !== undefined || res.data.items !== undefined) {
                            const newHtml = res.data.html !== undefined ? res.data.html : res.data.items;
                            if ($container.length) {
                                $container.html(newHtml);
                                // Reinitialize any JS dependencies on new content
                                $(document).trigger('vm_content_loaded', [$container]);
                            }
                        }

                        // Update pagination HTML
                        if (res.data.pagination) {
                            $wrapper.html(res.data.pagination);
                        } else {
                            $wrapper.empty();
                        }

                        // Update count if provided
                        if (res.data.count !== undefined) {
                            $(document).trigger('vm_pagination_count_updated', [action, res.data.count]);
                        }

                        // Scroll to top of container
                        if ($container.length) {
                            $('html, body').animate({ scrollTop: $container.offset().top - 150 }, 300);
                        }
                    }
                },
                error: function () {
                    $wrapper.removeClass('is-loading');
                    if ($container.length) {
                        $container.parent().removeClass('is-loading');
                    }
                    console.error('AJAX Pagination Failed');
                }
            });
        });
    };

    const vmInitSearchModal = () => {
        const $modal = $('#search-modal');
        const $btnOpen = $('#btn_search');
        const $btnClose = $('.search-modal__close');
        const $overlay = $('.search-modal__overlay');
        const $input = $('#search-modal-input');

        if (!$modal.length || !$btnOpen.length) return;

        const openModal = () => {
            $modal.addClass('is-active');
            $('body').addClass('search-modal-open');
            setTimeout(() => {
                $input.focus();
            }, 100);
        };

        const closeModal = () => {
            $modal.removeClass('is-active');
            $('body').removeClass('search-modal-open');
            $btnOpen.focus();
        };

        $btnOpen.on('click', function (e) {
            e.preventDefault();
            openModal();
        });

        $btnClose.on('click', function (e) {
            e.preventDefault();
            closeModal();
        });

        $overlay.on('click', function (e) {
            closeModal();
        });

        $(document).on('keydown', function (e) {
            if (e.key === 'Escape' && $modal.hasClass('is-active')) {
                closeModal();
            }
        });
    };
    const vmTableOfContent = () => {
        const tocContainer = document.getElementById('vm-table-of-content');
        if (!tocContainer) return;

        // Query inside the post content to avoid sidebars
        const contentContainer = tocContainer.closest('.main-section-left__content') ||
            tocContainer.closest('.entry-content') ||
            document.querySelector('.main-section-left__content') ||
            document.querySelector('.entry-content') ||
            document.body;

        if (!contentContainer) {
            tocContainer.style.display = 'none';
            return;
        }

        const headings = contentContainer.querySelectorAll('h2, h3, h4');
        if (headings.length === 0) {
            tocContainer.style.display = 'none';
            return;
        }

        // Build HTML
        let tocHTML = `
            <div class="toc-header d-flex align-items-center justify-content-between">
                <span>Contents</span>
                <button class="toc-toggle-btn d-flex align-items-center gap-2" aria-expanded="false" aria-label="Expand Table of Contents">
                    <svg class="toc-toggle-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
            </div>
            <div class="toc-body" style="display: none;">
                <ul class="toc-list">
        `;
        let currentLevel = 1; // 1 = h2, 2 = h3

        headings.forEach((heading, index) => {
            // Generate ID if missing
            if (!heading.id) {
                const text = heading.innerText || heading.textContent;
                heading.id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + index;
            }

            let level;
            if (heading.tagName.toLowerCase() === 'h2') level = 1;
            else if (heading.tagName.toLowerCase() === 'h3') level = 2;
            else return;

            const headingId = heading.id;
            const headingText = heading.innerText || heading.textContent;

            if (index > 0) {
                if (level === currentLevel) {
                    tocHTML += '</li>';
                } else if (level > currentLevel) {
                    while (currentLevel < level) {
                        tocHTML += '<ul class="toc-nested-list">';
                        currentLevel++;
                    }
                } else if (level < currentLevel) {
                    while (currentLevel > level) {
                        tocHTML += '</li></ul>';
                        currentLevel--;
                    }
                    tocHTML += '</li>';
                }
            }

            tocHTML += `<li class="toc-item toc-h${level + 1}"><a href="#${headingId}">${headingText}</a>`;
            currentLevel = level;
        });

        while (currentLevel > 1) {
            tocHTML += '</li></ul>';
            currentLevel--;
        }
        if (headings.length > 0) {
            tocHTML += '</li>';
        }
        tocHTML += '</ul></div>';

        tocContainer.innerHTML = tocHTML;
        tocContainer.style.display = 'block';

        // Toggle logic
        const tocHeader = tocContainer.querySelector('.toc-header');
        const toggleBtn = tocContainer.querySelector('.toc-toggle-btn');
        const tocBody = tocContainer.querySelector('.toc-body');
        const toggleIcon = tocContainer.querySelector('.toc-toggle-icon');

        if (tocHeader && toggleBtn && tocBody) {
            tocHeader.addEventListener('click', function () {
                const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
                if (isExpanded) {
                    // Collapse
                    $(tocBody).slideUp(300);
                    toggleBtn.setAttribute('aria-expanded', 'false');
                    toggleIcon.style.transform = 'rotate(0deg)';
                } else {
                    // Expand
                    $(tocBody).slideDown(300);
                    toggleBtn.setAttribute('aria-expanded', 'true');
                    toggleIcon.style.transform = 'rotate(180deg)';
                }
            });
        }

        // Smooth scroll
        const tocLinks = tocContainer.querySelectorAll('a');
        tocLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    // Accounting for fixed header
                    const offset = 100;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = targetEl.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Intersection Observer for highlighting
        const observerOptions = {
            root: null,
            rootMargin: '-100px 0px -70% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    const activeLink = tocContainer.querySelector(`a[href="#${id}"]`);

                    if (activeLink) {
                        // Remove active class from all
                        tocLinks.forEach(link => link.classList.remove('is-active'));
                        // Add active class
                        activeLink.classList.add('is-active');
                    }
                }
            });
        }, observerOptions);

        headings.forEach(heading => observer.observe(heading));
    };

    const vmInitStarRating = () => {
        const $pickers = $('.star-picker');
        if (!$pickers.length) return;

        $pickers.each(function () {
            const $picker = $(this);
            const $labels = $picker.find('.star-picker__label');
            const $text = $picker.find('.star-picker__text');
            const defaultText = $text.text();

            $labels.on('mouseenter', function () {
                const index = $(this).index('.star-picker__label');
                $labels.removeClass('is-hovered');
                $labels.each(function (i) {
                    if (i <= index) {
                        $(this).addClass('is-hovered');
                    }
                });
                const rating = $(this).find('input').val();
                $text.text(rating + ' star' + (rating > 1 ? 's' : ''));
            });

            $picker.on('mouseleave', function () {
                $labels.removeClass('is-hovered');
                const $checked = $picker.find('input:checked');
                if ($checked.length) {
                    const rating = $checked.val();
                    $text.text(rating + ' star' + (rating > 1 ? 's' : ''));
                } else {
                    $text.text(defaultText);
                }
            });

            $labels.on('click', function () {
                const index = $(this).index('.star-picker__label');
                $labels.removeClass('is-active');
                $labels.each(function (i) {
                    if (i <= index) {
                        $(this).addClass('is-active');
                    }
                });
                $picker.removeClass('star-picker--error');
            });

            // Add focus/keyboard support
            $picker.find('input').on('focus', function () {
                $(this).parent().addClass('is-hovered');
            }).on('blur', function () {
                $(this).parent().removeClass('is-hovered');
            }).on('change', function () {
                const index = $(this).parent().index('.star-picker__label');
                $labels.removeClass('is-active');
                $labels.each(function (i) {
                    if (i <= index) {
                        $(this).addClass('is-active');
                    }
                });
                $picker.removeClass('star-picker--error');
                const rating = $(this).val();
                $text.text(rating + ' star' + (rating > 1 ? 's' : ''));
            });
        });

        $('#vm-review-form').on('submit', function (e) {
            let hasError = false;
            $pickers.each(function () {
                const $picker = $(this);
                const $checked = $picker.find('input:checked');
                if (!$checked.length) {
                    $picker.addClass('star-picker--error');
                    hasError = true;
                    setTimeout(() => {
                        $picker.removeClass('star-picker--error');
                    }, 400);
                }
            });
            if (hasError) {
                e.preventDefault();
            }
        });
    };

    const vmInitRelatedSwiper = () => {
        const $carousels = $('.related-tour-section__list.swiper, .related-post-section__list.swiper');
        if (!$carousels.length) return;

        const initOrDestroySwiper = () => {
            const isMobile = window.innerWidth <= 991;

            $carousels.each(function () {
                const $carousel = $(this);
                let swiper = $carousel.data('swiper-instance');

                if (isMobile) {
                    if (!swiper) {
                        swiper = new Swiper(this, {
                            modules: [Autoplay],
                            slidesPerView: 1.15,
                            spaceBetween: 16,
                            grabCursor: true,
                            speed: 600,
                            autoplay: {
                                delay: 3000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            },
                            breakpoints: {
                                768: {
                                    slidesPerView: 2.15,
                                    spaceBetween: 24,
                                }
                            }
                        });
                        $carousel.data('swiper-instance', swiper);
                    }
                } else {
                    if (swiper) {
                        swiper.destroy(true, true);
                        $carousel.removeData('swiper-instance');
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

    const vmInitAnchorScrollSpy = () => {
        const $nav = $('#vm-anchor-nav');
        if (!$nav.length) return;

        const $links = $nav.find('.anchor-nav__link');
        if (!$links.length) return;

        const sections = [];
        $links.each(function () {
            const targetId = $(this).attr('href');
            if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                const $target = $(targetId);
                if ($target.length) {
                    sections.push({
                        link: $(this),
                        target: $target
                    });
                }
            }
        });

        if (!sections.length) return;

        let isScrolling = false;

        $links.on('click', function (e) {
            $links.removeClass('is-active');
            $(this).addClass('is-active');

            isScrolling = true;

            const navInner = $nav.find('.anchor-nav__list')[0];
            const itemLeft = this.offsetLeft;
            const itemWidth = this.offsetWidth;
            const navWidth = navInner.offsetWidth;
            if (navInner) {
                navInner.scrollTo({
                    left: itemLeft - (navWidth / 2) + (itemWidth / 2),
                    behavior: 'smooth'
                });
            }

            setTimeout(() => {
                isScrolling = false;
            }, 800);
        });

        const onScroll = () => {
            if (isScrolling) return;

            const scrollPos = $(window).scrollTop();
            const offset = 180;

            let currentActive = null;

            for (let i = 0; i < sections.length; i++) {
                const section = sections[i];
                const sectionTop = section.target.offset().top - offset;

                if (scrollPos >= sectionTop) {
                    currentActive = section.link;
                }
            }

            const docHeight = $(document).height();
            const winHeight = $(window).height();
            if (scrollPos + winHeight >= docHeight - 50) {
                currentActive = sections[sections.length - 1].link;
            }

            if (currentActive) {
                if (!currentActive.hasClass('is-active')) {
                    $links.removeClass('is-active');
                    currentActive.addClass('is-active');

                    const navInner = $nav.find('.anchor-nav__list')[0];
                    if (navInner) {
                        const itemLeft = currentActive[0].offsetLeft;
                        const itemWidth = currentActive[0].offsetWidth;
                        const navWidth = navInner.offsetWidth;
                        navInner.scrollTo({
                            left: itemLeft - (navWidth / 2) + (itemWidth / 2),
                            behavior: 'smooth'
                        });
                    }
                }
            } else if (scrollPos < sections[0].target.offset().top - offset) {
                $links.removeClass('is-active');
                sections[0].link.addClass('is-active');
            }
        };

        onScroll();

        let ticking = false;
        $(window).on('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    onScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    };

    const vmLazyLoadVideos = () => {
        const initLazyVideos = () => {
            const lazyVideos = document.querySelectorAll('video.lazy-video, video[data-src], video source[data-src]');
            lazyVideos.forEach(element => {
                const video = element.tagName.toLowerCase() === 'source' ? element.closest('video') : element;

                if (video && !video.dataset.lazyLoaded && !video.dataset.isObserving) {
                    if ('IntersectionObserver' in window) {
                        video.dataset.isObserving = 'true';
                        videoObserver.observe(video);
                    } else {
                        loadVideo(video);
                    }
                }
            });
        };

        const loadVideo = (video) => {
            if (video.dataset.lazyLoaded) return;
            video.dataset.lazyLoaded = 'true';

            let needsLoad = false;

            if (video.hasAttribute('data-src')) {
                video.src = video.getAttribute('data-src');
                video.removeAttribute('data-src');
                needsLoad = true;
            }

            const sources = video.querySelectorAll('source');
            sources.forEach(source => {
                if (source.hasAttribute('data-src')) {
                    source.src = source.getAttribute('data-src');
                    source.removeAttribute('data-src');
                    needsLoad = true;
                }
            });

            if (needsLoad) {
                video.load();
                // Play if autoplay attribute is present, sometimes required by browsers when src is set dynamically
                if (video.hasAttribute('autoplay')) {
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(() => {
                            // Autoplay was prevented by browser, safe to ignore
                        });
                    }
                }
            }
        };

        let videoObserver;
        if ('IntersectionObserver' in window) {
            videoObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const video = entry.target;
                        loadVideo(video);
                        observer.unobserve(video);
                    }
                });
            }, {
                rootMargin: '200px 0px',
                threshold: 0.01
            });
        }

        initLazyVideos();

        if (typeof MutationObserver !== 'undefined') {
            const mutationObserver = new MutationObserver((mutations) => {
                let hasNewNodes = false;
                for (let i = 0; i < mutations.length; i++) {
                    const mutation = mutations[i];
                    if (mutation.addedNodes.length > 0) {
                        for (let j = 0; j < mutation.addedNodes.length; j++) {
                            const node = mutation.addedNodes[j];
                            if (node.nodeType === 1) {
                                if (node.tagName && node.tagName.toLowerCase() === 'video' && (node.classList.contains('lazy-video') || node.hasAttribute('data-src') || node.querySelector('source[data-src]'))) {
                                    hasNewNodes = true;
                                    break;
                                } else if (node.querySelectorAll) {
                                    const lazyVideos = node.querySelectorAll('video.lazy-video, video[data-src], video source[data-src]');
                                    if (lazyVideos.length > 0) {
                                        hasNewNodes = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    if (hasNewNodes) break;
                }

                if (hasNewNodes) {
                    initLazyVideos();
                }
            });

            mutationObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    };

    $(document).ready(function () {
        vmHeroSliders()
        vmCounters()
        vmIconHeading()
        vmInitToursSwiper()
        vmInitRelatedSwiper()
        vmInitAnchorScrollSpy()
        vmInitTestimonialsSwiper()
        vmInitCarToursSwiper()
        vmInitPostsSwiper()
        vmInitFaqsAccordion()
        vmInitMapLocationsScroll()
        vmInitMapLocationsHover()
        vmInitOurTeamSwiper()
        vmInitBackToTop()
        vmParallaxGraphics()
        vmInitLicenseModal()
        vmInitTourGallery()
        vmInitMobileGallerySwiper()
        vmInitQuantitySelectors()
        vmInitAjaxTourOptions()
        vmInitCheckoutForm()
        vmInitAboutCarGallerySwiper()
        vmInitHotelAreaTabs()
        vmInitAjaxPagination()
        vmInitSearchModal()
        vmInitStarRating()
        vmTableOfContent()
        // vmLazyLoadVideos()
    });
})(jQuery);