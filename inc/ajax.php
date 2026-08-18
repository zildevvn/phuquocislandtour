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

    // Save Booking to Database (Custom Post Type)
    $booking_post_id = wp_insert_post([
        'post_title' => $booking_ref,
        'post_status' => 'publish',
        'post_type' => 'tour_booking',
    ]);

    if ($booking_post_id && !is_wp_error($booking_post_id)) {
        // Customer Info
        update_post_meta($booking_post_id, 'customer_name', $customer_name);
        update_post_meta($booking_post_id, 'customer_email', $customer_email);
        update_post_meta($booking_post_id, 'customer_phone', $customer_phone);
        update_post_meta($booking_post_id, 'customer_pickup', $customer_pickup);
        update_post_meta($booking_post_id, 'customer_dropoff', $customer_dropoff);
        update_post_meta($booking_post_id, 'customer_address', $customer_address);
        update_post_meta($booking_post_id, 'customer_messages', $customer_messages);
        update_post_meta($booking_post_id, 'payment_method', $payment_method);

        // Tour/Car Info
        $booking_type = get_post_type($tour_id); // 'tours' or 'cars'
        update_post_meta($booking_post_id, 'booking_type', $booking_type);
        update_post_meta($booking_post_id, 'tour_id', $tour_id);
        update_post_meta($booking_post_id, 'option_name', $selected_option['name'] ?? '');
        update_post_meta($booking_post_id, 'date', $booking_data['date']);
        update_post_meta($booking_post_id, 'starting_time', $selected_option['starting_time'] ?? '');
        update_post_meta($booking_post_id, 'adults', $adults);
        update_post_meta($booking_post_id, 'children', $children);
        update_post_meta($booking_post_id, 'total_pax', $total_pax);
        update_post_meta($booking_post_id, 'price_per_person', $price_per_person);
        update_post_meta($booking_post_id, 'total_price', $total_price);
    }

    // Common Styles for Email
    $table_style = 'width: 100%; max-width: 600px; border-collapse: collapse; margin-bottom: 20px; font-family: Arial, sans-serif; font-size: 14px;';
    $th_style = 'padding: 12px; border: 1px solid #e0e0e0; background-color: #f8f9fa; text-align: left; font-weight: bold; width: 35%; color: #333;';
    $td_style = 'padding: 12px; border: 1px solid #e0e0e0; color: #555; text-align: left;';
    $h2_style = 'color: #0C2C7A; font-family: Arial, sans-serif; font-size: 24px; border-bottom: 2px solid #00656D; padding-bottom: 10px; margin-bottom: 20px;';
    $h3_style = 'color: #00656D; font-family: Arial, sans-serif; font-size: 18px; margin-top: 30px; margin-bottom: 15px;';

    // --- 1. Admin Email ---
    $admin_email = get_field('booking_notification_email', 'option') ?: get_option('admin_email');
    $subject_admin = 'New Booking Request: ' . $booking_ref;

    $message_admin = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;'>";
    $message_admin .= "<h2 style='{$h2_style}'>New Booking Request: {$booking_ref}</h2>";

    $message_admin .= "<h3 style='{$h3_style}'>Customer Information</h3>";
    $message_admin .= "<table style='{$table_style}'>";
    $message_admin .= "<tr><th style='{$th_style}'>Name</th><td style='{$td_style}'>{$customer_name}</td></tr>";
    $message_admin .= "<tr><th style='{$th_style}'>Email</th><td style='{$td_style}'><a href='mailto:{$customer_email}'>{$customer_email}</a></td></tr>";
    $message_admin .= "<tr><th style='{$th_style}'>Phone</th><td style='{$td_style}'>{$customer_phone}</td></tr>";
    $message_admin .= "<tr><th style='{$th_style}'>Pick-up</th><td style='{$td_style}'>{$customer_pickup}</td></tr>";
    $message_admin .= "<tr><th style='{$th_style}'>Drop-off</th><td style='{$td_style}'>{$customer_dropoff}</td></tr>";
    if (!empty($customer_address))
        $message_admin .= "<tr><th style='{$th_style}'>Address</th><td style='{$td_style}'>{$customer_address}</td></tr>";
    if (!empty($customer_messages))
        $message_admin .= "<tr><th style='{$th_style}'>Messages</th><td style='{$td_style}'>" . nl2br($customer_messages) . "</td></tr>";
    $message_admin .= "<tr><th style='{$th_style}'>Payment Method</th><td style='{$td_style}'>{$payment_method}</td></tr>";
    $message_admin .= "</table>";

    $message_admin .= "<h3 style='{$h3_style}'>Booking Information</h3>";
    $message_admin .= "<table style='{$table_style}'>";
    $message_admin .= "<tr><th style='{$th_style}'>Tour</th><td style='{$td_style}'><strong>" . esc_html($tour->post_title) . "</strong></td></tr>";
    $message_admin .= "<tr><th style='{$th_style}'>Option</th><td style='{$td_style}'>" . esc_html($selected_option['name']) . "</td></tr>";
    $message_admin .= "<tr><th style='{$th_style}'>Date</th><td style='{$td_style}'>{$booking_data['date']}</td></tr>";
    $message_admin .= "<tr><th style='{$th_style}'>Starting Time</th><td style='{$td_style}'>" . esc_html($selected_option['starting_time']) . "</td></tr>";
    $message_admin .= "<tr><th style='{$th_style}'>Participants</th><td style='{$td_style}'>{$total_pax} ({$adults} Adults, {$children} Children)</td></tr>";
    $formatted_price = number_format($total_price, 0, '.', ',');
    $message_admin .= "<tr><th style='{$th_style}'>Total Price</th><td style='{$td_style}'><strong style='color: #0C2C7A; font-size: 16px;'>{$formatted_price} $</strong></td></tr>";
    $message_admin .= "</table>";
    $message_admin .= "</div>";

    $headers = array('Content-Type: text/html; charset=UTF-8');

    // Send to Admin
    wp_mail($admin_email, $subject_admin, $message_admin, $headers);

    // --- 2. Customer Confirmation Email ---
    if (is_email($customer_email)) {
        $subject_customer = 'Booking Confirmation: ' . $booking_ref;

        $message_customer = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;'>";
        $message_customer .= "<h2 style='{$h2_style}'>Booking Confirmation: {$booking_ref}</h2>";
        $message_customer .= "<p style='font-size: 15px; line-height: 1.6; color: #555;'>Dear <strong>{$customer_name}</strong>,</p>";
        $message_customer .= "<p style='font-size: 15px; line-height: 1.6; color: #555;'>Thank you for your booking request! We have received your details and our team will contact you shortly to confirm everything.</p>";

        $message_customer .= "<h3 style='{$h3_style}'>Your Booking Details</h3>";
        $message_customer .= "<table style='{$table_style}'>";
        $message_customer .= "<tr><th style='{$th_style}'>Tour</th><td style='{$td_style}'><strong>" . esc_html($tour->post_title) . "</strong></td></tr>";
        $message_customer .= "<tr><th style='{$th_style}'>Option</th><td style='{$td_style}'>" . esc_html($selected_option['name']) . "</td></tr>";
        $message_customer .= "<tr><th style='{$th_style}'>Date</th><td style='{$td_style}'>{$booking_data['date']}</td></tr>";
        $message_customer .= "<tr><th style='{$th_style}'>Starting Time</th><td style='{$td_style}'>" . esc_html($selected_option['starting_time']) . "</td></tr>";
        $message_customer .= "<tr><th style='{$th_style}'>Participants</th><td style='{$td_style}'>{$total_pax} ({$adults} Adults, {$children} Children)</td></tr>";
        $message_customer .= "<tr><th style='{$th_style}'>Pick-up Location</th><td style='{$td_style}'>{$customer_pickup}</td></tr>";
        $message_customer .= "<tr><th style='{$th_style}'>Total Price</th><td style='{$td_style}'><strong style='color: #0C2C7A; font-size: 16px;'>{$formatted_price} $</strong></td></tr>";
        $message_customer .= "<tr><th style='{$th_style}'>Payment Method</th><td style='{$td_style}'>{$payment_method}</td></tr>";
        $message_customer .= "</table>";

        $message_customer .= "<p style='font-size: 14px; color: #888; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;'>If you have any questions, simply reply to this email.</p>";
        $message_customer .= "</div>";

        // Send to Customer
        wp_mail($customer_email, $subject_customer, $message_customer, $headers);
    }

    wp_send_json_success([
        'message' => 'Booking successful.',
        'reference' => $booking_ref
    ]);
}