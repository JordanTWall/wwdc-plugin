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
  const server = 'https://api.wallwebdevelopment.com/cnpserver/'
  const apiRoute = 'api'

  const getValue = (id) =>
    parseFloat(document.getElementById(id).textContent.replace('$', ''))

  const discountCodeElement = document.getElementById('discountCodeInput')
  const discountCodeValue = discountCodeElement.value.trim()

  const data = {
    ...getServiceData(),
    subtotal: getValue('subtotal'),
    taxes: getValue('taxes'),
    savings: getValue('savings'),
    total: getValue('total'),
    discountCodeInput: discountCodeValue,
    eventUuid,
    inviteeUuid,
  }

  const queryString = new URLSearchParams(data).toString()
  console.log(`Request query string: ${queryString}`)

  try {
    const response = await fetch(`${server}${apiRoute}?${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const emailBody = await response.text()
    console.log('Data received successfully:', emailBody)

    const templateParams = {
      data: emailBody,
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
  } catch (fetchError) {
    console.error('Error sending data:', fetchError)
  }
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
