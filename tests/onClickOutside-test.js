describe('`onClickOutside` event', () => {
  it('should not call `onClickOutside` on click on the anchor or dropdown node', () => {
    const spy = sinon.spy()
    component.setProps({ onClickOutside: spy, isOpen: true })
    component.find('.anchor').simulate('click')
    expect(spy).to.have.not.been.called
    component.find('.node').simulate('click')
    expect(spy).to.have.not.been.called
  })

  it('should not call `onClickOutside` on click on a StickPortal node inside the Dropdown', () => {
    component = mount(
      <Dropdown
        node={
          <div className="node">
            <Stick node={<div className="stick-in-node" />}>
              <span>foo</span>
            </Stick>
          </div>
        }
      >
        <div className="anchor" />
      </Dropdown>
    )
    const spy = sinon.spy()
    component.setProps({ onClickOutside: spy, isOpen: true })
    component.update()
    component.find('.stick-in-node').simulate('click')
    expect(spy).to.have.not.been.called
  })

  it('should call `onClickNode` on click on the sticked node', () => {
    const onClickNode = sinon.spy()
    const result = mount(
      <Dropdown
        node={<div className="node" />}
        inline
        isOpen
        onClickNode={onClickNode}
      >
        <div className="anchor" />
      </Dropdown>
    )
    result.find('.node').simulate('click')

    expect(onClickNode).to.have.been.calledOnce
  })
})
