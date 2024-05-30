// admin-scripts.js

jQuery(document).ready(function ($) {
  $('#custom-image-upload-form').on('submit', function (e) {
    e.preventDefault()

    // Validate fields and highlight empty ones
    let isValid = true

    // Reset all th colors
    $('th').css('color', '')

    let serviceTitle = $('#service-title').val()
    if (!serviceTitle || serviceTitle.length > 80) {
      $('#service-title-th').css('color', 'red')
      isValid = false
    }

    let serviceRootName = $('#service-root-name').val()
    let rootNameRegex = /^[a-zA-Z0-9]+$/
    if (
      !serviceRootName ||
      serviceRootName.length > 40 ||
      !rootNameRegex.test(serviceRootName)
    ) {
      $('#service-root-name-th').css('color', 'red')
      isValid = false
    }

    let serviceImage = $('#service-image')[0].files[0]
    if (!serviceImage) {
      $('#service-image-th').css('color', 'red')
      isValid = false
    } else {
      // Optional: Validate image file type and size
      const fileType = serviceImage.type
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif']
      if (!validImageTypes.includes(fileType)) {
        alert('Only JPG, PNG, and GIF files are allowed.')
        $('#service-image-th').css('color', 'red')
        isValid = false
      }
    }

    let serviceMaxValue = $('#service-max-value').val()
    if (!serviceMaxValue) {
      $('#service-max-value-th').css('color', 'red')
      isValid = false
    }

    let serviceSliderPrice = $('#service-slider-price').val()
    if (!serviceSliderPrice) {
      $('#service-slider-price-th').css('color', 'red')
      isValid = false
    }

    if (!isValid) {
      alert('Please fill in all required fields correctly.')
      return
    }

    let formData = new FormData(this)
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
