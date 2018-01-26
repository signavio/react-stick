# react-stick

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

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

[build-badge]: https://img.shields.io/travis/user/repo/master.png?style=flat-square
[build]: https://travis-ci.org/user/repo
[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package
[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo
[semantic-release]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
