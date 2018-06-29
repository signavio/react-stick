import React from 'react'

import ButtonOverlay from './ButtonOverlay'
import SameWidth from './SameWidth'
import StickNodeWidth from './StickNodeWidth'
import FitOnPage from './FitOnPage'
import StickInSvg from './StickInSvg'
import StyledWithDataAttributes from './StyledWithDataAttributes'
import TransportToFixedContainer from './TransportToFixedContainer'

export default function Regressions() {
  return (
    <div>
      <h1>Regressions</h1>

      <ButtonOverlay />
      <SameWidth />
      <StickNodeWidth />
      <FitOnPage />
      <StickInSvg />
      <StyledWithDataAttributes />
      <TransportToFixedContainer />
    </div>
  )
}
