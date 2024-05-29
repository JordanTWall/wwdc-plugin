<?php
/*
Plugin Name: Wall Web Dev Calendly Integration Plugin
Plugin URI: https://wallwebdevelopment.com
Description: A custom plugin to integrate cleaning services selection and Calendly's scheduling software
Version: 1.0
Author: Jordan Wall
Author URI: https://wallwebdevelopment.com
License: GPL2
*/

// Prevent direct access to the file
if (!defined('ABSPATH')) {
    exit;
}

// Define constants
define('WWDC_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('WWDC_PLUGIN_URL', plugin_dir_url(__FILE__));

// Include additional PHP files
require_once(WWDC_PLUGIN_PATH . 'includes/shortcode.php');

include(plugin_dir_path(__FILE__) . 'includes/functions.php');

// Enqueue scripts and styles
function wwdc_enqueue_assets()
{
    // Enqueue styles
    wp_enqueue_style('wwdc-style', plugin_dir_url(__FILE__) . 'assets/css/style.css');



    // Third-party assets
    wp_enqueue_style('bootstrap-css', 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css');
    wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');
    wp_enqueue_style('calendly-css', 'https://calendly.com/assets/external/widget.css');

    wp_enqueue_script('jquery');

    // Enqueue scripts
    wp_enqueue_script('bootstrap-js', 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js', ['jquery', 'popper-js'], null, true);
    wp_enqueue_script('popper-js', 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js', [], null, true);
    wp_enqueue_script('calendly-widget', 'https://calendly.com/assets/external/widget.js', [], null, true);

    // Plugin JavaScript files

    wp_enqueue_script_module('wwdc-data-script', plugin_dir_url(__FILE__) . 'assets/js/utils/data.js');
    wp_enqueue_script_module('wwdc-calculator-script', plugin_dir_url(__FILE__) . 'assets/js/scripts/calculator.js');
    wp_enqueue_script_module('wwdc-data-manager-script', plugin_dir_url(__FILE__) . 'assets/js/scripts/dataManager.js');
    wp_enqueue_script_module('wwdc-display-controller-script', plugin_dir_url(__FILE__) . 'assets/js/scripts/displayController.js', ['jquery', 'wwdc-data-script', 'wwdc-calculator-script', 'wdc-utils-script']);
    wp_enqueue_script_module('wwdc-handlers-script', plugin_dir_url(__FILE__) . 'assets/js/scripts/handlers.js', ['wwdc-data-manager-script', 'wwdc-calculator-script', 'calendly-widget']);
    wp_enqueue_script_module('wwdc-main-script', plugin_dir_url(__FILE__) . 'assets/js/scripts/main.js', ['jquery', 'wwdc-utils-script', 'wwdc-display-controller-script', 'wwdc-handlers-script']);




    // Enqueue emailjs script
    wp_enqueue_script('emailjs', 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js', [], null, true);

    // Enqueue the inline script that depends on emailjs
    wp_add_inline_script('emailjs', '
        (function() {
            emailjs.init({
                publicKey: "92WGB_-QLtXqknE71",
            });
        })();
    ');
}
add_action('wp_enqueue_scripts', 'wwdc_enqueue_assets');
