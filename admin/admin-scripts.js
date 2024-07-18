jQuery(document).ready(function ($) {
  // Handle New Service Form Submission
  $('#custom-image-upload-form').on('submit', function (e) {
    e.preventDefault()

    // Validate fields and highlight empty ones
    let isValid = true

    // Reset all th colors
    $('th').css('color', '')

    // Error Handling For Post
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

  // Handle Edit Service Form Submission
  $('#edit-service-form').on('submit', function (e) {
    e.preventDefault()

    // Validate fields and highlight empty ones
    let isValid = true

    // Reset all the colors
    $('th').css('color', '')

    // Error Handling For Post
    let serviceTitle = $('#edit-service-title').val()
    if (!serviceTitle || serviceTitle.length > 80) {
      $('#edit-service-title-th').css('color', 'red')
      isValid = false
    }

    let serviceRootName = $('#edit-service-root-name').val()
    let rootNameRegex = /^[a-zA-Z0-9]+$/
    if (
      !serviceRootName ||
      serviceRootName.length > 40 ||
      !rootNameRegex.test(serviceRootName)
    ) {
      $('#edit-service-root-name-th').css('color', 'red')
      isValid = false
    }

    let serviceImage = $('#edit-service-image')[0].files[0]
    if (serviceImage) {
      const fileType = serviceImage.type
      const validImageTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
      ]
      if (!validImageTypes.includes(fileType)) {
        alert('Only JPG, PNG, WEBP and GIF files are allowed.')
        $('#edit-service-image-th').css('color', 'red')
        isValid = false
      }
    }

    let serviceMaxValue = $('#edit-service-max-value').val()
    if (!serviceMaxValue) {
      $('#edit-service-max-value-th').css('color', 'red')
      isValid = false
    }

    let serviceSliderPrice = $('#edit-service-slider-price').val()
    if (!serviceSliderPrice) {
      $('#edit-service-slider-price-th').css('color', 'red')
      isValid = false
    }

    if (!isValid) {
      alert('Please fill in all required fields correctly.')
      return
    }

    const formData = new FormData(this)
    formData.append('action', 'my_plugin_edit_service')
    formData.append('security', ajax_object.ajax_nonce) // Add the nonce

    const existingImageUrl = $('#edit-service-image').data('existing-image-url')
    if (existingImageUrl && !$('#edit-service-image')[0].files[0]) {
      formData.append('existing-image-url', existingImageUrl)
    }

    $.ajax({
      url: ajax_object.ajax_url,
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        if (response.success) {
          alert('Service updated successfully!')
          $('#edit-service-container').hide()
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

  let initialOrder = []

  function loadServices() {
    $.ajax({
      url: ajax_object.ajax_url,
      type: 'POST',
      data: { action: 'my_plugin_get_services' },
      success: function (response) {
        if (response.success) {
          renderServices(response.data)
          storeInitialOrder()
        } else {
          alert('Error: ' + response.data)
        }
      },
      error: function (error) {
        console.log('Error: ', error)
      },
    })
  }

  function storeInitialOrder() {
    initialOrder = []
    $('.service-item').each(function (index) {
      initialOrder.push($(this).data('id'))
    })
  }

  function getCurrentOrder() {
    const currentOrder = []
    $('.service-item').each(function (index) {
      currentOrder.push($(this).data('id'))
    })
    return currentOrder
  }

  function hasOrderChanged() {
    const currentOrder = getCurrentOrder()
    if (initialOrder.length !== currentOrder.length) {
      return true
    }
    for (let i = 0; i < initialOrder.length; i++) {
      if (initialOrder[i] !== currentOrder[i]) {
        return true
      }
    }
    return false
  }

  // Render services
  function renderServices(services) {
    const servicesList = $('#services-list')
    servicesList.empty()
    services.forEach((service) => {
      const serviceDiv = $(`
        <div class="service-item" data-id="${service.id}">
            <h3 class="service-title">${service.serviceTitleText}</h3>
            <div class="service-content">
                <img src="${service.imageUrl}" alt="${service.imageAlt}" class="service-image" />
                <div class="service-buttons">
                    <button class="view-edit-service edit-svc-btn button button-secondary" data-id="${service.id}">View/Edit Service</button>
                    <button class="delete-service button button-secondary" data-id="${service.id}">Delete</button>
                </div>
            </div>
        </div>
      `)
      servicesList.append(serviceDiv)
    })
    servicesList.sortable({})
  }

  function saveServiceOrder() {
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
        } else {
          alert('Error: ' + response.data)
        }
      },
      error: function (error) {
        console.log('Error: ', error)
      },
    })
  }

  // Save Service Order Handler
  $('#save-service-order').on('click', function () {
    if (hasOrderChanged()) {
      saveServiceOrder()
    } else {
      alert('Order has not changed.')
    }
  })

  function saveEditedService() {
    const formData = new FormData($('#edit-service-form')[0])
    formData.append('action', 'my_plugin_edit_service')
    formData.append('security', ajax_object.ajax_nonce) // Add the nonce
    const existingImageUrl = $('#edit-service-image').data('existing-image-url')
    if (existingImageUrl && !$('#edit-service-image')[0].files[0]) {
      formData.append('existing-image-url', existingImageUrl)
    }
    saveServiceOrder()
    $.ajax({
      url: ajax_object.ajax_url,
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        if (response.success) {
          alert('Service updated successfully!')
          $('#edit-service-container').hide()
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

  //Edit Serive Btn Handler
  $('#edit-service-form').on('submit', function (e) {
    e.preventDefault()
    saveEditedService()
  })

  //Save Service Btn Handler
  $('#save-service-changes-btn').on('click', function (e) {
    e.preventDefault()
    saveEditedService()
  })

  //Render Edit Service Section
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

          if (service.imageUrl) {
            $('#edit-service-image').data(
              'existing-image-url',
              service.imageUrl
            )
          }
          $('#edit-service-container').show()
        } else {
          alert('Error: ' + response.data)
        }
      },
      error: function (error) {
        console.log('Error: ', error)
      },
    })
  })

  loadServices()
})
