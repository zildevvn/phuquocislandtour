

import Swiper from 'swiper';
import { Pagination, Navigation, Autoplay, EffectFade, Keyboard } from 'swiper/modules';
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

    const hleInitDailyTourSwiper = () => {
        const $section = $('.daily-tour-section');
        if (!$section.length) return;

        const $carousel = $section.find('.daily-tour-section__carousel');
        if (!$carousel.length) return;

        const $slides = $carousel.find('.swiper-slide');
        if ($slides.length <= 1) return;

        new Swiper($carousel[0], {
            modules: [Navigation, Pagination, Autoplay],
            slidesPerView: 1,
            spaceBetween: 16,
            loop: $slides.length > 4,
            grabCursor: true,
            speed: 600,
            observer: true,
            observeParents: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            navigation: {
                nextEl: '.daily-tour-section .swiper-button-next',
                prevEl: '.daily-tour-section .swiper-button-prev',
            },
            pagination: {
                el: '.daily-tour-section .swiper-pagination',
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
                },
                1400: {
                    slidesPerView: 4
                }
            }
        });
    };

    $(document).ready(function () {
        vmHeroSliders()
        vmCounters()
        vmIconHeading()
        hleInitDailyTourSwiper()
    });
})(jQuery);