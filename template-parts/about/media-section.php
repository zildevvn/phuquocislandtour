<?php
$media = get_field('media_list');
?>
<?php if (!empty($media)): ?>
    <section class="vm-section media-section">
        <div class="container">
            <div class="media-section__grid">
                <?php foreach ($media as $item): ?>
                    <div class="media-item">
                        <div class="media-item__image">
                            <img src="<?= $item['image']['sizes']['large'] ?>"
                                alt="image phu quoc travel agency for <?= $item['heading'] ?>" />
                        </div>
                        <div class="media-item__content">
                            <h2 class="h3"> <?= $item['heading'] ?> </h2>
                            <div class="media-item__desc"> <?= $item['desc'] ?> </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
<?php endif; ?>