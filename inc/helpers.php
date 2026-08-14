<?php

/**
 * Helpers
 */

function dump($data)
{
	print "<pre style=' background: rgba(0, 0, 0, 0.1); margin-bottom: 1.618em; padding: 1.618em; overflow: auto; max-width: 100%; '>==========================\n";
	if (is_array($data)) {
		print_r($data);
	} elseif (is_object($data)) {
		var_dump($data);
	} else {
		var_dump($data);
	}
	print "===========================</pre>";
}


if (!function_exists('vm_svg_icon')) {

	/**
	 * @param $icon
	 *
	 * @return mixed|string
	 */
	function vm_svg_icon($icon)
	{
		$icons = require(__DIR__ . '/svg.php');
		return isset($icons[$icon]) ? $icons[$icon] : '';
	}
}

if (!function_exists('vm_pagination')) {
	function vm_pagination($current_page = null, $total_pages = null, $query_args = [])
	{
		global $wp_query, $wp_rewrite;

		$paged = get_query_var('paged') ? get_query_var('paged') : (get_query_var('page') ? get_query_var('page') : 1);
		$current_page = $current_page ? max(1, intval($current_page)) : max(1, intval($paged));
		$total_pages = $total_pages ? intval($total_pages) : $wp_query->max_num_pages;

		if ($total_pages < 2) {
			return;
		}

		$pagenum_link = html_entity_decode(get_pagenum_link());
		$url_parts = explode('?', $pagenum_link);
		$existing_args = [];
		if (isset($url_parts[1])) {
			wp_parse_str($url_parts[1], $existing_args);
		}

		$merged_args = array_merge($existing_args, $query_args);
		$pagenum_link = remove_query_arg(array_keys($existing_args), $pagenum_link);
		$pagenum_link = trailingslashit($pagenum_link) . '%_%';

		$format = $wp_rewrite->using_index_permalinks() && !strpos($pagenum_link, 'index.php') ? 'index.php/' : '';
		$format .= $wp_rewrite->using_permalinks() ? user_trailingslashit('page/%#%', 'paged') : '?paged=%#%';

		$links = paginate_links([
			'base' => $pagenum_link,
			'format' => $format,
			'current' => $current_page,
			'total' => $total_pages,
			'type' => 'list',
			'prev_text' => vm_svg_icon('arrow_prev') ? vm_svg_icon('arrow_prev') : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>',
			'next_text' => vm_svg_icon('arrow_next') ? vm_svg_icon('arrow_next') : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>',
			'add_args' => $merged_args,
		]);

		if ($links) {
			echo '<nav class="vm-pagination" aria-label="Pagination">';
			echo $links;
			echo '</nav>';
		}
	}
}




if (!function_exists('vm_split_words_preserve_html')) {
	function vm_split_words_preserve_html($html)
	{
		if (empty($html))
			return '';
		// Match HTML tags, whitespace sequences, or words
		preg_match_all('/(<[^>]+>)|(\s+)|([^<>\s]+)/', $html, $matches);

		$word_count = 0;
		foreach ($matches[0] as $token) {
			if (!preg_match('/^<[^>]+>$/', $token) && !preg_match('/^\s+$/', $token)) {
				$word_count++;
			}
		}

		$result = '';
		$current_word = 0;
		foreach ($matches[0] as $token) {
			if (preg_match('/^<[^>]+>$/', $token) || preg_match('/^\s+$/', $token)) {
				$result .= $token;
			} else {
				// Calculate reverse index so right-most words animate first
				$reverse_index = $word_count - $current_word - 1;
				$result .= '<span class="split-word" style="--word-index: ' . $reverse_index . ';">' . $token . '</span>';
				$current_word++;
			}
		}
		return $result;
	}
}

if (!function_exists('vm_load_button')) {
	function vm_load_button($btn_url, $btn_text, $btn_target = '_blank', $aria_label = '')
	{ ?>
		<a href="<?= $btn_url ?>" class="vm-button d-flex align-items-center justify-content-center" target="<?= $btn_target ?>"
			role="button" rel="noopener noreferrer" aria-label="<?= $aria_label ?>">
			<?= $btn_text ?>
			<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
				<path d="M12 21L12 3M12 3L20.5 11.5M12 3L3.5 11.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round"
					stroke-linejoin="round"></path>
			</svg>
		</a>
	<?php }
}

// Helper function to safely extract image data
if (!function_exists('vm_extract_gallery_image_data')) {
	function vm_extract_gallery_image_data($image)
	{
		$data = [
			'url' => '',
			'thumb' => '',
			'alt' => get_the_title() . ' - Gallery',
			'title' => ''
		];

		if (is_array($image)) {
			$data['url'] = !empty($image['url']) ? $image['url'] : '';
			$data['thumb'] = isset($image['sizes']['large']) ? $image['sizes']['large'] : $data['url'];
			if (!empty($image['alt'])) {
				$data['alt'] = $image['alt'];
			} elseif (!empty($image['title'])) {
				$data['alt'] = $image['title'];
			}
			$data['title'] = !empty($image['title']) ? $image['title'] : '';
		} elseif (is_numeric($image)) {
			$data['url'] = wp_get_attachment_url($image);
			$img_src_large = wp_get_attachment_image_src($image, 'large');
			$data['thumb'] = $img_src_large ? $img_src_large[0] : $data['url'];
			$alt = get_post_meta($image, '_wp_attachment_image_alt', true);
			if (!empty($alt)) {
				$data['alt'] = $alt;
			} else {
				$data['alt'] = get_the_title($image);
			}
			$data['title'] = get_the_title($image);
		} elseif (is_string($image)) {
			$data['url'] = $image;
			$data['thumb'] = $image;
		}

		return $data;
	}
}

if (!function_exists('vm_calculate_tour_price')) {
    /**
     * Calculate tour price based on option and pax
     * 
     * @param array $selected_option
     * @param int $total_pax
     * @return array
     */
    function vm_calculate_tour_price($selected_option, $total_pax) {
        if ($total_pax < 1) {
            $total_pax = 1;
        }

        $private_tour = $selected_option['private_tour'] ?? false;
        $price_group = $selected_option['price_group'] ?? 0;
        $price_private = $selected_option['price_private'] ?? [];

        $price_per_person = 0.0;

        if (empty($private_tour)) {
            $group_price_val = is_array($price_group) && isset($price_group['price']) ? $price_group['price'] : (is_scalar($price_group) ? $price_group : 0);
            $price_per_person = floatval(str_replace(['₫', '$', ',', ' '], '', $group_price_val));
        } else {
            $private_price_val = 0;
            if (is_array($price_private) && !empty($price_private)) {
                $available_pax = [];
                foreach ($price_private as $p_key => $p_val) {
                    $num = intval($p_key);
                    if ($num > 0 && $p_val !== '') {
                        $available_pax[$num] = $p_val;
                    }
                }
                if (!empty($available_pax)) {
                    ksort($available_pax);
                    $found_price = null;
                    $max_pax_price = 0;
                    foreach ($available_pax as $p_num => $p_val) {
                        $max_pax_price = $p_val;
                        if ($p_num >= $total_pax && $found_price === null) {
                            $found_price = $p_val;
                        }
                    }
                    $private_price_val = $found_price ?? $max_pax_price;
                }
            }
            $price_per_person = floatval(str_replace(['₫', '$', ',', ' '], '', $private_price_val));
        }

        $is_price_available = ($price_per_person !== 0.0);
        $total_price = $price_per_person * $total_pax;

        return [
            'price_per_person' => $price_per_person,
            'total_price' => $total_price,
            'is_price_available' => $is_price_available
        ];
    }
}