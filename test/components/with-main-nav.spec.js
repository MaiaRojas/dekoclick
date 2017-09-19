import React from 'react';
import { render, shallow } from 'enzyme';
import sinon from 'sinon';
import WithMainNav from '../../src/components/with-main-nav';


describe('<WithMainNav />', () => {

  it('should print warning when missing component prop', () => {
    const stub = sinon.stub(console, 'error');
    const component = shallow(<WithMainNav />);
		expect(stub.getCalls().length > 0).toBe(true);
    expect(stub.getCall(0).args[0]).toMatchSnapshot();
    stub.restore();
	});

  it('should print warnings when missing history and firebase props', () => {
    const stub = sinon.stub(console, 'error');
    const Component = props => (<div className="my-component">hello world</div>);
    const component = render(<WithMainNav component={Component} />);
		expect(stub.getCalls().length).toBe(2);
    expect(stub.getCall(0).args[0]).toMatchSnapshot();
    expect(stub.getCall(1).args[0]).toMatchSnapshot();
    stub.restore();
	});

  it('should wrap component in container along with MainNav', () => {
    const Component = props => (<div className="my-component">hello world</div>);

    const component = shallow(
      <WithMainNav
        component={Component}
        history={{ push: () => {} }}
        firebase={{ logout: () => {} }}
      />
    );

    expect(component.nodes.length).toBe(1);
    expect(component.nodes[0].type).toBe('div');
    expect(component.nodes[0].props.className).toBe('app');

    expect(component.children().nodes.length).toBe(2);
    expect(component.children().nodes[0].type.Naked.name).toBe('MainNav');
    expect(component.children().nodes[0].type.displayName).toBe('withStyles(MainNav)');
    expect(component.children().nodes[1].type).toBe('div');
    expect(component.children().nodes[1].props.className).toBe('main');
    expect(component.children().nodes[1].props.children.type).toBe(Component);
    expect(component.children().nodes[1].props.children.type.name).toBe('Component');
  });

});
