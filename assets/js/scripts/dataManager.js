export function getServiceData() {
  const serviceData = {}

  document.querySelectorAll('.service-container').forEach((service) => {
    const serviceName = service
      .querySelector('.service-title-text')
      .textContent.trim()

    const $slider = service.querySelector('.custom-range')

    const sliderPrice = parseFloat($slider.getAttribute('data-slider-price'))

    const quantity = parseFloat(
      service.querySelector('.selector-display span').textContent
    )

    if (!isNaN(sliderPrice) && !isNaN(quantity)) {
      const subtotal = sliderPrice * quantity
      serviceData[serviceName] = {
        quantity,
        serviceSubtotal: subtotal,
      }
    }
  })

  return serviceData
}

export async function sendQuoteInfo(eventUuid, inviteeUuid) {
  const server = 'http://localhost:8080'
  const apiRoute = '/'

  const getValue = (id) =>
    parseFloat(document.getElementById(id).textContent.replace('$', ''))

  const discountCodeElement = document.getElementById('discountCodeInput')
  const discountCodeValue = discountCodeElement ? discountCodeElement.value : ''

  const data = {
    ...getServiceData(),
    subtotal: getValue('subtotal'),
    taxes: getValue('taxes'),
    savings: getValue('savings'),
    total: getValue('total'),
    discountCodeInput: discountCodeValue ? '' : discountCodeValue,
    eventUuid,
    inviteeUuid,
  }
  console.log(data)

  const templateParams = {
    data: JSON.stringify(data),
  }

  try {
    const emailResponse = await emailjs.send(
      'service_b0hdp8b',
      'template_uhtnijl',
      templateParams
    )

    console.log(
      'Email sent successfully!',
      emailResponse.status,
      emailResponse.text
    )
  } catch (emailError) {
    console.error('Failed to send email...', emailError)
  }

  try {
    const response = await fetch(`${server}${apiRoute}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const responseData = await response.json()
    console.log('Data sent successfully:', responseData)
  } catch (fetchError) {
    console.error('Error sending data:', fetchError)
  }
}

//gets client and event IDs from calendly.
export function getUuids(eventUri, inviteeUri) {
  const eventUuid = eventUri.split('/scheduled_events/')[1]
  const inviteeUuid = inviteeUri.split('/invitees/')[1]
  sendQuoteInfo(eventUuid, inviteeUuid)
}

export async function fetchServices() {
  try {
    const response = await fetch(
      '/wp-json/wall-web-dev-calendly-integration-plugin/v1/services'
    )
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const services = await response.json()
    return services
  } catch (error) {
    console.error('Error fetching services:', error)
    return []
  }
}
