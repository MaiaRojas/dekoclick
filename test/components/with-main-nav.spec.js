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
    const component = render(
      <WithMainNav
        component={Component}
        auth={{ displayName: 'Ada Lovelace', email: 'ada@gmail.com' }}
        match={{ path: '/' }}
      />
    );
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

    const nodes = component.getElements();
    expect(nodes.length).toBe(1);
    expect(nodes[0].type).toBe('div');
    expect(nodes[0].props.className).toBe('app');

    const childNodes = component.children().getElements();
    expect(childNodes.length).toBe(2);
    expect(childNodes[0].type.Naked.name).toBe('MainNav');
    expect(childNodes[0].type.displayName).toBe('withStyles(MainNav)');
    expect(childNodes[1].type).toBe('div');
    expect(childNodes[1].props.className).toBe('main');
    expect(childNodes[1].props.children.type).toBe(Component);
    expect(childNodes[1].props.children.type.name).toBe('Component');
  });

});
