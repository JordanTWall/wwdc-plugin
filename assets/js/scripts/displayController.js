import { services } from '../utils/data.js'
import { hideEmptyCartAlert, hideUnusedRows } from '../utils/utils.js'
import { updateSliderValue } from './calculator.js'

export function renderServices() {
  const servicesContainer = jQuery('#services-selector-container')
  const serviceSubtotalContainer = jQuery('#service-subtotal-container')

  services.forEach((service) => {
    const rootNameCapitalized =
      service.rootName.charAt(0).toUpperCase() + service.rootName.slice(1)

    const serviceContainer = jQuery('<div>').addClass('service-container')

    // Title
    const titleDiv = jQuery('<div>').addClass('service-title row')
    const titleTextDiv = jQuery('<div>').addClass('col-9')
    const titleText = jQuery('<p>')
      .addClass('service-title-text')
      .text(service.serviceTitleText)
    titleTextDiv.append(titleText)

    const chevronDiv = jQuery('<div>').addClass('col-3 text-right')
    const chevronIcon = jQuery('<i>').addClass(
      'fa chevron fas fa-chevron-down custom-chevron'
    )
    chevronIcon.on('click', function () {
      toggleDropdown(`${service.rootName}-selector`, this)
    })
    chevronDiv.append(chevronIcon)

    titleDiv.append(titleTextDiv).append(chevronDiv)

    // Picture, Slider, and Value
    const bodyDiv = jQuery('<div>')
      .addClass('service-title-body')
      .attr('id', `${service.rootName}-selector`)

    // Service Image
    const img = jQuery('<img>')
      .attr({
        src: service.imageUrl,
        alt: service.imageAlt,
      })
      .addClass('service-image')

    // Slider Container
    const sliderContainer = jQuery('<div>').addClass('slider-container')
    const sliderInput = jQuery('<input>').attr({
      type: 'range',
      class: 'custom-range',
      id: `${service.rootName}Slider`,
      name: service.rootName,
      min: '0',
      max: service.maxValue.toString(),
      value: '0',
      'data-slider-price': service.sliderPrice.toString(),
      quoteSpanID: `quote${rootNameCapitalized}`,
      style: 'align-self: stretch',
    })
    sliderInput.on('input', function () {
      updateSliderValue(
        `${service.rootName}Slider`,
        `${service.rootName}Value`,
        `quote${rootNameCapitalized}`,
        service.rootName
      )
      hideEmptyCartAlert()
    })
    sliderContainer.append(sliderInput)

    // Value Display
    const selectorDisplay = jQuery('<div>').addClass('selector-display')
    const h4 = jQuery('<h4>')
    const span = jQuery('<span>')
      .attr('id', `${service.rootName}Value`)
      .text('0')
    h4.append(span)
    selectorDisplay.append(h4)

    bodyDiv.append(img).append(sliderContainer).append(selectorDisplay)
    serviceContainer.append(titleDiv).append(bodyDiv)
    servicesContainer.append(serviceContainer)

    const serviceRow = jQuery('<div>')
      .addClass('row calc-row quote-info-row')
      .attr('id', `${service.rootName}-row`)
    const serviceCol1 = jQuery('<div>')
      .addClass('col service-col')
      .text(`${rootNameCapitalized}:`)
    const serviceCol2 = jQuery('<div>').addClass('col quote-col')
    const serviceSpan = jQuery('<span>')
      .attr('id', `quote${rootNameCapitalized}`)
      .text('$0.00')
    serviceCol2.append(serviceSpan)

    serviceRow.append(serviceCol1).append(serviceCol2)
    serviceSubtotalContainer.append(serviceRow)
  })

  hideEmptyCartAlert()
  hideUnusedRows()
}

export function toggleDropdown(selectorId, chevronElement) {
  const selector = document.getElementById(selectorId)
  const serviceTitle = chevronElement.closest('.service-title')
  const isExpanded = serviceTitle.classList.contains('expanded')

  if (isExpanded) {
    selector.style.display = 'flex'
  } else {
    selector.style.display = 'none'
  }

  serviceTitle.classList.toggle('expanded') // Toggle the 'expanded' class
}

//shows checkoutbutton on bottom left corner until viewport reaches calculator on mobile
export function mobileCheckOutButtonDisplay() {
  window.addEventListener('scroll', function () {
    const serviceSelectorContainer = document.getElementById(
      'services-selector-container'
    )
    const checkoutButton = document.getElementById('checkout-button')

    if (serviceSelectorContainer) {
      const serviceSelectorContainerTop =
        serviceSelectorContainer.getBoundingClientRect().top

      const serviceSelectorContainerBottom =
        serviceSelectorContainer.getBoundingClientRect().bottom

      const viewportHeight = window.innerHeight

      if (
        serviceSelectorContainerTop < viewportHeight &&
        serviceSelectorContainerBottom > 0
      ) {
        checkoutButton.style.display = 'block'
      } else {
        checkoutButton.style.display = 'none'
      }
    }
  })
}
