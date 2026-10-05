(function ($) {
    "use strict";

    const vmToursFilter = () => {
        const $tours = $('.tours-sidebar');
        if (!$tours.length) return;

        // ---------------------------
        // 1. UTILS & CONFIG
        // ---------------------------
        const formatUSD = (val) => new Intl.NumberFormat('vi-VN', {
            style: 'currency', currency: 'VND', minimumFractionDigits: 0
        }).format(val);

        const SliderConfigs = {
            pax: {
                minDefault: 1, maxDefault: 50, minRange: 1, maxRange: 50, step: 1,
                formatDisplay: (min, max) => `${min} &ndash; ${max} Guests`
            },
            price: {
                minDefault: 0, maxDefault: 20000000, minRange: 0, maxRange: 20000000, step: 10,
                formatDisplay: (min, max) => `${formatUSD(min)} &mdash; ${formatUSD(max)}`
            }
        };

        const getSliderDOM = (idPrefix) => ({
            el: document.getElementById(`vm-tours-${idPrefix}-slider`),
            minIn: document.getElementById(`vm-tours-${idPrefix}-min`),
            maxIn: document.getElementById(`vm-tours-${idPrefix}-max`),
            display: document.getElementById(`vm-tours-${idPrefix}-display`)
        });

        // ---------------------------
        // 2. DOM CACHE
        // ---------------------------
        const DOM = {
            tours: $tours,
            results: $('#vm-tours-results'),
            pagination: $('#vm-tours-pagination'),
            count: $('#vm-tours-count'),
            emptyState: $('#vm-tours-empty'),
            loadingContainer: $('.tours-content'),
            searchInput: $('#vm-tours-search-input'),
            mobileFilterBtn: $('#vm-mobile-filter-btn'),
            closeFilterBtn: $('#vm-close-filter-btn'),
            sidebarBackdrop: $('#vm-tours-sidebar-backdrop'),
            body: $('body'),
            sortSelect: $('#vm-tours-sort'),
            clearBtn: $('#vm-clear-filters'),
            sliders: {
                pax: getSliderDOM('pax'),
                price: getSliderDOM('price')
            }
        };

        // ---------------------------
        // 3. STATE
        // ---------------------------
        const State = {
            page: 1,
            isClearing: false
        };

        // ---------------------------
        // 4. LIFECYCLE MANAGEMENT
        // ---------------------------
        const Lifecycle = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),

            init() {
                DOM.tours.data('vmLifecycleId', this.id);
                this.abortAjax();
                this.clearSearchTimeout();
            },

            isCurrent() {
                return DOM.tours.data('vmLifecycleId') === this.id;
            },

            abortAjax() {
                const req = DOM.tours.data('vmAjaxRequest');
                if (req) {
                    req.abort();
                    DOM.tours.removeData('vmAjaxRequest');
                }
            },

            setAjax(req) {
                DOM.tours.data('vmAjaxRequest', req);
            },

            getAjax() {
                return DOM.tours.data('vmAjaxRequest');
            },

            clearAjaxIfMatch(req) {
                if (this.isCurrent() && this.getAjax() === req) {
                    DOM.tours.removeData('vmAjaxRequest');
                }
            },

            clearSearchTimeout() {
                const id = DOM.tours.data('vmSearchTimeout');
                if (id) clearTimeout(id);
            },

            setSearchTimeout(cb, delay) {
                this.clearSearchTimeout();
                const id = setTimeout(() => {
                    if (DOM.tours.data('vmSearchTimeout') === id) {
                        DOM.tours.removeData('vmSearchTimeout');
                    }
                    if (!this.isCurrent()) return;
                    cb();
                }, delay);
                DOM.tours.data('vmSearchTimeout', id);
            },

            safeTimeout(cb, delay) {
                return setTimeout(() => {
                    if (!this.isCurrent()) return;
                    cb();
                }, delay);
            }
        };

        // ---------------------------
        // 5. FILTER STATE LOGIC
        // ---------------------------
        const triggerFilterUpdate = (delay = 0) => {
            if (State.isClearing) return;
            Lifecycle.clearSearchTimeout();
            State.page = 1;

            if (delay > 0) {
                Lifecycle.setSearchTimeout(fetchTours, delay);
            } else {
                fetchTours();
            }
        };

        const getFilterPayload = () => {
            const payload = {
                search: DOM.searchInput.val(),
                tour_cat: DOM.tours.find('input[name="tour_cat"]:checked').val(),
                sort: DOM.sortSelect.val(),
                page: State.page
            };

            Object.keys(SliderConfigs).forEach(type => {
                const s = DOM.sliders[type];
                payload[`${type}_min`] = s.minIn ? s.minIn.value : '';
                payload[`${type}_max`] = s.maxIn ? s.maxIn.value : '';
            });

            return payload;
        };

        const toggleClearButton = (payload) => {
            const isSliderActive = Object.entries(SliderConfigs).some(([type, config]) => {
                const minStr = payload[`${type}_min`];
                const maxStr = payload[`${type}_max`];
                if (minStr === '' || maxStr === '') return false;

                const minVal = Number(minStr);
                const maxVal = Number(maxStr);
                return minVal > config.minRange || maxVal < config.maxRange;
            });

            const isActive = payload.search ||
                payload.tour_cat !== 'all' ||
                payload.sort !== 'default' ||
                isSliderActive;
            DOM.clearBtn.toggle(!!isActive);
        };

        // ---------------------------
        // 6. SLIDERS
        // ---------------------------
        const initSlider = (type) => {
            if (typeof noUiSlider === 'undefined') return;
            const config = SliderConfigs[type];
            const s = DOM.sliders[type];
            if (!s.el || !s.minIn || !s.maxIn) return;

            if (!s.el.noUiSlider) {
                const parsedMin = parseInt(s.minIn.value, 10);
                const parsedMax = parseInt(s.maxIn.value, 10);

                let initMin = isNaN(parsedMin) ? config.minDefault : parsedMin;
                let initMax = isNaN(parsedMax) ? config.maxDefault : parsedMax;

                initMin = Math.max(config.minRange, Math.min(initMin, config.maxRange));
                initMax = Math.max(config.minRange, Math.min(initMax, config.maxRange));
                if (initMin > initMax) initMin = initMax;

                noUiSlider.create(s.el, {
                    start: [initMin, initMax],
                    connect: true,
                    step: config.step,
                    range: { 'min': config.minRange, 'max': config.maxRange }
                });
            }

            s.el.noUiSlider.off('.vmToursFilter');

            s.el.noUiSlider.on('update.vmToursFilter', function (values) {
                const min = Math.round(values[0]);
                const max = Math.round(values[1]);
                s.minIn.value = min;
                s.maxIn.value = max;
                if (s.display) {
                    s.display.innerHTML = config.formatDisplay(min, max);
                }
            });

            s.el.noUiSlider.on('change.vmToursFilter', () => triggerFilterUpdate(0));
        };

        // ---------------------------
        // 7. MOBILE MENU
        // ---------------------------
        const MobileMenu = {
            open() {
                DOM.tours.addClass('is-open');
                DOM.sidebarBackdrop.addClass('is-visible');
                DOM.body.css('overflow', 'hidden');
            },
            close() {
                DOM.tours.removeClass('is-open');
                DOM.sidebarBackdrop.removeClass('is-visible');
                DOM.body.css('overflow', '');
            }
        };

        // ---------------------------
        // 8. AJAX HANDLING
        // ---------------------------
        const fetchTours = () => {
            if (typeof php_data === 'undefined' || !php_data.ajax_url) {
                console.error('php_data or ajax_url is missing');
                return;
            }

            Lifecycle.abortAjax();

            const payload = getFilterPayload();
            DOM.loadingContainer.addClass('is-loading');
            toggleClearButton(payload);

            const data = {
                action: 'vm_ajax_filter_tours',
                nonce: php_data.vm_filter_tours_nonce || '',
                ...payload
            };

            const currentAjax = $.ajax({
                type: "post",
                url: php_data.ajax_url,
                dataType: "json",
                data: data,
                success: function (res) {
                    if (!Lifecycle.isCurrent() || Lifecycle.getAjax() !== currentAjax) return;

                    if (res.success) {
                        const resData = res.data;
                        const hasResults = resData.count > 0;

                        DOM.results.html(resData.html || '').toggle(hasResults);
                        DOM.pagination.html(resData.pagination || '').toggle(hasResults);
                        DOM.emptyState.toggle(!hasResults);
                        DOM.count.text(resData.count);

                        if (DOM.tours.hasClass('is-open')) {
                            MobileMenu.close();
                        }
                    } else {
                        console.error('Filter Error:', res.data.message);
                    }
                },
                error: function (err) {
                    if (!Lifecycle.isCurrent() || Lifecycle.getAjax() !== currentAjax) return;
                    if (err.statusText !== 'abort') {
                        console.error('AJAX request failed', err);
                    }
                },
                complete: function () {
                    if (Lifecycle.isCurrent() && Lifecycle.getAjax() === currentAjax) {
                        DOM.loadingContainer.removeClass('is-loading');
                        Lifecycle.clearAjaxIfMatch(currentAjax);
                    }
                }
            });

            Lifecycle.setAjax(currentAjax);
        };

        // ---------------------------
        // 9. EVENT BINDINGS
        // ---------------------------
        const handleClearFilters = (e) => {
            e.preventDefault();
            State.isClearing = true;
            Lifecycle.clearSearchTimeout();

            DOM.searchInput.val('');
            DOM.tours.find('input[name="tour_cat"][value="all"]').prop('checked', true);
            DOM.sortSelect.val('default');

            // Reset manual inputs dynamically based on configs
            Object.entries(SliderConfigs).forEach(([type, config]) => {
                const s = DOM.sliders[type];
                if (s.minIn) s.minIn.value = config.minDefault;
                if (s.maxIn) s.maxIn.value = config.maxDefault;
                if (s.display) s.display.innerHTML = config.formatDisplay(config.minDefault, config.maxDefault);

                if (typeof noUiSlider !== 'undefined' && s.el && s.el.noUiSlider) {
                    s.el.noUiSlider.set([config.minDefault, config.maxDefault]);
                }
            });

            State.page = 1;
            fetchTours();

            Lifecycle.safeTimeout(() => {
                State.isClearing = false;
            }, 0);
        };

        const bindEvents = () => {
            // Mobile toggle
            DOM.mobileFilterBtn.off('click.vmToursFilter').on('click.vmToursFilter', MobileMenu.open);
            DOM.closeFilterBtn.off('click.vmToursFilter').on('click.vmToursFilter', MobileMenu.close);
            DOM.sidebarBackdrop.off('click.vmToursFilter').on('click.vmToursFilter', MobileMenu.close);

            $(document).off('keydown.vmToursFilter').on('keydown.vmToursFilter', (e) => {
                if (e.key === 'Escape' && DOM.tours.hasClass('is-open')) {
                    MobileMenu.close();
                }
            });

            // Inputs
            DOM.searchInput.off('input.vmToursFilter').on('input.vmToursFilter', () => triggerFilterUpdate(400));
            DOM.tours.off('change.vmToursFilter', 'input[name="tour_cat"]').on('change.vmToursFilter', 'input[name="tour_cat"]', () => triggerFilterUpdate(0));
            DOM.sortSelect.off('change.vmToursFilter').on('change.vmToursFilter', () => triggerFilterUpdate(0));
            DOM.clearBtn.off('click.vmToursFilter').on('click.vmToursFilter', handleClearFilters);

            // Pagination integration
            $(document).off('vm_pagination_before_ajax.vmToursFilter').on('vm_pagination_before_ajax.vmToursFilter', (e, data) => {
                if (data.action === 'vm_ajax_filter_tours') {
                    Object.assign(data.params, getFilterPayload());
                    data.params.page = data.page;
                }
            });
        };

        // ---------------------------
        // BOOTSTRAP
        // ---------------------------
        Lifecycle.init();
        Object.keys(SliderConfigs).forEach(initSlider);
        bindEvents();
    };

    $(document).ready(function () {
        vmToursFilter();
    });

})(jQuery);
