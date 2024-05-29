import { applyDiscount } from './calculator.js'
import { getUuids } from './dataManager.js'
import { calendlyLink } from '../utils/data.js'
import { selectServicesErrorMsg } from './displayController.js'

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
        if (selectServicesErrorMsg) {
          selectServicesErrorMsg.style.display = 'none'
        }

        try {
          // Init Calendly popup widget+
          Calendly.initPopupWidget({
            url: `${calendlyLink}?hide_gdpr_banner=1;`,
          })
        } catch (error) {
          console.error('An error occurred while initializing Calendly:', error)
        }

        // fbq('track', 'InitiateCheckout')

        return false
      } else {
        if (selectServicesErrorMsg) {
          selectServicesErrorMsg.style.display = 'block'
        }
      }
    })
  }
}

export function initEmail() {
  emailjs.init({
    publicKey: '92WGB_-QLtXqknE71',
    // Do not allow headless browsers
    blockHeadless: true,
    limitRate: {
      // Set the limit rate for the application
      id: 'app',
      // Allow 1 request per 10s
      throttle: 10000,
    },
  })
}
