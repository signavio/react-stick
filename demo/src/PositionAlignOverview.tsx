import React, { useCallback, useRef, useState } from 'react'

import Stick from '../../es'
import { useWatcher } from './hooks'
import { WatcherOptions } from './hooks/useWatcher'

function formPairs<A extends string, B extends string>(
  listA: readonly A[],
  listB: readonly B[]
): `${A} ${B}`[][] {
  return listA.map((a) => listB.map((b) => `${a} ${b}`)) as `${A} ${B}`[][]
}

const verticals = ['top', 'middle', 'bottom'] as const
const horizontals = ['left', 'center', 'right'] as const

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

function FramesPerSecond({ updateOnAnimationFrame }: WatcherOptions) {
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
      <table
        style={{
          textAlign: 'center',
          borderCollapse: 'collapse',
        }}
      >
        <tbody
          style={{
            borderTop: '1px solid black',
            borderRight: '1px solid black',
          }}
        >
          {positionGroups.map((positions, i: number) => (
            <tr key={i}>
              {positions.map((position) => (
                <td
                  key={position}
                  style={{
                    padding: '0 10px 10px 10px',
                    borderLeft: '1px solid black',
                    borderBottom: '1px solid black',
                    fontSize: 11,
                  }}
                >
                  <pre>position="{position}"</pre>
                  <br />
                  <div style={{ display: 'inline-block' }}>
                    <Stick
                      inline={inline}
                      updateOnAnimationFrame={updateOnAnimationFrame}
                      position={position}
                      node={showNode && <Node />}
                    >
                      <Anchor />
                    </Stick>
                  </div>

                  <table
                    style={{
                      borderCollapse: 'collapse',
                      marginTop: 20,
                    }}
                  >
                    <tbody
                      style={{
                        borderTop: '1px solid gray',
                        borderRight: '1px solid gray',
                      }}
                    >
                      {alignmentGroups.map((alignments, j) => (
                        <tr key={j}>
                          {alignments.map((alignment) => (
                            <td
                              key={alignment}
                              style={{
                                padding: '0 10px 10px 10px',
                                borderLeft: '1px solid gray',
                                borderBottom: '1px solid gray',
                                fontSize: 11,
                              }}
                            >
                              <pre>align="{alignment}"</pre>
                              <br />
                              <div style={{ display: 'inline-block' }}>
                                <Stick
                                  position={position}
                                  align={alignment}
                                  inline={inline}
                                  updateOnAnimationFrame={
                                    updateOnAnimationFrame
                                  }
                                  node={showNode && <Node />}
                                >
                                  <Anchor />
                                </Stick>
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PositionAlignOverview
