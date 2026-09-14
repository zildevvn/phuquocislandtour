<?php
/**
 * Tour Review Section wrapper
 * Calls the shared reusable review-section component
 */
?>

<?php if (function_exists('kk_star_ratings')): ?>
    <div id="tour-review" class="vm-reviews">
        <h2 class="vm-heading vm-reviews__title"> Guest Reviews</h2>
        <?php echo kk_star_ratings(); ?>
    </div>
<?php endif; ?>