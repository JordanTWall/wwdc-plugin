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
  const server = 'https://138.197.124.77:8080'

  const data = {
    ...getServiceData(),
    subtotal: parseFloat(
      document.getElementById('subtotal').textContent.replace('$', '')
    ),

    taxes: parseFloat(
      document.getElementById('taxes').textContent.replace('$', '')
    ),

    savings: parseFloat(
      document.getElementById('savings').textContent.replace('$', '')
    ),

    total: parseFloat(
      document.getElementById('total').textContent.replace('$', '')
    ),

    discountCodeInput: validDiscountCode,
    eventUuid,
    inviteeUuid,
  }

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
    const response = await fetch(`${server}/api/auth`, {
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

  console.log(`The event UUID is ${eventUuid}`)
  console.log(`The invitee UUID is ${inviteeUuid}`)
  sendQuoteInfo(eventUuid, inviteeUuid)
}
