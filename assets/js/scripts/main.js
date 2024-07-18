import {
  renderServices,
  mobileCheckOutButtonController,
} from './displayController.js'

import { fetchServices } from './dataManager.js'

import {
  bookNowBtnHandler,
  discountBtnHandler,
  calendlyHandler,
  initEmail,
} from './handlers.js'

//Initialize Modules
initEmail()

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
