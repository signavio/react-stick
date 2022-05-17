import React from 'react'

import { render as renderBase } from '@testing-library/react'

import Stick from '../src'

import type { ReactElement } from 'react'

const InlineWrapper = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'inline-block' }}>{children}</div>
)

export const render = (
  stick: ReactElement<typeof Stick>
): ReturnType<typeof renderBase> => {
  return renderBase(stick, { wrapper: InlineWrapper })
}
