<?php

// Handle AJAX request to add a new service
function my_plugin_add_service()
{
    check_ajax_referer('custom_image_upload', 'custom_image_upload_nonce');

    // Validate and sanitize input fields
    $title = sanitize_text_field($_POST['service-title']);
    $root_name = sanitize_text_field($_POST['service-root-name']);
    $max_value = intval($_POST['service-max-value']);
    $slider_price = floatval($_POST['service-slider-price']);
    $img_alt = sanitize_text_field($_POST['service-img-alt']);

    // Validate required fields
    if (empty($title) || empty($root_name) || $max_value <= 0 || $slider_price <= 0) {
        wp_send_json_error('Invalid service data. Please ensure all fields are filled out correctly.');
    }

    // Handle file upload
    if (!function_exists('wp_handle_upload')) {
        require_once(ABSPATH . 'wp-admin/includes/file.php');
    }

    $uploadedfile = $_FILES['service-image'];
    $upload_overrides = array('test_form' => false);
    $movefile = wp_handle_upload($uploadedfile, $upload_overrides);

    if ($movefile && !isset($movefile['error'])) {
        $attachment_id = custom_insert_attachment($movefile['file']);

        // Validate and crop the image to a square
        if (!custom_validate_and_crop_image($attachment_id)) {
            wp_send_json_error('Image must be a square.');
            return;
        }

        // Determine service order dynamically
        $service_page = 'carpetCleaningPage'; // Change this if dynamic logic is required
        $args = array(
            'post_type' => 'service',
            'meta_query' => array(
                array(
                    'key' => 'servicePage',
                    'value' => $service_page,
                    'compare' => '='
                )
            ),
            'posts_per_page' => -1,
        );
        $query = new WP_Query($args);
        $service_order = $query->found_posts + 1; // Increment for the next order

        // Create a new post of type 'service'
        $post_id = wp_insert_post(array(
            'post_title' => $title,
            'post_type' => 'service',
            'post_status' => 'publish'
        ));

        if (is_wp_error($post_id)) {
            wp_send_json_error('Failed to create service. Please try again.');
        }

        set_post_thumbnail($post_id, $attachment_id);

        // Save custom fields
        update_post_meta($post_id, 'servicePage', $service_page);
        update_post_meta($post_id, 'rootName', $root_name);
        update_post_meta($post_id, 'imageUrl', wp_get_attachment_url($attachment_id));
        update_post_meta($post_id, 'imageAlt', $img_alt);
        update_post_meta($post_id, 'maxValue', $max_value);
        update_post_meta($post_id, 'sliderPrice', $slider_price);
        update_post_meta($post_id, 'serviceOrder', $service_order);

        wp_send_json_success('Service added successfully.');
    } else {
        wp_send_json_error('Error uploading image: ' . $movefile['error']);
    }
}
add_action('wp_ajax_my_plugin_add_service', 'my_plugin_add_service');

// Handle AJAX request to delete a service
function my_plugin_delete_service()
{
    check_ajax_referer('custom_image_upload', 'security');

    $service_id = intval($_POST['id']);

    if ($service_id && get_post($service_id)) {
        wp_delete_post($service_id, true); // Permanently delete
        wp_send_json_success('Service deleted successfully.');
    } else {
        wp_send_json_error('Invalid service ID.');
    }
}
add_action('wp_ajax_my_plugin_delete_service', 'my_plugin_delete_service');

// Save Calendly Link
function my_plugin_save_calendly_link()
{
    check_ajax_referer('custom_image_upload', 'security');
    update_option('calendly_link', sanitize_text_field($_POST['calendly_link']));
    wp_send_json_success(['message' => 'Calendly link saved successfully.']);
}
add_action('wp_ajax_my_plugin_save_calendly_link', 'my_plugin_save_calendly_link');

// Save Server API Endpoint
function my_plugin_save_server_endpoint()
{
    check_ajax_referer('custom_image_upload', 'security');
    update_option('server_endpoint', sanitize_text_field($_POST['server_endpoint']));
    wp_send_json_success(['message' => 'Server endpoint saved successfully.']);
}
add_action('wp_ajax_my_plugin_save_server_endpoint', 'my_plugin_save_server_endpoint');

// Save Discount Codes
function my_plugin_save_discount_code()
{
    check_ajax_referer('custom_image_upload', 'security');

    $codes = get_option('discount_codes', '[]');
    $codes = json_decode($codes, true);

    $new_code = sanitize_text_field($_POST['code']);
    $new_value = floatval($_POST['value']);

    $codes[] = ['discountCode' => $new_code, 'discountValue' => $new_value];
    update_option('discount_codes', json_encode($codes));

    wp_send_json_success($codes);
}
add_action('wp_ajax_my_plugin_save_discount_code', 'my_plugin_save_discount_code');

// Delete Discount Codes
function my_plugin_delete_discount_code()
{
    check_ajax_referer('custom_image_upload', 'security');
    $index = intval($_POST['index']);

    $codes = get_option('discount_codes', '[]');
    $codes = json_decode($codes, true);

    if (!isset($codes[$index])) {
        wp_send_json_error('Invalid discount code index.');
    }

    unset($codes[$index]);
    $codes = array_values($codes); // Re-index the array
    update_option('discount_codes', json_encode($codes));

    wp_send_json_success($codes);
}
add_action('wp_ajax_my_plugin_delete_discount_code', 'my_plugin_delete_discount_code');

// Validate and Crop Image to a Square
function custom_validate_and_crop_image($attachment_id)
{
    $image_path = get_attached_file($attachment_id);
    $image_editor = wp_get_image_editor($image_path);

    if (is_wp_error($image_editor)) {
        return false;
    }

    $size = $image_editor->get_size();
    $width = $size['width'];
    $height = $size['height'];

    if ($width != $height) {
        $size = min($width, $height);
        $x = ($width - $size) / 2;
        $y = ($height - $size) / 2;

        $image_editor->crop($x, $y, $size, $size, $size, $size);
        $cropped_image_path = $image_editor->generate_filename('cropped');
        $image_editor->save($cropped_image_path);

        $attachment_data = wp_generate_attachment_metadata($attachment_id, $cropped_image_path);
        wp_update_attachment_metadata($attachment_id, $attachment_data);

        return true;
    }

    return true;
}

// Insert Attachment into WordPress Media Library
function custom_insert_attachment($file)
{
    $filetype = wp_check_filetype($file);
    $attachment = array(
        'guid' => $file,
        'post_mime_type' => $filetype['type'],
        'post_title' => sanitize_file_name(basename($file)),
        'post_content' => '',
        'post_status' => 'inherit',
    );
    $attachment_id = wp_insert_attachment($attachment, $file);
    require_once(ABSPATH . 'wp-admin/includes/image.php');
    $attach_data = wp_generate_attachment_metadata($attachment_id, $file);
    wp_update_attachment_metadata($attachment_id, $attach_data);

    return $attachment_id;
}

// Fetch Services Data
function get_services_data()
{
    $args = array(
        'post_type' => 'service',
        'posts_per_page' => -1,
        'meta_key' => 'serviceOrder',
        'orderby' => 'meta_value_num',
        'order' => 'ASC',
    );

    $query = new WP_Query($args);
    $services = array();

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $service_id = get_the_ID();

            $services[] = array(
                'servicePage' => get_post_meta($service_id, 'servicePage', true),
                'rootName' => get_post_meta($service_id, 'rootName', true),
                'serviceTitleText' => get_the_title(),
                'imageUrl' => get_the_post_thumbnail_url($service_id, 'medium'),
                'imageAlt' => get_post_meta($service_id, 'imageAlt', true),
                'maxValue' => get_post_meta($service_id, 'maxValue', true),
                'sliderPrice' => get_post_meta($service_id, 'sliderPrice', true),
                'serviceOrder' => get_post_meta($service_id, 'serviceOrder', true),
            );
        }
        wp_reset_postdata();
    }

    return new WP_REST_Response($services, 200);
}
add_action('rest_api_init', function () {
    register_rest_route('wall-web-dev-calendly-integration-plugin/v1', '/services', array(
        'methods' => 'GET',
        'callback' => 'get_services_data',
    ));
});
