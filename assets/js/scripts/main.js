import {
  renderServices,
  mobileCheckOutButtonController,
} from './displayController.js'

import { fetchServices, sendQuoteInfo } from './dataManager.js'

import {
  bookNowBtnHandler,
  discountBtnHandler,
  calendlyHandler,
  initEmail,
} from './handlers.js'

//test only
let eventUuid = 'e94b084a-8d33-43e2-9c06-b221ed87ef9a'
let inviteeUuid = 'aba67a10-ed35-457b-8924-1572e74f6cd8'

//Initialize Modules
initEmail()

//test only
sendQuoteInfo(eventUuid, inviteeUuid)

mobileCheckOutButtonController()

fetchServices().then((services) => {
  if (services.length > 0) {
    renderServices(services)
    console.log(services)
  } else {
    console.error('No services found.')
  }
})

discountBtnHandler()

bookNowBtnHandler()

calendlyHandler()
