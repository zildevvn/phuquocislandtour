<?php

add_action('wp_enqueue_scripts', function () {
	wp_enqueue_style('nkt-google-fonts', 'https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Noto+Sans+JP:wght@400;700&family=Noto+Serif+JP:wght@400;700&family=Pinyon+Script&display=swap', array());
	wp_enqueue_style('nouislider-css', 'https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/15.7.1/nouislider.min.css', array(), '15.7.1');
	wp_enqueue_script('nouislider-js', 'https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/15.7.1/nouislider.min.js', array(), '15.7.1', true);
	$style_path  = get_template_directory() . '/dist/css/style.css';
	$script_path = get_template_directory() . '/dist/js/main.bundle.js';

	wp_enqueue_style(
		'theme-styles', 
		get_template_directory_uri() . '/dist/css/style.css', 
		array(), 
		file_exists($style_path) ? filemtime($style_path) : null
	);
	wp_enqueue_script(
		'theme-scripts', 
		get_template_directory_uri() . '/dist/js/main.bundle.js', 
		array('jquery'), 
		file_exists($script_path) ? filemtime($script_path) : null, 
		true
	);

	wp_enqueue_style('fancybox-css', 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css', array(), '5.0');
	wp_enqueue_script('fancybox-js', 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js', array(), '5.0', true);

	wp_localize_script('theme-scripts', 'php_data', [
		'admin_logged' => in_array('administrator', wp_get_current_user()->roles) ? 'yes' : 'no',
		'ajax_url' => admin_url('admin-ajax.php'),
		'site_url' => site_url(),
		'rest_url' => get_rest_url(),
		'tour_options_nonce' => wp_create_nonce('tour_options_nonce'),
		'vm_filter_tours_nonce' => wp_create_nonce('vm_filter_tours'),
		'vm_filter_posts_nonce' => wp_create_nonce('vm_filter_posts'),
		'vm_filter_cars_nonce' => wp_create_nonce('vm_filter_cars'),
	]);

	wp_localize_script('theme-scripts', 'themeData', [
		'templateUrl' => get_template_directory_uri()
	]);
});

