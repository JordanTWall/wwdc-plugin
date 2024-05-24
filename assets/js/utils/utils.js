import { selectServices } from '../scripts/main.js'

export const server = 'https://138.197.124.77:8080'

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

export function hideEmptyCartAlert() {
  const totalDiv = document.getElementById('total')

  if (totalDiv) {
    // Get the content of the div and remove the dollar sign
    const totalText = totalDiv.textContent.replace('$', '')

    // Parse the content as a float
    const totalValue = parseFloat(totalText)

    // Check if the value is greater than 0
    if (totalValue > 0) {
      // If selectServices exists, hide it
      if (selectServices) {
        selectServices.style.display = 'none'
      }
    }
  }
}

export function hideUnusedRows() {
  document.querySelectorAll('.calc-row').forEach(function (row) {
    row.style.display = 'none'
  })

  if (selectServices) {
    selectServices.style.setProperty('display', 'none', 'important')
  }
  hideEmptyCartAlert()
}
