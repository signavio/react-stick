# react-stick

[![CircleCI][build-badge]][build]
[![codecov][codecov-badge]][codecov]
[![npm package][npm-badge]][npm]
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

_Stick_ is a component that allows to attach an absolutely positioned node to a statically
positioned anchor element. Per default, the node will be rendered in a portal as a direct
child of the `body` element.

```
npm install --save react-stick
```

```javascript
import Stick from 'react-stick'

<Stick node={<p>The sticked node</p>} position="bottom center" align="top center">
  <p>The anchor node</p>
</Stick>
```

## Props

* `children` The anchor element
* `node` The node to stick to the anchor element
* `position` The reference point on the anchor element at which to position the sticked node
* `align` The alignment of the sticked node. You can also think of this as the reference point on the
  sticked node which is placed on the `position` reference point of the anchor node. For example `position="top left" align="bottom right"` means "put the bottom right point of the sticked not onto the top left point of the anchor node".
* `inline` If set to `true`, the sticked node will not be rendered detached but inside the same container
  as the anchor node.

For `position` and `align` props string values of the form `top|middle|bottom left|center|right` are supported.

[build-badge]: https://circleci.com/gh/signavio/react-stick/tree/master.svg?style=shield&circle-token=:circle-token
[build]: https://circleci.com/gh/signavio/react-stick/tree/master
[npm-badge]: https://img.shields.io/npm/v/npm.svg
[npm]: https://www.npmjs.org/package/react-stick
[codecov-badge]: https://img.shields.io/codecov/c/github/signavio/react-stick.svg
[codecov]: https://codecov.io/gh/signavio/react-stick


