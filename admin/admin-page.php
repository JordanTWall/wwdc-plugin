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
                    <th scope="row"><label for="service-title">Service Title</label></th>
                    <td><input type="text" name="service-title" id="service-title" class="regular-text" /></td>
                </tr>
                <tr>
                    <th scope="row"><label for="service-root-name">Root Name</label></th>
                    <td><input type="text" name="service-root-name" id="service-root-name" class="regular-text" /></td>
                </tr>
                <tr>
                    <th scope="row"><label for="service-image">Service Image</label></th>
                    <td><input type="file" name="service-image" id="service-image" /></td>
                </tr>
                <tr>
                    <th scope="row"><label for="service-max-value">Max Value</label></th>
                    <td><input type="number" name="service-max-value" id="service-max-value" class="regular-text" /></td>
                </tr>
                <tr>
                    <th scope="row"><label for="service-slider-price">Slider Price</label></th>
                    <td><input type="number" name="service-slider-price" id="service-slider-price" class="regular-text" /></td>
                </tr>
            </table>
            <input type="submit" name="upload_image" id="upload_image" class="button button-primary" value="Add Service" />
            <?php wp_nonce_field('custom_image_upload', 'custom_image_upload_nonce'); ?>
        </form>
        <div id="services-list">
            <h2>Existing Services</h2>
            <!-- JavaScript will dynamically load and manage the list of services here -->
        </div>
    </div>
<?php
}
?>