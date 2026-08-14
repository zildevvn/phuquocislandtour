<?php
add_action('wp_ajax_vm_ajax_filter_tours', 'vm_ajax_filter_tours');
add_action('wp_ajax_nopriv_vm_ajax_filter_tours', 'vm_ajax_filter_tours');
function vm_ajax_filter_tours()
{
    $idCate = isset($_POST['idCate']) ? $_POST['idCate'] : [];
    $tour_cat = isset($_POST['tour_cat']) ? $_POST['tour_cat'] : '';
    $keySeach = isset($_POST['keySeach']) ? $_POST['keySeach'] : [];
    $query = isset($_POST['query']) ? $_POST['query'] : [];
    $currentpage = isset($_POST['currentpage']) ? $_POST['currentpage'] : 1;
    $pax_min = isset($_POST['pax_min']) && $_POST['pax_min'] !== '' ? intval($_POST['pax_min']) : null;
    $pax_max = isset($_POST['pax_max']) && $_POST['pax_max'] !== '' ? intval($_POST['pax_max']) : null;
    $price_min = isset($_POST['price_min']) && $_POST['price_min'] !== '' ? intval($_POST['price_min']) : null;
    $price_max = isset($_POST['price_max']) && $_POST['price_max'] !== '' ? intval($_POST['price_max']) : null;
    $sort = isset($_POST['sort']) ? $_POST['sort'] : 'default';
    $searchHd = '';

    if (!empty($keySeach)) {
        $query['s'] = $keySeach;
    }

    if (!empty($idCate) && $idCate != 'all') {
        $query['cat'] = explode(",", $idCate);
    }

    if (!empty($tour_cat) && $tour_cat != 'all') {
        if (!isset($query['tax_query'])) {
            $query['tax_query'] = ['relation' => 'AND'];
        }
        $query['tax_query'][] = [
            'taxonomy' => 'tour_cats',
            'field' => 'term_id',
            'terms' => intval($tour_cat),
        ];
    }

    if (($pax_min !== null && $pax_max !== null) || ($price_min !== null && $price_max !== null) || $sort === 'price_low' || $sort === 'price_high') {
        if (!isset($query['meta_query'])) {
            $query['meta_query'] = ['relation' => 'AND'];
        }

        if ($pax_min !== null && $pax_max !== null) {
            $query['meta_query'][] = [
                'key' => 'paxs_tours_max',
                'value' => $pax_min,
                'compare' => '>=',
                'type' => 'NUMERIC'
            ];
            $query['meta_query'][] = [
                'key' => 'paxs_tours_min',
                'value' => $pax_max,
                'compare' => '<=',
                'type' => 'NUMERIC'
            ];
        }

        if ($price_min !== null && $price_max !== null) {
            $query['meta_query'][] = [
                'key' => 'price_tour',
                'value' => [$price_min, $price_max],
                'compare' => 'BETWEEN',
                'type' => 'NUMERIC'
            ];
        }

        if (($sort === 'price_low' || $sort === 'price_high') && ($price_min === null || $price_max === null)) {
            // Ensures price_tour meta is joined if not already filtered
            $query['meta_query'][] = [
                'key' => 'price_tour',
                'compare' => 'EXISTS'
            ];
        }
    }

    if ($sort === 'price_low') {
        $query['meta_key'] = 'price_tour';
        $query['orderby'] = 'meta_value_num';
        $query['order'] = 'ASC';
    } elseif ($sort === 'price_high') {
        $query['meta_key'] = 'price_tour';
        $query['orderby'] = 'meta_value_num';
        $query['order'] = 'DESC';
    } elseif ($sort === 'newest') {
        $query['orderby'] = 'date';
        $query['order'] = 'DESC';
    } elseif ($sort === 'title_az') {
        $query['orderby'] = 'title';
        $query['order'] = 'ASC';
    }

    $query['paged'] = $currentpage;

    ob_start();
    $the_query = new WP_Query($query);
    $count = $the_query->found_posts;

    if ($the_query->have_posts()) {

        if (!empty($keySeach)) {
            $searchHd = $the_query->found_posts;
        }

        while ($the_query->have_posts()) {
            $the_query->the_post();
            vm_tour_item();
        }

    } else { ?>
        <div class="sm-filter-posts-block--not-found"> Sorry, no posts matched your criteria.</div>
    <?php }

    $items = ob_get_clean();

    ob_start();
    vm_pagination($currentpage, $the_query->max_num_pages);
    $pagination = ob_get_clean();

    wp_reset_postdata();
    wp_send_json([
        'items' => $items,
        'searchHd' => $searchHd,
        'pagination' => $pagination,
        'count' => $count
    ]);
    wp_die();
}

add_action('wp_ajax_vm_ajax_filter_posts', 'vm_ajax_filter_posts');
add_action('wp_ajax_nopriv_vm_ajax_filter_posts', 'vm_ajax_filter_posts');
function vm_ajax_filter_posts()
{
    $post_cat = isset($_POST['post_cat']) ? $_POST['post_cat'] : '';
    $keySeach = isset($_POST['keySeach']) ? sanitize_text_field($_POST['keySeach']) : '';
    $query = isset($_POST['query']) ? $_POST['query'] : [];
    $currentpage = isset($_POST['currentpage']) ? intval($_POST['currentpage']) : 1;
    $searchHd = '';

    if (!empty($keySeach)) {
        $query['s'] = $keySeach;
    }

    if (!empty($post_cat) && $post_cat != 'all') {
        $query['cat'] = intval($post_cat);
    }

    $query['paged'] = $currentpage;

    ob_start();
    $the_query = new WP_Query($query);
    $count = $the_query->found_posts;

    if ($the_query->have_posts()) {
        if (!empty($keySeach)) {
            $searchHd = $the_query->found_posts;
        }

        while ($the_query->have_posts()) {
            $the_query->the_post();
            vm_post_item();
        }
    } else {
        // Handled by frontend display:none JS logic, but output empty string.
    }
    $items = ob_get_clean();

    ob_start();
    vm_pagination($currentpage, $the_query->max_num_pages);
    $pagination = ob_get_clean();

    wp_reset_postdata();
    wp_send_json([
        'items' => $items,
        'searchHd' => $searchHd,
        'pagination' => $pagination,
        'count' => $count
    ]);
    wp_die();
}

add_action('wp_ajax_vm_ajax_filter_cars', 'vm_ajax_filter_cars');
add_action('wp_ajax_nopriv_vm_ajax_filter_cars', 'vm_ajax_filter_cars');
function vm_ajax_filter_cars()
{
    $query = isset($_POST['query']) ? $_POST['query'] : [];
    $currentpage = isset($_POST['currentpage']) ? intval($_POST['currentpage']) : 1;

    $query['paged'] = $currentpage;

    ob_start();
    $the_query = new WP_Query($query);

    if ($the_query->have_posts()) {
        while ($the_query->have_posts()) {
            $the_query->the_post();
            vm_car_tour_item();
        }
    }
    $items = ob_get_clean();

    ob_start();
    vm_pagination($currentpage, $the_query->max_num_pages);
    $pagination = ob_get_clean();

    wp_reset_postdata();
    wp_send_json([
        'items' => $items,
        'pagination' => $pagination,
    ]);
    wp_die();
}

add_action('wp_ajax_vm_ajax_check_availability', 'vm_ajax_check_availability');
add_action('wp_ajax_nopriv_vm_ajax_check_availability', 'vm_ajax_check_availability');
function vm_ajax_check_availability()
{
    if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'tour_options_nonce')) {
        wp_send_json_error(['message' => 'Security check failed. Please refresh the page and try again.']);
    }

    $post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;
    $date = isset($_POST['date']) ? sanitize_text_field($_POST['date']) : '';
    $adults = isset($_POST['adults']) ? intval($_POST['adults']) : 2;
    $children = isset($_POST['children']) ? intval($_POST['children']) : 0;

    if (!$post_id) {
        wp_send_json_error(['message' => 'Invalid tour.']);
    }

    if (!empty($date) && strtotime($date) < strtotime(current_time('Y-m-d'))) {
        wp_send_json_error(['message' => 'Vui lòng chọn ngày hiện tại hoặc tương lai.']);
    }

    $total_pax = $adults + $children;
    if ($total_pax < 1 || $total_pax > 50) {
        wp_send_json_error(['message' => 'Tổng số lượng người phải từ 1 đến 50.']);
    }

    global $post;
    $post = get_post($post_id);
    if (!$post) {
        wp_send_json_error(['message' => 'Tour not found.']);
    }
    setup_postdata($post);

    // Get the field directly to check if there are options
    $tour_options = get_field('tour_options', $post_id);

    if (empty($tour_options)) {
        wp_reset_postdata();
        wp_send_json_success([
            'html' => '',
            'count' => 0
        ]);
    }

    ob_start();
    get_template_part('template-parts/single-tour/tour-options');
    $html = ob_get_clean();

    wp_reset_postdata();

    wp_send_json_success([
        'html' => $html,
        'count' => count($tour_options)
    ]);
}

add_action('wp_ajax_vm_ajax_process_booking', 'vm_ajax_process_booking');
add_action('wp_ajax_nopriv_vm_ajax_process_booking', 'vm_ajax_process_booking');
function vm_ajax_process_booking()
{
    if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'tour_options_nonce')) {
        wp_send_json_error(['message' => 'Security check failed. Please refresh the page and try again.']);
    }

    $post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;
    $option_id = isset($_POST['option_id']) ? intval($_POST['option_id']) : -1;
    $date = isset($_POST['date']) ? sanitize_text_field($_POST['date']) : '';
    $adults = isset($_POST['adults']) ? intval($_POST['adults']) : 2;
    $children = isset($_POST['children']) ? intval($_POST['children']) : 0;

    if (!$post_id || $option_id < 0 || empty($date)) {
        wp_send_json_error(['message' => 'Invalid booking details.']);
    }

    if (strtotime($date) < strtotime(current_time('Y-m-d'))) {
        wp_send_json_error(['message' => 'Vui lòng chọn ngày hiện tại hoặc tương lai.']);
    }

    $total_pax = $adults + $children;
    if ($total_pax < 1 || $total_pax > 50) {
        wp_send_json_error(['message' => 'Tổng số lượng người phải từ 1 đến 50.']);
    }

    $post = get_post($post_id);
    if (!$post) {
        wp_send_json_error(['message' => 'Tour not found.']);
    }

    $tour_options = get_field('tour_options', $post_id);
    if (empty($tour_options) || !isset($tour_options[$option_id])) {
        wp_send_json_error(['message' => 'Invalid tour option.']);
    }

    $booking_data = [
        'tour_id' => $post_id,
        'option_id' => $option_id,
        'option_name' => $tour_options[$option_id]['name'] ?? '',
        'date' => $date,
        'adults' => $adults,
        'children' => $children,
    ];

    $token = bin2hex(random_bytes(16));
    set_transient('vm_booking_' . $token, $booking_data, HOUR_IN_SECONDS);

    wp_send_json_success([
        'redirect_url' => site_url('/checkout/?token=' . $token)
    ]);
}

add_action('wp_ajax_vm_ajax_submit_checkout', 'vm_ajax_submit_checkout');
add_action('wp_ajax_nopriv_vm_ajax_submit_checkout', 'vm_ajax_submit_checkout');
function vm_ajax_submit_checkout()
{
    if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'tour_options_nonce')) {
        wp_send_json_error(['message' => 'Security check failed. Please refresh the page and try again.']);
    }

    $token = isset($_POST['booking_token']) ? sanitize_text_field($_POST['booking_token']) : '';
    if (empty($token)) {
        wp_send_json_error(['message' => 'Invalid booking session.']);
    }

    $booking_data = get_transient('vm_booking_' . $token);
    if (!$booking_data) {
        wp_send_json_error(['message' => 'Your booking session has expired or is invalid.']);
    }
    
    // Delete transient immediately to prevent double submission
    delete_transient('vm_booking_' . $token);

    // Extract and sanitize customer info
    $customer_name = isset($_POST['customer_name']) ? sanitize_text_field($_POST['customer_name']) : '';
    $customer_email = isset($_POST['customer_email']) ? sanitize_email($_POST['customer_email']) : '';
    $customer_phone = isset($_POST['customer_phone']) ? sanitize_text_field($_POST['customer_phone']) : '';
    $customer_pickup = isset($_POST['customer_pickup']) ? sanitize_text_field($_POST['customer_pickup']) : '';
    $customer_dropoff = isset($_POST['customer_dropoff']) ? sanitize_text_field($_POST['customer_dropoff']) : '';
    $customer_address = isset($_POST['customer_address']) ? sanitize_text_field($_POST['customer_address']) : '';
    $customer_messages = isset($_POST['customer_messages']) ? sanitize_textarea_field($_POST['customer_messages']) : '';
    $payment_method = isset($_POST['payment_method']) ? sanitize_text_field($_POST['payment_method']) : '';

    if (empty($customer_name) || empty($customer_email) || empty($customer_phone) || empty($customer_pickup) || empty($customer_dropoff)) {
        wp_send_json_error(['message' => 'Please fill in all required fields.']);
    }

    if (!is_email($customer_email)) {
        wp_send_json_error(['message' => 'Invalid email address.']);
    }

    // Re-validate booking details
    $tour_id = $booking_data['tour_id'];
    $option_id = $booking_data['option_id'];
    $tour = get_post($tour_id);
    if (!$tour) {
        wp_send_json_error(['message' => 'The selected tour is no longer available.']);
    }

    $tour_options = get_field('tour_options', $tour_id);
    if (empty($tour_options) || !isset($tour_options[$option_id])) {
        wp_send_json_error(['message' => 'The selected tour option is no longer available.']);
    }

    $selected_option = $tour_options[$option_id];
    
    if (isset($booking_data['option_name']) && $booking_data['option_name'] !== ($selected_option['name'] ?? '')) {
        wp_send_json_error(['message' => 'Tour option đã thay đổi, vui lòng chọn lại.']);
    }
    
    // Recalculate price server-side
    $adults = intval($booking_data['adults']);
    $children = intval($booking_data['children']);
    $total_pax = $adults + $children;

    $pricing = vm_calculate_tour_price($selected_option, $total_pax);
    $price_per_person = $pricing['price_per_person'];
    $total_price = $pricing['total_price'];
    $is_price_available = $pricing['is_price_available'];

    // Generate Booking Reference
    $booking_ref = 'VM-' . strtoupper(substr(uniqid(), -6));

    // --- 1. Admin Email ---
    $admin_email = get_field('booking_notification_email', 'option') ?: get_option('admin_email');
    $subject_admin = 'New Booking Request: ' . $booking_ref;
    
    $message_admin = "<h2>New Booking Request: {$booking_ref}</h2>";
    $message_admin .= "<h3>Customer Information</h3>";
    $message_admin .= "<p><strong>Name:</strong> {$customer_name}</p>";
    $message_admin .= "<p><strong>Email:</strong> {$customer_email}</p>";
    $message_admin .= "<p><strong>Phone:</strong> {$customer_phone}</p>";
    $message_admin .= "<p><strong>Pick-up:</strong> {$customer_pickup}</p>";
    $message_admin .= "<p><strong>Drop-off:</strong> {$customer_dropoff}</p>";
    if (!empty($customer_address)) $message_admin .= "<p><strong>Address:</strong> {$customer_address}</p>";
    if (!empty($customer_messages)) $message_admin .= "<p><strong>Messages:</strong><br>" . nl2br($customer_messages) . "</p>";
    $message_admin .= "<p><strong>Payment Method:</strong> {$payment_method}</p>";
    
    $message_admin .= "<h3>Booking Information</h3>";
    $message_admin .= "<p><strong>Tour:</strong> " . esc_html($tour->post_title) . "</p>";
    $message_admin .= "<p><strong>Option:</strong> " . esc_html($selected_option['name']) . "</p>";
    $message_admin .= "<p><strong>Date:</strong> {$booking_data['date']}</p>";
    $message_admin .= "<p><strong>Starting Time:</strong> " . esc_html($selected_option['starting_time']) . "</p>";
    $message_admin .= "<p><strong>Adults:</strong> {$adults}</p>";
    $message_admin .= "<p><strong>Children:</strong> {$children}</p>";
    $message_admin .= "<p><strong>Total Participants:</strong> {$total_pax}</p>";
    
    $formatted_price = number_format($total_price, 0, '.', ',');
    $message_admin .= "<h3>Total Price: {$formatted_price} VND</h3>";
    
    $headers = array('Content-Type: text/html; charset=UTF-8');
    
    // Send to Admin
    wp_mail($admin_email, $subject_admin, $message_admin, $headers);

    // --- 2. Customer Confirmation Email ---
    if (is_email($customer_email)) {
        $subject_customer = 'Booking Confirmation: ' . $booking_ref;
        
        $message_customer = "<h2>Booking Confirmation: {$booking_ref}</h2>";
        $message_customer .= "<p>Thank you for your booking, {$customer_name}. We have received your booking request and our team will contact you shortly to confirm the details.</p>";
        
        $message_customer .= "<h3>Your Booking Details</h3>";
        $message_customer .= "<p><strong>Tour:</strong> " . esc_html($tour->post_title) . "</p>";
        $message_customer .= "<p><strong>Option:</strong> " . esc_html($selected_option['name']) . "</p>";
        $message_customer .= "<p><strong>Date:</strong> {$booking_data['date']}</p>";
        $message_customer .= "<p><strong>Starting Time:</strong> " . esc_html($selected_option['starting_time']) . "</p>";
        $message_customer .= "<p><strong>Adults:</strong> {$adults}</p>";
        $message_customer .= "<p><strong>Children:</strong> {$children}</p>";
        $message_customer .= "<p><strong>Total Participants:</strong> {$total_pax}</p>";
        $message_customer .= "<h3>Total Price: {$formatted_price} VND</h3>";
        $message_customer .= "<p><strong>Payment Method:</strong> {$payment_method}</p>";
        
        // Send to Customer
        wp_mail($customer_email, $subject_customer, $message_customer, $headers);
    }

    wp_send_json_success([
        'message' => 'Booking successful.',
        'reference' => $booking_ref
    ]);
}