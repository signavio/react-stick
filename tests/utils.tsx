import React, { FunctionComponent, ReactElement } from 'react'

import { render as renderBase } from '@testing-library/react'

import Stick from '../src'

const InlineWrapper: FunctionComponent<{}> = (props) => (
  <div style={{ display: 'inline-block' }} {...props} />
)

export const render = (
  stick: ReactElement<typeof Stick>
): ReturnType<typeof renderBase> => {
  return renderBase(stick, { wrapper: InlineWrapper })
}
