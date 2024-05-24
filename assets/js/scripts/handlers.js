import { applyDiscount } from './calculator.js'
import { selectServices } from './main.js'
import { getUuids } from './dataManager.js'

export function discountBtnHandler() {
  const discountBtn = document.getElementById('discountBtn')
  const discountCodeInput = document.getElementById('discountCodeInput')

  if (discountBtn) {
    discountBtn.addEventListener('click', applyDiscount)
  }

  if (discountCodeInput) {
    discountCodeInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        applyDiscount()
      }
    })
  }
}

export function calendlyHandler() {
  function isCalendlyEvent(e) {
    return e.data.event && e.data.event.indexOf('calendly') === 0
  }

  window.addEventListener('message', function (e) {
    if (isCalendlyEvent(e)) {
      const { payload } = e.data
      if (payload) {
        const { event, invitee } = payload
        if (event && invitee) {
          const { uri: eventUri } = event
          const { uri: inviteeUri } = invitee
          console.log(eventUri, inviteeUri)
          // fbq('track', 'Schedule')
          getUuids(eventUri, inviteeUri)
        }
      }
    }
  })
}

export function bookNowBtnHandler() {
  const bookNowBtn = document.getElementById('bookNowBtn')
  if (bookNowBtn) {
    bookNowBtn.addEventListener('click', () => {
      const totalValue =
        parseFloat(
          document.getElementById('total').textContent.replace('$', '')
        ) || 0

      // Check if total is greater than 0
      if (totalValue > 0) {
        // Hide 'please select services'
        if (selectServices) {
          selectServices.style.display = 'none'
        }

        try {
          // Init Calendly popup widget
          Calendly.initPopupWidget({
            url: 'https://calendly.com/jordanwall_insurancebroker/clean-pristine-carpet-cleaning?hide_gdpr_banner=1;',
          })
        } catch (error) {
          console.error('An error occurred while initializing Calendly:', error)
        }

        // fbq('track', 'InitiateCheckout')

        return false
      } else {
        // Display 'please select services'
        if (selectServices) {
          selectServices.style.display = 'block'
        }
      }
    })
  }
}
