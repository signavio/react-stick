import React, { forwardRef } from 'react'
import useStyles, { inline } from 'substyle'

import { type AlignT, type PositionT } from './types'
import { getModifiers } from './utils'

import type { ReactNode } from 'react'

type PropsT = {
  width: number
  position: PositionT
  align: AlignT
  sameWidth: boolean
  children: ReactNode
}

const StickNode = forwardRef<HTMLDivElement, PropsT>(function (
  { children, width, align, position, sameWidth }: PropsT,
  ref
) {
  const styles = useStyles(
    defaultStyle,
    {},
    getModifiers({ align, position, sameWidth })
  )

  return (
    <div {...inline(styles, { width })}>
      <div {...styles('content')} ref={ref}>
        {children}
      </div>
    </div>
  )
})

const defaultStyle = {
  position: 'absolute',
  right: 0,
  bottom: 0,

  content: {
    // absolute position is needed as the stick node would otherwise
    // cover up the base node and, for instance, make it impossible to
    // click buttons
    position: 'absolute',
    display: 'inline-block',

    left: 'inherit',
    right: 'inherit',
    top: 'inherit',
    bottom: 'inherit',
  },

  '&sameWidth': {
    content: {
      display: 'block',
      width: '100%',
    },
  },

  '&align-left': {
    right: 'auto',
    left: 0,
  },
  '&align-top': {
    bottom: 'auto',
    top: 0,
  },

  '&align-middle': {
    content: {
      transform: 'translate(0, 50%)',
    },
  },
  '&align-center': {
    content: {
      transform: 'translate(50%, 0)',
    },
    '&align-middle': {
      content: {
        transform: 'translate(50%, 50%)',
      },
    },
  },
}

export default StickNode
