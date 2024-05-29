// admin-scripts.js

jQuery(document).ready(function ($) {
  $('#custom-image-upload-form').on('submit', function (e) {
    e.preventDefault()

    var formData = new FormData(this)
    formData.append('action', 'my_plugin_add_service')

    $.ajax({
      url: ajax_object.ajax_url,
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        if (response.success) {
          alert('Service added successfully!')
          // Optionally, refresh the list of services
        } else {
          alert('Error: ' + response.data)
        }
      },
      error: function (error) {
        console.log('Error: ', error)
      },
    })
  })

  // Function to load services dynamically (optional)
  function loadServices() {
    $.ajax({
      url: ajax_object.ajax_url,
      type: 'POST',
      data: {
        action: 'my_plugin_get_services',
      },
      success: function (response) {
        if (response.success) {
          // Render services list dynamically
        } else {
          alert('Error: ' + response.data)
        }
      },
      error: function (error) {
        console.log('Error: ', error)
      },
    })
  }

  loadServices() // Load services on page load
})
