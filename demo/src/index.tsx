import { createRoot } from 'react-dom/client'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import { StylesAsDataAttributes } from 'substyle-glamor'

import Demo from './Demo'

const root = createRoot(document.querySelector('#demo')!)

root.render(
  <StylesAsDataAttributes>
    <Demo />
  </StylesAsDataAttributes>
)
