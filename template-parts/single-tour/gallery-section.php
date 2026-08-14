<?php
/**
 * Single Tour Gallery Section
 */

$gallery_tour = get_field('gallery_tour');

if (empty($gallery_tour) || !is_array($gallery_tour)) {
    return;
}

$total_images = count($gallery_tour);
$visible_images_count = min(5, $total_images);
$remaining_images = max(0, $total_images - 5);
?>

<section class="tour-gallery">
    <div class="container">
        <div class="tour-gallery__grid">
            <?php for ($i = 0; $i < $visible_images_count; $i++):
                $img_data = vm_extract_gallery_image_data($gallery_tour[$i]);
                $is_featured = ($i === 0);
                $is_last_visible = ($i === 4 && $remaining_images > 0);

                $item_classes = 'tour-gallery__item';
                if ($is_featured) {
                    $item_classes .= ' tour-gallery__item--featured';
                }
                ?>
                <div class="<?php echo esc_attr($item_classes); ?>" data-index="<?php echo $i; ?>">
                    <img src="<?php echo esc_url($img_data['thumb']); ?>" alt="<?php echo esc_attr($img_data['alt']); ?>"
                        loading="<?php echo $is_featured ? 'eager' : 'lazy'; ?>">

                    <?php if ($is_featured): ?>
                        <div class="tour-gallery__overlay">
                            <span class="tour-gallery__overlay-btn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                    <polyline points="21 15 16 10 5 21"></polyline>
                                </svg>
                                View Photos
                            </span>
                        </div>
                    <?php endif; ?>

                    <?php if ($is_last_visible): ?>
                        <div class="tour-gallery__counter">
                            <span>+ <?php echo $remaining_images; ?> Photos</span>
                        </div>
                    <?php endif; ?>
                </div>
            <?php endfor; ?>
        </div>
    </div>
</section>

<!-- Lightbox Modal -->
<div class="tour-gallery__lightbox" id="tourGalleryLightbox" aria-hidden="true" role="dialog"
    aria-label="Image Gallery">
    <div class="tour-gallery__lightbox-overlay"></div>
    <div class="tour-gallery__lightbox-content">
        <button class="tour-gallery__lightbox-close" aria-label="Close gallery">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>

        <button class="tour-gallery__lightbox-prev" aria-label="Previous image">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
        </button>

        <div class="tour-gallery__lightbox-image-container">
            <img src="" alt="" class="tour-gallery__lightbox-image" id="tourGalleryLightboxImg">
        </div>

        <button class="tour-gallery__lightbox-next" aria-label="Next image">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        </button>

        <div class="tour-gallery__lightbox-counter" id="tourGalleryLightboxCounter"></div>
    </div>
</div>

<!-- Gallery Data for JS -->
<script type="application/json" id="tourGalleryData">
<?php
$gallery_data_json = [];
foreach ($gallery_tour as $image) {
    $img_data = vm_extract_gallery_image_data($image);
    $gallery_data_json[] = [
        'url' => $img_data['url'],
        'alt' => $img_data['alt']
    ];
}
echo json_encode(
    $gallery_data_json,
    JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP
);
?>
</script>