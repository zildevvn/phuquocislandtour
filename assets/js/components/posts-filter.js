(function ($) {
    "use strict";

    const vmPostsFilter = () => {
        const $postsSection = $('.posts-list-section');
        if (!$postsSection.length) return;

        const $results = $('#vm-posts-results');
        const $pagination = $('#vm-posts-pagination');
        const $count = $('#vm-posts-count');
        const $emptyState = $('#vm-posts-empty');
        const $loadingContainer = $('.posts-list-wrapper');

        const $searchInput = $('#vm-posts-search-input');
        const $clearBtn = $('#vm-posts-clear-filters');
        let currentPage = 1;
        let ajaxRequest = null;
        let searchTimeout = null;

        // Custom Dropdown Logic
        const $dropdownTriggers = $('.vm-dropdown-trigger');
        $dropdownTriggers.on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const $this = $(this);
            const isExpanded = $this.attr('aria-expanded') === 'true';

            // Close all other dropdowns
            $('.vm-dropdown-trigger').attr('aria-expanded', 'false');
            $('.vm-dropdown-menu').removeClass('is-open');

            if (!isExpanded) {
                $this.attr('aria-expanded', 'true');
                $('#' + $this.attr('aria-controls')).addClass('is-open');
            }
        });

        $(document).on('click', function (e) {
            if (!$(e.target).closest('.vm-custom-dropdown').length) {
                $('.vm-dropdown-trigger').attr('aria-expanded', 'false');
                $('.vm-dropdown-menu').removeClass('is-open');
            }
        });

        // Category Filter Change
        const $catRadios = $('input[name="post_cat"]');
        $catRadios.on('change', function () {
            const label = $(this).data('label');
            const $triggerLabel = $(this).closest('.vm-custom-dropdown').find('.vm-dropdown-label');
            $triggerLabel.text(label);
            
            // Close dropdown
            $(this).closest('.vm-dropdown-menu').removeClass('is-open');
            $(this).closest('.vm-custom-dropdown').find('.vm-dropdown-trigger').attr('aria-expanded', 'false');

            triggerFilter(true);
        });

        // Search Input Change (Debounced)
        $searchInput.on('input', function () {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(function () {
                triggerFilter(true);
            }, 500);
        });

        // Clear Filters Action
        $clearBtn.on('click', function (e) {
            e.preventDefault();
            $searchInput.val('');
            
            // Reset Category
            const $allCat = $('input[name="post_cat"][value="all"]');
            $allCat.prop('checked', true);
            const label = $allCat.data('label');
            $allCat.closest('.vm-custom-dropdown').find('.vm-dropdown-label').text(label);

            triggerFilter(true);
        });

        // Pagination Click
        $(document).on('click', '#vm-posts-pagination a.page-numbers', function (e) {
            e.preventDefault();
            const href = $(this).attr('href');
            if (href) {
                const match = href.match(/paged=(\d+)/) || href.match(/\/page\/(\d+)/);
                currentPage = match ? parseInt(match[1]) : 1;
                triggerFilter(false); // Do not reset page to 1
            }
        });

        // Main AJAX Filter Function
        function triggerFilter(resetPage = true) {
            if (resetPage) {
                currentPage = 1;
            }

            const searchVal = $searchInput.val();
            const catVal = $('input[name="post_cat"]:checked').val();

            // Toggle Clear Button Visibility
            if (searchVal || catVal !== 'all') {
                $clearBtn.show();
            } else {
                $clearBtn.hide();
            }

            $loadingContainer.addClass('is-loading');

            if (ajaxRequest) {
                ajaxRequest.abort();
            }

            ajaxRequest = $.ajax({
                url: php_data.ajax_url,
                type: 'POST',
                data: {
                    action: 'vm_ajax_filter_posts',
                    nonce: php_data.vm_filter_posts_nonce,
                    keySeach: searchVal, // Match backend parameter name exactly
                    post_cat: catVal,
                    currentpage: currentPage
                },
                success: function (res) {
                    $loadingContainer.removeClass('is-loading');

                    if (res.success) {
                        const data = res.data;

                        if (parseInt(data.count) > 0) {
                            $results.html(data.items);
                            $results.show();
                            $emptyState.hide();
                        } else {
                            $results.html('');
                            $results.hide();
                            $emptyState.show();
                        }

                        $count.text(data.count);
                        $pagination.html(data.pagination);
                        
                        // Scroll to top of results smoothly
                        if (resetPage) {
                            $('html, body').animate({
                                scrollTop: $('.posts-filter-bar').offset().top - 120
                            }, 500);
                        } else {
                            $('html, body').animate({
                                scrollTop: $('.posts-filter-bar').offset().top - 80
                            }, 500);
                        }
                    }
                },
                error: function (err) {
                    if (err.statusText !== 'abort') {
                        $loadingContainer.removeClass('is-loading');
                        console.error("Ajax filter error:", err);
                    }
                }
            });
        }
    };

    $(document).ready(vmPostsFilter);
})(jQuery);
