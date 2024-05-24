<?php
function wwdc_display_shortcode()
{
    ob_start();
?>
    <div id="my-custom-plugin-container">
        <!-- Your HTML content here -->
        <div class="container" id="masterContainer">
            <div class="row">
                <!-- Service Selector Column -->
                <div class="col-sm-9" id="services-selector-container">
                    <!-- service containers dynamically generated here -->
                </div>

                <!-- Calculator Container -->
                <div class="col-sm-3 calc-container" id="subtotal-calculator-container">
                    <div class="container quote-tool calculator-container sticky-calculator">
                        <!-- Logo -->
                        <div class="row centered">
                            <div class="row custom-col centered checkout-logo-container">
                                <img src="https://cleanandpristinesvcinc.com/wp-content/uploads/2023/01/cropped-b2b66fb2-c6ee-494d-afa0-a11cadb90cfc.png" alt="Clean & Pristine Logo" class="checkout-logo" />
                            </div>

                            <!-- Service Page Title -->
                            <div class="row custom-col centered checkout-title-text">
                                <div class="col">
                                    <h5>Carpet & Upholstery Services</h5>
                                </div>
                            </div>
                        </div>

                        <!-- Service Subtotals -->
                        <div class="service-subtotals" id="service-subtotal-container">
                            <!-- Calculator Subtotals -->
                            <div class="row calc-row">
                                <div class="col quote-col">
                                    <div class="input-group">
                                        <input type="text" class="form-control" placeholder="Enter Discount Code" />
                                        <div class="input-group-append discount-code-button">
                                            <button class="btn btn-primary" type="button">Apply</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Subtotal -->
                        <div class="subtotals-calculator">
                            <div class="row subtotal-calc-row">
                                <div class="col service-col">Services:</div>
                                <div class="col quote-col"><span id="subtotal">$0.00</span></div>
                            </div>

                            <!-- Tax -->
                            <div class="row subtotal-calc-row">
                                <div class="col service-col">Tax (7%):</div>
                                <div class="col quote-col"><span id="taxes">$0.00</span></div>
                            </div>

                            <!-- Savings -->
                            <div class="row subtotal-calc-row">
                                <div class="col service-col">Savings:</div>
                                <div class="col quote-col"><span id="savings" class="savings">$0.00</span></div>
                            </div>

                            <!-- Discount Code Display-->
                            <div class="row subtotal-calc-row">
                                <div class="col service-col">Total:</div>
                                <div class="col quote-col"><span id="total">$0.00</span></div>
                            </div>

                            <!-- Discount Code Input -->
                            <div class="row centered discount-code-alerts discount-code-input">
                                <div class="col-12">
                                    <input id="discountCodeInput" class="form-control form-control-sm" type="text" placeholder="Enter Discount Code" />
                                </div>
                            </div>

                            <!-- hidden success/failure messages -->
                            <div class="centered col-12">
                                <!-- Discount Code Failure -->
                                <div class="row centered subtotal-calc-row invalid-code col-12 discount-code-alerts" id="invalid-code">
                                    Invalid Discount Code
                                </div>
                                <!-- Discount Code Success -->
                                <div class="row centered subtotal-calc-row discount-applied col-12 discount-code-alerts" id="discount-applied">
                                    <span id="discount-percentage" class="discount-code-alerts"></span>
                                    Discount Applied!
                                </div>
                            </div>

                            <!-- Discount Button -->
                            <div class="row centered subtotal-calc-row">
                                <button class="btn btn-primary btns" id="discountBtn">Apply Discount</button>
                            </div>
                            <div class="centered col-12">
                                <div class="row centered subtotal-calc-row invalid-code discount-code-alerts col-12" id="select-services">
                                    Please Select Services
                                </div>
                            </div>
                            <div class="row centered subtotal-calc-row" id="book-now-container">
                                <button class="btn btn-primary btns" id="bookNowBtn">Book Now!</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- checkout button -->
            <a href="#subtotal-calculator-container">
                <button id="checkout-button" class="btn btn-primary btns">
                    <i class="fa fa-cart-arrow-down"></i></button>
            </a>
        </div>
    </div>
<?php
    return ob_get_clean();
}
add_shortcode('wall-web-dev-calendly-integration', 'wwdc_display_shortcode');
