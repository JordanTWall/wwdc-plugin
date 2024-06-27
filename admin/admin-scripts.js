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
      const fileType = serviceImage.type
      const validImageTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
      ]
      if (!validImageTypes.includes(fileType)) {
        alert('Only JPG, PNG, WEBP and GIF files are allowed.')
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
          loadServices()
        } else {
          alert('Error: ' + response.data)
        }
      },
      error: function (error) {
        console.log('Error: ', error)
      },
    })
  })

  function loadServices() {
    $.ajax({
      url: ajax_object.ajax_url,
      type: 'POST',
      data: { action: 'my_plugin_get_services' },
      success: function (response) {
        if (response.success) {
          renderServices(response.data)
        } else {
          alert('Error: ' + response.data)
        }
      },
      error: function (error) {
        console.log('Error: ', error)
      },
    })
  }

  // Render services dynamically
  function renderServices(services) {
    const servicesList = $('#services-list')
    servicesList.empty()
    services.forEach((service, index) => {
      const isFirst = index === 0
      const isLast = index === services.length - 1
      const serviceDiv = $(`
        <div class="service-item" data-id="${service.id}">
          <img src="${service.imageUrl}" alt="${
        service.imageAlt
      }" width="100" height="100" />
          <span>${service.serviceTitleText}</span>
          <button class="view-edit-service" data-id="${
            service.id
          }">View/Edit Service</button>
          ${
            !isFirst
              ? '<button class="move-up" data-id="' +
                service.id +
                '">&uarr;</button>'
              : ''
          }
          ${
            !isLast
              ? '<button class="move-down" data-id="' +
                service.id +
                '">&darr;</button>'
              : ''
          } 
        </div>
      `)
      servicesList.append(serviceDiv)
      const deleteButton = $('<button>')
        .addClass('delete-service')
        .text('Delete')
        .data('id', service.id)
      serviceDiv.append(deleteButton)

      // Delete service button click
      $(document).on('click', '.delete-service', function () {
        const serviceId = $(this).data('id')
        if (
          confirm(
            'Are you sure you want to delete this service? This action cannot be undone.'
          )
        ) {
          $.ajax({
            url: ajax_object.ajax_url,
            type: 'POST',
            data: { action: 'my_plugin_delete_service', id: serviceId },
            success: function (response) {
              if (response.success) {
                alert('Service deleted successfully!')
                loadServices()
              } else {
                alert('Error: ' + response.data)
              }
            },
            error: function (error) {
              console.log('Error: ', error)
            },
          })
        }
      })
    })
    // Add this in the renderServices function where other buttons are appended
  }

  // Save service order button click
  $('#save-service-order').on('click', function () {
    const serviceOrder = []
    $('.service-item').each(function (index) {
      serviceOrder.push({
        id: $(this).data('id'),
        order: index + 1,
      })
    })
    $.ajax({
      url: ajax_object.ajax_url,
      type: 'POST',
      data: {
        action: 'my_plugin_save_service_order',
        serviceOrder: serviceOrder,
      },
      success: function (response) {
        if (response.success) {
          alert('Service order saved successfully!')
          loadServices()
          const selectedServiceId = $('#edit-service-id').val()
          if (selectedServiceId) {
            saveEditedService()
          }
        } else {
          alert('Error: ' + response.data)
        }
      },
      error: function (error) {
        console.log('Error: ', error)
      },
    })
  })

  // View/Edit service button click
  $(document).on('click', '.view-edit-service', function () {
    const serviceId = $(this).data('id')
    $.ajax({
      url: ajax_object.ajax_url,
      type: 'POST',
      data: { action: 'my_plugin_get_service', id: serviceId },
      success: function (response) {
        if (response.success) {
          const service = response.data
          $('#edit-service-id').val(service.id)
          $('#edit-service-title').val(service.serviceTitleText)
          $('#edit-service-root-name').val(service.rootName)
          $('#edit-service-max-value').val(service.maxValue)
          $('#edit-service-slider-price').val(service.sliderPrice)
          $('#edit-service-img-alt').val(service.imageAlt)
          $('#editServiceModal').show()
        } else {
          alert('Error: ' + response.data)
        }
      },
      error: function (error) {
        console.log('Error: ', error)
      },
    })
  })

  // Function to save edited service
  function saveEditedService() {
    const formData = new FormData($('#edit-service-form')[0])
    formData.append('action', 'my_plugin_edit_service')
    $.ajax({
      url: ajax_object.ajax_url,
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        if (response.success) {
          alert('Service updated successfully!')
          $('#editServiceModal').hide()
          loadServices()
        } else {
          alert('Error: ' + response.data)
        }
      },
      error: function (error) {
        console.log('Error: ', error)
      },
    })
  }

  // Move service up
  $(document).on('click', '.move-up', function () {
    const serviceId = $(this).data('id')
    // Implement the logic to move the service up in order
    changeServiceOrder(serviceId, 'up')
  })

  // Move service down
  $(document).on('click', '.move-down', function () {
    const serviceId = $(this).data('id')
    // Implement the logic to move the service down in order
    changeServiceOrder(serviceId, 'down')
  })

  function changeServiceOrder(serviceId, direction) {
    $.ajax({
      url: ajax_object.ajax_url,
      type: 'POST',
      data: {
        action: 'my_plugin_change_service_order',
        id: serviceId,
        direction: direction,
      },
      success: function (response) {
        if (response.success) {
          loadServices()
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
