# Stick

_Stick_ is a component that allows to attach an absolutely positioned node to a statically
positioned anchor element. Per default, the node will be rendered in a detached subtree as a direct
child of the `body` element.

- `children` The anchor element
- `node` The node to stick to the anchor element
- `position` The reference point on the anchor element at which to position the sticked node
- `align` The alignment of the sticked node. You can also think of this as the reference point on the
sticked node which is placed on the `position` reference point of the anchor node.
- `inline` If set to `true`, the sticked node will not be rendered detached but inside the same container
as the anchor node.