import { renderToStaticMarkup } from 'react-dom/server'
import Stick from '../../src'
import { describe, expect, it } from 'vitest'

describe('SSR', () => {
  it('does not throw when rendering in a node environment', () => {
    expect(() =>
      renderToStaticMarkup(
        <Stick node={<div>Node</div>}>
          <div>Anchor</div>
        </Stick>
      )
    ).not.toThrow()
  })

  it('renders only the anchor and not the node on the server', () => {
    expect(
      renderToStaticMarkup(<Stick node={<div>Node</div>}>Anchor</Stick>)
    ).toMatchInlineSnapshot(`"<div>Anchor</div>"`)
  })
})
