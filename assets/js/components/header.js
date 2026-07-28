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

  $(document).ready(function () {
    hleInitStickyHeader();
  });
})(jQuery);