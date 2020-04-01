import 'core-js/stable'
import 'regenerator-runtime/runtime'

import React from 'react'
import { render } from 'react-dom'
import { StylesAsDataAttributes } from 'substyle-glamor'

import Demo from './Demo'

render(
  <StylesAsDataAttributes>
    <Demo />
  </StylesAsDataAttributes>,
  document.querySelector('#demo')
)
