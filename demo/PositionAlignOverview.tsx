import React, { ReactNode, useCallback, useRef, useState } from 'react'

import Stick, { HorizontalAlign, Position, VerticalAlign } from '..//src'
import { useWatcher } from './hooks'

const formPairs = (
  listA: VerticalAlign[],
  listB: HorizontalAlign[]
): Position[] =>
  listA.reduce((result: Position[], verticalAlign) => {
    return [
      ...result,
      ...listB.reduce((result: Position[], horizontalAlign) => {
        return [...result, [verticalAlign, horizontalAlign] as Position]
      }, []),
    ]
  }, [])

const verticals: VerticalAlign[] = ['top', 'middle', 'bottom']
const horizontals: HorizontalAlign[] = ['left', 'center', 'right']

const positionGroups = formPairs(verticals, horizontals)
const alignmentGroups = formPairs(verticals, horizontals)

const Anchor = () => (
  <div
    style={{
      width: 35,
      height: 35,
      backgroundColor: 'rgb(24, 170, 177)',
    }}
  />
)

const Node = () => (
  <div
    style={{
      width: 10,
      height: 10,
      backgroundColor: '#ae0d5c',
    }}
  />
)

type FPSPropsT = {
  updateOnAnimationFrame: boolean
}

function FramesPerSecond({ updateOnAnimationFrame }: FPSPropsT) {
  const [fps, setFps] = useState(0)
  const lastUpdated = useRef(Date.now())
  const framesSinceLastUpdate = useRef(0)

  const measure = useCallback(() => {
    framesSinceLastUpdate.current += 1

    const duration = Date.now() - lastUpdated.current
    if (duration >= 1000) {
      setFps(framesSinceLastUpdate.current)

      framesSinceLastUpdate.current = 0
      lastUpdated.current = Date.now()
    }
  }, [])

  useWatcher(measure, { updateOnAnimationFrame })

  return <div>FPS: {fps}</div>
}

function PositionAlignOverview() {
  const [updateOnAnimationFrame, setUpdateOnAnimationFrame] = useState(false)
  const [inline, setInline] = useState(false)
  const [showNode, setShowNode] = useState(true)

  return (
    <div>
      <p>
        The table shows all combinations of possible values for the{' '}
        <code>position</code> and <code>align</code> props. The{' '}
        <code>node</code> elements are colors in red while the anchor elements (
        <code>children</code>) are colored in blue.
      </p>
      <div>
        <input
          type="checkbox"
          checked={inline}
          onChange={() => setInline(!inline)}
        />
        <code>inline</code>
      </div>
      <div>
        <input
          type="checkbox"
          checked={updateOnAnimationFrame}
          onChange={() => setUpdateOnAnimationFrame(!updateOnAnimationFrame)}
        />
        <code>updateOnAnimationFrame</code>
      </div>
      <div>
        <input
          type="checkbox"
          checked={showNode}
          onChange={() => setShowNode(!showNode)}
        />
        <code>showNode</code>
      </div>
      <div>
        <textarea
          readOnly
          defaultValue="resize me to check smoothness of Stick"
        />
        <FramesPerSecond updateOnAnimationFrame={updateOnAnimationFrame} />
      </div>
      <Grid>
        {positionGroups.map((position, i) => (
          <GridCell key={i}>
            <code>position</code>
            <code>{JSON.stringify(position)}</code>

            <Stick
              style={{ margin: 20 }}
              inline={inline}
              updateOnAnimationFrame={updateOnAnimationFrame}
              position={position}
              node={showNode && <Node />}
            >
              <Anchor />
            </Stick>

            <Grid>
              {alignmentGroups.map((alignment, j) => (
                <GridCell key={j}>
                  <code>align</code>
                  <code>{JSON.stringify(alignment)}</code>

                  <Stick
                    style={{ margin: 20 }}
                    position={position}
                    align={alignment}
                    inline={inline}
                    updateOnAnimationFrame={updateOnAnimationFrame}
                    node={showNode && <Node />}
                  >
                    <Anchor />
                  </Stick>
                </GridCell>
              ))}
            </Grid>
          </GridCell>
        ))}
      </Grid>
    </div>
  )
}

type GridPropsT = {
  children: ReactNode
}

function Grid({ children }: GridPropsT) {
  return (
    <div
      style={{
        display: 'inline-grid',
        gridTemplateColumns: 'auto auto auto',
        borderTop: '1px solid black',
        borderRight: '1px solid black',
      }}
    >
      {children}
    </div>
  )
}

type GridCellPropsT = {
  children: ReactNode
}

function GridCell({ children }: GridCellPropsT) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

        borderLeft: '1px solid black',
        borderBottom: '1px solid black',

        padding: 5,
      }}
    >
      {children}
    </div>
  )
}

export default PositionAlignOverview
