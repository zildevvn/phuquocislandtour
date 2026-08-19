(function ($) {
    "use strict";

    const vmToursFilter = () => {
        const $tours = $('.tours-sidebar');
        if (!$tours.length) return;

        const $results = $('#vm-tours-results');
        const $pagination = $('#vm-tours-pagination');
        const $count = $('#vm-tours-count');
        const $emptyState = $('#vm-tours-empty');
        const $loading = $('.tours-loading-overlay');

        const $searchInput = $('#vm-tours-search-input');
        const $sortSelect = $('#vm-tours-sort');
        const $clearBtn = $('#vm-clear-filters');
        let currentPage = 1;
        let ajaxRequest = null;
        let searchTimeout = null;
        let loadingTimeout = null;

        // Sliders
        const paxSlider = document.getElementById('vm-tours-pax-slider');
        const paxMinInput = document.getElementById('vm-tours-pax-min');
        const paxMaxInput = document.getElementById('vm-tours-pax-max');
        const paxDisplay = document.getElementById('vm-tours-pax-display');

        const priceSlider = document.getElementById('vm-tours-price-slider');
        const priceMinInput = document.getElementById('vm-tours-price-min');
        const priceMaxInput = document.getElementById('vm-tours-price-max');
        const priceDisplay = document.getElementById('vm-tours-price-display');


        // Initialize Sliders
        if (paxSlider && paxMinInput && paxMaxInput) {
            noUiSlider.create(paxSlider, {
                start: [parseInt(paxMinInput.value) || 1, parseInt(paxMaxInput.value) || 50],
                connect: true,
                step: 1,
                range: { 'min': 1, 'max': 50 }
            });

            paxSlider.noUiSlider.on('update', function (values) {
                const min = Math.round(values[0]);
                const max = Math.round(values[1]);
                paxMinInput.value = min;
                paxMaxInput.value = max;
                if (paxDisplay) paxDisplay.innerHTML = `${min} &ndash; ${max} Guests`;
            });

            paxSlider.noUiSlider.on('change', () => {
                currentPage = 1;
                fetchTours();
            });
        }


        if (priceSlider && priceMinInput && priceMaxInput) {
            noUiSlider.create(priceSlider, {
                start: [parseInt(priceMinInput.value) || 0, parseInt(priceMaxInput.value) || 1000],
                connect: true,
                step: 10,
                range: { 'min': 0, 'max': 1000 }
            });

            priceSlider.noUiSlider.on('update', function (values) {
                const min = Math.round(values[0]);
                const max = Math.round(values[1]);
                priceMinInput.value = min;
                priceMaxInput.value = max;
                if (priceDisplay) {
                    const formatUSD = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(val);
                    priceDisplay.innerHTML = `${formatUSD(min)} &mdash; ${formatUSD(max)}`;
                }
            });

            priceSlider.noUiSlider.on('change', () => {
                currentPage = 1;
                fetchTours();
            });
        }

        // Event Listeners
        $searchInput.on('input', function () {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                currentPage = 1;
                fetchTours();
            }, 400);
        });

        $tours.on('change', 'input[name="tour_cat"]', function () {
            currentPage = 1;
            fetchTours();
        });

        $sortSelect.on('change', function () {
            currentPage = 1;
            fetchTours();
        });

        // Pagination
        $(document).on('click', '#vm-tours-pagination a.page-numbers', function (e) {
            e.preventDefault();
            const href = $(this).attr('href');

            let match = href.match(/paged=(\d+)/) || href.match(/\/page\/(\d+)/);
            if (match && match[1]) {
                currentPage = parseInt(match[1], 10);
            } else if ($(this).hasClass('prev')) {
                currentPage = Math.max(1, currentPage - 1);
            } else if ($(this).hasClass('next')) {
                currentPage = currentPage + 1;
            } else {
                currentPage = 1;
            }

            fetchTours();
            $('html, body').animate({ scrollTop: $('.tours-content').offset().top - 150 }, 300);
        });


        // Clear filters
        $('#vm-clear-filters').on('click', function (e) {
            e.preventDefault();
            $searchInput.val('');
            $('input[name="tour_cat"][value="all"]').prop('checked', true);
            $sortSelect.val('default');
            if (paxSlider) paxSlider.noUiSlider.set([1, 50]);
            if (priceSlider) priceSlider.noUiSlider.set([0, 1000]);
            currentPage = 1;
            fetchTours();
        });

        const getFilterState = () => {
            return {
                search: $searchInput.val(),
                pax_min: paxMinInput ? paxMinInput.value : '',
                pax_max: paxMaxInput ? paxMaxInput.value : '',
                price_min: priceMinInput ? priceMinInput.value : '',
                price_max: priceMaxInput ? priceMaxInput.value : '',
                tour_cat: $('input[name="tour_cat"]:checked').val(),
                sort: $sortSelect.val(),
                page: currentPage
            };
        };

        const fetchTours = () => {
            if (ajaxRequest) {
                ajaxRequest.abort();
            }

            if (loadingTimeout) {
                clearTimeout(loadingTimeout);
                loadingTimeout = null;
            }

            const state = getFilterState();

            loadingTimeout = setTimeout(() => {
                $loading.addClass('active');
            }, 150);

            if (state.search || state.tour_cat !== 'all' || state.sort !== 'default' || state.pax_min > 1 || state.pax_max < 50 || state.price_min > 0 || state.price_max < 1000) {
                $('#vm-clear-filters').show();
            } else {
                $('#vm-clear-filters').hide();
            }

            const data = {
                action: 'vm_ajax_filter_tours',
                nonce: typeof php_data !== 'undefined' ? php_data.vm_filter_tours_nonce : '',
                ...state
            };

            const currentAjax = $.ajax({
                type: "post",
                url: php_data.ajax_url,
                dataType: "json",
                data: data,
                success: function (res) {
                    if (res.success) {
                        const payload = res.data;

                        if (payload.count > 0) {
                            $results.html(payload.html).show();
                            $pagination.html(payload.pagination).show();
                            $emptyState.hide();
                        } else {
                            $results.hide();
                            $pagination.hide();
                            $emptyState.show();
                        }

                        $count.text(payload.count);
                    } else {
                        console.error('Filter Error:', res.data.message);
                    }
                },
                error: function (err) {
                    if (err.statusText !== 'abort') {
                        console.error('AJAX request failed', err);
                    }
                },
                complete: function () {
                    if (ajaxRequest === currentAjax) {
                        if (loadingTimeout) {
                            clearTimeout(loadingTimeout);
                            loadingTimeout = null;
                        }
                        $loading.removeClass('active');
                    }
                }
            });
            ajaxRequest = currentAjax;
        };

    }

    $(document).ready(function () {
        vmToursFilter()
    });

})(jQuery);
