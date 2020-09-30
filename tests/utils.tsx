import React, { Element } from 'react'

import { render as renderBase } from '@testing-library/react'

import Stick from '../src'

const InlineWrapper = ({ children }) => (
  <div style={{ display: 'inline-block' }}>{children}</div>
)

export const render = (
  stick: Element<typeof Stick>
): $Call<typeof renderBase> => {
  return renderBase(stick, { wrapper: InlineWrapper })
}
