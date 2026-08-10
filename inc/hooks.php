<?php

/**
 * Hooks.
 */

function imageTagForJs($response, $attachment)
{
	foreach ($response['sizes'] as $size => $datas) {
		$response['sizes'][$size]['tag'] = wp_get_attachment_image($attachment->ID, $size);
		$response['sizes'][$size]['srcset'] = wp_get_attachment_image_srcset($attachment->ID, $size);
	}
	return $response;
}
add_filter('wp_prepare_attachment_for_js', 'imageTagForJs', 10, 2);


/**
 * Allow upload json file
 */
add_filter('upload_mimes', function ($mime_types) {
	$mime_types['json'] = 'application/json'; // Adding .json extension
	$mime_types['svg'] = 'image/svg+xml';
	$mime_types['svgz'] = 'image/svg+xml';
	$mime_types['ttf'] = 'application/x-font-ttf';
	$mime_types['otf'] = 'application/x-font-opentype';
	$mime_types['woff'] = 'application/font-woff';
	$mime_types['woff2'] = 'application/font-woff2';
	return $mime_types;
}, 1);

/**
 * Header template
 * @return void
 */
add_action('vm_hook_header', 'vm_header_template');
function vm_header_template()
{
	load_template(get_template_directory() . '/template-parts/header.php', false);
}

/**
 * Footer template
 * @return void
 */
add_action('vm_hook_footer', 'vm_footer_template');
function vm_footer_template()
{
	load_template(get_template_directory() . '/template-parts/footer.php', false);
}

/**
 * Search template
 * @return void
 */
add_action('vm_hook_search', 'vm_search_template');
function vm_search_template()
{
	load_template(get_template_directory() . '/template-parts/modal-search.php', false);
}


/**
 * Post loop item template
 *
 * @param Int $post_id
 *
 * @return void
 */
add_action('vm_hook_post_loop_item', 'vm_post_loop_item_template', 20, 2);
function vm_post_loop_item_template($post_id, $index)
{
	set_query_var('post_id', $post_id);
	?>
	<article <?php post_class('col-md-4') ?>>
		<?php vm_post_item() ?>
	</article>
	<?php
}

/**
 * Force comments to be open for standard posts, tours, and cars.
 */
add_filter('comments_open', function ($open, $post_id) {
	if (in_array(get_post_type($post_id), ['post', 'tours', 'cars'])) {
		return true;
	}
	return $open;
}, 20, 2);

/**
 * Save review rating as comment meta after a comment is posted.
 */
add_action('comment_post', function ($comment_id, $comment_approved) {
	if (isset($_POST['vm_tour_rating'])) {
		$rating = intval($_POST['vm_tour_rating']);
		if ($rating >= 1 && $rating <= 5) {
			add_comment_meta($comment_id, 'rating', $rating, true);
		}
	}
}, 10, 2);

/**
 * Validate that a rating is submitted for tour or car review comments.
 */
add_filter('preprocess_comment', function ($commentdata) {
	$post_id = isset($commentdata['comment_post_ID']) ? intval($commentdata['comment_post_ID']) : 0;
	if ($post_id && in_array(get_post_type($post_id), ['tours', 'cars'])) {
		if (empty($_POST['vm_tour_rating']) || intval($_POST['vm_tour_rating']) < 1) {
			wp_die(__('Please select a star rating before submitting your review.'), __('Missing Rating'), ['back_link' => true, 'response' => 400]);
		}
	}
	return $commentdata;
});

/**
 * Handle redirect after tour or car review submission.
 */
add_filter('comment_post_redirect', function ($location, $comment) {
	$post_type = get_post_type($comment->comment_post_ID);
	if (in_array($post_type, ['tours', 'cars'])) {
		$location = remove_query_arg(['unapproved', 'approved', 'moderation-hash'], $location);
		// Strip any hash anchor first
		$parts = explode('#', $location);
		$base_url = $parts[0];

		if ($comment->comment_approved == '1') {
			$base_url = add_query_arg('approved', '1', $base_url);
		} else {
			$base_url = add_query_arg([
				'unapproved' => $comment->comment_ID,
				'moderation-hash' => wp_hash($comment->comment_date_gmt)
			], $base_url);
		}

		$anchor = ($post_type === 'cars') ? 'car-review' : 'tour-review';
		$location = $base_url . '#' . $anchor;
	}
	return $location;
}, 10, 2);




// function custom_google_reviews_shortcode($atts)
// {
// 	$transient_key = 'google_reviews_cache';
// 	$data = get_transient($transient_key);

// 	if (false === $data) {
// 		$place_id = 'ChIJecSedmEZQjERbcFwrNOhTA4';
// 		$api_key = 'AIzaSyCsyqhpCTfEsE3NOipTKwZ2PwYwQ_dyDi4';

// 		$url = "https://places.googleapis.com/v1/places/{$place_id}?fields=rating,userRatingCount&key={$api_key}";

// 		$response = wp_remote_get($url);

// 		if (!is_wp_error($response) && wp_remote_retrieve_response_code($response) === 200) {
// 			$body = wp_remote_retrieve_body($response);
// 			$json = json_decode($body, true);

// 			if (isset($json['rating'])) {
// 				$data = [
// 					'rating' => $json['rating'],
// 					'count' => $json['userRatingCount']
// 				];
// 				set_transient($transient_key, $data, 24 * HOUR_IN_SECONDS);
// 			}
// 		}
// 	}

// 	if (!$data) {
// 		$data = ['rating' => '4.8', 'count' => '121'];
// 	}

// 	ob_start();
// 	 ?>
// <a href="https://maps.app.goo.gl/A8FAitnbGFDk3ntM9" target="_blank" class="vm-custom-review-badge">
	// <img src="https://danangcarrental.vn/wp-content/uploads/2026/07/gg-review.svg" alt="Google Reviews" //
		class="badge-icon">
	// <span class="badge-stars" style="color: #fbbc04;">★★★★★</span>
	// <span class="badge-score">
		// <?php echo esc_html($data['rating']); ?>
		// </span>
	// <span class="badge-divider">|</span>
	// <span class="badge-count">
		// <?php echo number_format($data['count']); ?> reviews
		// </span>
	// </a>
// <?php
// 	return ob_get_clean();
// }
// add_shortcode('google_badge', 'custom_google_reviews_shortcode');


// 2. SHORTCODE TRIPADVISOR: [tripadvisor_badge]
function custom_tripadvisor_reviews_shortcode($atts)
{
	$transient_key = 'tripadvisor_reviews_cache';
	$data = get_transient($transient_key);

	if (false === $data) {
		$url = 'https://www.tripadvisor.com/Attraction_Review-g293926-d5569598-Reviews-VM_Travel-Hue_Thua_Thien_Hue_Province.html';

		$response = wp_remote_get($url, [
			'headers' => ['User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)']
		]);

		if (!is_wp_error($response) && wp_remote_retrieve_response_code($response) === 200) {
			$body = wp_remote_retrieve_body($response);

			preg_match('/"ratingValue":\s*"([0-9.]+)"/', $body, $rating_matches);
			preg_match('/"reviewCount":\s*"([0-9]+)"/', $body, $count_matches);

			if (!empty($rating_matches[1]) && !empty($count_matches[1])) {
				$data = [
					'rating' => $rating_matches[1],
					'count' => $count_matches[1]
				];
				set_transient($transient_key, $data, 24 * HOUR_IN_SECONDS);
			}
		}
	}

	if (!$data) {
		$data = ['rating' => '4.9', 'count' => '2678'];
	}

	ob_start();

	// var_dump($data);

	// echo "<pre>";
	// echo print_r($data);
	// echo "</pre>";
	?>
	<a href="https://www.tripadvisor.com/Attraction_Review-g293926-d5569598-Reviews-VM_Travel-Hue_Thua_Thien_Hue_Province.html"
		target="_blank" class="vm-custom-review-badge">
		<img src="https://danangcarrental.vn/wp-content/uploads/2026/07/trip-review.svg" alt="Tripadvisor Reviews"
			class="badge-icon">
		<span class="badge-circles" style="color: #11AD87; font-size: 13px;">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
				stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
				class="lucide lucide-circle-dot-icon lucide-circle-dot">
				<circle cx="12" cy="12" r="10" />
				<circle cx="12" cy="12" r="1" />
			</svg>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
				stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
				class="lucide lucide-circle-dot-icon lucide-circle-dot">
				<circle cx="12" cy="12" r="10" />
				<circle cx="12" cy="12" r="1" />
			</svg>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
				stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
				class="lucide lucide-circle-dot-icon lucide-circle-dot">
				<circle cx="12" cy="12" r="10" />
				<circle cx="12" cy="12" r="1" />
			</svg>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
				stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
				class="lucide lucide-circle-dot-icon lucide-circle-dot">
				<circle cx="12" cy="12" r="10" />
				<circle cx="12" cy="12" r="1" />
			</svg>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
				stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
				class="lucide lucide-circle-dot-icon lucide-circle-dot">
				<circle cx="12" cy="12" r="10" />
				<circle cx="12" cy="12" r="1" />
			</svg>
		</span>
		<span class="badge-score">
			<?php echo esc_html($data['rating']); ?>
		</span>
		<span class="badge-divider">|</span>
		<span class="badge-count">
			<?php echo number_format($data['count']); ?> reviews
		</span>
	</a>
	<?php
	return ob_get_clean();
}
add_shortcode('tripadvisor_badge', 'custom_tripadvisor_reviews_shortcode');