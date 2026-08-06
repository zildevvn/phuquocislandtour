

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
                speed: 800,
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

    const hleInitToursSwiper = () => {
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

    const hleInitCarToursSwiper = () => {
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

    const hleInitTestimonialsSwiper = () => {
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

    $(document).ready(function () {
        vmHeroSliders()
        vmCounters()
        vmIconHeading()
        hleInitToursSwiper()
        hleInitTestimonialsSwiper()
        hleInitCarToursSwiper()
    });
})(jQuery);