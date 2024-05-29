import {
  renderServices,
  mobileCheckOutButtonController,
} from './displayController.js'

import {
  bookNowBtnHandler,
  discountBtnHandler,
  calendlyHandler,
  initEmail,
} from './handlers.js'

//Initialize Modules
initEmail()

mobileCheckOutButtonController()

renderServices()

discountBtnHandler()

bookNowBtnHandler()

calendlyHandler()
