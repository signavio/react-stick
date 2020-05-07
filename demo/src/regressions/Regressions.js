import React from 'react'

import ButtonOverlay from './ButtonOverlay'
import FitOnPage from './FitOnPage'
import SameWidth from './SameWidth'
import ScrollPosition from './ScrollPosition'
import StickInSvg from './StickInSvg'
import StickNodeWidth from './StickNodeWidth'
import StickOnHover from './StickOnHover'
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
      <StickOnHover />
      <ScrollPosition />
    </div>
  )
}
