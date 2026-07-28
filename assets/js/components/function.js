

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

    $(document).ready(function () {
        vmHeroSliders()
    });
})(jQuery);