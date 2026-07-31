(function ($) {
  "use strict";


  const hleInitStickyHeader = () => {
    var $header = $('#site-header');
    if ($header.length === 0) {
      return;
    }

    var threshold = 80;
    var isFixed = false;
    var ticking = false;
    var $window = $(window);

    function updateHeader() {
      var scrollTop = $window.scrollTop();

      if (scrollTop > threshold) {
        if (!isFixed) {
          $header.addClass('is-fixed');
          isFixed = true;
        }
      } else {
        if (isFixed) {
          $header.removeClass('is-fixed');
          isFixed = false;
        }
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }

    $window.on('scroll', onScroll);
    updateHeader(); // trigger immediately on page load
  }

  const hleInitMobileMenu = () => {
    const $btnToggle = $('#mobile-side-drawer');
    const $menu = $('#offcanvas-menu');
    const $overlay = $('.offcanvas-overlay');
    const $btnClose = $('.offcanvas-menu__close');
    const $body = $('body');
    const $navItemsWithChildren = $menu.find('.menu-item-has-children');

    // Add toggle buttons to parent items
    $navItemsWithChildren.each(function() {
      $(this).children('a').after(`
        <button class="submenu-toggle" aria-expanded="false" aria-label="Toggle submenu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      `);
    });

    const openMenu = () => {
      $menu.addClass('is-active').attr('aria-hidden', 'false');
      $overlay.addClass('is-active').attr('aria-hidden', 'false');
      $btnToggle.addClass('is-active').attr('aria-expanded', 'true');
      $body.addClass('offcanvas-open');
      
      // Focus trap setup - set focus to close button
      setTimeout(() => {
        $btnClose.focus();
      }, 400);
    };

    const closeMenu = () => {
      $menu.removeClass('is-active').attr('aria-hidden', 'true');
      $overlay.removeClass('is-active').attr('aria-hidden', 'true');
      $btnToggle.removeClass('is-active').attr('aria-expanded', 'false');
      $body.removeClass('offcanvas-open');
      
      // Return focus to toggle button
      $btnToggle.focus();
    };

    $btnToggle.off('click').on('click', function(e) {
      e.preventDefault();
      if ($menu.hasClass('is-active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    $btnClose.off('click').on('click', function(e) {
      e.preventDefault();
      closeMenu();
    });

    $overlay.off('click').on('click', function() {
      closeMenu();
    });

    // Close on ESC key
    $(document).off('keydown.offcanvas').on('keydown.offcanvas', function(e) {
      if (e.key === 'Escape' && $menu.hasClass('is-active')) {
        closeMenu();
      }
    });

    // Accordion toggle
    $menu.find('.submenu-toggle').off('click').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const $this = $(this);
      const $submenu = $this.siblings('.sub-menu');

      $this.toggleClass('is-expanded');
      
      if ($this.hasClass('is-expanded')) {
        $this.attr('aria-expanded', 'true');
        $submenu.slideDown(300);
      } else {
        $this.attr('aria-expanded', 'false');
        $submenu.slideUp(300);
      }
    });

    // Focus trap
    $menu.on('keydown', function(e) {
      if (e.key !== 'Tab') return;

      const focusableElements = $menu.find('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else { // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  };

  $(document).ready(function () {
    hleInitMobileMenu();
    hleInitStickyHeader();
  });
})(jQuery);