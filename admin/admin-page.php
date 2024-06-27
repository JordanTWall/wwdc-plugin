<?php
function my_plugin_admin_page()
{
?>
    <div class="wrap">
        <h1>Service Manager</h1>
        <form id="custom-image-upload-form" method="post" enctype="multipart/form-data">
            <h2>Add New Service</h2>
            <table class="form-table">
                <tr>
                    <th scope="row" id="service-title-th"><label for="service-title">Service Title<br> <span class="regular text" style="font-size: x-small">Customer Display - 80 Character Max.</span></label></th>
                    <td><input type="text" name="service-title" id="service-title" class="regular-text" maxlength="80" required /></td>
                </tr>
                <tr>
                    <th scope="row" id="service-root-name-th"><label for="service-root-name">Short Name<br> <span class="regular text" style="font-size: x-small">For Internal Use. One Word Only - No Spaces or Special Characters.</span></label></th>
                    <td><input type="text" name="service-root-name" id="service-root-name" class="regular-text" maxlength="40" required /></td>
                </tr>
                <tr>
                    <th scope="row" id="service-image-th"><label for="service-image">Service Image<br> <span class="regular text" style="font-size: x-small">Upload Square Images Only</span></label></th>
                    <td><input type="file" name="service-image" id="service-image" required /></td>
                </tr>
                <tr>
                    <th scope="row" id="service-img-alt-th">
                        <label for="service-img-alt">Short Image Description <br>
                            <span class="regular text" style="font-size: x-small">For ADA Compliance and SEO</span>
                        </label>
                    </th>
                    <td><input type="text" name="service-img-alt" id="service-img-alt" class="regular-text" maxlength="80" required /></td>
                </tr>

                <tr>
                    <th scope="row" id="service-max-value-th"><label for="service-max-value">Slider Max Value</label></th>
                    <td><input type="number" name="service-max-value" id="service-max-value" class="regular-text" required /></td>
                </tr>
                <tr>
                    <th scope="row" id="service-slider-price-th"><label for="service-slider-price">Slider Price</label></th>
                    <td><input type="number" name="service-slider-price" id="service-slider-price" class="regular-text" required /></td>
                </tr>
            </table>
            <input type="submit" name="upload_image" id="upload_image" class="button button-primary" value="Add Service" />
            <?php wp_nonce_field('custom_image_upload', 'custom_image_upload_nonce'); ?>
        </form>
        <h2>Existing Services</h2>
        <br>
        <div id="services-list">
            <!-- JavaScript will dynamically load and manage the list of services here -->
        </div>
        <button id="save-service-order" class="button button-primary">Save Changes</button>
        <br>
        <div id="editServiceModal" style="display:none;">
            <form id="edit-service-form">
                <h2>Edit Service</h2>
                <table class="form-table">
                    <tr>
                        <th scope="row" id="edit-service-title-th"><label for="edit-service-title">Service Title<br> <span class="regular text" style="font-size: x-small">Customer Display - 80 Character Max.</span></label></th>
                        <td><input type="text" name="service-title" id="edit-service-title" class="regular-text" maxlength="80" required /></td>
                    </tr>
                    <tr>
                        <th scope="row" id="edit-service-root-name-th"><label for="edit-service-root-name">Short Name<br> <span class="regular text" style="font-size: x-small">For Internal Use. One Word Only - No Spaces or Special Characters.</span></label></th>
                        <td><input type="text" name="service-root-name" id="edit-service-root-name" class="regular-text" maxlength="40" required /></td>
                    </tr>
                    <tr>
                        <th scope="row" id="edit-service-image-th"><label for="edit-service-image">Service Image<br> <span class="regular text" style="font-size: x-small">Upload Square Images Only</span></label></th>
                        <td><input type="file" name="service-image" id="edit-service-image" /></td>
                    </tr>
                    <tr>
                        <th scope="row" id="edit-service-img-alt-th"><label for="edit-service-img-alt">Short Image Description <br><span class="regular text" style="font-size: x-small">For ADA Compliance and SEO</span></label></th>
                        <td><input type="text" name="service-img-alt" id="edit-service-img-alt" class="regular-text" maxlength="80" required /></td>
                    </tr>
                    <tr>
                        <th scope="row" id="edit-service-max-value-th"><label for="edit-service-max-value">Slider Max Value</label></th>
                        <td><input type="number" name="service-max-value" id="edit-service-max-value" class="regular-text" required /></td>
                    </tr>
                    <tr>
                        <th scope="row" id="edit-service-slider-price-th"><label for="edit-service-slider-price">Slider Price</label></th>
                        <td><input type="number" name="service-slider-price" id="edit-service-slider-price" class="regular-text" required /></td>
                    </tr>
                </table>
                <input type="hidden" name="service-id" id="edit-service-id" />
                <input type="submit" value="Save Changes" class="button button-primary" />
            </form>
        </div>
    </div>
<?php
}

function my_plugin_get_services()
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
                'id' => $service_id,
                'serviceTitleText' => get_the_title(),
                'rootName' => get_post_meta($service_id, 'rootName', true),
                'imageUrl' => wp_get_attachment_url(get_post_thumbnail_id($service_id)),
                'imageAlt' => get_post_meta($service_id, 'imageAlt', true),
                'maxValue' => get_post_meta($service_id, 'maxValue', true),
                'sliderPrice' => get_post_meta($service_id, 'sliderPrice', true),
                'serviceOrder' => get_post_meta($service_id, 'serviceOrder', true),
            );
        }
        wp_reset_postdata();
    }
    wp_send_json_success($services);
}
add_action('wp_ajax_my_plugin_get_services', 'my_plugin_get_services');

function my_plugin_get_service()
{
    $service_id = intval($_POST['id']);
    $service = array(
        'id' => $service_id,
        'serviceTitleText' => get_the_title($service_id),
        'rootName' => get_post_meta($service_id, 'rootName', true),
        'imageAlt' => get_post_meta($service_id, 'imageAlt', true),
        'maxValue' => get_post_meta($service_id, 'maxValue', true),
        'sliderPrice' => get_post_meta($service_id, 'sliderPrice', true),
    );
    wp_send_json_success($service);
}
add_action('wp_ajax_my_plugin_get_service', 'my_plugin_get_service');

function my_plugin_edit_service()
{
    $service_id = intval($_POST['service-id']);
    $title = sanitize_text_field($_POST['service-title']);
    $root_name = sanitize_text_field($_POST['service-root-name']);
    $img_alt = sanitize_text_field($_POST['service-img-alt']);
    $max_value = intval($_POST['service-max-value']);
    $slider_price = floatval($_POST['service-slider-price']);

    wp_update_post(array(
        'ID' => $service_id,
        'post_title' => $title,
    ));
    update_post_meta($service_id, 'rootName', $root_name);
    update_post_meta($service_id, 'imageAlt', $img_alt);
    update_post_meta($service_id, 'maxValue', $max_value);
    update_post_meta($service_id, 'sliderPrice', $slider_price);

    if (!empty($_FILES['service-image']['name'])) {
        // Handle the new image upload and update
    }

    wp_send_json_success('Service updated successfully.');
}
add_action('wp_ajax_my_plugin_edit_service', 'my_plugin_edit_service');

// Change service order
function my_plugin_change_service_order()
{
    $service_id = intval($_POST['id']);
    $direction = sanitize_text_field($_POST['direction']);
    $current_order = get_post_meta($service_id, 'serviceOrder', true);

    if ($direction === 'up') {
        $new_order = $current_order - 1;
    } else {
        $new_order = $current_order + 1;
    }

    // Get the service to swap with
    $args = array(
        'post_type' => 'service',
        'meta_key' => 'serviceOrder',
        'meta_value' => $new_order,
        'meta_compare' => '='
    );
    $query = new WP_Query($args);

    if ($query->have_posts()) {
        $query->the_post();
        $other_service_id = get_the_ID();
        update_post_meta($other_service_id, 'serviceOrder', $current_order);
        update_post_meta($service_id, 'serviceOrder', $new_order);
    }

    wp_send_json_success('Service order updated successfully.');
}
add_action('wp_ajax_my_plugin_change_service_order', 'my_plugin_change_service_order');

function my_plugin_save_service_order()
{
    $serviceOrder = $_POST['serviceOrder'];
    foreach ($serviceOrder as $order) {
        update_post_meta($order['id'], 'serviceOrder', $order['order']);
    }
    wp_send_json_success('Service order updated successfully.');
}
add_action('wp_ajax_my_plugin_save_service_order', 'my_plugin_save_service_order');



?>