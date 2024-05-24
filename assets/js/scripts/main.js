import { initEmail } from '../utils/utils.js'

import {
  renderServices,
  mobileCheckOutButtonDisplay,
} from './displayController.js'

import {
  bookNowBtnHandler,
  discountBtnHandler,
  calendlyHandler,
} from './handlers.js'

export const selectServices = document.getElementById('select-services')

//Initialize Modules
initEmail()

mobileCheckOutButtonDisplay()

renderServices()

discountBtnHandler()

bookNowBtnHandler()

calendlyHandler()
