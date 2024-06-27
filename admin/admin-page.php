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
        <button id="save-service-order" class="button button-primary">Save Service Order</button>
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
                <input type="submit" value="Save Service Changes" class="button button-primary" id="save-service-changes-btn/>
            </form>
        </div>
    </div>
<?php
}
?>