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
require_once(WWDC_PLUGIN_PATH . 'includes/functions.php');
require_once(WWDC_PLUGIN_PATH . 'admin/admin-page.php');

// Add admin menu
function my_plugin_add_admin_menu()
{
    add_menu_page('Service Manager', 'Service Manager', 'manage_options', 'service-manager', 'my_plugin_admin_page');
}
add_action('admin_menu', 'my_plugin_add_admin_menu');

// Enqueue admin scripts
function my_plugin_enqueue_admin_scripts($hook)
{
    if ($hook != 'toplevel_page_service-manager') {
        return;
    }
    wp_enqueue_script('admin-scripts', WWDC_PLUGIN_URL . 'admin/admin-scripts.js', array('jquery'), null, true);
    wp_localize_script('admin-scripts', 'ajax_object', array('ajax_url' => admin_url('admin-ajax.php'), 'ajax_nonce' => wp_create_nonce('my_plugin_nonce')));
}
add_action('admin_enqueue_scripts', 'my_plugin_enqueue_admin_scripts');

// Enqueue frontend scripts and styles
function wwdc_enqueue_assets()
{
    wp_enqueue_style('wwdc-style', WWDC_PLUGIN_URL . 'assets/css/style.css');
    wp_enqueue_style('bootstrap-css', 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css');
    wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');
    wp_enqueue_style('calendly-css', 'https://calendly.com/assets/external/widget.css');

    wp_enqueue_script('jquery');
    wp_enqueue_script('popper-js', 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js', array(), null, true);
    wp_enqueue_script('bootstrap-js', 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js', array('jquery', 'popper-js'), null, true);
    wp_enqueue_script('calendly-widget', 'https://calendly.com/assets/external/widget.js', array(), null, true);

    wp_enqueue_script_module('wwdc-data-script', WWDC_PLUGIN_URL . 'assets/js/utils/data.js');
    wp_enqueue_script_module('wwdc-calculator-script', WWDC_PLUGIN_URL . 'assets/js/scripts/calculator.js');
    wp_enqueue_script_module('wwdc-data-manager-script', WWDC_PLUGIN_URL . 'assets/js/scripts/dataManager.js');
    wp_enqueue_script_module('wwdc-display-controller-script', WWDC_PLUGIN_URL . 'assets/js/scripts/displayController.js', array('jquery', 'wwdc-data-script', 'wwdc-calculator-script'));
    wp_enqueue_script_module('wwdc-handlers-script', WWDC_PLUGIN_URL . 'assets/js/scripts/handlers.js', array('wwdc-data-manager-script', 'wwdc-calculator-script', 'calendly-widget'));
    wp_enqueue_script_module('wwdc-main-script', WWDC_PLUGIN_URL . 'assets/js/scripts/main.js', array('jquery', 'wwdc-display-controller-script', 'wwdc-handlers-script'));

    wp_enqueue_script('emailjs', 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js', array(), null, true);
    wp_add_inline_script('emailjs', '
        (function() {
            emailjs.init({
                publicKey: "92WGB_-QLtXqknE71",
            });
        })();
    ');
}
add_action('wp_enqueue_scripts', 'wwdc_enqueue_assets');
