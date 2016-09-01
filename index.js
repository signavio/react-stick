// @flow

import React from 'react'
import StickPortal from './StickPortal'
import StickInline from './StickInline'

const Stick = ({ inline, ...rest }: { inline?: boolean }) => (
  inline ? <StickInline {...rest} /> : <StickPortal {...rest} />
)

export default Stick
