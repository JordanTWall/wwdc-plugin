let discount = 1
let isFirstUpdate = true
import { discountCodes } from '../utils/data.js'

export function updateSliderValue(sliderID, valueID, quoteSpanID, name) {
  jQuery(document).ready(function ($) {
    const $slider = document.getElementById(sliderID)
    const sliderValue = parseFloat($slider.value)
    const price = parseFloat($slider.getAttribute('data-slider-price'))

    if (isNaN(price)) {
      console.error(`Invalid price for ${sliderID}`)
      return
    }

    const quote = (sliderValue * price).toFixed(2)

    document.getElementById(quoteSpanID).textContent = `$${quote}`
    document.getElementById(valueID).textContent = sliderValue

    const row = document.getElementById(`${name}-row`)
    row.style.display = sliderValue === 0 ? 'none' : 'flex'

    updateSubtotal()
    updateTaxes()
    updateTotal()
    calculateSavings()
  })
}

export function updateSubtotal() {
  let subtotal = 0

  document.querySelectorAll('[id^="quote"]').forEach((element) => {
    const value = parseFloat(element.textContent.replace('$', ''))
    if (!isNaN(value)) {
      subtotal += value
    }
  })

  const subtotalElement = document.getElementById('subtotal')
  if (subtotalElement) {
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`
  }
}

export function updateTaxes() {
  const subtotal =
    parseFloat(
      document.getElementById('subtotal').textContent.replace('$', '')
    ) || 0
  const taxRate = 0.07
  const taxes = (subtotal * taxRate).toFixed(2)

  const taxesElement = document.getElementById('taxes')
  if (taxesElement) {
    taxesElement.textContent = `$${taxes}`
  }
}

export function updateTotal() {
  const subtotal =
    parseFloat(
      document.getElementById('subtotal').textContent.replace('$', '')
    ) || 0
  const taxRate = 0.07
  const taxes = parseFloat((subtotal * taxRate).toFixed(2))

  const totalValue = (subtotal + taxes) * discount

  const totalElement = document.getElementById('total')
  if (totalElement) {
    totalElement.textContent = `$${totalValue.toFixed(2)}`
  }

  if (isFirstUpdate) {
    // fbq('track', 'AddToCart')
    isFirstUpdate = false
  }
}

export function applyDiscount() {
  const discountCodeInput = document.getElementById('discountCodeInput')
  const discountCode = discountCodeInput.value.trim().toLowerCase()

  // Find the discount code in the array
  const discount = discountCodes.find(
    (code) => code.discountCode.toLowerCase() === discountCode
  )

  if (discount) {
    const discountValue = 1 - discount.discountValue
    discountCodeInput.value = ''

    const invalidCodeMessage = document.getElementById('invalid-code')
    if (invalidCodeMessage) {
      invalidCodeMessage.style.display = 'none'
    }

    const discountAppliedMessage = document.getElementById('discount-applied')
    if (discountAppliedMessage) {
      const discountPercentage = discount.discountValue * 100
      discountAppliedMessage.style.display = 'block'
      document.getElementById(
        'discount-percentage'
      ).textContent = `${discountPercentage.toFixed(0)}%`
    }

    // Change total to green bold
    const totalSpan = document.getElementById('total')
    if (totalSpan) {
      totalSpan.style.fontWeight = 'bold'
      totalSpan.style.color = 'green'
    }

    // Apply the discount and update totals
    window.discount = discountValue
    updateTotal()
    calculateSavings()
    return discountCode
  } else {
    const invalidCodeMessage = document.getElementById('invalid-code')
    if (invalidCodeMessage) {
      invalidCodeMessage.style.display = 'block'
    }

    // Hide the success message if an invalid code is entered
    const discountAppliedMessage = document.getElementById('discount-applied')
    if (discountAppliedMessage) {
      discountAppliedMessage.style.display = 'none'
    }
  }
}

export function calculateSavings() {
  const subtotal =
    parseFloat(
      document.getElementById('subtotal').textContent.replace('$', '')
    ) || 0
  const taxes =
    parseFloat(document.getElementById('taxes').textContent.replace('$', '')) ||
    0
  const originalTotal = subtotal + taxes
  const discountAmount = originalTotal - originalTotal * discount

  const savingsSpan = document.getElementById('savings')
  if (savingsSpan) {
    if (discountAmount > 0) {
      savingsSpan.textContent = `-$${discountAmount.toFixed(2)}`
      savingsSpan.style.textDecoration = 'line-through 1px'
      savingsSpan.style.color = 'red'
    } else {
      savingsSpan.textContent = '$0.00'
      savingsSpan.style.textDecoration = 'none'
      savingsSpan.style.color = 'inherit'
    }
  }
}
